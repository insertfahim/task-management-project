import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Priority } from "@prisma/client";

const createTaskSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
    dueDate: z.string().datetime().optional(),
    categoryId: z.string().optional(),
});

interface TaskWhere {
    userId: string;
    categoryId?: string;
    priority?: Priority;
    completed?: boolean;
    OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
    }>;
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const priority = url.searchParams.get("priority");
        const completed = url.searchParams.get("completed");
        const search = url.searchParams.get("search");
        const sortField = url.searchParams.get("sortField") || "createdAt";
        const sortDirection = url.searchParams.get("sortDirection") || "desc";

        const where: TaskWhere = {
            userId: session.user.id,
        };

        if (category && category !== "all") {
            where.categoryId = category;
        }
        if (priority && priority !== "all") {
            where.priority = priority as Priority;
        }
        if (completed !== null && completed !== "all") {
            where.completed = completed === "true";
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: {
                [sortField]: sortDirection,
            },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Get tasks error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, description, priority, dueDate, categoryId } =
            createTaskSchema.parse(body);

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                categoryId,
                userId: session.user.id,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error("Create task error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input data" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

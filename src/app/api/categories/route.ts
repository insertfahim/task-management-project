import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createCategorySchema = z.object({
    name: z.string().min(1).max(50),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i)
        .default("#3B82F6"),
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const categories = await prisma.category.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Get categories error:", error);
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
        const { name, color } = createCategorySchema.parse(body);

        // Check if category already exists for this user
        const existingCategory = await prisma.category.findFirst({
            where: {
                name,
                userId: session.user.id,
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: "Category already exists" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                color,
                userId: session.user.id,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Create category error:", error);
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

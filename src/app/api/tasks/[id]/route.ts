import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Priority } from "@prisma/client";

const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    categoryId: z.string().optional().nullable(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const task = await prisma.task.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
            include: {
                category: true,
            },
        });

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Get task error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const updateData = updateTaskSchema.parse(body);

        // Verify task ownership
        const existingTask = await prisma.task.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        const updatedTask = await prisma.task.update({
            where: { id: params.id },
            data: {
                ...updateData,
                dueDate: updateData.dueDate
                    ? new Date(updateData.dueDate)
                    : updateData.dueDate,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("Update task error:", error);
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify task ownership
        const existingTask = await prisma.task.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        await prisma.task.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Delete task error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

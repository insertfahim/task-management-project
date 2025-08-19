import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Create CSV content
        const csvHeaders =
            "Title,Description,Priority,Status,Category,Due Date,Created At\n";

        const csvRows = tasks
            .map((task) => {
                const title = `"${task.title.replace(/"/g, '""')}"`;
                const description = task.description
                    ? `"${task.description.replace(/"/g, '""')}"`
                    : "";
                const priority = task.priority;
                const status = task.completed ? "Completed" : "Pending";
                const category = task.category?.name || "No Category";
                const dueDate = task.dueDate
                    ? task.dueDate.toISOString().split("T")[0]
                    : "";
                const createdAt = task.createdAt.toISOString().split("T")[0];

                return `${title},${description},${priority},${status},"${category}",${dueDate},${createdAt}`;
            })
            .join("\n");

        const csvContent = csvHeaders + csvRows;

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="tasks.csv"',
            },
        });
    } catch (error) {
        console.error("Export tasks error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

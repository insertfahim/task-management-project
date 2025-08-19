import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
    try {
        const demoEmail = "demo@taskmanagement.com";
        const demoPassword = "demo123";
        const demoName = "Demo User";

        // Check if demo user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: demoEmail },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Demo user already exists" },
                { status: 200 }
            );
        }

        const hashedPassword = await bcrypt.hash(demoPassword, 10);

        // Create demo user
        const demoUser = await prisma.user.create({
            data: {
                email: demoEmail,
                password: hashedPassword,
                name: demoName,
            },
        });

        // Create default categories for demo user
        await prisma.category.createMany({
            data: [
                {
                    name: "Work",
                    color: "#3B82F6",
                    userId: demoUser.id,
                },
                {
                    name: "Personal",
                    color: "#10B981",
                    userId: demoUser.id,
                },
                {
                    name: "Shopping",
                    color: "#F59E0B",
                    userId: demoUser.id,
                },
                {
                    name: "Health",
                    color: "#EF4444",
                    userId: demoUser.id,
                },
            ],
        });

        // Get the created categories
        const createdCategories = await prisma.category.findMany({
            where: { userId: demoUser.id },
        });

        const workCategory = createdCategories.find((c) => c.name === "Work");
        const personalCategory = createdCategories.find(
            (c) => c.name === "Personal"
        );
        const shoppingCategory = createdCategories.find(
            (c) => c.name === "Shopping"
        );

        // Create some demo tasks
        await prisma.task.createMany({
            data: [
                {
                    title: "Complete project presentation",
                    description:
                        "Prepare slides and practice presentation for the quarterly review",
                    priority: "HIGH",
                    completed: false,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                    userId: demoUser.id,
                    categoryId: workCategory?.id,
                },
                {
                    title: "Review team reports",
                    description:
                        "Go through all team member reports and provide feedback",
                    priority: "MEDIUM",
                    completed: true,
                    userId: demoUser.id,
                    categoryId: workCategory?.id,
                },
                {
                    title: "Call dentist for appointment",
                    description: "Schedule routine dental checkup",
                    priority: "LOW",
                    completed: false,
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                    userId: demoUser.id,
                    categoryId: personalCategory?.id,
                },
                {
                    title: "Buy groceries",
                    description: "Milk, bread, eggs, fruits, vegetables",
                    priority: "MEDIUM",
                    completed: false,
                    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
                    userId: demoUser.id,
                    categoryId: shoppingCategory?.id,
                },
                {
                    title: "Plan weekend trip",
                    description: "Research destinations and book accommodation",
                    priority: "LOW",
                    completed: false,
                    userId: demoUser.id,
                    categoryId: personalCategory?.id,
                },
                {
                    title: "Update resume",
                    description: "Add recent achievements and projects",
                    priority: "MEDIUM",
                    completed: true,
                    userId: demoUser.id,
                    categoryId: workCategory?.id,
                },
            ],
        });

        return NextResponse.json(
            {
                message: "Demo user and data created successfully",
                email: demoEmail,
                password: demoPassword,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create demo user error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

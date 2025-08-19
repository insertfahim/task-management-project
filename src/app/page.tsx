import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TaskDashboard } from "@/components/task-dashboard";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <TaskDashboard />
        </main>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { Task, Category, Priority, TaskFilters, TaskSort } from "@/types";
import {
    PlusIcon,
    FilterIcon,
    CheckCircleIcon,
    ClockIcon,
    AlertCircleIcon,
} from "lucide-react";

export function TaskDashboard() {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddTask, setShowAddTask] = useState(false);
    const [filters, setFilters] = useState<TaskFilters>({});
    const [sort] = useState<TaskSort>({
        field: "createdAt",
        direction: "desc",
    });

    const fetchTasks = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append("category", filters.category);
            if (filters.priority) params.append("priority", filters.priority);
            if (filters.completed !== undefined)
                params.append("completed", filters.completed.toString());
            if (filters.search) params.append("search", filters.search);
            params.append("sortField", sort.field);
            params.append("sortDirection", sort.direction);

            const response = await fetch(`/api/tasks?${params}`);
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [filters, sort]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }, []);

    // Fetch tasks and categories on component mount
    useEffect(() => {
        const loadData = async () => {
            await fetchCategories();
            await fetchTasks();
        };
        loadData();
    }, [fetchTasks, fetchCategories]);

    const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !completed }),
            });
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case "HIGH":
                return "text-red-600 bg-red-100";
            case "MEDIUM":
                return "text-yellow-600 bg-yellow-100";
            case "LOW":
                return "text-green-600 bg-green-100";
        }
    };

    const formatDate = (date: Date | string | null) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString();
    };

    // Statistics
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.filter((task) => !task.completed).length;
    const highPriorityTasks = tasks.filter(
        (task) => task.priority === "HIGH" && !task.completed
    ).length;
    const overdueTasks = tasks.filter(
        (task) =>
            !task.completed &&
            task.dueDate &&
            new Date(task.dueDate) < new Date()
    ).length;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-gray-300 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Task Management Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Welcome back,{" "}
                        {session?.user?.name || session?.user?.email}
                    </p>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowAddTask(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Task</span>
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-8 h-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Completed
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {completedTasks}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <ClockIcon className="w-8 h-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pending
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {pendingTasks}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <AlertCircleIcon className="w-8 h-8 text-red-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                High Priority
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {highPriorityTasks}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <AlertCircleIcon className="w-8 h-8 text-orange-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Overdue
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {overdueTasks}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center space-x-2">
                        <FilterIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Filters:</span>
                    </div>

                    <select
                        value={filters.category || "all"}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                category:
                                    e.target.value === "all"
                                        ? undefined
                                        : e.target.value,
                            }))
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.priority || "all"}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                priority:
                                    e.target.value === "all"
                                        ? undefined
                                        : (e.target.value as Priority),
                            }))
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        <option value="all">All Priorities</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                    <select
                        value={
                            filters.completed === undefined
                                ? "all"
                                : filters.completed.toString()
                        }
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                completed:
                                    e.target.value === "all"
                                        ? undefined
                                        : e.target.value === "true",
                            }))
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="false">Pending</option>
                        <option value="true">Completed</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                search: e.target.value || undefined,
                            }))
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm flex-1 min-w-48"
                    />
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Tasks ({tasks.length})
                    </h2>
                </div>

                {tasks.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No tasks found.{" "}
                        {Object.keys(filters).length > 0
                            ? "Try adjusting your filters."
                            : "Create your first task!"}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <button
                                            onClick={() =>
                                                toggleTaskCompletion(
                                                    task.id,
                                                    task.completed
                                                )
                                            }
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                task.completed
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "border-gray-300 hover:border-green-500"
                                            }`}
                                        >
                                            {task.completed && (
                                                <CheckCircleIcon className="w-3 h-3" />
                                            )}
                                        </button>

                                        <div className="flex-1">
                                            <h3
                                                className={`font-medium ${
                                                    task.completed
                                                        ? "line-through text-gray-500"
                                                        : "text-gray-900 dark:text-white"
                                                }`}
                                            >
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>
                                                {task.category && (
                                                    <span
                                                        className="px-2 py-1 text-xs rounded"
                                                        style={{
                                                            backgroundColor:
                                                                task.category
                                                                    .color +
                                                                "20",
                                                            color: task.category
                                                                .color,
                                                        }}
                                                    >
                                                        {task.category.name}
                                                    </span>
                                                )}
                                                {task.dueDate && (
                                                    <span
                                                        className={`text-xs ${
                                                            new Date(
                                                                task.dueDate
                                                            ) < new Date() &&
                                                            !task.completed
                                                                ? "text-red-600 font-medium"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        Due:{" "}
                                                        {formatDate(
                                                            task.dueDate
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            {showAddTask && (
                <AddTaskModal
                    categories={categories}
                    onClose={() => setShowAddTask(false)}
                    onTaskAdded={() => {
                        fetchTasks();
                        setShowAddTask(false);
                    }}
                />
            )}
        </div>
    );
}

// Add Task Modal Component
function AddTaskModal({
    categories,
    onClose,
    onTaskAdded,
}: {
    categories: Category[];
    onClose: () => void;
    onTaskAdded: () => void;
}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM" as Priority,
        dueDate: "",
        categoryId: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                dueDate: formData.dueDate
                    ? new Date(formData.dueDate).toISOString()
                    : undefined,
                categoryId: formData.categoryId || undefined,
            };

            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onTaskAdded();
            }
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Add New Task
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter task description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        priority: e.target.value as Priority,
                                    }))
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        categoryId: e.target.value,
                                    }))
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">No Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.dueDate}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    dueDate: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

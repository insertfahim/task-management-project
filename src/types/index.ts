import { Priority } from "@prisma/client";

export { Priority };

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: Priority;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    categoryId?: string;
    category?: Category;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    userId: string;
    tasks?: Task[];
}

export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: Date;
    categoryId?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: Priority;
    dueDate?: Date;
    categoryId?: string;
}

export interface CreateCategoryData {
    name: string;
    color?: string;
}

export interface TaskFilters {
    category?: string;
    priority?: Priority;
    completed?: boolean;
    search?: string;
}

export interface TaskSort {
    field: "createdAt" | "dueDate" | "title" | "priority";
    direction: "asc" | "desc";
}

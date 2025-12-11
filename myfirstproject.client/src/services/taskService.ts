import api from "./axiosConfig";

export interface TaskPayload {
    name: string;
    description?: string;
    categoryId: string;
    dueDate?: string;
    status?: "todo" | "inProgress" | "done";
}

export interface TaskResponse {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
    dueDate?: string;
    status: "todo" | "inProgress" | "done";
    createdAt: string;
}

export const taskService = {
    getTasksByCategoryId: async (categoryId: string) => {
        const response = await api.get<TaskResponse[]>(`/tasks/categories/${categoryId}`);
        return response.data;
    },
    createTask: async (payload: TaskPayload) => {
        const response = await api.post<TaskResponse>("/tasks", payload);
        return response.data;
    },
    updateTask: async (id: string, payload: Partial<TaskPayload>) => {
        const response = await api.put<TaskResponse>(`/tasks/${id}`, payload);
        return response.data;
    },
    deleteTask: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};
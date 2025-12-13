import api from "./axiosConfig";

export interface TaskPayload {
    name: string;
    description?: string;
    planId: string;
    dueDate?: string;
}

export interface TaskResponse {
    id: string;
    name: string;
    description?: string;
    planId: string;
    dueDate?: string;
    status: "Todo" | "InProgress" | "Completed" | "Overdue";
    createdAt: string;
}

export interface TaskUpdatePayload {
    name: string;
    description?: string;
    dueDate?: string;
    status?: "Todo" | "InProgress" | "Completed" | "Overdue";
}

export const taskService = {
    getTasksByPlanId: async (planId: string) => {
        const response = await api.get<TaskResponse[]>(`/tasks`,{
            params: { planId }
        });
        return response.data;
    },
    createTask: async (payload: TaskPayload) => {
        const response = await api.post<TaskResponse>("/tasks", payload);
        return response.data;
    },
    updateTask: async (id: string, payload: Partial<TaskUpdatePayload>) => {
        const response = await api.put<TaskResponse>(`/tasks/${id}`, payload);
        return response.data;
    },
    deleteTask: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};
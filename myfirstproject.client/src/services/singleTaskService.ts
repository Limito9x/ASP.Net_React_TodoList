import api from "./axiosConfig";
import type { SingleTask } from "../types/singleTask";

export type TaskPayload = Omit<
    SingleTask,
    "id" | "createdAt" | "updatedAt"
>;

export const singleTaskService = {
    getTaskById: async () => {
        const response = await api.get<SingleTask>(`/tasks`);
        return response.data;
    },
    createTask: async (payload: TaskPayload) => {
        const response = await api.post<SingleTask>("/tasks", payload);
        return response.data;
    },
    updateTask: async (id: string, payload: Partial<TaskPayload>) => {
        const response = await api.put<SingleTask>(`/tasks/${id}`, payload);
        return response.data;
    },
    deleteTask: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};
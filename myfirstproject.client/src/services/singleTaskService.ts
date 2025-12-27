import api from "./axiosConfig";
import type { SingleTask } from "../types/singleTask";
import type { Form } from "../types/form";

export type TaskRequestPayload = {
    name: string;
    description?: string;
    type: "Normal" | "Milestone" | "Event";
    dueDate?: string; // ISO string
    startAt?: string; // ISO string
    endAt?: string; // ISO string
    linkedGoalIds?: number[];
    phaseId?: number;
};

export type TaskExecutePayload = {
    status: "Completed" | "Cancelled";
    completedAt?: string; // ISO string
    note?: string;
    forms?: Form[];
}

export const singleTaskService = {
    getTaskById: async () => {
        const response = await api.get<SingleTask>(`/single-tasks`);
        return response.data;
    },
    createTask: async (payload: TaskRequestPayload) => {
        const response = await api.post<SingleTask>("/single-tasks", payload);
        return response.data;
    },
    updateTask: async (id: string, payload: Partial<TaskRequestPayload>) => {
        const response = await api.patch<SingleTask>(`/single-tasks/${id}`, payload);
        return response.data;
    },
    executeTask: async (id: string, payload: TaskExecutePayload) => {
        const response = await api.post<SingleTask>(`/single-tasks/${id}/execute`, payload);
        return response.data;
    },
    deleteTask: async (id: string) => {
        const response = await api.delete(`/single-tasks/${id}`);
        return response.data;
    }
};
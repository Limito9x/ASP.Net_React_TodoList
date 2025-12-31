import api from "./axiosConfig";
import type { SingleTask } from "../types/singleTask";
import type { DefaultLinkedGoal, ActualLinkedGoal } from "../types/goal";
import type { TaskLogStatus } from "../types/taskLog";
import type { Form } from "../types/form";

export type TaskRequestPayload = {
    name: string;
    description?: string;
    type: "Normal" | "Milestone" | "Event";
    dueDate?: string; // ISO string
    startAt?: string; // ISO string
    endAt?: string; // ISO string
    linkedGoals?: DefaultLinkedGoal[];
    phaseId?: number;
};

export type TaskExecutePayload = {
    outcome: TaskLogStatus;
    note?: string;
    contributions?: ActualLinkedGoal[];
    data?: Form[];
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
    updateTask: async (id: number, payload: Partial<TaskRequestPayload>) => {
        const response = await api.patch<SingleTask>(`/single-tasks/${id}`, payload);
        return response.data;
    },
    executeTask: async (id: number, payload: TaskExecutePayload) => {
        const response = await api.post<SingleTask>(`/single-tasks/${id}/execute`, payload);
        return response.data;
    },
    deleteTask: async (id: number) => {
        const response = await api.delete(`/single-tasks/${id}`);
        return response.data;
    }
};
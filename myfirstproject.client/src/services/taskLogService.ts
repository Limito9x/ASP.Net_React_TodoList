import api from "./axiosConfig";
import type { TaskLog } from "../types/taskLog";

export type TaskLogPayload = Omit<
  TaskLog,
  | "id"
  | "createdAt"
  | "updatedAt"
>;

export const taskLogService = {
  getTaskLogById: async (id: number) => {
    const response = await api.get<TaskLog>(`/task-logs/${id}`);
    return response.data;
  },
  createTaskLog: async (payload: TaskLogPayload) => {
    const response = await api.post<TaskLog>("/task-logs", payload);
    return response.data;
  },
  updateTaskLog: async (id: number, payload: Partial<TaskLogPayload>) => {
    const response = await api.put<TaskLog>(`/task-logs/${id}`, payload);
    return response.data;
  },
  deleteTaskLog: async (id: number) => {
    const response = await api.delete<void>(`/task-logs/${id}`);
    return response.data;
  }
}
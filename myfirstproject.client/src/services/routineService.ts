import api from "./axiosConfig";
import type { Routine } from "../types/routine";
import type { TaskLog } from "../types/taskLog";

export type RoutinePayload = Omit<Routine, "id" | "createdAt" | "updatedAt">;

export type RoutineResponse = Routine & {
  taskLogs: TaskLog[];
};

export const routineService = {
  getAllRoutines: async () => {
    const response = await api.get<RoutineResponse[]>("/routines");
    return response.data;
  },
  getRoutineById: async (id: string) => {
    const response = await api.get<RoutineResponse>(`/routines/${id}`);
    return response.data;
  },
  createRoutine: async (payload: RoutinePayload) => {
    const response = await api.post<RoutineResponse>("/routines", payload);
    return response.data;
  },
  updateRoutine: async (id: string, payload: RoutinePayload) => {
    const response = await api.patch<RoutineResponse>(
      `/routines/${id}`,
      payload
    );
    return response.data;
  },
  deleteRoutine: async (id: string) => {
    const response = await api.delete<void>(`/routines/${id}`);
    return response.data;
  },
};

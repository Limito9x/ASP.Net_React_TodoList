import api from "./axiosConfig";
import type { Routine, RecurrenceRule } from "../types/routine";
import type { TaskLog, TaskLogStatus } from "../types/taskLog";
import type { ActualLinkedGoal, DefaultLinkedGoal } from "../types/goal";
import type { Form } from "../types/form";

export type RoutinePayload = {
  name: string;
  description?: string;
  scheduledTime: string;
  rule: RecurrenceRule;
  phaseId?: number;
  linkedGoals?: DefaultLinkedGoal[];
};

export type RoutineCheckinPayload = {
    outcome: TaskLogStatus;
    note?: string;
    contributions?: ActualLinkedGoal[];
    data?: Form[];
}

export type RoutineResponse = Routine & {
  taskLogs: TaskLog[];
};

export const routineService = {
  getAllRoutines: async () => {
    const response = await api.get<RoutineResponse[]>("/routines");
    return response.data;
  },
  getRoutineById: async (id: number) => {
    const response = await api.get<RoutineResponse>(`/routines/${id}`);
    return response.data;
  },
  createRoutine: async (payload: RoutinePayload) => {
    const response = await api.post<RoutineResponse>("/routines", payload);
    return response.data;
  },
  checkinRoutine: async (id: number, payload: RoutineCheckinPayload) => {
    const response = await api.post<RoutineResponse>(`/routines/${id}/checkin`, payload);
    return response.data;
  },
  updateRoutine: async (id: number, payload: RoutinePayload) => {
    const response = await api.patch<RoutineResponse>(
      `/routines/${id}`,
      payload
    );
    return response.data;
  },
  deleteRoutine: async (id: number) => {
    const response = await api.delete<void>(`/routines/${id}`);
    return response.data;
  },
};

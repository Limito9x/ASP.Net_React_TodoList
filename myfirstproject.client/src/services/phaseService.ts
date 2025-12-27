import api from "./axiosConfig";
import type { Phase } from "../types/phase";
import type { Routine } from "../types/routine";
import type { SingleTask } from "../types/singleTask";

export type PhasePayload = Omit<
  Phase,
  | "id"
  | "progress"
  | "createdAt"
  | "updatedAt"
  | "actualStartDate"
  | "actualEndDate"
> & {
  planId?: number;
};

export type PhaseResponse = Phase & {
  routines: Routine[];
  singleTasks: SingleTask[];
};

export const phaseService = {
  getPhaseById: async (id: string) => {
    const response = await api.get<PhaseResponse>(`/phases/${id}`);
    return response.data;
  },
  createPhase: async (payload: PhasePayload) => {
    const response = await api.post<PhaseResponse>("/phases", payload);
    return response.data;
  },
  updatePhase: async (id: number, payload: PhasePayload) => {
    const response = await api.patch<PhaseResponse>(`/phases/${id}`, payload);
    return response.data;
  },
  deletePhase: async (id: number) => {
    const response = await api.delete<void>(`/phases/${id}`);
    return response.data;
  },
};

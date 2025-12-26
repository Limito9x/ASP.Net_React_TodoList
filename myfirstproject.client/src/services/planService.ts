import api from "./axiosConfig";
import type { Plan } from "../types/plan";
import type { Phase } from "../types/phase";
import type { SingleTask } from "../types/singleTask";

export type PlanPayload = Omit<
  Plan,
  | "id"
  | "progress"
  | "createdAt"
  | "updatedAt"
  | "actualStartDate"
  | "actualEndDate"
>;

export type PlanResponse = Plan & {
  phases: Phase[]; // Phase là một dạng đơn giản 
};

export interface SuggestPlanResponse {
  title: string;
  description: string;
  phases: PhaseInPlan[]; // PhaseInPlan bao gồm cả tasks
}

export type PhaseInPlan = Omit<
  Phase,
  "id" | "createdAt" | "updatedAt" | "actualStartDate" | "actualEndDate"
> & {
  tasks: SingleTaskInPhase[];
};

export type SingleTaskInPhase = Omit<
  SingleTask,
  | "id"
  | "createdAt"
  | "updatedAt"
>;

export const planService = {
  getAllPlans: async () => {
    const response = await api.get<PlanResponse[]>("/plans");
    return response.data;
  },
  getPlanById: async (id: string) => {
    const response = await api.get<PlanResponse>(`/plans/${id}`);
    return response.data;
  },
  createPlan: async (payload: PlanPayload) => {
    const response = await api.post<PlanResponse>("/plans", payload);
    return response.data;
  },
  updatePlan: async (id: number, payload: PlanPayload) => {
    const response = await api.put<PlanResponse>(`/plans/${id}`, payload);
    return response.data;
  },
  deletePlan: async (id: number) => {
    const response = await api.delete<void>(`/plans/${id}`);
    return response.data;
  },
  suggestPlans: async (prompt: string) => {
    const response = await api.post<SuggestPlanResponse>(`/plans/suggest`, {
      prompt,
    });
    return response.data;
  },
};

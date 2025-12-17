import api from "./axiosConfig";

export interface PlanPayload {
    title: string;
    description?: string;
    endDate?: string;
    tasks?: TaskInPlanSuggestion[];
}

export interface PlanResponse {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    userId?: string;
}

export interface SuggestPlanResponse {
    title: string;
    description: string;
    tasks: TaskInPlanSuggestion[];
}

export interface TaskInPlanSuggestion {
    name: string;
    description: string;
    dayOffset: number;
}

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
  updatePlan: async (id: string, payload: PlanPayload) => {
    const response = await api.put<PlanResponse>(`/plans/${id}`, payload);
    return response.data;
  },
  deletePlan: async (id: string) => {
    const response = await api.delete<void>(`/plans/${id}`);
    return response.data;
  },
  suggestPlans: async (prompt: string) => {
    const response = await api.post<SuggestPlanResponse>(`/plans/suggest`, { prompt });
    return response.data;
  }
};
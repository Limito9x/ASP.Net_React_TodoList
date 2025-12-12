import api from "./axiosConfig";

export interface PlanPayload {
    title: string;
    description?: string;
    endDate?: string;
}

export interface PlanResponse {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    userId?: string;
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
};
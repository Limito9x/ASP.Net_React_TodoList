import api from "./axiosConfig";
import type { Form } from "../types/form";

export type FormPayload = Omit<Form, "id" | "createdAt" | "updatedAt">;

export const formService = {
  getAllForms: async () => {
    const response = await api.get<Form[]>(`/forms`);
    return response.data;
  },
  createForm: async (payload: FormPayload) => {
    const response = await api.post<Form>("/forms", payload);
    return response.data;
  },
  deleteForm: async (id: string) => {
    const response = await api.delete<void>(`/forms/${id}`);
    return response.data;
  },
};

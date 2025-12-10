import api from "./axiosConfig";

export interface CategoryPayload {
    name: string;
    description?: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    description?: string;
    userId?: string;
}

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get<CategoryResponse[]>("/category");
    return response.data;
  },
    getCategoryById: async (id: string) => {
    const response = await api.get<CategoryResponse>(`/category/${id}`);
    return response.data;
  },
  createCategory: async (payload: CategoryPayload) => {
    const response = await api.post<CategoryResponse>("/category", payload);
    return response.data;
  },
};
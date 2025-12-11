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
    const response = await api.get<CategoryResponse[]>("/categories");
    return response.data;
  },
    getCategoryById: async (id: string) => {
    const response = await api.get<CategoryResponse>(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (payload: CategoryPayload) => {
    const response = await api.post<CategoryResponse>("/categories", payload);
    return response.data;
  },
  updateCategory: async (id: string, payload: CategoryPayload) => {
    const response = await api.put<CategoryResponse>(`/categories/${id}`, payload);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete<void>(`/categories/${id}`);
    return response.data;
  },
};
import api from "./axiosConfig";

export interface LoginPayload {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
}

export interface RegisterPayload {
  userName: string;
  fullName: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<LoginResponse>("/auth/me");
    return response.data;
  }
};

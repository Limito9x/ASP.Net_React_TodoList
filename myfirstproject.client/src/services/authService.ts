import api from "./axiosConfig";
import type { User } from "../types/user";

type LoginPayload = Pick<User, 'userName'> & { password: string };

type LoginResponse = Pick<User, 'id' | 'userName' | 'fullName' | 'email'> & {
  token: string;
};

type RegisterPayload = Pick<User, 'userName' | 'fullName' | 'email'> & { password: string };

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

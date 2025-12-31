import api from "./axiosConfig";
import type { TodayTask } from "../types/schedule";

export const scheduleService = {
  getTodayTasks: async () => {
    const response = await api.get<TodayTask[]>("/schedules/today");
    return response.data;
  },
};
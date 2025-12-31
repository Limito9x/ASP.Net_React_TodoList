import type { GoalConfig } from "./phase";
import type { DefaultLinkedGoal } from "./goal";

export interface TodayTask {
    id: number;
    name: string;
    description?: string;
    type: "Single" | "Routine";
    subType?: "Normal" | "Milestone" | "Event";
    startAt?: string;
    endAt?: string;
    dueDate?: string;
    linkedGoals?: DefaultLinkedGoal[];
    linkedFormIds?: number[];
    phase?: {
        id: number;
        title: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        order: number;
        progress?: number;
        goals?: GoalConfig[];
        plan: {
            id: number;
            title: string;
            progress: number;
            startDate?: string;
            endDate?: string;
        }
    }
}
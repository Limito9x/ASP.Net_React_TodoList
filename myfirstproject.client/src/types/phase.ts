import type { TimeLineEntity } from "./common";

export type GoalType = "Numeric" | "Boolean" | "Count" | "TaskOnly";

export type GoalConfig = {
  id?: string;
  name: string;
  type: GoalType;
  target: number;
  start: number;
  current: number;
  unit?: string;
};

export interface Phase extends TimeLineEntity {
  title: string;
  description?: string;
  goals?: GoalConfig[];
}
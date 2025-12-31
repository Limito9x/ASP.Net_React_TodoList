import type { BaseEntity } from "./common";

export type Frequency = "Daily" | "Weekly" | "Monthly" | "Yearly";

export type RecurrenceRule = {
  frequency: Frequency;
  interval: number;
  daysOfWeek?: number[]; // 0 (Sunday) to 6 (Saturday)
  daysOfMonth?: number[]; // 1 to 31
};

export interface Routine extends BaseEntity {
  name: string;
  description: string;
  scheduledTime: string;
  nextOccurrence: string;
  recurrenceRule: RecurrenceRule;
  note?: string;
}
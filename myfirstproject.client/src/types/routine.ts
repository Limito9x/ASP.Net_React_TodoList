import type { BaseEntity } from "./common";

export type Frequence = "Daily" | "Weekly" | "Monthly" | "Yearly";

export type RecurrenceRule = {
  frequence: Frequence;
  interval: number;
  daysOfWeek?: number[]; // 0 (Sunday) to 6 (Saturday)
  dayOfMonth?: number[]; // 1 to 31
};

export interface Routine extends BaseEntity {
  title: string;
  description: string;
  scheduledTime: string;
  nextOccurrence: string;
  recurrenceRule: RecurrenceRule;
  note?: string;
}
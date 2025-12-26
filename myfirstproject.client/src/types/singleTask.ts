import type { BaseEntity } from "./common";
import type { Form } from "./form";

export type SingleTaskStatus =
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "Archived";

export type SingleTaskType = "Normal" | "Milestone" | "Event" | "Appointment";

export interface SingleTask extends BaseEntity {
  name: string;
  description: string;
  dueDate: string;
  completedAt?: string;
  startAt?: string;
  endAt?: string;
  status: SingleTaskStatus;
  type: SingleTaskType;
  note?: string;
  data?: Form[];
}

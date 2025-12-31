import type { BaseEntity } from "./common";
import type { Form } from "./form";

export type TaskLogStatus = "Success" | "Partial" | "Failed" | "Skipped";

export interface TaskLog extends BaseEntity {
  name: string;
  description: string;
  dueDate: string;
  completedAt?: string;
  note?: string;
  data?: Form[];
  status: TaskLogStatus;
}

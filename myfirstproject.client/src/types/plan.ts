import type { TimeLineEntity } from "./common";

export interface Plan extends TimeLineEntity {
  title: string;
  description?: string;
  progress: number;
}
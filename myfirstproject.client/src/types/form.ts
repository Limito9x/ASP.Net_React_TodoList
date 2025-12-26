import type { BaseEntity } from "./common";

export type MetadataField = {
  id: string;
  // type: "string" | "number" | "date" | "boolean";
  type: string;
  label: string;
  value: any;
  defaultValue?: any;
};

export type MetadataRow = {
  id: string;
  fields: MetadataField[];
};

export interface Form extends BaseEntity {
  name: string;
  description?: string;
  rows: MetadataRow[];
}
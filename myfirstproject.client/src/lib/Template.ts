export type FieldType = "text" | "number" | "boolean" | "date";

export interface InputField {
  id: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
}

export interface Template {
  id: string;
  name: string;
  rows: InputField[][];
}

export interface TemplateMetadata {
  instanceId: string; // Unique ID cho mỗi instance
  templateId: string; // ID của template gốc
  displayName: string; // Tên hiển thị với số thứ tự
  rows: (InputField & { value?: any })[][];
}

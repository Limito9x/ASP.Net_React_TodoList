
import { fieldTypeOptions } from "../../components/Template/DynamicField";
import type { Form } from "../../types/form";

export const mapRowToFormGroup = (row: any) => {
  // Kiểm tra nếu row hợp lệ và có fields
  const fields = Array.isArray(row.fields) ? row.fields : [];

  return {
    id: crypto.randomUUID(),
    fields: fields.map((field: any) => ({
      ...field,
      id: crypto.randomUUID(),
      // Lấy giá trị mặc định dựa trên loại field
      value:
        field.defaultValue ??
        fieldTypeOptions[field.type as keyof typeof fieldTypeOptions]
          ?.defaultValue,
    })),
  };
};

export const mapTemplateToFormGroup = (template: Form) => {
  return {
    id: crypto.randomUUID(),
    templateId: template.id,
    name: template.name,
    rows: (template.rows || []).map((row) => mapRowToFormGroup(row)),
  };
};

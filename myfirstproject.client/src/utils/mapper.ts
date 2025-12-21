import type { Template } from "../lib/Template";
import { fieldTypeOptions } from "../components/Template/DynamicField";

// Bản thân mỗi lần map là tạo ra 1 instance mới với ID duy nhất
export const mapTemplateToFormGroup = (template: Template) => {
    return {
        id: crypto.randomUUID(),
        templateId: template.id,
        groupName: template.name,
        rows: template.rows.map((row) => ({
            id: crypto.randomUUID(),
            fields: row.map((field) => ({
                ...field,
                id: crypto.randomUUID(),
                value: field.defaultValue ?? fieldTypeOptions[field.type]?.defaultValue,
            })),
        }))
    }
};

export const mapRowToFormGroup = (row: Template["rows"][number]) => {
    return {
        id: crypto.randomUUID(),
        fields: row.map((field) => ({
            ...field,
            id: crypto.randomUUID(),
            value: field.defaultValue ?? fieldTypeOptions[field.type]?.defaultValue,
        }))
    }
}
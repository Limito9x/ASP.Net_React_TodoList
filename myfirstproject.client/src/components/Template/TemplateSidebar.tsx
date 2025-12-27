import { fieldTypeOptions } from "./DynamicField";
import { Card, Button } from "antd";
import { useEffect, useState } from "react";
import { formService } from "../../services/formService";
import { useQuery } from "@tanstack/react-query";
import type { Form } from "../../types/form";

interface TemplateSidebarProps {
  onAddTemplate: (template: Form) => void;
  onAddRow: (
    templateRow: Form["rows"][number],
    templateIndex: number
  ) => void;
  selectedTemplateId: number | undefined;
  onUnselectTemplate: () => void;
}

export default function TemplateSidebar({
  onAddTemplate,
  onAddRow,
  selectedTemplateId,
  onUnselectTemplate,
}: TemplateSidebarProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Form | null>(
    null
  );

  const { data: forms } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const result = await formService.getAllForms();
      return result;
    },
  });

  useEffect(() => {
    const template = forms?.find((t) => t.id === selectedTemplateId) || null;
    setSelectedTemplate(template);
  }, [selectedTemplateId, forms]);

  console.log("Fetched forms:", forms);

  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #f0f0f0",
        borderRadius: 4,
        position: "sticky",
        top: 16,
      }}
    >
      {/* Hiển thị danh sách template để thêm mới */}
      {!selectedTemplateId && (
        <>
          <p style={{ color: "#666", fontStyle: "italic" }}>
            Click vào template bên dưới để thêm vào form
          </p>
          {forms?.map((template) => (
            <Card
              key={template.id}
              title={template.name}
              style={{
                marginBottom: 16,
                cursor: "pointer",
                border: "1px solid #d9d9d9",
              }}
              hoverable
              onClick={() => onAddTemplate(template)}
            >
              <div style={{ color: "#666", fontSize: "12px" }}>
                {template.rows.length} dòng mẫu
              </div>
            </Card>
          ))}
        </>
      )}

      {/* Hiển thị các dòng mẫu của template đang được chọn */}
      {selectedTemplate && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="link"
              onClick={() => onUnselectTemplate()}
              style={{ paddingLeft: 0 }}
            >
              ← Quay lại danh sách template
            </Button>
          </div>

          {(() => {
            return (
              <>
                <h3>{selectedTemplate.name} - Các dòng mẫu</h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "12px",
                    marginBottom: 16,
                  }}
                >
                  Click vào dòng để thêm vào nhóm đã chọn
                </p>

                {selectedTemplate.rows.map((row, rowIndex) => (
                  <Card
                    key={rowIndex}
                    title={`Dòng ${rowIndex + 1}`}
                    style={{
                      marginBottom: 12,
                      cursor: "pointer",
                      border: "1px solid #d9d9d9",
                    }}
                    hoverable
                    onClick={() =>
                      onAddRow(
                        row,
                        forms?.findIndex(
                          (t) => t.id === selectedTemplate.id
                        ) ?? -1
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {row.fields.map((field) => (
                        <div
                          key={field.id}
                          style={{ fontSize: "12px", color: "#666" }}
                        >
                          • {field.label} ({fieldTypeOptions[field.type as keyof typeof fieldTypeOptions]?.label}
                          )
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}

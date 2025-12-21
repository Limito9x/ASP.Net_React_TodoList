import  { fieldTypeOptions } from "./DynamicField";
import { Card, Button } from "antd";
import { useEffect, useState } from "react";
import type { Template } from "../../lib/Template";

const exampleTemplates: Template[] = [
  {
    id: "template1",
    name: "Tập gym",
    rows: [
      [
        {
          id: "1",
          label: "Tên bài tập với tạ",
          type: "text",
          defaultValue: "",
        },
        { id: "2", label: "Số hiệp", type: "number", defaultValue: 0 },
        { id: "3", label: "Mức tạ (kg)", type: "number", defaultValue: 0 },
      ],
      [
        {
          id: "4",
          label: "Tên bài tập cường độ",
          type: "text",
          defaultValue: "",
        },
        { id: "5", label: "Thời gian (phút)", type: "number", defaultValue: 0 },
      ],
    ],
  },
  {
    id: "template2",
    name: "Đi chợ",
    rows: [
      [
        { id: "1", label: "Tên món hàng", type: "text", defaultValue: "" },
        { id: "2", label: "Số lượng", type: "number", defaultValue: 0 },
      ],
    ],
  },
];

interface TemplateSidebarProps {
  onAddTemplate: (template: Template) => void;
  onAddRow: (templateRow: Template["rows"][number], templateIndex: number) => void;
  selectedTemplateId: string | undefined;
  onUnselectTemplate: () => void;
}

export default function TemplateSidebar({ onAddTemplate, onAddRow, selectedTemplateId, onUnselectTemplate, }: TemplateSidebarProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const template = exampleTemplates.find(t => t.id === selectedTemplateId) || null;
    setSelectedTemplate(template);
  },[selectedTemplateId]);

  return (
    <div style={{ padding: 16, border: "1px solid #f0f0f0", borderRadius: 4, position: "sticky", top: 16 }}>
          {/* Hiển thị danh sách template để thêm mới */}
          {!selectedTemplateId && (
            <>
              <p style={{ color: "#666", fontStyle: "italic" }}>
                Click vào template bên dưới để thêm vào form
              </p>
              {exampleTemplates.map((template) => (
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
                          onAddRow(row, exampleTemplates.findIndex(t => t.id === selectedTemplate.id))
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          {row.map((field) => (
                            <div
                              key={field.id}
                              style={{ fontSize: "12px", color: "#666" }}
                            >
                              • {field.label} (
                              {fieldTypeOptions[field.type]?.label})
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

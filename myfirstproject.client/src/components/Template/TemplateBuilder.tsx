import React, { useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, Card, Row, Col, Form, Tooltip } from "antd";
import { MenuOutlined, DeleteOutlined } from "@ant-design/icons";
import { FIELD_DEFINITIONS, type FieldType } from "./DynamicField";
import FormPreview from "./FormPreview"; // Giả sử bạn đã tách file Preview ra

// --- 1. Component Input Tối ưu (Chống Lag khi gõ) ---
const LazyInput = ({ value, onChange, placeholder, ...props }: any) => {
  const [innerValue, setInnerValue] = useState(value);

  // Sync khi giá trị từ form store thay đổi (do undo/redo hoặc reset)
  React.useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <Input
      {...props}
      value={innerValue}
      onChange={(e) => setInnerValue(e.target.value)}
      onBlur={() => {
        if (innerValue !== value) onChange(innerValue);
      }}
      placeholder={placeholder}
    />
  );
};

// --- 2. Item Kéo thả (Cấu hình 1 Field) ---
const SortableConfigurationItem = ({
  field, // Object field của Ant Form.List (chứa name = index)
  id, // ID thực tế (UUID) để làm key
  onRemove,
  type, // Loại input để hiển thị Label
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: "10px",
    border: "1px solid #d9d9d9",
    marginBottom: "8px",
    background: "#fff",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: isDragging ? 999 : "auto",
    position: "relative" as "relative",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Tay nắm */}
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", color: "#999", fontSize: "18px" }}
      >
        <MenuOutlined />
      </div>

      {/* Hiển thị loại Field */}
      <div style={{ fontWeight: 500, minWidth: 60 }}>
        {FIELD_DEFINITIONS[type as FieldType]?.label}:
      </div>

      {/* Input nhập nhãn (Dùng LazyInput để không bị lag cả form) */}
      <Form.Item
        name={[field.name, "label"]}
        noStyle
        rules={[{ required: true, message: "Nhập tên" }]}
      >
        <LazyInput placeholder="Tên nhãn (VD: Số hiệp)" />
      </Form.Item>

      {/* Các Input Ẩn để lưu cấu trúc */}
      <Form.Item name={[field.name, "id"]} hidden initialValue={id}>
        <Input />
      </Form.Item>
      <Form.Item name={[field.name, "type"]} hidden initialValue={type}>
        <Input />
      </Form.Item>

      {/* Nút xóa */}
      <Button danger type="text" icon={<DeleteOutlined />} onClick={onRemove} />
    </div>
  );
};

// --- 3. Component Chính ---
export default function TemplateBuilder() {
  const [form] = Form.useForm();

  // Xử lý kéo thả
  const handleDragEnd = (event: DragEndEvent, rowIndex: number) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 1. Lấy toàn bộ mảng rows
    const rows = form.getFieldValue("rows");
    const currentRow = rows[rowIndex];
    const fields = currentRow.fields;

    // 2. Tìm vị trí cũ và mới dựa trên ID (UUID)
    const oldIndex = fields.findIndex((f: any) => f.id === active.id);
    const newIndex = fields.findIndex((f: any) => f.id === over.id);

    // 3. Tráo đổi vị trí trong mảng
    const newFields = arrayMove(fields, oldIndex, newIndex);

    // 4. Cập nhật lại Form Store
    const newRows = [...rows];
    newRows[rowIndex].fields = newFields;
    form.setFieldsValue({ rows: newRows });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛠️ Thiết kế mẫu (Template Builder)</h2>

      <Row gutter={24} style={{ marginTop: 20 }}>
        {/* CỘT TRÁI: BUILDER */}
        <Col span={12}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              // Khởi tạo sẵn 1 dòng mẫu có ID
              rows: [{ id: crypto.randomUUID(), fields: [] }],
            }}
          >
            {/* VÒNG LẶP NGOÀI: CÁC DÒNG (ROWS/GROUPS) */}
            <Form.List name="rows">
              {(rows, { add: addRow, remove: removeRow }) => (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {rows.map((row, rowIndex) => (
                    <Card
                      key={row.key}
                      title={`Dòng ${rowIndex + 1}`}
                      // Nút xóa dòng nằm ở đây
                      extra={
                        <Button
                          danger
                          type="text"
                          onClick={() => removeRow(row.name)}
                        >
                          Xóa dòng
                        </Button>
                      }
                      // Nút thêm trường nằm ở footer hoặc action tùy bạn chọn
                      actions={Object.entries(FIELD_DEFINITIONS).map(
                        ([type, def]) => (
                          <Tooltip title={`Thêm ô ${def.label}`} key={type}>
                            <Button
                              type="text"
                              icon={def.icon}
                              onClick={() => {
                                // LOGIC THÊM FIELD THỦ CÔNG
                                // 1. Lấy data hiện tại
                                const currentRows = form.getFieldValue("rows");
                                // 2. Push item mới có đầy đủ ID vào mảng fields của dòng này
                                currentRows[rowIndex].fields.push({
                                  id: crypto.randomUUID(),
                                  type: type,
                                  label: "",
                                  defaultValue: def.defaultValue,
                                });
                                // 3. Cập nhật lại form
                                form.setFieldsValue({ rows: [...currentRows] });
                              }}
                            >
                              {def.label}
                            </Button>
                          </Tooltip>
                        )
                      )}
                    >
                      {/* VÒNG LẶP TRONG: CÁC INPUT (FIELDS) */}
                      <Form.List name={[row.name, "fields"]}>
                        {(fields, { remove: removeField }) => {
                          // Lấy dữ liệu thực tế để lấy ID cho DnD
                          const currentFieldsData =
                            form.getFieldValue(["rows", row.name, "fields"]) ||
                            [];

                          return (
                            <DndContext
                              collisionDetection={closestCenter}
                              onDragEnd={(e) => handleDragEnd(e, row.name)}
                            >
                              <SortableContext
                                items={currentFieldsData.map((f: any) => f.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                  }}
                                >
                                  {fields.map((field, index) => {
                                    // Lấy data dựa trên index hiện tại
                                    const fieldData = currentFieldsData[index];
                                    // Fallback an toàn
                                    if (!fieldData) return null;

                                    return (
                                      <SortableConfigurationItem
                                        key={fieldData.id} // Key React = UUID
                                        id={fieldData.id} // ID DnD = UUID
                                        field={field} // Field Antd (để bind input name)
                                        type={fieldData.type}
                                        onRemove={() => removeField(field.name)}
                                      />
                                    );
                                  })}
                                </div>
                              </SortableContext>
                            </DndContext>
                          );
                        }}
                      </Form.List>

                      {/* Nếu chưa có field nào */}
                      {form.getFieldValue(["rows", row.name, "fields"])
                        ?.length === 0 && (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#ccc",
                            padding: 20,
                          }}
                        >
                          Chưa có trường nào. Chọn bên dưới để thêm.
                        </div>
                      )}
                    </Card>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() =>
                      addRow({ id: crypto.randomUUID(), fields: [] })
                    }
                  >
                    + Thêm Dòng Mới
                  </Button>
                </div>
              )}
            </Form.List>
          </Form>
        </Col>

        {/* CỘT PHẢI: PREVIEW */}
        <Col span={12}>
          {/* Component Preview của bạn */}
          <FormPreview form={form} />
        </Col>
      </Row>
    </div>
  );
}

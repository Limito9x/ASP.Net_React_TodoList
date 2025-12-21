import React from "react";
import { Button, Form, Input } from "antd";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 1. Component con (Cái vỏ bọc để kéo thả)
const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as "relative",
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

// 2. Component Chính (Cái Kệ Sách)
interface SortableFormListProps {
  name: string | (string | number)[]; // Tên field trong Form (VD: "rows" hoặc ["rows", 0, "fields"])
  renderItem: (
    field: any,
    index: number,
    remove: () => void
  ) => React.ReactNode; // Hàm render giao diện tùy ý
  addButton?: React.ReactNode; // Nút thêm mới (tùy chọn)
}

export const SortableFormList = ({
  name,
  renderItem,
  addButton,
}: SortableFormListProps) => {
  const form = Form.useFormInstance(); // Lấy instance form từ context (Antd 5+)

  // Theo dõi danh sách để lấy ID thực tế
  // Nếu list nằm sâu (nested), useWatch vẫn bắt được
  const items = Form.useWatch(name, form) || [];

  return (
    <Form.List name={name}>
      {(fields, { add, remove, move }) => {
        // Logic xử lý khi thả chuột (Dùng hàm move của Antd)
        const handleDragEnd = (event: DragEndEvent) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;

          // Tìm index dựa trên ID (Đây là cầu nối giữa DnD và Form)
          const oldIndex = items.findIndex((x: any) => x.id === active.id);
          const newIndex = items.findIndex((x: any) => x.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            move(oldIndex, newIndex); // <--- HÀM MOVE ĐƯỢC GỌI Ở ĐÂY
          }
        };

        return (
          <>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((x: any) => x.id)} // Danh sách ID cho DnD Kit
                strategy={verticalListSortingStrategy}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {fields.map((field, index) => {
                    // Lấy ID của dòng hiện tại để làm key
                    const rowData = items[index];
                    // Fallback an toàn nếu data chưa sync kịp
                    if (!rowData || !rowData.id) return null;

                    return (
                      <SortableItem key={rowData.id} id={rowData.id}>
                        {/* Gọi hàm render từ bên ngoài truyền vào */}
                        {renderItem(field, index, () => remove(field.name))}

                        {/* Input Ẩn bắt buộc để giữ ID cho item */}
                        {/* <Form.Item
                          name={[field.name, "id"]}
                          initialValue={rowData.id}
                          hidden
                        >
                          <Input />
                        </Form.Item> */}
                      </SortableItem>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>

            {/* Nút thêm mới */}
            {addButton && (
              <div style={{ marginTop: 12 }}>
                {React.cloneElement(addButton as React.ReactElement<any>, {
                  onClick: () => add(),
                })}
              </div>
            )}
          </>
        );
      }}
    </Form.List>
  );
};

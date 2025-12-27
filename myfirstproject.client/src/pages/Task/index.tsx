import { useParams } from "react-router-dom";
import EditTask from "../../components/Template/EditTask";
import TemplateSidebar from "../../components/Template/TemplateSidebar";
import { Row, Col, Form } from "antd";
import { mapRowToFormGroup, mapTemplateToFormGroup } from "../../utils/mapper";
import type { Template } from "../../lib/Template";
import { useState } from "react";
import type { Form as FormType } from "../../types/form";

export default function Task() {
  const { taskId } = useParams<{ taskId: string }>();
  const [form] = Form.useForm();

  const [selectedInstance, setSelectedInstance] = useState<ReturnType<
    typeof mapTemplateToFormGroup
  > | null>(null);

  const handleAddTemplate = (template: FormType) => {
    const formGroup = mapTemplateToFormGroup(template);
    const currentMetadata = form.getFieldValue("metadata") || [];
    form.setFieldsValue({
      metadata: [...currentMetadata, formGroup],
    });
    console.log("Added form group:", formGroup);
  };

  const handleAddRow = (templateRow: FormType["rows"][number]) => {
    if (!selectedInstance) return;

    const currentMetadata = form.getFieldValue("metadata") || [];
    const instanceIndex = currentMetadata.findIndex(
      (m: any) => m.id === selectedInstance.id
    );

    if (instanceIndex === -1) return;

    // Tạo dữ liệu row mới từ templateRow (đã sửa ở bước 1)
    const newRow = mapRowToFormGroup(templateRow);

    const templatePath = ["metadata", instanceIndex, "rows"];
    const currentRows = form.getFieldValue(templatePath) || [];

    // Cập nhật giá trị vào form
    const updatedRows = [...currentRows, newRow];
    form.setFieldValue(templatePath, updatedRows);

    // Quan trọng: Cập nhật lại selectedInstance state để UI Sidebar/EditTask đồng bộ
    setSelectedInstance({
      ...selectedInstance,
      rows: updatedRows,
    });

    console.log("Added row successfully:", newRow);
  };

  return (
    <div>
      Task Page for Task ID: {taskId}{" "}
      <Row style={{ marginTop: 20 }}>
        <Col span={16}>
          <EditTask
            form={form}
            selectedInstance={selectedInstance}
            onSelectInstance={setSelectedInstance}
          />
        </Col>
        <Col span={8}>
          <TemplateSidebar
            onAddTemplate={handleAddTemplate}
            onAddRow={handleAddRow}
            selectedTemplateId={selectedInstance?.templateId}
            onUnselectTemplate={() => setSelectedInstance(null)}
          />
        </Col>
      </Row>
    </div>
  );
}

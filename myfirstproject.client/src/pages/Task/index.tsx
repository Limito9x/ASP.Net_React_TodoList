import { useParams } from "react-router-dom";
import EditTask from "../../components/Template/EditTask";
import TemplateSidebar from "../../components/Template/TemplateSidebar";
import { Row, Col, Form } from "antd";
import { mapRowToFormGroup, mapTemplateToFormGroup } from "../../utils/mapper";
import type { Template } from "../../lib/Template";
import { useState } from "react";

export default function Task() {
    const { planId, taskId } = useParams<{ planId: string; taskId: string }>();
    const [form] = Form.useForm();

    const [selectedInstance, setSelectedInstance] = useState<ReturnType<typeof mapTemplateToFormGroup> | null>(null);

  const handleAddTemplate = (template: Template) => {
    const formGroup = mapTemplateToFormGroup(template);
    const currentMetadata = form.getFieldValue("metadata") || [];
    form.setFieldsValue({
      metadata: [...currentMetadata, formGroup],
    });
    console.log("Added form group:", formGroup);
  };

  const handleAddRow = (templateRow: Template["rows"][number], templateIndex: number) => {
    const templatePath = ["metadata", templateIndex];
    const newRow = mapRowToFormGroup(templateRow);
    const targetTemplate = form.getFieldValue(templatePath);
    const updatedRows = [...(targetTemplate.rows || []), newRow];
    form.setFieldValue([...templatePath, "rows"], updatedRows);
    console.log("Added row:", newRow);
  };

  return (
    <div>
      Task Page for Plan ID: {planId} and Task ID: {taskId}
      <Row style={{ marginTop: 20 }}>
        <Col span={16}>
          <EditTask form={form} selectedInstance={selectedInstance} onSelectInstance={setSelectedInstance} />
        </Col>
        <Col span={8}>
          <TemplateSidebar onAddTemplate={handleAddTemplate} onAddRow={handleAddRow} selectedTemplateId={selectedInstance?.templateId} onUnselectTemplate={() => setSelectedInstance(null)} />
        </Col>
      </Row>
    </div>
  );
}

import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import DynamicField from "./DynamicField";
import type { mapTemplateToFormGroup } from "../../utils/mapper";

interface EditTaskProps {
  form: ReturnType<typeof Form.useForm>[0];
  onSelectInstance: (instance: ReturnType<typeof mapTemplateToFormGroup> | null) => void;
  selectedInstance: ReturnType<typeof mapTemplateToFormGroup> | null;
}

export default function EditTask({
  form,
  onSelectInstance,
  selectedInstance,
}: EditTaskProps) {

  return (
    <>
      <Button
        type="default"
        onClick={() => console.log(form.getFieldValue("metadata"))}
        style={{ marginBottom: 16, marginLeft: 8 }}
      >
        Xem Dữ Liệu Form
      </Button>
      <Form form={form} layout="vertical">
        <Form.List name="metadata">
          {(templates, { remove: removeTemplate }) => (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {templates.map((template, index) => {
                const isSelected =
                  selectedInstance?.id ===
                  form.getFieldValue(["metadata", template.name, "id"]);
                return (
                  <Card
                    key={template.key}
                    title={`Template ${
                      form.getFieldValue("metadata")[template.name]
                        ?.groupName || ""
                    } (#${index + 1})`}
                    className="cursor-pointer"
                    onClick={() => onSelectInstance && onSelectInstance(form.getFieldValue(["metadata", template.name]))}
                    style={{ border: isSelected ? "2px solid #1890ff" : "" }}
                    extra={
                      <>
                        <Button
                          type="primary"
                          danger
                          onClick={() => removeTemplate(template.name)}
                          style={{ marginRight: 8 }}
                        >
                          Xóa Template
                        </Button>
                      </>
                    }
                  >
                    <Form.List name={[template.name, "rows"]}>
                      {(rows, { remove: removeRow }) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {rows.map((row) => (
                            <Space
                              key={row.key}
                              align="start"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                border: "1px solid #d9d9d9",
                                padding: "12px",
                              }}
                            >
                              <Form.List name={[row.name, "fields"]}>
                                {(fields, { remove: removeField }) => (
                                  <Row gutter={16}>
                                    {fields.map((field) => {
                                      const fieldPath = [
                                        "metadata", // Bắt đầu từ gốc là metadata
                                        template.name, // Lấy đúng chỉ số template, nghĩa là index của mảng templates
                                        "rows", // Chuyển vào biến rows của template đó
                                        row.name, // Lấy đúng chỉ số row, nghĩa là index của mảng rows
                                        "fields", // Chuyển vào biến fields của row đó
                                        field.name, // Lấy đúng chỉ số field, nghĩa là index của mảng fields (input)
                                      ];
                                      const fieldData =
                                        form.getFieldValue(fieldPath); // Lấy dữ liệu field từ form
                                      return (
                                        <Col
                                          span={24 / fields.length}
                                          key={field.key}
                                        >
                                          <Form.Item
                                            key={field.key}
                                            label={fieldData?.label}
                                            required={true}
                                            name={[field.name, "value"]}
                                          >
                                            <DynamicField
                                              type={fieldData?.type}
                                            />
                                          </Form.Item>
                                        </Col>
                                      );
                                    })}
                                    <Button
                                      type="dashed"
                                      danger
                                      onClick={() => removeRow(row.name)}
                                    >
                                      Xóa Dòng
                                    </Button>
                                  </Row>
                                )}
                              </Form.List>
                            </Space>
                          ))}
                        </div>
                      )}
                    </Form.List>
                  </Card>
                );
              })}
            </div>
          )}
        </Form.List>
      </Form>
    </>
  );
}

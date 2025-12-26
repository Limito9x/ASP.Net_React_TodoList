import { Card, Form, Divider, Row, Button, Input } from "antd";
import DynamicField from "./DynamicField";
import { formService } from "../../services/formService";

type PreviewRow = {
  id: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    defaultValue: unknown;
  }>;
};

export default function FormPreview({
  form,
}: {
  form: ReturnType<typeof Form.useForm>[0];
}) {
  const rows = Form.useWatch("rows", form) || [];

  const buildPayload = () => {
    const allValues = form.getFieldsValue(true);
    const templateName = allValues?.name as string | undefined;
    const currentRows = (allValues?.rows || rows) as PreviewRow[];

    const rowsWithValues = (currentRows || []).map((row) => ({
      ...row,
      fields: (row?.fields || []).map((field) => {
        const fieldId = String(field.id);
        const fieldValue =
          allValues?.[fieldId]?.value ?? field.defaultValue ?? undefined;

        return {
          ...field,
          value: fieldValue,
        };
      }),
    }));

    return {
      name: templateName ?? "",
      rows: rowsWithValues,
    };
  };

  const handleSave = async () => {
    const payload = buildPayload();
    console.log("AntD form store:", form.getFieldsValue(true));
    console.log("Payload (name + rows + field.value):", payload);

    // Nếu bạn muốn gọi API lưu luôn thì bật dòng dưới.
    const result = await formService.createForm(payload);
    console.log("Saved form result:", result);
  };

  return (
    <Card title="👁️ Preview" style={{ height: "100%", background: "#fafafa" }}>
      <Form layout="vertical" form={form} component={false}>
        {rows.map((row: any, rowIndex: number) => (
          <div
            key={rowIndex}
            style={{
              marginBottom: 24,
              padding: 16,
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 4,
            }}
          >
            <Divider>Row {rowIndex + 1}</Divider>
            <Row gutter={16}>
              {row.fields.map((field: any, fieldIndex: number) => {
                return (
                  <Form.Item
                    key={field.id}
                    label={field?.label || `Field ${fieldIndex + 1}`}
                    name={[field.id, "value"]}
                    style={{ flex: 1, marginRight: 8 }}
                  >
                    <DynamicField type={field?.type} />
                  </Form.Item>
                );
              })}
            </Row>
          </div>
        ))}
        <Form.Item label="Tên mẫu" name="name">
          <Input />
        </Form.Item>
      </Form>
      <Button type="primary" onClick={handleSave}>
        Lưu Mẫu
      </Button>
    </Card>
  );
}

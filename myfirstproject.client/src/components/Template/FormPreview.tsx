import { Card, Form, Divider, Row, Button } from "antd";
import DynamicField from "./DynamicField";

export default function FormPreview({
  form,
}: {
  form: ReturnType<typeof Form.useForm>[0];
}) {
  const rows = Form.useWatch("rows", form) || [];
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
      </Form>
      <Button type="primary" onClick={() => {
        const result = form.getFieldValue("rows");
        console.log(result);
      }}>
        Lưu Mẫu
      </Button>
    </Card>
  );
}

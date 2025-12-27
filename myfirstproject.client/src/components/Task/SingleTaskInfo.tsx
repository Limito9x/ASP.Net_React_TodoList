import { Form, Input, Select, DatePicker } from "antd";

export default function SingleTaskInfo({
  form,
}: {
  form: ReturnType<typeof Form.useForm>[0];
}) {
  // ✅ Dùng Form.useWatch để theo dõi reactive
  const taskType = Form.useWatch("type", form);
  const isEvent = taskType === "Event";

  return (
    <div>
        <Form.Item
          label="Task Name"
          name="name"
          rules={[{ required: true, message: "Please input the task name!" }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
        <Form.Item
          name="type"
          initialValue={"Normal"}
          label="Task Type"
          rules={[{ required: true, message: "Please select task type!" }]}
        >
          <Select placeholder="Select task type">
            <Select.Option value="Normal">Normal</Select.Option>
            <Select.Option value="Milestone">Milestone</Select.Option>
            <Select.Option value="Event">Event</Select.Option>
          </Select>
        </Form.Item>
        {isEvent ? (
          <>
            <Form.Item label="Start Date" name="startAt">
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD HH:mm" showTime />
            </Form.Item>
            <Form.Item label="End Date" name="endAt">
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD HH:mm" showTime />
            </Form.Item>
          </>
        ) : (
          <Form.Item label="Due Date" name="dueDate">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD HH:mm" showTime />
          </Form.Item>
        )}
    </div>
  );
}

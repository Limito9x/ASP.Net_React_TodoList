import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Popconfirm,
  Flex,
  Card,
  Spin,
  message,
  Tag,
  Select,
} from "antd";
import { taskService, type TaskResponse } from "../../services/taskService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

// --- 1. MAPPERS (Chuyển đổi dữ liệu) ---
const taskMappers = {
  // Chuyển dữ liệu từ Form (AntD) -> API Payload (JSON)
  toApiPayload: (values: any, planId: string) => {
    return {
      name: values.taskName,
      description: values.description,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      planId: planId,
    };
  },

  toApiUpdatePayload: (values: any) => {
    const payload: any = {};
    if (values.taskName !== undefined) payload.name = values.taskName;
    if (values.description !== undefined)
      payload.description = values.description;
    if (values.dueDate !== undefined)
      payload.dueDate = values.dueDate ? values.dueDate.toISOString() : null;
    if (values.status !== undefined) payload.status = values.status;
    return payload;
  },

  // Chuyển dữ liệu từ API (JSON) -> Form Values (AntD)
  toFormValues: (task: TaskResponse) => {
    return {
      taskName: task.name,
      description: task.description,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      status: task.status,
    };
  },
};

// --- 2. REUSABLE FORM COMPONENT ---
const TaskFormFields = () => (
  <>
    <Form.Item
      label="Task Name"
      name="taskName"
      rules={[{ required: true, message: "Please input the task name!" }]}
    >
      <Input placeholder="Enter task name" />
    </Form.Item>
    <Form.Item label="Description" name="description">
      <Input.TextArea placeholder="Enter description" rows={4} />
    </Form.Item>
    <Form.Item label="Due Date" name="dueDate">
      <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
    </Form.Item>
  </>
);

const updateFields = () => (
  <Form.Item label="Status" name="status">
    <Select>
      <Select.Option value="Todo">To Do</Select.Option>
      <Select.Option value="InProgress">In Progress</Select.Option>
      <Select.Option value="Completed">Done</Select.Option>
    </Select>
  </Form.Item>
);

export default function TaskPage() {
  const { planId } = useParams<{ planId: string }>();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // Gom state modal lại cho gọn
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    editingId?: string;
  }>({ isOpen: false, mode: "create" });

  const [form] = Form.useForm();

  // --- QUERY ---
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", planId],
    queryFn: () => taskService.getTasksByPlanId(planId!),
  });

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      messageApi.success("Task created successfully!");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["tasks", planId] });
    },
    onError: () => messageApi.error("Failed to create task."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      taskService.updateTask(id, payload),
    onSuccess: () => {
      messageApi.success("Task updated successfully!");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["tasks", planId] });
    },
    onError: () => messageApi.error("Failed to update task."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      messageApi.success("Task deleted!");
      queryClient.invalidateQueries({ queryKey: ["tasks", planId] });
    },
  });

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    form.resetFields();
    setModalState({ isOpen: true, mode: "create" });
  };

  const handleOpenEdit = (task: TaskResponse) => {
    const formValues = taskMappers.toFormValues(task);
    form.setFieldsValue(formValues);
    setModalState({ isOpen: true, mode: "edit", editingId: task.id });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const payload =
      modalState.mode === "create"
        ? taskMappers.toApiPayload(values, planId!)
        : taskMappers.toApiUpdatePayload(values);

    if (modalState.mode === "create") {
      createMutation.mutate(payload);
    } else if (modalState.mode === "edit" && modalState.editingId) {
      updateMutation.mutate({ id: modalState.editingId, payload });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1>My Tasks</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
        >
          Create New Task
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : tasks && tasks.length > 0 ? (
        <Flex vertical gap={16}>
          {tasks.map((task) => (
            <Card
              key={task.id}
              hoverable
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <strong>{task.name}</strong>
                </div>
              }
              extra={
                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleOpenEdit(task)}
                  />
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => deleteMutation.mutate(task.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              }
            >
              <p style={{ marginBottom: 8, color: "#666" }}>
                {task.description}
              </p>
              {task.dueDate && (
                <Tag color="blue">
                  Due: {dayjs(task.dueDate).format("DD/MM/YYYY")}
                </Tag>
              )}
            </Card>
          ))}
        </Flex>
      ) : (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#999" }}>
          <p>Currently no tasks available.</p>
        </div>
      )}

      {/* Dùng 1 Modal duy nhất cho cả Create và Edit */}
      <Modal
        title={modalState.mode === "create" ? "Create New Task" : "Edit Task"}
        open={modalState.isOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <TaskFormFields />
          {modalState.mode === "edit" && updateFields()}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {modalState.mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

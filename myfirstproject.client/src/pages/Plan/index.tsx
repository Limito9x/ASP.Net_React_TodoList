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
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { planService, type PlanResponse } from "../../services/planService";

// --- 1. MAPPERS (Chuyển đổi dữ liệu) ---
// Có thể tách sang file utils/mappers.ts nếu muốn
const planMappers = {
  // Chuyển dữ liệu từ Form (AntD) -> API Payload (JSON)
  toApiPayload: (values: any) => {
    return {
      title: values.title, // Thống nhất dùng chữ 'title'
      description: values.description,
      // Chuyển Dayjs object sang ISO string cho Backend
      endDate: values.endDate ? values.endDate.toISOString() : null,
      tasks: values.tasks || [], // Thêm dòng này để đảm bảo có tasks
    };
  },

  // Chuyển dữ liệu từ API (JSON) -> Form Values (AntD)
  toFormValues: (plan: PlanResponse) => {
    return {
      title: plan.title,
      description: plan.description,
      // Chuyển string từ DB sang Dayjs để DatePicker hiểu
      endDate: plan.endDate ? dayjs(plan.endDate) : null,
    };
  },
};

// --- 2. REUSABLE FORM COMPONENT ---
// Tách ra để dùng chung cho cả Create và Edit
const PlanFormFields = () => (
  <>
    <Form.Item
      label="Plan Title"
      name="title" // Đặt tên khớp với DTO backend luôn cho đỡ nhầm
      rules={[{ required: true, message: "Please input the plan title!" }]}
    >
      <Input placeholder="Enter plan title" />
    </Form.Item>
    <Form.Item label="Description" name="description">
      <Input.TextArea placeholder="Enter description" rows={4} />
    </Form.Item>
    <Form.Item label="End Date" name="endDate">
      <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
    </Form.Item>
    <div style={{ marginTop: 20 }}>
      <h4>Tasks List</h4>
      <Form.List name="tasks">
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                title={`Task ${name + 1}`}
                extra={
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  />
                }
              >
                <Form.Item
                  {...restField}
                  name={[name, "name"]} // Khớp với formValues ở trên
                  rules={[{ required: true, message: "Missing task name" }]}
                  style={{ marginBottom: 8 }}
                >
                  <Input placeholder="Task Name" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "description"]}
                  style={{ marginBottom: 8 }}
                >
                  <Input.TextArea placeholder="Task Description" />
                </Form.Item>

                {/* DatePicker này sẽ nhận giá trị ngày cụ thể đã tính toán */}
                <Form.Item
                  {...restField}
                  name={[name, "dueDate"]}
                  label="Due Date"
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>
              </Card>
            ))}

            <Button
              type="dashed"
              style={{
                margin: 2
              }}
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add Task manually
            </Button>
          </div>
        )}
      </Form.List>
    </div>
  </>
);

export default function PlanPage() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage(); // Dùng message của AntD

  // Gom state modal lại cho gọn
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    editingId?: string; // Lưu ID đang sửa
  }>({ isOpen: false, mode: "create" });

  const [form] = Form.useForm();

  // --- QUERY ---
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planService.getAllPlans,
  });

  const mutation = useMutation({
    mutationFn: (prompt: string) => planService.suggestPlans(prompt),
    onSuccess: (aiData) => {
      messageApi.success("Plans suggested successfully!");
      console.log("Suggested Plans:", aiData);
      // 1. Mở Modal ở chế độ Create
      setModalState({ isOpen: true, mode: "create" });

      // 2. Tính toán ngày tháng cho các Task
      const today = dayjs();

      const formValues = {
        title: aiData.title,
        description: aiData.description,
        endDate: today.add(30, "day"), // Giả sử plan 1 tháng

        // Map danh sách task từ AI
        tasks: aiData.tasks.map((t: any) => ({
          name: t.name, // Backend AI trả về 'name'
          description: t.description,

          // --- LOGIC TÍNH NGÀY Ở ĐÂY ---
          // Nếu AI có dayOffset -> Cộng vào hôm nay -> Ra DatePicker
          dueDate: t.dayOffset !== null ? today.add(t.dayOffset, "day") : null,
        })),
      };

      // 3. Đổ dữ liệu vào Form
      form.setFieldsValue(formValues);
    },
    onError: () => messageApi.error("Failed to suggest plans."),
  });

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: planService.createPlan,
    onSuccess: () => {
      messageApi.success("Plan created successfully!");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => messageApi.error("Failed to create plan."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      planService.updatePlan(id, payload),
    onSuccess: () => {
      messageApi.success("Plan updated successfully!");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => messageApi.error("Failed to update plan."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => planService.deletePlan(id),
    onSuccess: () => {
      messageApi.success("Plan deleted!");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    form.resetFields();
    setModalState({ isOpen: true, mode: "create" });
  };

  const handleOpenEdit = (plan: PlanResponse) => {
    // Sử dụng Mapper để đổ dữ liệu vào form
    const formValues = planMappers.toFormValues(plan);
    form.setFieldsValue(formValues);

    setModalState({ isOpen: true, mode: "edit", editingId: plan.id });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    // Sử dụng Mapper để chuẩn bị dữ liệu gửi đi
    const payload = planMappers.toApiPayload(values);

    if (values.tasks) {
      payload.tasks = values.tasks.map((t: any) => ({
        name: t.name,
        description: t.description,
        dayOffset: t.dueDate ? dayjs(t.dueDate).diff(dayjs(), "day") : null,
      }));
    }

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
        <h1>My Plans</h1>
        <Input.Search
          placeholder="Suggest plans (e.g., trip to Japan)"
          enterButton="Suggest"
          loading={mutation.isPending}
          onSearch={(value) => {
            if (value.trim()) {
              mutation.mutate(value.trim());
            }
          }}
          style={{ width: 400, marginRight: 16 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
        >
          Create New Plan
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Flex vertical gap={16}>
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              hoverable
              title={<strong>{plan.title}</strong>}
              extra={
                <div style={{ display: "flex", gap: 8 }}>
                  <Button href={`/plans/${plan.id}`}>View</Button>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleOpenEdit(plan)}
                  />
                  <Popconfirm
                    title="Delete the plan"
                    description="Are you sure to delete this plan?"
                    onConfirm={() => deleteMutation.mutate(plan.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              }
            >
              <p style={{ marginBottom: 8, color: "#666" }}>
                {plan.description}
              </p>
              {plan.endDate && (
                <p style={{ color: "#1890ff", fontSize: "12px", margin: 0 }}>
                  Due: {dayjs(plan.endDate).format("DD/MM/YYYY")}
                </p>
              )}
            </Card>
          ))}
        </Flex>
      )}

      {/* Dùng 1 Modal duy nhất cho cả Create và Edit */}
      <Modal
        title={modalState.mode === "create" ? "Create New Plan" : "Edit Plan"}
        open={modalState.isOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={"50vw"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <PlanFormFields />
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

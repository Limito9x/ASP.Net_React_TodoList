import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Popconfirm,
  List,
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
        >
          Create New Plan
        </Button>
      </div>

      <List
        loading={isLoading}
        grid={{ gutter: 16, column: 1 }} // Hiển thị dạng list dọc
        dataSource={plans}
        renderItem={(plan) => (
          <List.Item>
            <div className="border border-gray-200 rounded p-4 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="text-lg font-bold">{plan.title}</h3>
                <p className="text-gray-500">{plan.description}</p>
                {plan.endDate && (
                  <p className="text-xs text-blue-500 mt-1">
                    Due: {dayjs(plan.endDate).format("DD/MM/YYYY")}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button href={`/plans/${plan.id}`}>View</Button>

                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleOpenEdit(plan)}
                />

                {/* Popconfirm thay cho window.confirm */}
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
            </div>
          </List.Item>
        )}
      />

      {/* Dùng 1 Modal duy nhất cho cả Create và Edit */}
      <Modal
        title={modalState.mode === "create" ? "Create New Plan" : "Edit Plan"}
        open={modalState.isOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
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

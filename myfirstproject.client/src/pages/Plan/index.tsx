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
  Steps,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { planService, type PlanResponse } from "../../services/planService";
import CreatePlan from "./CreatePlan";
import { useNavigate } from "react-router-dom";

// --- 1. MAPPERS (Chuyển đổi dữ liệu) ---
// Có thể tách sang file utils/mappers.ts nếu muốn
const planMappers = {
  // Chuyển dữ liệu từ Form (AntD) -> API Payload (JSON)
  toApiPayload: (values: any) => {
    const payload: any = {
      title: values.title,
      description: values.description,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
    };

    // Xử lý phases nếu có
    if (values.phases && Array.isArray(values.phases)) {
      payload.phases = values.phases.map((phase: any) => ({
        title: phase.title,
        description: phase.description,
        startDate: phase.startDate ? phase.startDate.toISOString() : null,
        endDate: phase.endDate ? phase.endDate.toISOString() : null,
        // Xử lý goals cho mỗi phase
        goals:
          phase.goals && Array.isArray(phase.goals)
            ? phase.goals.map((goal: any) => ({
                type: goal.type,
                name: goal.name,
                start: Number(goal.start),
                target: Number(goal.target),
                current:
                  goal.current !== undefined
                    ? Number(goal.current)
                    : Number(goal.start),
              }))
            : [],
      }));
    }

    return payload;
  },
  // Chuyển dữ liệu từ API (JSON) -> Form Values (AntD)
  toFormValues: (plan: PlanResponse) => {
    return {
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate ? dayjs(plan.startDate) : null,
      endDate: plan.endDate ? dayjs(plan.endDate) : null,
      // TODO: Xử lý phases khi edit nếu cần
    };
  },
};

export default function PlanPage() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage(); // Dùng message của AntD
  const [current, setCurrent] = useState(0);

  const stepChange = (value: number) => {
    setCurrent(value);
  };

  // Gom state modal lại cho gọn
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    editingId?: number; // Lưu ID đang sửa
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
    onError: (error: any) => messageApi.error("Failed to create plan.", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      planService.updatePlan(id, payload),
    onSuccess: () => {
      messageApi.success("Plan updated successfully!");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => messageApi.error("Failed to update plan."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => planService.deletePlan(id),
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

  const navigate = useNavigate();

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
          onSearch={(value) => {
            confirm(value);
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
                  <Button onClick={() => navigate(`/plans/${plan.id}`)}>View</Button>
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

      <Modal
        title={modalState.mode === "create" ? "Create New Plan" : "Edit Plan"}
        open={modalState.isOpen}
        onCancel={handleCloseModal}
        centered={true}
        footer={null}
        width={"50vw"}
      >
        {/* <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
        </Form> */}
        <Steps
          current={current}
          onChange={stepChange}
          items={[
            {
              title: "Step 1",
              description: "Basic Info",
            },
            {
              title: "Step 2",
              description: "Phases Info (For Multi-Phase Plans)",
              disabled: !form.getFieldValue("isMultiPhase"),
            },
            {
              title: "Step 3",
              description: "Confirm",
            },
          ]}
        />
        <CreatePlan
          step={current}
          stepChange={(stepValue) => {
            if (stepValue === 3) {
              const values = form.getFieldsValue(true);
              createMutation.mutate(planMappers.toApiPayload(values));
            } else setCurrent(stepValue);
          }}
          form={form}
        />
      </Modal>
    </div>
  );
}

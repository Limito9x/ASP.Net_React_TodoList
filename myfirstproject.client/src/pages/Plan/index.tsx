import {
  Button,
  Popconfirm,
  Flex,
  Card,
  Spin,
  message,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { planService, type PlanResponse } from "../../services/planService";
import { useNavigate } from "react-router-dom";
import { usePlanModalStore } from "../../stores/usePlanModalStore";

export default function PlanPage() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage(); // Dùng message của AntD
  const { openModal } = usePlanModalStore();



  // --- QUERY ---
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planService.getAllPlans,
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
    openModal("create");
  };

  const handleOpenEdit = (plan: PlanResponse) => {
    openModal("edit", plan.id, plan);
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
                  <Button onClick={() => navigate(`/plans/${plan.id}`)}>
                    View
                  </Button>
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
    </div>
  );
}

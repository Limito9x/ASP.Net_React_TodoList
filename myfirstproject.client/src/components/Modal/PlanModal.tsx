import { Form, Modal, message, Steps } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { planService } from "../../services/planService";
import PlanInfo from "../Plan/PlanInfo";
import { planMappers } from "../../utils/mappers/planMapper";
import { usePlanModalStore } from "../../stores/usePlanModalStore";

export default function PlanModal() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage(); // Dùng message của AntD
  const [current, setCurrent] = useState(0);

  const stepChange = (value: number) => {
    setCurrent(value);
  };

  const { isOpen, mode, editingId, initialValues, closeModal } =
    usePlanModalStore();

  const [form] = Form.useForm();

  const mappedFormValues = initialValues
    ? planMappers.toFormValues(initialValues)
    : {};

  form.setFieldsValue(mappedFormValues);

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: planService.createPlan,
    onSuccess: () => {
      messageApi.success("Plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      handleCloseModal();
    },
    onError: (error: any) => messageApi.error("Failed to create plan.", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      planService.updatePlan(id, payload),
    onSuccess: () => {
      messageApi.success("Plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      handleCloseModal();
    },
    onError: () => messageApi.error("Failed to update plan."),
  });

  const handleCloseModal = () => {
    setCurrent(0);
    form.resetFields();
    closeModal();
  };

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <Modal
        title={mode === "create" ? "Create New Plan" : "Edit Plan"}
        open={isOpen}
        onCancel={handleCloseModal}
        centered={true}
        footer={null}
        width={"50vw"}
      >
        <Steps
          current={current}
          onChange={stepChange}
          items={[
            {
              title: "Bước 1",
              description: "Thông tin cơ bản",
            },
            {
              title: "Bước 2",
              description: "Giai đoạn & Mục tiêu",
            },
          ]}
        />
        <PlanInfo
          step={current}
          stepChange={(stepValue) => {
            if (stepValue === 2) {
              const values = form.getFieldsValue(true);
              if (mode === "create")
                createMutation.mutate(planMappers.toApiPayload(values));
              else if (mode === "edit" && editingId)
                updateMutation.mutate({
                  id: editingId,
                  payload: planMappers.toApiPayload(values),
                });
            } else setCurrent(stepValue);
          }}
          form={form}
        />
      </Modal>
    </div>
  );
}

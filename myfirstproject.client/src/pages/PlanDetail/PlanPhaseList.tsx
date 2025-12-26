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
  Tooltip,
} from "antd";
import FileList from "../../components/FileList";
import FileUploader from "../../components/FileUploader";
import { phaseService } from "../../services/phaseService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  PaperClipOutlined
} from "@ant-design/icons";
import { lazy, useState } from "react";
import dayjs from "dayjs";
import type { Phase } from "../../types/phase";
import { planService } from "../../services/planService";

// --- 1. MAPPERS (Chuyển đổi dữ liệu) ---
const taskMappers = {
  // Chuyển dữ liệu từ Form (AntD) -> API Payload (JSON)
  toApiPayload: (values: any, planId?: number) => {
    const payload: any = {
      title: values.title,
      description: values.description,
      startDate: values.startDate
        ? values.startDate.toISOString()
        :null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
      planId: planId,
    };
    if (values.goals) {
      payload.goals = [
        {
          name: values.goals.name,
          type: values.goals.type,
          target: Number(values.goals.target),
          current: Number(values.goals.current),
          start: Number(values.goals.start),
        },
      ];
    }
    return payload;
  },

  // Chuyển dữ liệu từ API (JSON) -> Form Values (AntD)
  toFormValues: (phase: Phase) => {
    console.log("Mapping phase to form values:", phase);
    return {
      title: phase.title,
      description: phase.description,
      startDate: phase.startDate ? dayjs(phase.startDate) : null,
      endDate: phase.endDate ? dayjs(phase.endDate) : null,
    };
  },
};

// --- 2. REUSABLE FORM COMPONENT ---
const TaskFormFields = () => (
  <>
    <Form.Item
      label="Phase Title"
      name="title"
      rules={[{ required: true, message: "Please input the phase name!" }]}
    >
      <Input placeholder="Enter phase title" />
    </Form.Item>
    <Form.Item label="Description" name="description">
      <Input.TextArea placeholder="Enter description" rows={4} />
    </Form.Item>
    <Form.Item label="Start Date" name="startDate">
      <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
    </Form.Item>
    <Form.Item label="End Date" name="endDate">
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

export default function TaskPage({ planId }: { planId?: string }) {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // Gom state modal lại cho gọn
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    editingId?: number;
  }>({ isOpen: false, mode: "create" });

  const [attachmentModal, setAttachmentModal] = useState<{
    isOpen: boolean;
    phaseId?: number;
    phaseTitle?: string;
  }>({ isOpen: false });

  const [form] = Form.useForm();

  // --- QUERY ---
  const { data: plan, isLoading } = useQuery({
    queryKey: ["plan", planId],
    queryFn: () => planService.getPlanById(planId!),
  });

  console.log("Plan detail data:", plan);

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: phaseService.createPhase,
    onSuccess: () => {
      messageApi.success("Task created successfully!");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["tasks", planId] });
    },
    onError: () => messageApi.error("Failed to create task."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      phaseService.updatePhase(id, payload),
    onSuccess: () => {
      messageApi.success("Task updated successfully!");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["tasks", planId] });
    },
    onError: () => messageApi.error("Failed to update task."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => phaseService.deletePhase(id),
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

  const handleOpenEdit = (task: Phase) => {
    const formValues = taskMappers.toFormValues(task);
    form.setFieldsValue(formValues);
    setModalState({ isOpen: true, mode: "edit", editingId: task.id });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const payload = taskMappers.toApiPayload(values, Number(planId));

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
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>My Phases</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
        >
          Create New Phase
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : plan?.phases && plan.phases.length > 0 ? (
        <Flex vertical gap={16}>
          {plan.phases.map((phase) => (
            <Card
              key={phase.id}
              hoverable
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <strong>{phase.title}</strong>
                </div>
              }
              extra={
                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="link" href={`/plans/${planId}/phases/${phase.id}`}>
                    Go to Phase
                  </Button>
                  <Tooltip title="Attachments">
                    <Button
                      icon={<PaperClipOutlined />}
                      onClick={() => {
                        setAttachmentModal({
                          isOpen: true,
                          phaseId: phase.id,
                          phaseTitle: phase.title,
                        });
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Edit Task">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleOpenEdit(phase)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete Task">
                    <Popconfirm
                      title="Delete the phase"
                      description="Are you sure to delete this phase?"
                      onConfirm={() => deleteMutation.mutate(phase.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Tooltip>
                </div>
              }
            >
              <p style={{ marginBottom: 8, color: "#666" }}>
                {phase.description}
              </p>
              {phase.endDate && (
                <Tag color="blue">
                  Due: {dayjs(phase.endDate).format("DD/MM/YYYY")}
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

      <Modal
        title={`Attachments for: ${attachmentModal.phaseTitle}`}
        open={attachmentModal.isOpen}
        onCancel={() =>
          setAttachmentModal({ isOpen: false, phaseId: undefined })
        }
        footer={null}
        width={800}
      >
        {/* <FileUploader
          planId={planId!}
          phaseId={attachmentModal.phaseId!}
          onSuccess={() => {}}
        />
        {attachmentModal.phaseId && (
          <FileList planId={planId!} phaseId={attachmentModal.phaseId!} />
        )} */}
      </Modal>
    </div>
  );
}

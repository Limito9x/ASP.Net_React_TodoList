import { type PhaseResponse } from "../../services/phaseService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button, Card, Form, Modal } from "antd";
import { useState } from "react";
import SingleTaskInfo from "../../components/Task/SingleTaskInfo";
import {
  type TaskRequestPayload,
  singleTaskService,
} from "../../services/singleTaskService";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import LinkedGoal from "../../components/Task/LinkedGoal";

const TaskMappers = {
  toSingleTaskPayload: (values: any, phaseId?: number) => {
    const payload: TaskRequestPayload = {
      name: values.name,
      description: values.description,
      type: values.type,
    };

    if (phaseId) {
      payload.phaseId = phaseId;
    }

    if (values.type !== "Event" && values.dueDate) {
      payload.dueDate = values.dueDate.toISOString();
    }
    if (values.type === "Event" && values.startAt && values.endAt) {
      payload.startAt = values.startAt.toISOString();
      payload.endAt = values.endAt.toISOString();
    }

    if (values.linkedGoals) {
      payload.linkedGoals = values.linkedGoals;
    }

    return payload;
  },
  toFormValues: (task: any) => {
    // Helper để format date thành YYYY-MM-DD cho input type="date"
    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return null;
      return dayjs(dateStr);
    };

    return {
      name: task.name,
      description: task.description,
      type: task.type,
      dueDate: formatDate(task.dueDate),
      startAt: formatDate(task.startAt),
      endAt: formatDate(task.endAt),
      // Xử lý nhiều trường hợp có thể: linkedGoals, linkedGoalIds, goals
      linkedGoals: task.linkedGoals || [],
      selectedGoalIds: task.linkedGoals?.map((goal: any) => goal.goalId) || []
    };
  },
};

interface PhaseSingleTaskTabProps {
  goalsOptions: { label: string; value: string, type: "Cumulative" | "Absolute" }[];
  phase: PhaseResponse | undefined;
  phaseId?: string;
}

export default function PhaseSingleTaskTab({
  goalsOptions,
  phase,
  phaseId,
}: PhaseSingleTaskTabProps) {

  const [modal, setModal] = useState<{
    isOpen: boolean;
    title?: string;
    mode?: "create" | "edit";
    id?: number;
  }>({
    isOpen: false,
  });

  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (payload: TaskRequestPayload) =>
      singleTaskService.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phase", phaseId] });
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<TaskRequestPayload>;
    }) => singleTaskService.updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phase", phaseId] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  const handleOpenModal = (
    title: string,
    mode: "create" | "edit" = "create",
    id?: number
  ) => {
    setModal({ isOpen: true, title, mode, id });
  };

  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button
            onClick={() => handleOpenModal("Create single task", "create")}
          >
            Create single task
          </Button>
        </div>
      </div>
      <br />
      <div>
        <Modal
          title={modal.title}
          open={modal.isOpen}
          onCancel={() => setModal({ isOpen: false })}
          centered={true}
          footer={
            <>
              <Button onClick={() => setModal({ isOpen: false })}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  const payload = TaskMappers.toSingleTaskPayload(
                    values,
                    phase?.id
                  );
                  if (modal.mode === "create") {
                    createTaskMutation.mutate(payload);
                  }
                  else if (modal.mode === "edit" && modal.id) {
                    updateTaskMutation.mutate({ id: modal.id, payload });
                  }
                }}
              >
                {modal.mode === "create" ? "Create Task" : "Update Task"}
              </Button>
            </>
          }
        >
          <Form form={form} layout="vertical">
            <SingleTaskInfo form={form} />
            <LinkedGoal goalsOptions={goalsOptions} form={form} />
          </Form>
        </Modal>
      </div>
      <div>
        <h2>Tasks in this phase:</h2>
        <div>
          {phase?.singleTasks?.map((task) => (
            <Card
              key={task.id}
              style={{ marginBottom: 10 }}
              title={task.name}
              extra={
                <span>
                  <Button type="link" onClick={() => navigate(`/tasks/${task.id}`)}>
                    Go to Task
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Editing task:", task);
                      const formValues = TaskMappers.toFormValues(task);
                      form.setFieldsValue(formValues);
                      handleOpenModal("Edit single task", "edit", task.id);
                    }}
                  >
                    Edit
                  </Button>
                </span>
              }
            >
              <p>{task.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

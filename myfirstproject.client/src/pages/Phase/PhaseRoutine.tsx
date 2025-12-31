import { type PhaseResponse } from "../../services/phaseService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button, Card, Form, Modal, Select } from "antd";
import { useState } from "react";
import { type RoutinePayload, routineService } from "../../services/routineService";
import { useNavigate } from "react-router-dom";
import RoutineInfo from "../../components/Task/RoutineInfo";
import LinkedGoal from "../../components/Task/LinkedGoal";

const RoutineMappers = {
  toRoutinePayload: (values: any, phaseId?: number) => {
    const payload: RoutinePayload = {
      name: values.name,
      description: values.description,
      scheduledTime: values.scheduledTime,
      rule: values.rule,
    };

    if(values.rule) {
      const frequency = values.rule.frequency;
      payload.rule.frequency = frequency;
      if (frequency === "Weekly" && values.rule.byWeekDays) {
        payload.rule.daysOfWeek = values.rule.byWeekDays;
      } else if (frequency === "Monthly" && values.rule.byMonthDay) {
        payload.rule.daysOfMonth = values.rule.byMonthDay;
      }
    }

    if (phaseId) {
      payload.phaseId = phaseId;
    }

    if (values.linkedGoals) {
      payload.linkedGoals = values.linkedGoals;
    }
    console.log("Routine payload:", payload);
    return payload;
  },
  toFormValues: (task: any) => {
    return {
      name: task.name,
      description: task.description,
      rule: task.recurrenceRule,
      scheduledTime: task.scheduledTime,
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

export default function PhaseRoutineTab({
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
    mutationFn: (payload: RoutinePayload) =>
      routineService.createRoutine(payload),
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
      payload: RoutinePayload;
    }) => routineService.updateRoutine(id, payload),
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
            onClick={() => handleOpenModal("Create routine", "create")}
          >
            Create routine
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
                  const payload = RoutineMappers.toRoutinePayload(
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
            <RoutineInfo form={form} />
            <LinkedGoal goalsOptions={goalsOptions} form={form} />
          </Form>
        </Modal>
      </div>
      <div>
        <h2>Routines in this phase:</h2>
        <div>
          {phase?.routines?.map((routine) => (
            <Card
              key={routine.id}
              style={{ marginBottom: 10 }}
              title={routine.name}
              extra={
                <span>
                  <Button type="link" onClick={() => navigate(`/routines/${routine.id}`)}>
                    Go to Routine
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Editing routine:", routine);
                      const formValues = RoutineMappers.toFormValues(routine);
                      form.setFieldsValue(formValues);
                      handleOpenModal("Edit routine", "edit", routine.id);
                    }}
                  >
                    Edit
                  </Button>
                </span>
              }
            >
              <p>{routine.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

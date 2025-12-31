import { scheduleService } from "../../services/scheduleService";
import { routineService } from "../../services/routineService";
import { singleTaskService } from "../../services/singleTaskService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { Card, Row, Col, Modal, Button, Form } from "antd";
import TaskLogInfo from "../../components/Task/TaskLogInfo";
import dayjs from "dayjs";
import { useState } from "react";
import type { TodayTask } from "../../types/schedule";

const logMappers = {
  toPayload: (values: any) => {
    const payload: any = {
      note: values.note,
      outcome: values.outcome,
      contributions: values.contributions?.map((contribution: any) => ({
        goalId: contribution.goalId,
        actualValue: Number(contribution.actualValue),
      })),
    };
    console.log("Mapped log payload:", payload);
    return payload;
  }
}

export default function Home() {
  const { userInfo } = useAuth();
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title?: string;
    item?: TodayTask;
  }>({
    isOpen: false,
    title: undefined,
    item: undefined,
  });

  const [form] = Form.useForm();

  const handleOpenModal = (title: string, item?: TodayTask) => {
    setModal({ isOpen: true, title, item });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false });
    form.resetFields();
  };

  const {
    data: todayTasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todayTasks"],
    queryFn: () => scheduleService.getTodayTasks(),
  });

  const queryClient = useQueryClient();

  const createSingleTaskLogMutation = useMutation({
    mutationFn: (payload: any) =>
      singleTaskService.executeTask(payload.taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayTasks"] });
    },
    onError: (error) => {
      console.error("Error creating task log:", error);
    },
  });

  const createRoutineLogMutation = useMutation({
    mutationFn: (payload: any) => routineService.checkinRoutine(payload.routineId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayTasks"] });
    },
    onError: (error) => {
      console.error("Error creating routine log:", error);
    },
  });
      

  if (!userInfo)
    return (
      <div>
        <h1>Welcome to the Home Page</h1>
        <p>This is the main landing page of the application.</p>
      </div>
    );

  return (
    <div>
      <h1>Welcome back, {userInfo.fullName}!</h1>
      <h2>Today's Tasks</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p>Error loading tasks.</p>}
      {todayTasks && todayTasks.length === 0 && <p>No tasks for today!</p>}
      <Row>
        {todayTasks &&
          todayTasks.map((task) => (
            <Col span={8} key={`${task.type}-${task.id}`}>
              <Card
                key={task.id}
                title={task.name}
                extra={
                  <span>
                    <Button
                      type="primary"
                      onClick={() =>
                        handleOpenModal(`Create log for ${task.name}`, task)
                      }
                    >
                      Create task log
                    </Button>
                  </span>
                }
                style={{ marginBottom: "16px" }}
              >
                <p>{task.description}</p>
                <p>Start {dayjs(task.startAt).format("DD/MM/YYYY HH:mm")}</p>
              </Card>
            </Col>
          ))}
      </Row>
      <Modal
        title={modal.title}
        open={modal.isOpen}
        onCancel={handleCloseModal}
        footer={<>
          <Button onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={ () => {
              const values = form.getFieldsValue(true);
              const payload = logMappers.toPayload(values);
              if (modal.item?.type === "Single") {
                createSingleTaskLogMutation.mutate({
                  ...payload,
                  taskId: modal.item.id,
                });
              } else if (modal.item?.type === "Routine") {
                createRoutineLogMutation.mutate({
                  ...payload,
                  routineId: modal.item.id,
                });
              }
            }}
          >
            Create Task Log
          </Button>
        </>}
      >
        <Form form={form} layout="vertical">
          <TaskLogInfo form={form} scheduleItem={modal.item} />
        </Form>
      </Modal>
    </div>
  );
}

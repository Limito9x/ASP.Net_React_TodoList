import { Form, Input, Button, Modal, DatePicker } from "antd";
import type { FormProps } from "antd";
import { taskService, type TaskResponse } from "../../services/taskService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const taskForm = () => (
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
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </>
);

const additionalUpdateFields = {
  // Thêm các trường bổ sung cần thiết cho việc cập nhật tại đây
};

export default function TaskPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
  const queryClient = useQueryClient();

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingTask, setEditingTask] =
    useState<TaskResponse | null>(null);

  const handleOpenEditModal = (task: TaskResponse) => {
    setOpenEditModal(true);
    setEditingTask(task);
    // Cập nhật giá trị form khi mở modal
    editForm.setFieldsValue({
      taskName: task.name,
      description: task.description,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
    });
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingTask(null);
    editForm.resetFields();
  };

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", categoryId],
    queryFn: () => taskService.getTasksByCategoryId(categoryId!),
  });

  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", categoryId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      taskService.updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", categoryId] });
      alert("Task updated successfully!");
      handleCloseEditModal();
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", categoryId] });
    },
  });

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    console.log("Form Values:", values);
    try {
      const payload = {
        name: values.taskName,
        description: values.description,
        dueDate: values.dueDate,
        categoryId: categoryId!,
      };
      createMutation.mutate(payload);
      alert("Task created successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  return (
    <div>
      <h1>Category Page</h1>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Create New Task
      </Button>
      <h2>Your Tasks:</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p>Error loading tasks.</p>}
      {tasks && tasks.length > 0 ? (
        <ul className="border border-gray-300 rounded-md p-4">
          {tasks.map((task) => (
            <li className="font-bold" key={task.id}>
              {task.name}
              <Button
                className="ml-4"
                icon={<EditOutlined />}
                onClick={() => handleOpenEditModal(task)}
              />
              <Button
                className="ml-2"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  if (
                    !confirm("Are you sure you want to delete this task?")
                  )
                    return;
                  deleteMutation.mutate(task.id);
                }}
              />
            </li>
          ))}
        </ul>
      ): (
        <i>Currently no tasks available.</i>
      )}
      <Modal
        title="Create New Task"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        centered
        footer={null}
      >
        <Form
          form={form}
          name="taskForm"
          layout="vertical"
          onFinish={onFinish}
        >
          {taskForm()}
        </Form>
      </Modal>
      <Modal
        title="Edit Category"
        open={openEditModal}
        onCancel={() => handleCloseEditModal()}
        centered
        footer={null}
      >
        {editingTask && (
          <Form
            form={editForm}
            name="editTaskForm"
            layout="vertical"
            onFinish={(values) =>
              updateMutation.mutate({
                id: editingTask.id,
                payload: {
                  name: values.taskName,
                  description: values.description,
                  dueDate: values.dueDate,
                },
              })
            }
          >
            {taskForm()}
          </Form>
        )}
      </Modal>
    </div>
  );
}

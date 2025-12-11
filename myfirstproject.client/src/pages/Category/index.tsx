import { Form, Input, Button, Modal } from "antd";
import type { FormProps } from "antd";
import {
  categoryService,
  type CategoryResponse,
} from "../../services/categoryService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";

const categoryForm = () => (
  <>
    <Form.Item
      label="Category Name"
      name="categoryName"
      rules={[{ required: true, message: "Please input the category name!" }]}
    >
      <Input placeholder="Enter category name" />
    </Form.Item>
    <Form.Item label="Description" name="description">
      <Input.TextArea placeholder="Enter description" rows={4} />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </>
);

export default function CategoryPage() {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponse | null>(null);

  const handleOpenEditModal = (category: CategoryResponse) => {
    setOpenEditModal(true);
    setEditingCategory(category);
    // Cập nhật giá trị form khi mở modal
    editForm.setFieldsValue({
      categoryName: category.name,
      description: category.description,
    });
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingCategory(null);
    editForm.resetFields();
  };

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAllCategories,
  });

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      alert("Category updated successfully!");
      handleCloseEditModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    console.log("Form Values:", values);
    try {
      const payload = {
        name: values.categoryName,
        description: values.description,
      };
      const newCategory = createMutation.mutate(payload);
      console.log("Created Category:", newCategory);
      alert("Category created successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category.");
    }
  };

  return (
    <div>
      <h1>Category Page</h1>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Create New Category
      </Button>
      <h2>Your Categories:</h2>
      {isLoading && <p>Loading categories...</p>}
      {error && <p>Error loading categories.</p>}
      {categories && (
        <ul className="border border-gray-300 rounded-md p-4">
          {categories.map((category) => (
            <li className="font-bold" key={category.id}>
              {category.name}
              <Button className="ml-4" type="link" href={`/categories/${category.id}`}>
                View tasks
              </Button>
              <Button
                className="ml-4"
                icon={<EditOutlined />}
                onClick={() => handleOpenEditModal(category)}
              />
              <Button className="ml-2" danger icon={<DeleteOutlined />} 
                onClick={() => {
                  if (!confirm("Are you sure you want to delete this category?")) return;
                  deleteMutation.mutate(category.id);
                }}
              />
            </li>
          ))}
        </ul>
      )}
      <Modal
        title="Create New Category"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        centered
        footer={null}
      >
        <Form
          form={form}
          name="categoryForm"
          layout="vertical"
          onFinish={onFinish}
        >
          {categoryForm()}
        </Form>
      </Modal>
      <Modal
        title="Edit Category"
        open={openEditModal}
        onCancel={() => handleCloseEditModal()}
        centered
        footer={null}
      >
        {editingCategory && (
          <Form
            form={editForm}
            name="editCategoryForm"
            layout="vertical"
            onFinish={(values) => updateMutation.mutate({
              id: editingCategory.id,
              payload: {
                name: values.categoryName,
                description: values.description,
              },
            })}
          >
            {categoryForm()}
          </Form>
        )}
      </Modal>
    </div>
  );
}

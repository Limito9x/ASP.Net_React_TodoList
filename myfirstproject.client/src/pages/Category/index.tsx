import { Form, Input, Button } from "antd";
import type { FormProps } from "antd";
import { categoryService } from "../../services/categoryService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function CategoryPage() {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

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
      <div>
        <h2>Create a New Category</h2>
        <Form
          form={form}
          name="categoryForm"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[
              { required: true, message: "Please input the category name!" },
            ]}
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
        </Form>
      </div>
      <h2>Your Categories</h2>
      {isLoading && <p>Loading categories...</p>}
      {error && <p>Error loading categories.</p>}
      {categories && (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

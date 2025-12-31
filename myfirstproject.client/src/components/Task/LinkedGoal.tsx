import { Form, Select, Input } from "antd";
import { useEffect } from "react";

export default function LinkedGoal({
  goalsOptions,
  form,
}: {
  goalsOptions: {
    label: string;
    value: string;
    type: "Cumulative" | "Absolute";
  }[];
  form: ReturnType<typeof Form.useForm>[0];
}) {
  const selectedGoalIds = Form.useWatch("selectedGoalIds", form) || [];

  // Cập nhật linkedGoals khi selectedGoals thay đổi
  useEffect(() => {
    // Lấy danh sách chi tiết hiện tại (để giữ lại defaultValue nếu đã nhập)
    const currentLinkedGoals = form.getFieldValue("linkedGoals") || [];

    // Map để tra cứu nhanh dữ liệu cũ
    const existingGoalsMap = new Map(
      currentLinkedGoals.map((goal: any) => [goal?.goalId, goal])
    );

    // Tạo danh sách mới dựa trên những gì đang được chọn ở Select
    const newLinkedGoals = selectedGoalIds.map((goalId: string) => {
      // Nếu Goal này đã có trong danh sách cũ -> Giữ nguyên (để không mất defaultValue)
      if (existingGoalsMap.has(goalId)) {
        return existingGoalsMap.get(goalId);
      }
      // Nếu là Goal mới chọn -> Tạo object mới
      return { goalId, defaultValue: undefined };
    });

    // Cập nhật lại Form.List (nhưng không cập nhật ngược lại Select để tránh Loop)
    // Dùng JSON.stringify để so sánh sâu, tránh render thừa
    if (JSON.stringify(newLinkedGoals) !== JSON.stringify(currentLinkedGoals)) {
      form.setFieldValue("linkedGoals", newLinkedGoals);
    }
  }, [selectedGoalIds]);

  return (
    <>
      <Form.Item name={["selectedGoalIds"]} label="Contribute to Goals">
        <Select
          mode="multiple"
          placeholder="Link Goals"
          style={{ width: "100%" }}
          options={goalsOptions}
          showSearch={{
            filterOption: (input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
          }}
        />
      </Form.Item>

      <Form.List name="linkedGoals">
        {(fields) => (
          <>
            {fields.map(({ key, name, ...restField }) => {
              const goalId = form.getFieldValue([
                "linkedGoals",
                name,
                "goalId",
              ]);

              // Chỉ hiển thị nếu goal được chọn
              const goalInfo = goalsOptions.find((g) => g.value === goalId);
              if (!goalInfo) return null;

              if (goalInfo.type === "Absolute") return null; // Không hiển thị nếu là Absolute

              return (
                <div key={key} style={{ marginBottom: 16 }}>
                  <Form.Item {...restField} name={[name, "goalId"]} hidden>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "defaultValue"]}
                    label={`Định mức cho mục tiêu ${goalInfo.label}`}
                    rules={[{ required: true, message: "Please input value" }]}
                  >
                    <Input
                      type="number"
                      placeholder="Nhập giá trị dự kiến"
                      style={{
                        width: "100%",
                        padding: "4px 11px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px",
                      }}
                    />
                  </Form.Item>
                </div>
              );
            })}
          </>
        )}
      </Form.List>
    </>
  );
}

import { Form, Input, Select } from "antd";
import type { TodayTask } from "../../types/schedule";
import { useEffect } from "react";


interface TaskLogInfoProps {
    scheduleItem?: TodayTask;
    form: ReturnType<typeof Form.useForm>[0];
}

export default function TaskLogInfo({ scheduleItem, form }: TaskLogInfoProps) {
    const contributions = scheduleItem?.phase?.goals?.filter(goal=>
        scheduleItem.linkedGoals?.some(linkedGoal => linkedGoal.goalId === goal.id)
    ) || [];

    useEffect(() => {
        if (scheduleItem?.linkedGoals) {
            const initialContributions = scheduleItem.linkedGoals.map(linkedGoal => {
                const defaultValue = linkedGoal.defaultValue;
                return {
                    goalId: linkedGoal.goalId,
                    actualValue: defaultValue && defaultValue !== 0 ? defaultValue : undefined
                };
            });
            form.setFieldValue("contributions", initialContributions);
        }
    },[scheduleItem])

    return (
      <>
        <Form.Item name="note" label="Note">
          <Input.TextArea rows={4} placeholder="Enter log note" />
        </Form.Item>
        <Form.Item name="outcome" label="Status">
          <Select>
            <Select.Option value="Success">Success</Select.Option>
            <Select.Option value="Partial">Partial</Select.Option>
            <Select.Option value="Failed">Failed</Select.Option>
            <Select.Option value="Skipped">Skipped</Select.Option>
          </Select>
        </Form.Item>
        {contributions.length > 0 && (
            <Form.List name="contributions">
            {(fields) => (
                <div>
                {fields.map((field, index) => {
                    const goal = contributions[index];
                    return (
                    <Form.Item
                        name={[field.name,"actualValue"]}
                        label={`Contribution to Goal: ${goal.name}`}
                        key={goal.id}
                        rules={[{ required: true, message: "Please input the contribution value!" }]}
                    >
                        <Input
                        type="number"
                        placeholder={`Enter contribution for ${goal.name}`}
                        style={{ width: "100%" }}
                        />
                    </Form.Item>
                    );
                })}
                </div>
            )}
            </Form.List>
        )}    
      </>
    );
}
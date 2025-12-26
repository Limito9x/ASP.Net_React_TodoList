import { Button, Col, DatePicker, Form, Input, Row, Select, Switch, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function CreatePlan({
  step,
  stepChange,
  form,
}: {
  step: number;
  stepChange: (value: number) => void;
  form: ReturnType<typeof Form.useForm>[0];
}) {
  const handleNextStepChange = () => {
    if (step === 0 && !form.getFieldValue("isMultiPhase")) {
      stepChange(2); // Skip step 1 nếu không có nhiều phase
      return; // Quan trọng: dừng lại, không chạy tiếp
    }
    stepChange(step + 1);
  };

  const handleBackStepChange = () => {
        if (step === 2 && !form.getFieldValue("isMultiPhase")) {
          stepChange(0);
          return; 
        }
    stepChange(step - 1);
  }

  return (
    <>
      <Form layout="vertical" form={form} component={false}>
        {step === 0 && (
          <>
            <h2>Thông tin cơ bản về kế hoạch</h2>
            <Form.Item
              label="Tiêu đề kế hoạch"
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề kế hoạch!" },
              ]}
            >
              <Input placeholder="Nhập tiêu đề kế hoạch" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea placeholder="Nhập mô tả" rows={4} />
            </Form.Item>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Cấu trúc kế hoạch"
              name="isMultiPhase"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren="Nhiều giai đoạn"
                unCheckedChildren="Một giai đoạn"
              />
            </Form.Item>
          </>
        )}
        {step === 1 && (
          <>
            <h2>Các giai đoạn của kế hoạch</h2>
            <Form.List name="phases">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        border: "1px solid #d9d9d9",
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "4px",
                        position: "relative",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        label={`Tiêu đề giai đoạn`}
                        name={[name, "title"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tiêu đề giai đoạn!",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập tiêu đề giai đoạn" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Mô tả"
                        name={[name, "description"]}
                      >
                        <Input.TextArea
                          placeholder="Nhập mô tả giai đoạn"
                          rows={3}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Ngày bắt đầu"
                        name={[name, "startDate"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày bắt đầu!",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Ngày kết thúc"
                        name={[name, "endDate"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày kết thúc!",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                      <Button
                        type="link"
                        danger
                        style={{ position: "absolute", top: 8, right: 8 }}
                        onClick={() => remove(name)}
                      >
                        Xóa giai đoạn
                      </Button>
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm giai đoạn mới
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Xác định mục tiêu và hoàn tất</h2>
            <Form.List name="phases">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        border: "1px solid #d9d9d9",
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "4px",
                        position: "relative",
                      }}
                    >
                      <p>
                        <strong>Giai đoạn:</strong>{" "}
                        {form.getFieldValue(["phases", name, "title"]) ||
                          `Giai đoạn ${name + 1}`}
                      </p>
                      <Form.List name={[name, "goals"]}>
                        {(goalFields, { add: addGoal, remove: removeGoal }) => (
                          <>
                            {goalFields.map(
                              ({
                                key: goalKey,
                                name: goalName,
                                ...goalRestField
                              }) => (
                                <div
                                  key={goalKey}
                                  style={{
                                    border: "1px dashed #d9d9d9",
                                    padding: "12px",
                                    marginBottom: "12px",
                                    borderRadius: "4px",
                                    position: "relative",
                                  }}
                                >
                                  <Row gutter={16}>
                                    <Col span={6}>
                                      <Form.Item name={[goalName, "type"]}>
                                        <Select placeholder="Chọn loại mục tiêu">
                                          <Select.Option value="Numeric">
                                            Tăng/ giảm chỉ số
                                          </Select.Option>
                                          <Select.Option value="Count">
                                            Tích lũy số lượng
                                          </Select.Option>
                                          <Select.Option value="Binary">
                                            Hoàn thành/ không hoàn thành
                                          </Select.Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item name={[goalName, "name"]}>
                                        <Input placeholder="Nhập tên mục tiêu" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item name={[goalName, "start"]}>
                                        <Input
                                          type={"number"}
                                          placeholder="Chỉ số bắt đầu"
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item name={[goalName, "target"]}>
                                        <Input
                                          type={"number"}
                                          placeholder="Chỉ số mục tiêu"
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <Button
                                    type="link"
                                    danger
                                    style={{
                                      position: "absolute",
                                      top: 8,
                                      right: 8,
                                    }}
                                    onClick={() => removeGoal(goalName)}
                                  >
                                    Xóa mục tiêu
                                  </Button>
                                </div>
                              )
                            )}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => addGoal()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Thêm mục tiêu mới
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </>
        )}
      </Form>
      <br />
      {step > 0 && (
        <Button style={{ marginRight: "8px" }} onClick={handleBackStepChange}>
          Quay lại
        </Button>
      )}
      <Button
        type="primary"
        onClick={handleNextStepChange}
        style={{ marginTop: "16px" }}
      >
        {step === 2 ? "Hoàn tất" : "Tiếp theo"}
      </Button>
    </>
  );
}

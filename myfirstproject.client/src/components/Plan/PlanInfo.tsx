import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tabs,
  Tooltip,
  Empty,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import PhaseTimeline from "./PhaseTimeline";

export default function PlanInfo({
  step,
  stepChange,
  form,
}: {
  step: number;
  stepChange: (value: number) => void;
  form: ReturnType<typeof Form.useForm>[0];
}) {
  const { RangePicker } = DatePicker;
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("info");
  const [initialized, setInitialized] = useState(false);

  // Lấy phases từ form
  const watchedPhases = Form.useWatch("phases", form);

  // Khởi tạo với 1 phase mặc định khi vào step 1
  useEffect(() => {
    if (step === 1 && !initialized) {
      const currentPhases = form.getFieldValue("phases");
      if (!currentPhases || currentPhases.length === 0) {
        const range = form.getFieldValue("dateRange");
        const defaultPhase = {
          title: "",
          description: "",
          startDate: range?.[0] || dayjs(),
          endDate: range?.[1] || dayjs().add(7, "day"),
          goals: [],
        };
        form.setFieldsValue({ phases: [defaultPhase] });
      }
      setSelectedPhaseIndex(0);
      setInitialized(true);
      console.log("Initialized phases for step 1");
      console.log(form.getFieldValue("phases"));
    }
    // Reset initialized khi quay về step khác
    if (step !== 1) {
      setInitialized(false);
    }
  }, [step, form, initialized]);

  // Đảm bảo phases luôn là mảng và có ít nhất 1 phần tử khi ở step 1
  const phases = useMemo(() => {
    if (step === 1 && (!watchedPhases || watchedPhases.length === 0)) {
      const range = form.getFieldValue("dateRange");
      return [
        {
          title: "",
          description: "",
          startDate: range?.[0] || dayjs(),
          endDate: range?.[1] || dayjs().add(7, "day"),
          goals: [],
        },
      ];
    }
    return watchedPhases || [];
  }, [watchedPhases, step, form]);

  const handleNextStepChange = () => {
    stepChange(step + 1);
  };

  const handleBackStepChange = () => {
    stepChange(step - 1);
  };

  return (
    <>
      <Form layout="vertical" form={form} component={false} preserve={true}>
        {/* Step 0: Thông tin cơ bản */}
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
              label="Khoảng thời gian"
              name="dateRange"
              rules={[
                { required: true, message: "Vui lòng chọn khoảng thời gian!" },
              ]}
            >
              <RangePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                minDate={dayjs(new Date())}
              />
            </Form.Item>
          </>
        )}

        {/* Step 1: Các giai đoạn với Timeline */}
        {step === 1 && (
          <>
            <h2>Các giai đoạn của kế hoạch</h2>
            <div
              style={{
                display: "flex",
                border: "1px solid #e8e8e8",
                borderRadius: 8,
                overflow: "hidden",
                minHeight: 500,
              }}
            >
              {/* Bên trái: Timeline */}
              <div style={{ width: 220, flexShrink: 0 }}>
                <PhaseTimeline
                  form={form}
                  onSelectPhase={setSelectedPhaseIndex}
                />
              </div>

              {/* Bên phải: Nội dung phase */}
              <div style={{ flex: 1, padding: 16, background: "#fff" }}>
                {phases.length > 0 ? (
                  <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                      {
                        key: "info",
                        label: "Thông tin giai đoạn",
                        children: (
                          <div style={{ padding: "8px 0" }}>
                            <Form.Item
                              label="Tiêu đề giai đoạn"
                              name={["phases", selectedPhaseIndex, "title"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập tiêu đề!",
                                },
                              ]}
                            >
                              <Input placeholder="Nhập tiêu đề giai đoạn" />
                            </Form.Item>

                            <Form.Item
                              label="Mô tả"
                              name={[
                                "phases",
                                selectedPhaseIndex,
                                "description",
                              ]}
                            >
                              <Input.TextArea
                                placeholder="Nhập mô tả giai đoạn"
                                rows={3}
                              />
                            </Form.Item>

                            {/* Cấu hình mục tiêu (Goals) */}
                            <div style={{ marginTop: 24 }}>
                              <h4
                                style={{ marginBottom: 16, color: "#1890ff" }}
                              >
                                Cấu hình mục tiêu
                              </h4>
                              <Form.List
                                name={["phases", selectedPhaseIndex, "goals"]}
                              >
                                {(
                                  goalFields,
                                  { add: addGoal, remove: removeGoal }
                                ) => (
                                  <>
                                    {goalFields.map(
                                      ({ key: goalKey, name: goalName }) => (
                                        <Card
                                          key={goalKey}
                                          size="small"
                                          title={`Mục tiêu ${goalName + 1}`}
                                          extra={
                                            <Tooltip title="Xóa mục tiêu">
                                              <Button
                                                type="text"
                                                danger
                                                size="small"
                                                onClick={() =>
                                                  removeGoal(goalName)
                                                }
                                              >
                                                Xóa
                                              </Button>
                                            </Tooltip>
                                          }
                                          style={{ marginBottom: 12 }}
                                        >
                                          <Row gutter={12}>
                                            <Col span={12}>
                                              <Form.Item
                                                name={[goalName, "type"]}
                                                label="Loại mục tiêu"
                                                style={{ marginBottom: 8 }}
                                              >
                                                <Select
                                                  placeholder="Chọn loại"
                                                  size="small"
                                                >
                                                  <Select.Option value="Absolute">
                                                    Theo dõi chỉ số
                                                  </Select.Option>
                                                  <Select.Option value="Cumulative">
                                                    Tích lũy dần
                                                  </Select.Option>
                                                </Select>
                                              </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                              <Form.Item
                                                name={[goalName, "name"]}
                                                label="Tên mục tiêu"
                                                style={{ marginBottom: 8 }}
                                              >
                                                <Input
                                                  placeholder="Nhập tên"
                                                  size="small"
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                              <Form.Item
                                                name={[goalName, "start"]}
                                                label="Giá trị bắt đầu"
                                                style={{ marginBottom: 0 }}
                                              >
                                                <Input
                                                  type="number"
                                                  placeholder="0"
                                                  size="small"
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                              <Form.Item
                                                name={[goalName, "target"]}
                                                label="Giá trị mục tiêu"
                                                style={{ marginBottom: 0 }}
                                              >
                                                <Input
                                                  type="number"
                                                  placeholder="100"
                                                  size="small"
                                                />
                                              </Form.Item>
                                            </Col>
                                          </Row>
                                        </Card>
                                      )
                                    )}
                                    <Button
                                      type="dashed"
                                      onClick={() => addGoal()}
                                      block
                                      icon={<PlusOutlined />}
                                    >
                                      Thêm mục tiêu mới
                                    </Button>
                                  </>
                                )}
                              </Form.List>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "tasks",
                        label: "Công việc",
                        children: (
                          <Empty
                            description="Chức năng đang phát triển"
                            style={{ padding: "40px 0" }}
                          />
                        ),
                      },
                    ]}
                  />
                ) : (
                  <Empty description="Chưa có giai đoạn nào" />
                )}
              </div>
            </div>
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
        {step === 1 ? "Hoàn tất" : "Tiếp theo"}
      </Button>
    </>
  );
}

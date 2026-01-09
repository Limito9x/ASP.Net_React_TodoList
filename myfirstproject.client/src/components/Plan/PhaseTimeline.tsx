import { Button, DatePicker, Tooltip, Form, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";

interface PhaseData {
  title?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
}

interface PhaseTimelineProps {
  form: ReturnType<typeof Form.useForm>[0];
  onSelectPhase?: (index: number) => void;
}

export default function PhaseTimeline({
  form,
  onSelectPhase,
}: PhaseTimelineProps) {


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 400,
        padding: "16px",
        borderRight: "1px solid #e8e8e8",
        background: "#fafafa",
      }}
    >
      <h4 style={{ marginBottom: 16, color: "#666" }}>Timeline</h4>

      <Form.List name="phases">
        {(phases,{add, remove}) => (
          <>
            {phases.map((phase, index) => (
              <div key={phase.key}>
                <Form.Item name={[phase.name,"startDate"]}>
                  <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <div>
                  <Button onClick={()=>{
                    onSelectPhase?.(index);
                  }}>
                    {index + 1}.{" "}
                  </Button>
                  {phases.length > 1 && (
                    <Tooltip title="Xóa giai đoạn">
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(index)}
                      />
                    </Tooltip>
                  )}
                </div>
                <Form.Item name={[phase.name,"endDate"]}>
                  <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => add({})}
              style={{ width: "100%", marginTop: 16 }}
              icon={<PlusOutlined />}
            >
              Thêm giai đoạn
            </Button>
          </>
        )}
      </Form.List>
    </div>
  );
}

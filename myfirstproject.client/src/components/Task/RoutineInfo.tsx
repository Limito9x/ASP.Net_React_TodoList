import { Form, Input, Select } from "antd";

const Frequence = ["Daily", "Weekly", "Monthly", "Yearly"] as const;

const daysOfWeekOptions = [
  { label: "CN", value: 0 },
  { label: "T2", value: 1 },
  { label: "T3", value: 2 },
  { label: "T4", value: 3 },
  { label: "T5", value: 4 },
  { label: "T6", value: 5 },
  { label: "T7", value: 6 },
];

const monthDaysOptions = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));

// Custom Day Selector Component
function DaySelector({
  value = [],
  onChange,
}: {
  value?: number[];
  onChange?: (value: number[]) => void;
}) {
  const handleToggle = (dayValue: number) => {
    const newValue = value.includes(dayValue)
      ? value.filter((v) => v !== dayValue)
      : [...value, dayValue];
    onChange?.(newValue);
  };

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {daysOfWeekOptions.map((day) => {
        const isSelected = value.includes(day.value);
        return (
          <div
            key={day.value}
            onClick={() => handleToggle(day.value)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: isSelected ? "2px solid #1890ff" : "2px solid #d9d9d9",
              backgroundColor: isSelected ? "#1890ff" : "#fff",
              color: isSelected ? "#fff" : "#000",
              fontWeight: isSelected ? "bold" : "normal",
              transition: "all 0.3s ease",
              userSelect: "none",
            }}
          >
            {day.label}
          </div>
        );
      })}
    </div>
  );
}

// Custom Month Day Selector Component
function MonthDaySelector({
  value = [],
  onChange,
}: {
  value?: number[];
  onChange?: (value: number[]) => void;
}) {
  const handleToggle = (dayValue: number) => {
    const newValue = value.includes(dayValue)
      ? value.filter((v) => v !== dayValue)
      : [...value, dayValue];
    onChange?.(newValue);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        maxWidth: "400px",
      }}
    >
      {monthDaysOptions.map((day) => {
        const isSelected = value.includes(day.value);
        return (
          <div
            key={day.value}
            onClick={() => handleToggle(day.value)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: isSelected ? "2px solid #1890ff" : "2px solid #d9d9d9",
              backgroundColor: isSelected ? "#1890ff" : "#fff",
              color: isSelected ? "#fff" : "#000",
              fontWeight: isSelected ? "bold" : "normal",
              transition: "all 0.3s ease",
              userSelect: "none",
              fontSize: "12px",
            }}
          >
            {day.label}
          </div>
        );
      })}
    </div>
  );
}

function RecurrenceRule({
  form,
}: {
  form: ReturnType<typeof Form.useForm>[0];
}) {
  const frequence = Form.useWatch(["rule", "frequence"], form);

  return (
    <>
      <Form.Item
        name={["rule", "frequence"]}
        label="Frequence"
        initialValue="Daily"
      >
        <Select placeholder="Select frequence">
          {Frequence.map((freq) => (
            <Select.Option key={freq} value={freq}>
              {freq}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {frequence === "Weekly" && (
        <Form.Item name={["rule", "daysOfWeek"]} label="Days of Week">
          <DaySelector />
        </Form.Item>
      )}

      {frequence === "Monthly" && (
        <Form.Item name={["rule", "daysOfMonth"]} label="Days of Month">
          <MonthDaySelector />
        </Form.Item>
      )}
    </>
  );
}

export default function RoutineInfo({
  form,
}: {
  form: ReturnType<typeof Form.useForm>[0];
}) {
  return (
    <div>
      <Form.Item
        label="Routine Name"
        name="name"
        rules={[{ required: true, message: "Please input the routine name!" }]}
      >
        <Input placeholder="Enter routine name" />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea placeholder="Enter description" rows={4} />
      </Form.Item>
      <RecurrenceRule form={form} />
      <Form.Item
        label="Scheduled Time"
        name="scheduledTime"
        rules={[
          { required: true, message: "Please input the scheduled time!" },
        ]}
        normalize={(value) => {
          // Đảm bảo luôn có giây (HH:MM:SS)
          if (value && value.length === 5) {
            return value + ":00";
          }
          return value;
        }}
      >
        <Input type="time" step="1" placeholder="HH:MM:SS" />
      </Form.Item>
    </div>
  );
}

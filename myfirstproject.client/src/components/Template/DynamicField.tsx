import { Input, InputNumber, DatePicker, Checkbox } from "antd";
import {
  FileTextOutlined,
  NumberOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface BaseProps {
  config?: any;
  value?: any;
  onChange?: (value: any) => void;
}

export const fieldTypeOptions = {
  Text: { label: "Chữ", value: "Text", defaultValue: "" },
  Number: { label: "Số", value: "Number", defaultValue: 0 },
  Boolean: { label: "Boolean", value: "Boolean", defaultValue: false },
  Date: { label: "Ngày tháng", value: "Date", defaultValue: null },
};

interface FieldDefinition {
  label: string;
  icon: React.ReactNode;
  defaultValue: any;
  component: React.FC<BaseProps>;
}

export const FIELD_DEFINITIONS: Record<FieldType, FieldDefinition> = {
  Text: {
    label: "Văn bản",
    icon: <FileTextOutlined />,
    defaultValue: "",
    component: (props) => <Input {...props} placeholder="Nhập văn bản" />,
  },
  Number: {
    label: "Số",
    icon: <NumberOutlined />,
    defaultValue: 0,
    component: (props) => (
      <InputNumber style={{ width: "100%" }} {...props} placeholder="Nhập số" />
    ),
  },
  Boolean: {
    label: "Boolean",
    icon: <CheckSquareOutlined />,
    defaultValue: false,
    component: (props) => (
      <Checkbox
        {...props}
        checked={props.value}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
    ),
  },
  Date: {
    label: "Ngày tháng",
    icon: <CalendarOutlined />,
    defaultValue: null,
    component: (props) => (
      <DatePicker
        style={{ width: "100%" }}
        {...props}
        format={"DD/MM/YYYY"}
        placeholder="DD/MM/YYYY"
        value={props.value ? dayjs(props.value) : null}
        onChange={(date) => props.onChange?.(date ? date.toISOString() : null)}
      />
    ),
  },
};

export type FieldType = keyof typeof fieldTypeOptions;

export default function DynamicField({
  type,
  config,
  ...restProps
}: { type: FieldType } & BaseProps) {
  const definition = FIELD_DEFINITIONS[type];
  if(!definition) {
    return <div>Loại trường không hợp lệ: {type}</div>;
  }
  const FieldComponent = definition.component;
  return <FieldComponent config={config} {...restProps} />;
}

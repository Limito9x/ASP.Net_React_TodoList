import { Input, InputNumber, DatePicker, Checkbox } from "antd";
import {
  FileTextOutlined,
  NumberOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

interface BaseProps {
  config?: any;
  value?: any;
  onChange?: (value: any) => void;
}

export const fieldTypeOptions = {
  text: { label: "Chữ", value: "text", defaultValue: "" },
  number: { label: "Số", value: "number", defaultValue: 0 },
  boolean: { label: "Boolean", value: "boolean", defaultValue: false },
  date: { label: "Ngày tháng", value: "date", defaultValue: null },
};

interface FieldDefinition {
  label: string;
  icon: React.ReactNode;
  defaultValue: any;
  component: React.FC<BaseProps>;
}

export const FIELD_DEFINITIONS: Record<FieldType, FieldDefinition> = {
  text: {
    label: "Văn bản",
    icon: <FileTextOutlined />,
    defaultValue: "",
    component: (props) => <Input {...props} placeholder="Nhập văn bản" />,
  },
  number: {
    label: "Số",
    icon: <NumberOutlined />,
    defaultValue: 0,
    component: (props) => (
      <InputNumber style={{ width: "100%" }} {...props} placeholder="Nhập số" />
    ),
  },
  boolean: {
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
  date: {
    label: "Ngày tháng",
    icon: <CalendarOutlined />,
    defaultValue: null,
    component: (props) => (
      <DatePicker
        style={{ width: "100%" }}
        {...props}
        format={"DD/MM/YYYY"}
        placeholder="DD/MM/YYYY"
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

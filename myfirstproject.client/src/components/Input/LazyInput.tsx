import React, { useState, useEffect } from "react";
import { Input, type InputProps } from "antd";

// Kế thừa props của Antd Input
export const LazyInput = ({ value, onChange, ...props }: InputProps) => {
  // 1. Lưu giá trị tạm trong state nội bộ
  const [localValue, setLocalValue] = useState(value);

  // 2. Đồng bộ: Nếu giá trị từ Cha (Form Store) thay đổi (VD: do reset form), cập nhật lại local
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // 3. Xử lý khi gõ (Chỉ cập nhật UI nội bộ -> Siêu nhanh)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  // 4. Xử lý khi Blur (Mới báo cho Form cha biết)
  const handleBlur = () => {
    if (onChange && localValue !== value) {
      // @ts-ignore: Trick để giả lập event cho Antd Form
      onChange(localValue);
    }
  };

  return (
    <Input
      {...props}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur} // <--- CHÌA KHÓA Ở ĐÂY
      onPressEnter={handleBlur} // Bấm Enter cũng lưu
    />
  );
};

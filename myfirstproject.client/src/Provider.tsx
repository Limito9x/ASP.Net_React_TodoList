import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#4CAF50',
                borderRadius: 6,
            },
        }}
    >
      {children}
    </ConfigProvider>
  );
}
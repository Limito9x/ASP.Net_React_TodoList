import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

const { Content, Footer } = Layout;

export default function RootLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "20px 50px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        My First Project ©2024 Created by YourName
      </Footer>
    </Layout>
  );
}

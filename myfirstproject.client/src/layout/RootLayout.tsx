import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import AIChat from "./AIChat";
import PlanModal from "../components/Modal/PlanModal";

const { Content, Footer } = Layout;

export default function RootLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "20px 50px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <Outlet />
          <div style={{ marginTop: 40 }}>
            <PlanModal />
            <AIChat />
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        My First Project ©2025 Created by Limito
      </Footer>
    </Layout>
  );
}

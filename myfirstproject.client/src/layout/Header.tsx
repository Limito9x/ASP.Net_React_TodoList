import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Menu, Button, Space, Typography } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const navigations = [
  { key: "home", label: "Home", icon: <HomeOutlined />, path: "/" },
  {
    key: "plans",
    label: "Plans",
    icon: <AppstoreOutlined />,
    path: "/plans",
  },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useAuth();

  // Xác định menu item đang active dựa trên pathname
  const getSelectedKey = () => {
    const currentPath = location.pathname;

    // Kiểm tra exact match trước
    const activeNav = navigations.find((nav) => nav.path === currentPath);
    if (activeNav) return [activeNav.key];

    // Kiểm tra nested routes (ví dụ: /plans/:id/tasks vẫn highlight Plans)
    if (currentPath.startsWith("/plans")) return ["plans"];

    // Mặc định về home
    return ["home"];
  };

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
        My First Project
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getSelectedKey()}
        style={{ flex: 1, minWidth: 0, marginLeft: "20px" }}
        items={navigations.map((nav) => ({
          key: nav.key,
          icon: nav.icon,
          label: nav.label,
          onClick: () => navigate(nav.path),
        }))}
      />
      <Space>
        {userInfo ? (
          <>
            <Text style={{ color: "#fff" }}>Welcome, {userInfo.fullName}!</Text>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              type="default"
              icon={<LoginOutlined />}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </>
        )}
      </Space>
    </AntHeader>
  );
}

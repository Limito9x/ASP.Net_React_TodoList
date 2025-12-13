import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Menu, Button, Space, Typography, Drawer, Grid } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useState } from "react";

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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

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

  const handleMenuClick = (path: string) => {
    navigate(path);
    setDrawerVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDrawerVisible(false);
  };

  const isMobile = !screens.md;

  return (
    <>
      <AntHeader
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
          My First Project
        </div>

        {isMobile ? (
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: "20px", color: "#fff" }} />}
            onClick={() => setDrawerVisible(true)}
          />
        ) : (
          <>
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
                  <Text style={{ color: "#fff" }}>
                    Welcome, {userInfo.fullName}!
                  </Text>
                  <Button
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
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
          </>
        )}
      </AntHeader>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Menu
          mode="vertical"
          selectedKeys={getSelectedKey()}
          items={navigations.map((nav) => ({
            key: nav.key,
            icon: nav.icon,
            label: nav.label,
            onClick: () => handleMenuClick(nav.path),
          }))}
        />
        <div style={{ marginTop: 20, padding: "0 16px" }}>
          {userInfo ? (
            <>
              <Text>Welcome, {userInfo.fullName}!</Text>
              <Button
                type="primary"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ marginTop: 10, width: "100%" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="default"
                icon={<LoginOutlined />}
                onClick={() => handleMenuClick("/login")}
                block
              >
                Login
              </Button>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => handleMenuClick("/register")}
                block
              >
                Register
              </Button>
            </Space>
          )}
        </div>
      </Drawer>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Menu, Button, Space, Typography } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

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
        defaultSelectedKeys={["home"]}
        style={{ flex: 1, minWidth: 0, marginLeft: "20px" }}
        items={[
          {
            key: "home",
            icon: <HomeOutlined />,
            label: "Home",
            onClick: () => navigate("/"),
          },
        ]}
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

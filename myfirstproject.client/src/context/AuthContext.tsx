import { createContext, useContext, useEffect, useState } from "react";
import { type LoginResponse } from "../services/authService";

type AuthContextType = {
  userInfo: LoginResponse | null;
  loading: boolean;
  login: (payload: { token: string; newUser: LoginResponse }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true); // Thêm loading state

  // Lấy user từ token khi load lại trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
        setUserInfo(JSON.parse(user));
    } else {
      setLoading(false); // Không có token thì cũng xong loading
    }
  }, []);

  const login = async ({
    token,
    newUser,
  }: {
    token: string;
    newUser: LoginResponse;
  }) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUserInfo(newUser);
    } catch (err) {
      localStorage.removeItem("token");
      setUserInfo(null);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng trong AuthProvider");
  }
  return context;
};

import { createContext, useContext, useEffect, useState } from "react";
import { type LoginResponse } from "../services/authService";
import { jwtDecode } from "jwt-decode";

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

  // Hàm kiểm tra token có hết hạn chưa
  const isTokenValid = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Chuyển miliseconds sang seconds

      // So sánh thời gian hiện tại với thời gian hết hạn (exp)
      if (decoded.exp < currentTime) {
        return false; // Hết hạn
      }
      return true; // Còn hạn
    } catch (error) {
      return false; // Token lỗi format -> coi như hết hạn
    }
  };

  // Lấy user từ token khi load lại trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      if(isTokenValid(token)) {
        setUserInfo(JSON.parse(user));
      }
      else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUserInfo(null);
      }
    }
    setLoading(false);
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

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// interceptor: tự gắn token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, // Nếu thành công thì trả về data bình thường
  (error) => {
    // Nếu Server trả về 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log("Phiên đăng nhập hết hạn.");
      
      // 1. Xóa LocalStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 2. Chuyển hướng về trang Login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

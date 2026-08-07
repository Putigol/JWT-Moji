import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api" //True: axios gửi req tới localhost
      : "api", //Ngược lại, khi build production chỉ gọi /api
  withCredentials: true, //gửi cookie lên server (tránh logout liên tục)
});

// gắn access token vào req header
//req chạy vào hàm này trước
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;

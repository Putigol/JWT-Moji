import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

//tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config; //cấu hình req bị lỗi

    // những api không cần check
    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      //bỏ qua, trả về lỗi luôn
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0; //chưa có thuộc tính _retryCount thì cho = 0

    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      try {
        //lấy access token mới
        const res = await api.post("/auth/refresh", { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        //cập nhật lại tokens trong store
        useAuthStore.getState().setAccessToken(newAccessToken);

        //gắn access token mới vào req header cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        //nếu refresh token hết hạn/lỗi, xóa state trong store
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    //nếu ko phải là lỗi 403 (hàm if ko chạy), reject bthg
    return Promise.reject(error);
  },
);

export default api;

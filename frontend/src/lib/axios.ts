import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api" //True: axios gửi req tới localhost
      : "api", //Ngược lại, khi build production chỉ gọi /api
  withCredentials: true, //gửi cookie lên server (tránh logout liên tục)
});

export default api;

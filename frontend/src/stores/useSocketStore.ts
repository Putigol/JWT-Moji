import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  //tạo socket rồi kết nối lên server
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return; // tránh tạo nhiều socket

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    //set socket vào state
    set({ socket });

    socket.on("connect", () => {
      console.log("Đã kết nối với socket");
    });

    //lắng nghe sự kiện online user từ BE
    socket.on("online-users", (userIds) => {
      //cập nhật store
      set({ onlineUsers: userIds });
    });
  },

  //Ngắt socket khi user logout
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

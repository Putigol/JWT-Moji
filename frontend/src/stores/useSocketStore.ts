import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

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

    socket.on("connect_error", async (error) => {
      const errorData = (error as Error & { data?: { code?: string } }).data;
      if (errorData?.code !== "TOKEN_EXPIRED") return;

      try {
        await useAuthStore.getState().refresh();
        const newAccessToken = useAuthStore.getState().accessToken;

        if (!newAccessToken) {
          socket.disconnect();
          return;
        }

        if (socket.connected) return;

        socket.auth = { token: newAccessToken };
        socket.connect();
      } catch (refreshError) {
        console.error("Không thể làm mới phiên socket", refreshError);
        socket.disconnect();
      }
    });

    //lắng nghe sự kiện online user từ BE
    socket.on("online-users", (userIds) => {
      //cập nhật store
      set({ onlineUsers: userIds });
    });

    //lắng nghe sự kiện new message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message); //thêm vào store

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      //Nếu user đang mở convo
      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        //có TN mới ngay khi đang trong convo đang chat thì mark as seen
        useChatStore.getState().markAsSeen();
      }
      useChatStore.getState().updateConversation(updatedConversation);
    });

    //lắng nghe sự kiện read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        //chứa những thông tin update cho conversation
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      useChatStore.getState().updateConversation(updated); //cập nhật conversation trong store
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

import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
        });
      },
    }),

    {
      name: "chat-storage",
      //mỗi khi reload thì conversation list vẫn đc giữ lại, ko giữ lại message và activeConversationId trong local storage
      //tránh bị hacker lấy
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    },
  ),
);

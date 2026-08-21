import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false, //convo loading
          messageLoading: false, //message loading
        });
      },
      fetchConversations: async () => {
        try {
          set({ convoLoading: true }); //đang load data
          const { conversations } = await chatService.fetchConversations(); //phân rã
          set({ conversations, convoLoading: false });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchConversations", error);
        } finally {
          set({ messageLoading: false });
        }
      },

      //Gọi API lấy message list,xử lý phân trang và update
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState(); //để biết user nào đang login

        const convoId = conversationId ?? activeConversationId; //ko có thì tạo mới

        if (!convoId) return;

        //lấy data của conversation hiện tại
        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        //Nếu đã hết tin cũ thì dừng lại ko fetch thêm
        if (nextCursor === null) return;

        set({ messageLoading: true });

        //gọi API lấy tin nhắn
        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );

          //đánh dấu tin nào của user đang login (UI dễ render tin theo 2 hướng)
          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((state) => {
            //nếu state chưa có tin nào cho conversation thì prev rỗng
            const prev = state.messages[convoId]?.items ?? [];
            const merged =
              //load những tin mới nhất lên trên đầu list
              prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                //giữ nguyên data các cuộc trò chuyện khác
                ...state.messages,
                //ghi đè conversation hiện tại
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor, //để biết còn load tin kế tiếp hay không (!!booleans)
                  nextCursor: cursor ?? null, //lần fetch kế tiếp
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchMessages:", error);
        } finally {
          set({ messageLoading: false });
        }
      },

      //Gọi API gửi tin nhắn
      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined,
          );
          //update state
          set((state) => ({
            conversations: state.conversations.map((c) =>
              // tin nhắn mới vừa được gửi và trạng thái đã xem cần được tính lại
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gửi direct message", error);
        }
      },
      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, imgUrl);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === get().activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra gửi group message", error);
        }
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

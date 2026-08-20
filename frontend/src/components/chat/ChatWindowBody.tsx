import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const messages = allMessages[activeConversationId!]?.items ?? []; //nếu chưa có TN thì fallback mảng rỗng tránh UI bị crash
  //tìm convo nào đang được mở
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  //Tìm xem có selectedConvo hay không
  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  //bên trong convo chưa có tin nhắn nào
  if (!messages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground ">
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        {messages.map((message) => (
          <>{message.content}</>
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;

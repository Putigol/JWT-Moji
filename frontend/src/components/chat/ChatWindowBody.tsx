import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { useLayoutEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  const messages = allMessages[activeConversationId!]?.items ?? []; //nếu chưa có TN thì fallback mảng rỗng tránh UI bị crash
  //tìm convo nào đang được mở
  const reversedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const key = `chat-scroll-${activeConversationId}`;
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  //ref
  const messagesEndRef = useRef<HTMLDivElement>(null); //tham chiếu tới cuối TN
  const containerRef = useRef<HTMLDivElement>(null);

  const lastMessageStatus: "delivered" | "seen" =
    selectedConvo?.seenBy && selectedConvo.seenBy.length > 0
      ? "seen"
      : "delivered";

  // kéo xuống dưới khi load convo
  useLayoutEffect(() => {
    if (!messagesEndRef.current) return; //ref chưa trỏ

    messagesEndRef.current?.scrollIntoView({
      //cuộn xuống vị trí
      behavior: "smooth",
      block: "end",
    });
  }, [activeConversationId]); //chạy mỗi khi activeConversationId thay đổi

  const fetchMoreMessages = async () => {
    if (!activeConversationId) {
      return;
    }

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("Lỗi xảy ra khi fetch thêm tin", error);
    }
  };

  //lưu vị trí cuộn hiện tại vào SessionStorage
  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) {
      return;
    }

    const key = `chat-scroll-${activeConversationId}`;
    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop, //vị trí cuộn hiện tại
        scrollHeight: container.scrollHeight,
      }),
    );
  };

  //cuộn tới vị trí đã lưu trong SessionStorage khi component render
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop } = JSON.parse(item);
      //đợi trình duyệt render xong thì mới cuộn
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [key, messages.length]);

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
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
      >
        <div ref={messagesEndRef}></div>
        <InfiniteScroll
          dataLength={messages.length}
          // next chạy mỗi khi user kéo lên load tin
          next={fetchMoreMessages}
          //có còn tin để load ko
          hasMore={hasMore}
          //phần tử chứa khung chat
          scrollableTarget="scrollableDiv"
          loader={<p>Đang tải...</p>}
          inverse={true} //kích hoạt kéo lên
          style={{
            display: "flex",
            flexDirection: "column-reverse", //đảo chiều
            overflow: "visible",
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessageItem
              key={message._id}
              message={message}
              index={index}
              messages={reversedMessages}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatWindowBody;

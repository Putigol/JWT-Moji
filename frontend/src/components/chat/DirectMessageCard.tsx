import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore(); //lấy thông tin user hiện tại
  const {
    activeConversationId, //biết conversation nào được chọn
    setActiveConversation, //đổi activeConversation khi chọn conversation khác
    messages,
    // fetchMessages, //list tin nhắn
  } = useChatStore();

  if (!user) return null;

  //tìm ra người mà user nói chuyện cùng
  const otherUser = convo.participants.find((p) => p._id !== user._id);
  if (!otherUser) return null;

  //lấy số lượng tin nhắn chưa đọc của user
  const unreadCount = convo.unreadCounts[user._id];
  //lấy nội dụng message cuối cùng nếu có
  const lastMessage = convo.lastMessage?.content ?? "";

  //tạo 1 hàm xử lý khi user click vào 1 conversation
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      // await fetchMessages(); //load message nếu conversation chưa có tin nhắn
      //todo: fetch messages
    }
  };
  return (
    <div>
      <ChatCard
        convoId={convo._id}
        name={otherUser.displayName ?? ""}
        timestamp={
          convo.lastMessage?.createdAt
            ? new Date(convo.lastMessage.createdAt)
            : undefined
        }
        isActive={activeConversationId === convo._id}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={
          <>
            <UserAvatar
              type="sidebar"
              name={otherUser.displayName ?? ""}
              avatarUrl={otherUser.avatarUrl ?? undefined}
            />

            {/* todo: socket io */}
            <StatusBadge status={"offline"} />
            {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          </>
        }
        //trong direct chat thì subtitle là last message
        subtitle={
          <p
            className={cn(
              "text-sm truncate",
              unreadCount > 0 //nếu có unread thì làm đậm lên
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            {lastMessage}
          </p>
        }
      />
    </div>
  );
};

export default DirectMessageCard;

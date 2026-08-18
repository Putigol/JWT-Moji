import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
  return (
    <div>
      <ChatCard></ChatCard>
    </div>
  );
};

export default DirectMessageCard;

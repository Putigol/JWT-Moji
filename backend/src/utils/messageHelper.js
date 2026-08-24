//Chứa các helper liên quan đến controller
export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId,
) => {
  //Khi 1 message được gửi thì cần reset seenBy, cập nhật lastMessage
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId,
      createdAt: message.createdAt,
    },
  });

  //Khi có message mới thì reset tin chưa đọc (sender=0, receiver+=1)
  conversation.participants.forEach((p) => {
    const memberId = p.userId.toString();
    const isSender = memberId === senderId.toString();
    const prevCount = conversation.unreadCounts.get(memberId) || 0;
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);
  });
};

//fetch đi sự kiện vào 1 room
export const emitNewMessage = (io, conversation, message) => {
  //join vào 1 room
  io.to(conversation._id.toString()).emit("new-message", {
    message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    },
    unreadCounts: conversation.unreadCounts,
  });
};

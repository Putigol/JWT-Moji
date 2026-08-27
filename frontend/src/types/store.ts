import type { Friend, FriendRequest, User } from "./user";
import type { Conversation, Message } from "./chat";
import type { Socket } from "socket.io-client";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface ChatState {
  conversations: Conversation[];
  //map những conversation với các message thuộc cái conversation đó
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean; // infinite-scroll (có còn tin nhắn cũ để lướt tới hay ko)
      nextCursor?: string | null; // phân trang
    }
  >;
  activeConversationId: string | null;
  convoLoading: boolean;
  messageLoading: boolean;
  reset: () => void;

  setActiveConversation: (id: string | null) => void; //để những component khác update activeConversation
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessage: (
    recipientId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;
  // add message
  addMessage: (message: Message) => Promise<void>;
  // update convo
  updateConversation: (
    conversation: Pick<Conversation, "_id"> & Partial<Conversation>,
  ) => void;

  markAsSeen: () => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[]; //danh sách người dùng online do BE gửi
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  friends: Friend[];
  loading: boolean; //biết khi nào API chạy xong
  receivedList: FriendRequest[]; //danh sách yêu cầu kết bạn đã nhận
  sentList: FriendRequest[]; //danh sách yêu cầu bẻ kết bạn đã gửi
  searchByUsername: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
  getAllFriendRequests: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  getFriends: () => Promise<void>;
}

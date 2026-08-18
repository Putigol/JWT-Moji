import type { User } from "./user";
import type { Conversation, Message } from "./chat";

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
  loading: boolean;
  reset: () => void;

  setActiveConversation: (id: string | null) => void; //để những component khác update activeConversation
  fetchConversations: () => Promise<void>;
}

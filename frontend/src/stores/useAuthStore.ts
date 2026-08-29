import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";
import type { User } from "@/types/user";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false, //theo dõi state khi gọi API

      setAccessToken: (accessToken) => {
        set({ accessToken }); //cập nhật state trong store
      },

      setUser: (user: User) => {
        set({ user }); //cập nhật user state
      },

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        //cho phép user vẫn có state trong chatStore khi logout hoặc signin
        useChatStore.getState().reset();
        //tránh dữ liệu của người dùng trước bị dùng lại
        localStorage.clear();
        sessionStorage.clear();
      },

      signUp: async (username, password, email, firstName, lastName) => {
        try {
          set({ loading: true }); //cập nhật state trong store

          //  gọi api
          await authService.signUp(
            username,
            password,
            email,
            firstName,
            lastName,
          );

          toast.success(
            "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.",
          );
        } catch (error) {
          console.error(error);
          toast.error("Đăng ký không thành công");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          get().clearState();
          set({ loading: true });

          localStorage.clear();
          useChatStore.getState().reset();

          const { accessToken } = await authService.signIn(username, password);
          get().setAccessToken(accessToken);

          //gọi api lấy data user
          await get().fetchMe();
          useChatStore.getState().fetchConversations();

          toast.success("Chào mừng bạn quay lại với Moji 🎉");
        } catch (error) {
          console.error(error);
          toast.error("Đăng nhập không thành công!");
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Logout thành công!");
        } catch (error) {
          console.error(error);
          toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          //lưu kq trả về
          const user = await authService.fetchMe();
          //cập nhật store
          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true }); //báo cho UI đang refresh
          const { user, fetchMe, setAccessToken } = get();
          //lấy accessToken mới
          const accessToken = await authService.refresh();
          //lưu vào store
          setAccessToken(accessToken);

          if (!user) await fetchMe();
        } catch (error) {
          console.error(error);
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          //xoá thông tin Đăng nhập
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      //partialize cho phép phần nào trong state được lưu
      partialize: (state) => ({ user: state.user }), //chỉ persist user (ko có access token và loading)
    },
  ),
);

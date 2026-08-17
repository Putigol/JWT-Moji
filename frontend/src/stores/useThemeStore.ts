import type { ThemeState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false, //default: sáng

      toggleTheme: () => {
        const newValue = !get().isDark; //lấy giá trị hiện tại của isDark rồi đảo ngược lại
        set({ isDark: newValue });

        if (newValue) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      //Giữ lại giao diện khi load lại
      setTheme: (dark: boolean) => {
        set({ isDark: dark });
        if (dark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {
      name: "theme-storage", //object tên theme-storage trong local storage lưu 2 giá trị sáng tối
    },
  ),
);

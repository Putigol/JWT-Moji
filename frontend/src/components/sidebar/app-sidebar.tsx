import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="p-0">
              <a
                href="#"
                className="block w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-400 shadow-lg overflow-hidden"
              >
                <div className="flex w-full items-center px-4 py-3 justify-between">
                  <h1 className="text-xl font-bold text-white">Moji</h1>
                  <div className="flex items-center gap-3">
                    <Sun className="w-4 h-4 text-white/90" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-white/60"
                    />
                    <Moon className="w-4 h-4 text-white/90" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">
        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group Chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">nhóm chat</SidebarGroupLabel>

          {/* Tạo nhóm mới */}
          <SidebarGroupAction title="Tạo nhóm" className="cursor-pointer">
            <NewGroupChatModal />
          </SidebarGroupAction>

          {/* Danh sách nhóm chat */}
          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Message */}
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="uppercase">bạn bè</SidebarGroupLabel>
            {/* Kết bạn */}
            <AddFriendModal />
          </div>

          {/* Danh sách bạn bè */}
          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}

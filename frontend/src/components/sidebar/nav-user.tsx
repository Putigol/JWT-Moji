import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "@/types/user";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { ChevronsUpDownIcon, BellIcon, UserIcon } from "lucide-react";
import Logout from "../auth/Logout";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const parts = user.displayName.split(/\s+/).filter(Boolean);
  const firstName =
    parts.length > 1 ? parts[parts.length - 1] : parts[0] || "M";

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.displayName}</span>
              <span className="truncate text-xs">{user.username}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback className="rounded-lg">
                      {firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.displayName}
                    </span>
                    <span className="truncate text-xs">{user.username}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon className="text-muted-foreground dark:group-focus:!text-accent-foreground" />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon className="text-muted-foreground dark:group-focus:!text-accent-foreground" />
                Thông báo
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* logout nổi bật với màu đỏ */}
            <DropdownMenuItem
              className="cursor-pointer"
              variant="destructive"
              onClick={handleLogout}
            >
              <span className="flex items-center gap-2">
                <Logout />
                Đăng xuất
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

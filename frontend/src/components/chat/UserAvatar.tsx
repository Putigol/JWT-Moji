import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatarProps {
  type: "sidebar" | "chat" | "profile";
  name: string;
  avatarUrl?: string;
  className?: string; //cho phép custom
}

const UserAvatar = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
  //set màu thay nếu ko có avatar
  const bgColor = !avatarUrl ? "bg-blue-500" : "";

  return (
    <Avatar
      className={cn(
        className ?? "",
        type === "sidebar" && "size-12 text-base",
        type === "chat" && "size-8 text-sm",
        type === "profile" && "size-24 text-3xl shadow-md",
      )}
    >
      <AvatarImage src={avatarUrl} alt={name} />
      {/* AvatarFallback là phần hiển thị chữ cái đầu cho AvatarImage */}
      <AvatarFallback className={`${bgColor} text-white font-semibold`}>
        {(() => {
          const safeName = (name || "Moji").trim();
          const parts = safeName.split(/\s+/).filter(Boolean);
          const firstName =
            parts.length > 1 ? parts[parts.length - 1] : parts[0] || "M";
          return firstName.charAt(0).toUpperCase();
        })()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

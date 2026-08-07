import { useAuthStore } from "@/stores/useAuthStore";
import Logout from "../components/auth/Logout";
const ChatAppPage = () => {
  //theo dõi trường user trong store, chỉ render khi user thay đổi
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      {/* nếu user có giá trị thì hiển thị username */}
      {user?.username}
      <Logout />
    </div>
  );
};

export default ChatAppPage;

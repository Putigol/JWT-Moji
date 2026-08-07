import { useAuthStore } from "@/stores/useAuthStore";
import Logout from "../components/auth/Logout";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const ChatAppPage = () => {
  //theo dõi trường user trong store, chỉ render khi user thay đổi
  const user = useAuthStore((s) => s.user);

  const handleOnClick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("ok");
    } catch (error) {
      toast.error("Thất bại!");
      console.error(error);
    }
  };
  return (
    <div>
      {/* nếu user có giá trị thì hiển thị username */}
      {user?.username}
      <Logout />

      <Button onClick={handleOnClick}>test</Button>
    </div>
  );
};

export default ChatAppPage;

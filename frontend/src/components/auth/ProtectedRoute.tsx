import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  //người dùng chưa đăng nhập (chưa nhận accessToken)
  if (!accessToken) {
    return (
      <Navigate
        to="/signin"
        //replace ko cho quay lại trang trước
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    //gửi yêu cầu đăng ký
    const res = await api.post(
      "/auth/signup",
      { username, password, email, firstName, lastName },
      { withCredentials: true },
    );

    return res.data;
  },

  signIn: async (username: string, password: string) => {
    //gửi yêu cầu đăng nhập
    const res = await api.post(
      "auth/signin",
      { username, password },
      { withCredentials: true },
    );
    return res.data; // access token
  },

  signOut: async () => {
    return api.post("/auth/signout", { withCredentials: true });
  },
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

//authorization: xác minh user là ai
//next: chuyển sang middleware tiếp theo
export const protectedRoute = async (req, res, next) => {
  try {
    //lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //tách: Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }
    //xác nhận token hợp lệ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error("Lỗi khi xác thực token:", err);
          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không đúng" });
        }

        //tìm user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        ); //loại bỏ hashedPassword khỏi dữ liệu trả về

        if (!user) {
          return res.status(404).json({ message: "Không tìm thấy user" });
        }
        //trả user về trong req
        req.user = user;
        next();
      },
    );
  } catch (error) {
    return res.status(401).json({ message: "Lỗi hệ thống khi xác thực" });
  }
};

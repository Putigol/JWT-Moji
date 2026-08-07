import bcrypt from "bcrypt";
import User from "../models/User.js";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30s";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14 ngày

//signup API
export const signUp = async (req, res) => {
  //Lấy dữ liệu người dùng gửi lên từ request body
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Vui lòng điền đầy đủ username, password, email, firstName, lastName",
      });
    }

    //Kiểm tra username đã tồn tại chưa
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }

    //Mã hoá password
    const hashedPassword = await bcrypt.hash(password, 10); //saltRound: số lần bcrypt thực hiện mã hoá (2^10)

    //Tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${lastName} ${firstName}`,
    });

    //Return
    return res.sendStatus(204); //204: req được thực hiện thành công nhưng không có dữ liệu trả về
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    res.status(500).json({ message: "Có lỗi hệ thống xảy ra khi đăng ký" });
  }
};

//signin API
export const signIn = async (req, res) => {
  try {
    //lấy inputs
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ username và password" });
    }

    //lấy hashedPassword từ DB để so với input password
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không đúng" });
    }

    //kiểm tra password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không đúng" });
    }

    //nếu khớp, tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    //tạo refreshToken
    const refreshToken = crypto.randomBytes(64).toString("hex");

    //tạo session mới để lưu refreshToken
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //trả refreshToken về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //cookie ko thể truy cập từ JS phía client
      secure: true, // chỉ gửi cookie qua HTTPS
      sameSite: "none", //backend và frontend chạy khác domain
      maxAge: REFRESH_TOKEN_TTL,
    });
    //trả accessToken về trong res
    return res.status(200).json({
      message: `${user.displayName} đăng nhập thành công`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn:", error);
    res.status(500).json({ message: "Có lỗi hệ thống xảy ra khi đăng nhập" });
  }
};

//signout API
export const signOut = async (req, res) => {
  try {
    //lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      //xoá refresh token trong Session
      await Session.deleteOne({ refreshToken: token });
      //xoá cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut:", error);
    res.status(500).json({ message: "Có lỗi hệ thống xảy ra khi đăng xuất" });
  }
};

//tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
  try {
    //lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại." });
    }

    //so với refresh token trong DB
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res.status(403).json({ message: "Token hết hạn hoặc không đúng" });
    }

    //kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token hết hạn" });
    }

    //tạo access token mới
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    //trả về cho client
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

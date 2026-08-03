import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, //Lưu mật khẩu đã hash, không lưu mật khẩu gốc
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // link CDN để hiển thị hình
    },
    avatarId: {
      type: String, // Cloudinary public_id để xoá hình
    },
    bio: {
      type: String,
      maxLength: 500, // Giới hạn độ dài bio để tránh spam
    },
    phone: {
      type: String,
      sparse: true, // cho phép null, nhưng không được trùng
    },
  },
  {
    timestamps: true, //tự động thêm 2 trường createdAt và updatedAt
  },
);

const User = mongoose.model("User", userSchema); //tạo model User từ schema userSchema, tên collection trong MongoDB sẽ là "users" (tên model + s)
export default User;

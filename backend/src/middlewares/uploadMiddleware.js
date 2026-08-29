import multer from "multer"; //nhận và xử lý file upload từ form lên server
import { v2 as cloudinary } from "cloudinary";

export const upload = multer({
  storage: multer.memoryStorage(), //lưu file trên RAM
  limits: {
    fileSize: 1024 * 1024 * 1, // 1MB
  },
});

//xử lý ảnh đã nhận  trên cloudinary
export const uploadImageFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "moji_chat/avatars",
        resource_type: "image",
        transformation: [{ width: 200, height: 200, crop: "fill" }],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result); //result chứa URL và ID của ảnh
        }
      },
    );

    uploadStream.end(buffer); //kết thúc stream
  });
};

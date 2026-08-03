import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Liên kết CSDL thành công");
  } catch (error) {
    console.log("Liên kết CSDL thất bại: ", error);
    process.exit(1);
  }
};

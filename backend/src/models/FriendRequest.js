import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxLength: 300,
    },
  },
  {
    timestamps: true,
  },
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); //tránh trùng lặp lời mời

friendRequestSchema.index({ from: 1 }); //truy vấn nhanh các lời mời đã gửi

friendRequestSchema.index({ to: 1 }); //truy vấn nhanh các lời mời đã nhận

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;

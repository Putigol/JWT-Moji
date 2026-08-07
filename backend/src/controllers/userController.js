export const authMe = async (req, res) => {
  try {
    const user = req.user; // Lấy thông tin người dùng từ authMiddleware
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi gọi authMe:", error);
    res
      .status(500)
      .json({ message: "Có lỗi hệ thống xảy ra khi lấy thông tin user" });
  }
};

export const test = async (req, res) => {
  return res.sendStatus(204);
};

import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  //Lấy dữ liệu người dùng gửi lên từ request body
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
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
      displayName: `${firstName} ${lastName}`,
    });

    //Return
    return res.sendStatus(204); //204: req được thực hiện thành công nhưng không có dữ liệu trả về
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    res.status(500).json({ message: "Có lỗi hệ thống xảy ra khi đăng ký" });
  }
};

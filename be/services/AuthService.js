const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const JWT_SECRET = '034846806522150363221407'; 
class AuthService {

  // Kiểm tra mật khẩu khi đăng nhập
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Đăng ký người dùng mới
  static async register({ fullname, email, password, role }) {
    try {
      // Kiểm tra xem email hoặc username đã tồn tại chưa
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email đã được đăng ký');
      }

      const existingUsername = await User.findOne({ where: { fullname } });
      if (existingUsername) {
        throw new Error('Username đã tồn tại');
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const user = await User.create({ fullname, email, password: hashedPassword, role });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Đăng nhập người dùng
  static async login({ email, password }) {
    try {
      // Tìm người dùng theo email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Mật khẩu không chính xác');
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET, // Sử dụng secret key đã khai báo
        { expiresIn: '1h' } // Thời gian hết hạn của token (1 giờ)
      );

      return { token, user };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = AuthService;
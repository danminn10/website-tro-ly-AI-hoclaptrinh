const User = require('../models/User');  // Import model User
const bcrypt = require('bcryptjs');   // Để mã hóa mật khẩu
const jwt = require('jsonwebtoken');  // Để xử lý các token

class UserController {
  // Lấy tất cả người dùng
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();  // Lấy tất cả người dùng từ database
      res.json(users);  // Trả về dữ liệu người dùng
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Không thể lấy danh sách người dùng' });
    }
  }

  // Lấy thông tin người dùng theo ID
  static async getUserById(req, res) {
    const { id } = req.params;  // Lấy ID từ params

    try {
      const user = await User.findByPk(id);  // Tìm người dùng theo ID

      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      res.json(user);  // Trả về thông tin người dùng
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Không thể lấy thông tin người dùng' });
    }
  }

  // Cập nhật thông tin người dùng
  static async updateUser(req, res) {
    const { id } = req.params;  // Lấy ID người dùng từ params
    const { fullname, email, password, score, role, quizzScore,  hasCompletedTest } = req.body;  // Lấy các thông tin cần cập nhật

    try {
      const user = await User.findByPk(id);  // Tìm người dùng theo ID

      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      // Nếu có mật khẩu mới, mã hóa mật khẩu
      let updatedPassword = user.password;
      if (password) {
        updatedPassword = await bcrypt.hash(password, 10);
      }

      // Cập nhật thông tin người dùng
      await user.update({
        fullname: fullname || user.fullname,  // Cập nhật tên đầy đủ
        email: email || user.email,            // Cập nhật email
        password: updatedPassword,             // Cập nhật mật khẩu
        score: score || user.score,            // Cập nhật điểm số
        role: role || user.role,               // Cập nhật vai trò
        quizzScore: quizzScore || user.quizzScore,  // Cập nhật điểm số trắc nghiệm
        hasCompletedTest: hasCompletedTest || user.hasCompletedTest,  // Cập nhật trạng thái đã hoàn thành bài kiểm tra
      });

      res.json({ message: 'Thông tin người dùng đã được cập nhật', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Không thể cập nhật thông tin người dùng' });
    }
  }

  // Đăng ký người dùng mới
  static async createUser(req, res) {
    const { fullname, email, password, role } = req.body;  // Lấy thông tin đăng ký

    try {
      // Kiểm tra nếu người dùng đã tồn tại
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã được đăng ký' });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo mới người dùng
      const newUser = await User.create({
        fullname,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json({ message: 'Người dùng đã được tạo', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Không thể tạo người dùng' });
    }
  }

  // Đăng nhập
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Sai mật khẩu' });
      }

      const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'Đăng nhập thành công', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đăng nhập thất bại' });
    }
  }
}

module.exports = UserController;

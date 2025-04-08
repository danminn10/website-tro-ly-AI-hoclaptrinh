const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res) {
    const { fullname, email, password, role } = req.body; // Thêm `username` và `role`
    try {
      if (!fullname || !email || !password || !role) {
        throw new Error('Vui lòng cung cấp đầy đủ thông tin: username, email, password, role');
      }

      const user = await AuthService.register({ fullname, email, password, role });
      res.status(201).json({
        message: 'Đăng ký thành công',
        user,
      });
    } catch (error) {
      res.status(400).json({ message: `Đăng ký không thành công: ${error.message}` });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        throw new Error('Vui lòng cung cấp đầy đủ email và password');
      }

      const { token, user } = await AuthService.login({ email, password });
      res.status(200).json({
        message: 'Đăng nhập thành công',
        user,
        token,
      });
    } catch (error) {
      res.status(400).json({ message: `Đăng nhập không thành công: ${error.message}` });
    }
  }
}

module.exports = AuthController;

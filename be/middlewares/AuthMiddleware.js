const jwt = require('jsonwebtoken');
const JWT_SECRET = '034846806522150363221407';  // Thay thế bằng khóa bí mật của bạn
const JWT_EXPIRES_IN = '1h';  // Thời gian hết hạn token

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(403).json({ message: 'Token không tồn tại' });
  }

  // Xác thực JWT với secret key
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }
    req.user = user; // Gán thông tin người dùng vào request
    next();
  });
};

module.exports = authenticateJWT;

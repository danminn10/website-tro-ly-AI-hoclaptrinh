const multer = require('multer');

// Cấu hình multer để lưu ảnh vào bộ nhớ tạm
const storage = multer.memoryStorage();  // Lưu file vào bộ nhớ tạm
const upload = multer({ storage: storage });

// Middleware upload file
module.exports = upload;

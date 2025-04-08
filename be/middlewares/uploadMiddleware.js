const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file tạm thời vào thư mục uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Lưu vào thư mục "uploads"
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.mkv'];
const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true);  // Chấp nhận file
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);  // Từ chối file không hợp lệ
  }
};

// Tạo middleware xử lý upload file
const upload = multer({ storage, fileFilter });

// Middleware để xóa file sau khi xử lý xong
const deleteFile = (req, res, next) => {
    if (req.file) {
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Failed to delete file:', err);
            } else {
                console.log('File deleted:', filePath);
            }
        });
    }
    next();
};

module.exports = { upload, deleteFile };

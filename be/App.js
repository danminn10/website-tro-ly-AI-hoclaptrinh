const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Khởi tạo ứng dụng Express
const app = express();

// Import các route
const coursesRoutes = require('./routes/CoursesRoutes');
const quizzRoutes = require('./routes/QuizzRoutes');  // Thêm QuizzRoutes mới
const progressRoutes = require('./routes/ProgressRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const videosRoutes = require('./routes/VideosRoutes');
const conversationsRoutes = require('./routes/ConversationsRoutes');

// Middleware
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Cho phép tất cả các miền

// Định tuyến
app.use('/courses', coursesRoutes);
app.use('/quizzes', quizzRoutes);  // Thay Assignments thành Quizzes
app.use('/progress', progressRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/videos', videosRoutes);
app.use('/conversations', conversationsRoutes);
app.use('/uploads', express.static('uploads'));

// Khởi động server
app.listen(3000, () => {
  console.log('Server đang chạy tại http://localhost:3000');
});
 
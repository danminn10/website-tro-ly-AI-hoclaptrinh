const express = require('express');
const router = express.Router();
const {upload} = require('../middlewares/uploadMiddleware'); // Import middleware upload
const { createCourse, updateCourse, deleteCourse, searchCourses, getAllCourses, 
    getCourseById
 } = require('../controllers/CoursesController');

// Courses routes
router.post(
    '/',
    upload.single('image'),  // Đảm bảo key là 'image' trong form-data
    createCourse // Controller xử lý logic tạo khóa học
  );        // Tạo mới khóa học
router.put('/:id', upload.single('image'), updateCourse);        // Cập nhật khóa học
router.delete('/:id', deleteCourse);     // Xóa khóa học
router.get('/search', searchCourses);         // Tìm kiếm các khóa học theo title và level or cả hai
router.get('/all', getAllCourses);       // Lấy tất cả khóa học
router.get('/:id', getCourseById);       // Lấy khóa học theo ID

module.exports = router;

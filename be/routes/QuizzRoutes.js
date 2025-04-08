// routes/QuizzRoutes.js

const express = require('express');
const router = express.Router();
const { createQuizz, updateQuizz, deleteQuizz, searchQuizzes, getAllQuizzes, getQuizzById,
    getQuizzesByCourseId
 } = require('../controllers/QuizzController');

// Quizz routes
router.post('/', createQuizz);      // Tạo mới quizz
router.put('/:id', updateQuizz);    // Cập nhật quizz
router.delete('/:id', deleteQuizz); // Xóa quizz
router.get('/search', searchQuizzes);      // Tìm kiếm quizz
router.get('/all', getAllQuizzes);   // Lấy tất cả quizz
router.get('/:id', getQuizzById);    // Lấy quizz theo id
router.get('/course/:courseId', getQuizzesByCourseId); // Lấy danh sách quizz theo courseId

module.exports = router;

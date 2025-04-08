const express = require('express');
const router = express.Router();
const { createProgress, updateProgress, deleteProgress, searchProgress } = require('../controllers/ProgressController');

// Progress routes
router.post('/', createProgress);        // Tạo mới tiến trình học
router.put('/:id', updateProgress);      // Cập nhật tiến trình học
router.delete('/:id', deleteProgress);   // Xóa tiến trình học
router.get('/', searchProgress);         // Tìm kiếm tiến trình học

module.exports = router;

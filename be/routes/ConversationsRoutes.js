const express = require('express');
const router = express.Router();
const { createConversation, textToSpeech, createHintCourses, getAllConversations, AIHintCourses } = require('../controllers/ConversationsController');  // Import từ controller

// Lấy danh sách cuộc trò chuyện của người dùng
// router.get('/:userId', getConversationContext);  // Sử dụng hàm getConversations từ controller

// Thêm mới cuộc trò chuyện
router.post('/chat', createConversation);  // Sử dụng hàm createConversation từ controller
router.post('/v1/text-to-speech', textToSpeech);  // Thêm route mới để chuyển văn bản thành giọng nói
router.post('/v1/hint-courses', createHintCourses);  // Thêm route mới để tạo khóa học ý tưởng
router.get('/', getAllConversations);  // Lấy tất cả cuộc trò chuyện
router.post('/v1/ai-hint-courses', AIHintCourses);  // Thêm route mới để tạo khóa học ý tưởng từ AI
module.exports = router;
 
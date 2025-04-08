// controllers/QuizzController.js

const  Quizz  = require('../models/Quizz');
const User = require('../models/User');
const Courses = require('../models/Courses'); // Đảm bảo đường dẫn đúng với vị trí của mô hình 
const Sequelize = require('sequelize');

// Thêm Quizz mới
// Thêm Quizz mới
const createQuizz = async (req, res) => {
  try {
    const {
      title,
      description,
      userId, // Có thể là bất kỳ giá trị nào
      courseId,
      limit,
      questionType,
      quizzScore,
      questions,
      userAnswers,
      feedbacks,
    } = req.body;

    // Kiểm tra các trường bắt buộc (trừ userId nếu không bắt buộc)
    if (
      !title ||
      !description ||
      !courseId ||
      !limit ||
      !questionType ||
      !quizzScore ||
      !questions
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tạo quizz mới
    const quizz = await Quizz.create({
      title,
      description,
      userId: userId,
      courseId,
      limit,
      questionType,
      quizzScore,
      questions,
      userAnswers,
      feedbacks,
    });

    res.status(201).json({
      message: "Quizz created successfully",
      quizz,
    });
  } catch (error) {
    console.error("Error creating quizz:", error);
    res.status(400).json({
      message: "Error creating quizz",
      error: error.message || error,
    });
  }
};
// Cập nhật Quizz
const updateQuizz = async (req, res) => {
  const { id } = req.params;
  const { title, description, userId, courseId, limit, questionType, quizzScore, questions, feedbacks } = req.body;
  try {
    const quizz = await Quizz.findByPk(id);
    if (!quizz) return res.status(404).json({ message: 'Quizz not found' });
    quizz.title = title || quizz.title;
    quizz.description = description || quizz.description;
    quizz.userId = userId || quizz.userId;
    quizz.courseId = courseId || quizz.courseId;
    quizz.limit = limit || quizz.limit;
    quizz.questionType = questionType || quizz.questionType;
    quizz.quizzScore = quizzScore || quizz.quizzScore;
    quizz.questions = questions || quizz.questions;
    quizz.feedbacks = feedbacks || quizz.feedbacks;
    await quizz.save();
    res.status(200).json({ message: 'Quizz updated successfully', quizz });
  } catch (error) {
    res.status(400).json({ message: 'Error updating quizz', error });
  }
};

// Xóa Quizz
const deleteQuizz = async (req, res) => {
  const { id } = req.params;
  try {
    const quizz = await Quizz.findByPk(id);
    if (!quizz) return res.status(404).json({ message: 'Quizz not found' });
    await quizz.destroy();
    res.status(200).json({ message: 'Quizz deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting quizz', error });
  }
};
// Tìm kiếm Quizz
const searchQuizzes = async (req, res) => {
  const { title } = req.query;  // Lấy title từ query string
  try {
    const quizzes = await Quizz.findAll({
      where: {
        title: {
          [Sequelize.Op.like]: `%${title}%`  // Đảm bảo sử dụng đúng cú pháp cho cơ sở dữ liệu
        }
      }
    });

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "Quizz not found" });
    }

    res.status(200).json(quizzes);  // Trả về danh sách các quiz tìm thấy
  } catch (error) {
    console.error("Error searching for quizzes:", error);  // Log chi tiết lỗi vào console
    res.status(400).json({ message: 'Error searching for quizzes', error: error.message });  // Trả về thông báo lỗi chi tiết
  }
};
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quizz.findAll();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching all quizzes:', error);
    res.status(400).json({ message: 'Error fetching all quizzes', error });
  }
};
/// Trong QuizzController.js
const getQuizzById = async (req, res) => {
  const { id } = req.params;
  try {
    // Ép kiểu id về số nguyên
    const quizzId = parseInt(id, 10);
    if (isNaN(quizzId)) {
      return res.status(400).json({ message: 'Invalid quizz ID' });
    }
    // Log để debug
    console.log('Fetching quizz with ID:', quizzId);

    const quizz = await Quizz.findByPk(quizzId);
    if (!quizz) {
      console.log('Quizz not found for ID:', quizzId);
      return res.status(404).json({ message: 'Quizz not found' });
    }

    // Log kết quả truy vấn
    console.log('Quizz found:', quizz);

    res.status(200).json(quizz);
  } catch (error) {
    console.error('Error fetching quizz with ID:', id, error);
    res.status(400).json({ message: 'Error fetching quizz', error: error.message });
  }
};
// Lấy danh sách Quizz theo courseId
const getQuizzesByCourseId = async (req, res) => {
  const { courseId } = req.params;
  try {
    const quizzes = await Quizz.findAll({
      where: {
        courseId: courseId
      }
    });

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this course" });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes by courseId:", error);
    res.status(400).json({ message: 'Error fetching quizzes by courseId', error });
  }
};

module.exports = {
  createQuizz,
  updateQuizz,
  deleteQuizz,
  searchQuizzes,
  getAllQuizzes,
  getQuizzById,
  getQuizzesByCourseId,
};

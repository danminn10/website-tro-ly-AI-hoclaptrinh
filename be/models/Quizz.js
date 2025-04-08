const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Courses = require('./Courses'); // Đảm bảo import đúng mô hình Courses
const User = require('./User'); // Đảm bảo import đúng mô hình Users
const Quizz = sequelize.define('Quizz', {
  quizzId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'userId',
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'coursesId',
    },
  },
  limit: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM,
    values: ['single', 'multiple'], // Định nghĩa loại câu hỏi: single (1 đáp án đúng), multiple (nhiều đáp án đúng)
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSON, // Dùng kiểu JSON để lưu trữ các câu hỏi và lựa chọn
    allowNull: false,
  },
  userAnswers: {
    type: DataTypes.JSON, // Dùng kiểu JSON để lưu trữ câu trả lời của người dùng
    allowNull: true,
  },
  quizzScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  feedbacks: {
    type: DataTypes.JSON, // Sử dụng kiểu dữ liệu JSON thay vì JSONB
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'quizCreationTime', // thời gian tạo quiz
  updatedAt: 'quizUpdateTime', // thời gian cập nhật quiz
});

// Quan hệ với Courses
Quizz.belongsTo(Courses, { foreignKey: 'courseId' });
Quizz.belongsTo(User, { foreignKey: 'userId' });
module.exports = Quizz;

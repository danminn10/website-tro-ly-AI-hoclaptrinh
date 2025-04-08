const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Định nghĩa mô hình Progress
const Progress = sequelize.define('Progress', {
  progressId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Liên kết với bảng Users
      key: 'userId',
    },
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Courses', // Liên kết với bảng Courses
      key: 'coursesId',
    },
  },
  status: {
    type: DataTypes.INTEGER, // 0: chưa bắt đầu, 1: đang tiến hành, 2: đã hoàn thành
    allowNull: false,
  },
  startProgress: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endProgress: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  progressDetail: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'progressCreationTime', // thời gian tạo tiến trình
  updatedAt: 'progressUpdateTime', // thời gian cập nhật tiến trình
});

module.exports = Progress;

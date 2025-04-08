const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Import đối tượng sequelize đã được khởi tạo
const Quizz = require('./Quizz');  // Import mô hình Quizz
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hasCompletedTest: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quizzScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,  // Tạo các trường createdAt và updatedAt
  createdAt: 'userCreationTime', // Đặt tên trường thời gian tạo user
  updatedAt: 'userUpdateTime', // Đặt tên trường thời gian cập nhật user
});
module.exports = User;

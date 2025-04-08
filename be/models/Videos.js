const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// Định nghĩa mô hình Videos
const Videos = sequelize.define('Videos', {
  videoId: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  url: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  category: { 
    type: DataTypes.ENUM, 
    values: ['Python', 'Java', 'JavaScript'], 
    allowNull: false 
  },
  courseId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { 
      model: 'Courses', 
      key: 'coursesId' 
    } 
  }
}, {
  timestamps: true,
  createdAt: 'videoCreationTime', // thời gian tạo video
  updatedAt: 'videoUpdateTime', // thời gian cập nhật video
});

module.exports = Videos;

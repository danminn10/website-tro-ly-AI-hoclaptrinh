const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Đảm bảo import mô hình User

const Conversations = sequelize.define('Conversations', {
  conversationsId: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { 
      model: 'Users', 
      key: 'userId' 
    } 
  },
  userMessage: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  aiResponse: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  audioUrl: { 
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  timestamps: true,
  createdAt: 'conversationCreationTime', // thời gian tạo cuộc trò chuyện
  updatedAt: 'conversationUpdateTime', // thời gian cập nhật cuộc trò chuyện
});

// Định nghĩa quan hệ giữa Conversations và User
Conversations.belongsTo(User, { foreignKey: 'userId' });

module.exports = Conversations;

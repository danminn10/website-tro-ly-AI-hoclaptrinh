const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Videos = require("./Videos"); // Import mô hình Videos
const Progress = require("./Progress");

// Định nghĩa mô hình Courses
const Courses = sequelize.define(
  "Courses",
  {
    coursesId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Sử dụng TEXT thay vì STRING cho mô tả dài
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Giá mặc định là 0
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Mặc định không giảm giá
    },
    time: {
      type: DataTypes.INTEGER, // Thời lượng khóa học (giờ)
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"), // Dễ hiểu hơn với ENUM
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Python", "Java", "JavaScript"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "archived"), // Trạng thái khóa học
      defaultValue: "active", // Trạng thái mặc định là active
    },
  },
  {
    timestamps: true,
    createdAt: "courseCreationTime", // Thời gian tạo khóa học
    updatedAt: "courseUpdateTime", // Thời gian cập nhật khóa học
    tableName: "Courses", // Đảm bảo tên bảng chuẩn
  }
);

// Thiết lập quan hệ với Progress
Courses.hasMany(Progress, {
  foreignKey: "courseId", // Khóa ngoại trỏ đến coursesId
  as: "progresses", // Alias cho quan hệ Progress
});

// Thiết lập quan hệ với Videos
Courses.hasMany(Videos, {
  foreignKey: "courseId", // Khóa ngoại trỏ đến coursesId
  as: "videos", // Alias cho quan hệ Videos
});

// Export mô hình Courses
module.exports = Courses;

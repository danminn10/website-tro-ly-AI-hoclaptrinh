const Courses  = require('../models/Courses');
const fs = require('fs');  // Import fs module để xóa file
const {uploadToCloudinary, deleteImageFromCloudinary} = require('../config/cloudinary'); // Import hàm uploadToCloudinary
const Sequelize = require('sequelize');
const Videos = require('../models/Videos');

// Tạo khóa học mới
const createCourse = async (req, res) => {
  try {
    const { title, description, price, discount, time, level, category, status } = req.body;

    // Kiểm tra các trường cần thiết
    if (!title || !description || !price || !time || !level || !category || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Kiểm tra giá trị price hợp lệ
    if (isNaN(price)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }

    let imageUrl = null;
    if (req.file) {
      // Upload ảnh lên Cloudinary và lấy URL trả về
      imageUrl = await uploadToCloudinary(req.file.path); // Gọi hàm uploadToCloudinary

      // Xóa file tạm thời sau khi upload thành công lên Cloudinary
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file from uploads folder:', err);
        } else {
          console.log('File deleted from uploads folder');
        }
      });
    }
    // Kiểm tra xem khóa học đã tồn tại chưa`
    const existingCourse = await Courses.findOne({ where: { title } });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists' });
    }
    // Lưu khóa học vào database (dùng ORM hoặc database theo yêu cầu của bạn)
    const course = await Courses.create({
      title, description, image: imageUrl, price, discount, time, level, category, status,
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: 'Error creating course', error: error.message || error });
  }
};



// Cập nhật khóa học
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, discount, time, level, category, status } = req.body;

  try {
    const course = await Courses.findByPk(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let imageUrl = course.image;  // Giữ nguyên ảnh cũ nếu không có ảnh mới
    if (req.file) {
      // Nếu có ảnh mới, tải ảnh lên Cloudinary
      imageUrl = await uploadToCloudinary(req.file); // Gọi hàm uploadToCloudinary
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.image = imageUrl;  // Cập nhật ảnh mới
    course.price = price || course.price;
    course.discount = discount || course.discount;
    course.time = time || course.time;
    course.level = level || course.level;
    course.category = category || course.category;
    course.status = status || course.status;

    await course.save();

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error });
  }
};


// Xóa khóa học
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm khóa học theo ID
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Nếu có ảnh, xóa ảnh khỏi Cloudinary
    if (course.image) {
      try {
        const cloudinaryResponse = await deleteImageFromCloudinary(course.image);
        console.log('Image deleted from Cloudinary:', cloudinaryResponse);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        // Không return lỗi ở đây để tiếp tục xóa khóa học dù ảnh không được xóa
      }
    }

    // Xóa khóa học trong database
    await course.destroy();

    res.status(200).json({ message: 'Course and associated image deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message || error });
  }
};


// Tìm kiếm Course
const searchCourses = async (req, res) => {
  const { title, level } = req.query; // Lấy `title` và `level` từ query parameters

  try {
    // Tạo điều kiện tìm kiếm động
    const searchConditions = {};

    // Thêm điều kiện tìm kiếm theo `title` nếu được cung cấp
    if (title) {
      searchConditions.title = {
        [Sequelize.Op.like]: `%${title}%`, // Tìm kiếm tương đối theo title
      };
    }

    // Thêm điều kiện tìm kiếm theo `level` nếu được cung cấp
    if (level) {
      if (isNaN(level)) {
        return res.status(400).json({ message: 'Level must be a valid number' });
      }
      searchConditions.level = parseInt(level, 10); // Chuyển level từ string sang số nguyên
    }

    // Tìm kiếm khóa học dựa trên điều kiện
    const courses = await Courses.findAll({
      where: searchConditions,
    });

    // Nếu không có khóa học nào thỏa mãn điều kiện
    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found matching the criteria' });
    }

    // Trả về danh sách khóa học thỏa mãn
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error searching for courses:', error);
    res.status(500).json({ message: 'Error searching for courses', error: error.message || error });
  }
};

// API lấy tất cả khóa học
// const getAllCourses = async (req, res) => {
//   try {
//     const courses = await Courses.findAll();
//     res.status(200).json(courses);
//   } catch (error) {
//     res.status(400).json({ message: 'Error fetching courses', error });
//   }
// };
const getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.findAll({
      include: [{
        model: Videos,
        as: 'videos', // Tên quan hệ đã định nghĩa trong model Courses
        required: false, // Lấy tất cả khóa học, ngay cả khi không có video
      }]
    });
    
    res.status(200).json(courses); // Trả về danh sách khóa học cùng với video
  } catch (error) {
    res.status(400).json({ message: 'Error fetching courses', error });
  }
};

// API lấy khóa học theo ID
const getCourseById = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Kiểm tra id có phải là số hợp lệ không
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Tìm khóa học theo ID
    const course = await Courses.findByPk(id, 
      {include: [
        {
          model: Videos,
          as: "videos", // Tên alias của quan hệ
          required: false, // Cho phép lấy course kể cả khi không có video
          attributes: ["videoId", "title", "description", "videoUrl"], // Chỉ lấy các trường cần thiết
        },
      ],}
    );

    // Nếu khóa học không tồn tại
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Trả về thông tin khóa học
    res.status(200).json(course);

  } catch (error) {
    // Log lỗi chi tiết ra console để tiện theo dõi và debug
    console.error('Error fetching course by ID:', error);

    // Trả về phản hồi lỗi chi tiết hơn
    res.status(500).json({ message: 'Error fetching course', error: error.message || error });
  }
};


module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
  getAllCourses,
  getCourseById,
};

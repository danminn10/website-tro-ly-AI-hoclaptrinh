const Videos  = require('../models/Videos');
const { uploadToCloudinary, deleteFileFromCloudinary } = require('../config/cloudinary');  // Import các hàm xử lý Cloudinary
const fs = require('fs');
const path = require('path');


// Lấy tất cả video
const getAllVideos = async (req, res) => {
  try {
    const videos = await Videos.findAll();
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh sách video' });
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, description, category, courseId } = req.body;

    // Nếu có file video, upload lên Cloudinary và lấy URL trả về
    let videoUrl = null;
    if (req.file) {
      videoUrl = await uploadToCloudinary(req.file.path); // Upload lên Cloudinary
      // Xóa file tạm thời sau khi upload lên Cloudinary
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);  // Đường dẫn file tạm
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete temporary file:', err);
        } else {
          console.log('Temporary file deleted successfully');
        }
      });
    }

    console.log("Data to create video:", { title, description, category, courseId, videoUrl });


    // Kiểm tra dữ liệu để tạo video
    const videoData = {
      title,
      description,
      category,
      courseId,
      url: videoUrl || '',  // Nếu không có videoUrl, sẽ để trống
    };

    console.log("Data to create video:", videoData);

    // Tạo video mới trong cơ sở dữ liệu
    const newVideo = await Videos.create(videoData);

    // Trả về kết quả thành công
    res.status(201).json({
      message: 'Video đã được tạo thành công',
      newVideo,
    });
  } catch (err) {
    console.error('Error creating video:', err);
    res.status(500).json({
      error: 'Có lỗi xảy ra khi tạo video mới',
      details: err.message || err,
    });
  }
};
// Cập nhật video
const updateVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Videos.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Video không tồn tại' });
    }

    let videoUrl = video.url;
    if (req.file) {
      // Xóa video cũ khỏi Cloudinary
      await deleteFileFromCloudinary(video.url);

      // Upload video mới lên Cloudinary
      videoUrl = await uploadToCloudinary(req.file.path);
    }

    // Cập nhật thông tin video
    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;
    video.url = videoUrl;
    video.category = req.body.category || video.category;
    video.courseId = req.body.courseId || video.courseId;

    await video.save();
    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật video' });
  }
};

// Xóa video
const deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Videos.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Video không tồn tại' });
    }

    // Xóa video khỏi Cloudinary
    await deleteFileFromCloudinary(video.url);

    // Xóa video trong cơ sở dữ liệu
    await video.destroy();
    res.status(200).json({ message: 'Video đã được xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Có lỗi xảy ra khi xóa video' });
  }
};

const getVideosByCategory = async (req, res) => {
  const { category } = req.params;
  const { courseId } = req.query; // Lấy `courseId` từ query parameters

  try {
    const queryOptions = { where: { category } };

    if (courseId) {
      queryOptions.where.courseId = courseId;
    }

    const videos = await Videos.findAll(queryOptions);

    if (!videos.length) {
      return res.status(204).json({ message: 'Không có video nào trong danh mục này' });
    }

    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Có lỗi xảy ra khi lấy video theo danh mục' });
  }
};
const getVideoById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("📌 Đang tìm video với ID:", id); // Debug

    // Kiểm tra nếu ID không hợp lệ
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    // Tìm video theo ID (phải chuyển ID thành số nguyên)
    const video = await Videos.findOne({
      where: { videoId: parseInt(id, 10) }, // Lọc theo videoId
    });

    if (!video) {
      console.warn(`⚠️ Không tìm thấy video với ID ${id}`);
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("❌ Lỗi khi lấy video theo ID:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error });
  }
};
module.exports = {
  getAllVideos,
  getVideoById, 
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByCategory
};


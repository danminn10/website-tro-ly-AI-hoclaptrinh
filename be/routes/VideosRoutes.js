const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/uploadMiddleware"); // Middleware upload file

const {
  getAllVideos,
  getVideoById, // Thêm hàm lấy video theo ID
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByCategory,
} = require("../controllers/VideosController");

// 📌 Lấy tất cả video
router.get("/", getAllVideos);

// 📌 Lấy video theo ID
router.get("/:id", getVideoById); // Thêm route này để lấy video theo ID

// 📌 Thêm video mới (có hỗ trợ upload file)
router.post("/", upload.single("video"), createVideo);

// 📌 Cập nhật video
router.put("/:id", upload.single("video"), updateVideo);

// 📌 Xóa video
router.delete("/:id", deleteVideo);

// 📌 Lấy video theo danh mục
router.get("/category/:category", getVideosByCategory);

module.exports = router;

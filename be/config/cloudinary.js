const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'diudnwgbf',
  api_key: '284361171674877',
  api_secret: 'Hw7Rybnz8Z_Yz-ARtHRZLXZYmg4'
});

const uploadToCloudinary = async (filePath) => {
    return new Promise((resolve, reject) => {
      const fileExtension = path.extname(filePath).toLowerCase();

      // Xác định loại tài nguyên (video hoặc ảnh) dựa trên phần mở rộng file
      let resourceType = 'image'; // Mặc định là image
      if (['.mp4', '.mov', '.avi', '.mkv'].includes(fileExtension)) {
        resourceType = 'video';
      }
      cloudinary.uploader.upload(filePath, { folder: 'courses', resource_type: resourceType }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`Uploaded ${resourceType} to Cloudinary:`, result.url);
          resolve(result.url); // Trả về URL của ảnh đã upload
        }
      });
    });
  };
  // Hàm upload âm thanh lên Cloudinary
  const uploadAudioToCloudinary = async (filePath) => {
    return new Promise((resolve, reject) => {
      const fileExtension = path.extname(filePath).toLowerCase();

      // Xác định loại tài nguyên (video hoặc ảnh) dựa trên phần mở rộng file
      let resourceType = ''; // Mặc định 
      if (['.mp4', '.mov', '.avi', '.mkv', '.mp3'].includes(fileExtension)) {
        resourceType = 'video';
      }
      cloudinary.uploader.upload(filePath, { folder: 'audio_files', resource_type: resourceType }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`Uploaded ${resourceType} to Cloudinary:`, result.url);
          resolve(result.url); // Trả về URL của ảnh đã upload
        }
      });
    });
  };
// Hàm xóa ảnh từ Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) {
      throw new Error('Invalid image URL');
    }
  
    try {
      // Tách public_id từ URL ảnh
      const publicId = extractPublicId(imageUrl);
  
      // Gọi API của Cloudinary để xóa ảnh
      const result = await cloudinary.uploader.destroy(publicId);
  
      // Kiểm tra kết quả từ Cloudinary
      if (result.result === 'ok' || result.result === 'not found') {
        console.log(`Image ${result.result === 'ok' ? 'successfully deleted' : 'not found on Cloudinary'}:`, publicId);
        return result;
      } else {
        throw new Error(`Failed to delete image with public ID: ${publicId}`);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  };
  // Hàm xóa video từ Cloudinary
  const deleteFileFromCloudinary = async (videoUrl) => {
    try {
      const publicId = extractPublicId1(videoUrl);  // Lấy public_id từ URL

      // Gọi Cloudinary API để xóa video
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video',  // Chú ý rằng đây là video, không phải hình ảnh
      });

      if (result.result === 'ok') {
        console.log('Video deleted successfully from Cloudinary:', publicId);
      } else {
        throw new Error('Không thể xóa video từ Cloudinary');
      }

      return result;  // Trả về kết quả xóa thành công từ Cloudinary
    } catch (error) {
      console.error('Error deleting video from Cloudinary:', error);
      throw error;  // Ném lỗi lên phía trên
    }
  };

  
  // Hàm tách public_id từ URL
  const extractPublicId = (imageUrl) => {
    const regex = /\/v\d+\/(.+)\.\w+$/; // Tìm phần sau "/v{version}/" và trước phần mở rộng
    const match = imageUrl.match(regex);
  
    if (!match || !match[1]) {
      throw new Error('Invalid image URL format, unable to extract public ID');
    }
  
    return match[1]; // Public ID là phần đầu tiên của kết quả
  };
  const extractPublicId1 = (videoUrl) => {
    const regex = /\/v\d+\/(.+)\.\w+$/;  // Regex để lấy public_id từ URL
    const match = videoUrl.match(regex);
  
    if (!match || !match[1]) {
      throw new Error('Không thể trích xuất public_id từ URL');
    }
  
    return match[1];  // Public ID là phần đầu tiên của kết quả regex
  };
  
  // Hàm xóa âm thanh từ Cloudinary
const deleteAudioFromCloudinary = async (audioUrl) => {
  try {
    const publicId = extractPublicId1(audioUrl);  // Lấy public_id từ URL

    // Gọi Cloudinary API để xóa âm thanh
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'audio',  // Đây là âm thanh
    });

    if (result.result === 'ok') {
      console.log('Audio deleted successfully from Cloudinary:', publicId);
    } else {
      throw new Error('Không thể xóa âm thanh từ Cloudinary');
    }

    return result;  // Trả về kết quả xóa thành công từ Cloudinary
  } catch (error) {
    console.error('Error deleting audio from Cloudinary:', error);
    throw error;  // Ném lỗi lên phía trên
  }
};
  module.exports = {
    uploadToCloudinary,
    deleteImageFromCloudinary,
    deleteFileFromCloudinary,
    uploadAudioToCloudinary,
    deleteAudioFromCloudinary,
  };

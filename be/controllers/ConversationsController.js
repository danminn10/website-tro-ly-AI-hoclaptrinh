const dotenv = require('dotenv');
const { ElevenLabsClient } = require("elevenlabs");  // Import đúng vị trí
const Groq = require('groq-sdk');
const Conversations = require('../models/Conversations');
const { uploadAudioToCloudinary, deleteAudioFromCloudinary } = require("../config/cloudinary");
const fs = require('fs');
const path = require('path');
const tempDir = path.join(__dirname, '..', 'temp');  // Đảm bảo đường dẫn đúng
const Courses = require('../models/Courses');
const User = require('../models/User');
const Quizz = require('../models/Quizz');
const Videos = require('../models/Videos');
const Sequelize = require('sequelize');
// Tải biến môi trường từ file .env
dotenv.config();
// Khởi tạo đối tượng Groq với API Key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Hàm lấy kết quả từ Groq API
async function getGroqChatCompletion(userMessage, userId) {
  try {
    // Lấy các cuộc trò chuyện trước đó từ cơ sở dữ liệu
    const previousConversations = await Conversations.findAll({
      where: { userId: userId },
      order: [['conversationCreationTime', 'DESC']],  // Sắp xếp theo thời gian tạo
      attributes: ['userMessage', 'aiResponse', ],  // Chỉ lấy tin nhắn của người dùng và phản hồi AI
      limit: 10,  // Giới hạn số lượng cuộc trò chuyện
    });
    // Tạo ngữ cảnh từ các câu hỏi và câu trả lời trước đó
    const context = previousConversations.flatMap(item => [
      { role: 'user', content: item.userMessage },  // Đảm bảo role là 'user'
      { role: 'ai', content: item.aiResponse },     // Đảm bảo role là 'ai'
    ]);

    // Thêm câu hỏi hiện tại vào ngữ cảnh
    context.push({ role: "user", content: userMessage });

    const response = await groq.chat.completions.create({
      messages: context,  // Truyền ngữ cảnh vào API
      model: "mixtral-8x7b-32768", // Chọn mô hình Groq
      temperature: 0.5, // Điều chỉnh mức độ sáng tạo của AI
      top_p: 0.5 // Tăng khả năng đa dạng trong phản hồi
    });

    // Kiểm tra và trả về nội dung phản hồi từ AI
    if (response && response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    } else {
      throw new Error("No response from AI.");
    }
  } catch (error) {
    console.error("Error while fetching from Groq:", error);
    throw error;
  }
}

async function getGroqChatCompletion(userMessage, userId) {
  try {
    // Lấy các cuộc trò chuyện trước đó từ cơ sở dữ liệu
    const previousConversations = await Conversations.findAll({
      where: { userId: userId },
      order: [['conversationCreationTime', 'DESC']], // Sắp xếp theo thời gian tạo
      attributes: ['userMessage', 'aiResponse'], // Chỉ lấy tin nhắn của người dùng và phản hồi AI
      limit: 10, // Giới hạn số lượng cuộc trò chuyện
    });

    // Tạo ngữ cảnh từ các câu hỏi và câu trả lời trước đó
    const context = previousConversations.flatMap((item) => {
      // Đảm bảo không thêm tin nhắn rỗng vào context
      const userMessage = item.userMessage?.trim();
      const aiResponse = item.aiResponse?.trim();

      const messages = [];
      if (userMessage) {
        messages.push({ role: 'user', content: userMessage });
      }
      if (aiResponse) {
        messages.push({ role: 'assistant', content: aiResponse });
      }
      return messages;
    });

    // Thêm câu hỏi hiện tại vào ngữ cảnh
    if (userMessage?.trim()) {
      context.push({ role: 'user', content: userMessage.trim() });
    }

    // Gọi API Groq với ngữ cảnh đã tạo
    const response = await groq.chat.completions.create({
      messages: context, // Truyền ngữ cảnh vào API
      model: "llama-3.2-90b-vision-preview", // Chọn mô hình Groq
      temperature: 0.5, // Điều chỉnh mức độ sáng tạo của AI
      top_p: 0.5, // Tăng khả năng đa dạng trong phản hồi
    });

    // Kiểm tra và trả về nội dung phản hồi từ AI
    if (response && response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    } else {
      throw new Error("No response from AI.");
    }
  } catch (error) {
    console.error("Error while fetching from Groq:", error);
    throw error;
  }
}


// Controller để nhận yêu cầu chat từ người dùng
async function createConversation(req, res) {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "User ID and message are required" });
    }

    // Gọi API của Groq hoặc bất kỳ API AI nào để tạo phản hồi
    const aiResponse = await getGroqChatCompletion(message, userId); // Giả sử bạn có hàm này để tạo phản hồi từ AI

    // Lưu cuộc trò chuyện vào cơ sở dữ liệu
    const conversation = await Conversations.create({
      userId: userId,
      userMessage: message,
      aiResponse: aiResponse,
    });

    res.status(200).json({
      success: true,
      conversation,
      message: "Conversation saved successfully"
    });

  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// hàm lấy gợi ý khóa học từ kết quả bài kiểm tra
// Hàm gợi ý khóa học dựa trên kết quả bài kiểm tra của người dùng
const getCourseRecommendations = async (userId, category) => {
  try {
    // Lấy thông tin người dùng từ bảng User
    const user = await User.findByPk(userId);

    if (!user) {
      return "Không tìm thấy người dùng.";
    }
    // Lấy điểm số từ bảng User (score)
    const score = user.score;
    // truy vấn khóa học theo danh mục 
    const categoryCourses = await Courses.findAll({ where: { category: category } });
    console.log(categoryCourses);  // In ra các khóa học lấy được từ database
    // Lọc các khóa học dựa trên điểm số người dùng
    let recommendedCourses = [];
    if (score > 8) {
      recommendedCourses = categoryCourses.filter(course => course.level === 5); // Khóa học nâng cao
    } else if (score > 6) {
      recommendedCourses = categoryCourses.filter(course => course.level === 4); // Khóa học trung cấp
    } else if (score > 4) {
      recommendedCourses = categoryCourses.filter(course => course.level === 3); // Khóa học cơ bản
    } else if (score > 2) {
      recommendedCourses = categoryCourses.filter(course => course.level === 2); // Khóa học tiền cơ bản
    } else {
      recommendedCourses = categoryCourses.filter(course => course.level === 1); // Khóa học cơ bản nhất
    }

    let context = `Dựa trên điểm số ${score}, người dùng sẽ học các khóa học sau: ${recommendedCourses.map(course => course.title).join(', ')}. 
    Hãy đưa ra kế hoạch học tập chi tiết cho người dùng dựa trên các khóa học này.`;

    const recommentProgress = await getGroqChatCompletion(context, userId);

    // Trả về danh sách khóa học gợi ý và video liên quan
    return {
      recommendedCourses: recommendedCourses.map(course => ({
        title: course.title,
        description: course.description,
        price: course.price,
        level: course.level,
      })),
      recommentProgress
    };
  } catch (error) {
    console.error('Error fetching course recommendations:', error);
    throw error;
  }
};

// Controller để nhận yêu cầu và trả về gợi ý khóa học sau khi làm bài kiểm tra
async function createHintCourses(req, res) {
  try {
    const { userId, message, category, score } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "User ID and message are required" });
    }

    // Gọi hàm gợi ý khóa học nếu người dùng đã hoàn thành bài kiểm tra
    const courseRecommendations = await getCourseRecommendations(userId, category);

    // Trả về gợi ý khóa học mà không cần kiểm tra câu hỏi người dùng
    return res.status(200).json({
      success: true,
      message: `Tôi đã phân tích điểm số: ${score} bạn đã đạt được ở bài test. Đây là các khóa học ${category} phù hợp với năng lực hiện tại của bạn.`,
      aiResponse: courseRecommendations,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const getCourseRecommendations1 = async (userId, category) => {
  try {
    // Lấy thông tin người dùng từ bảng User
    const user = await User.findByPk(userId);

    if (!user) {
      return "Không tìm thấy người dùng.";
    }
    // truy vấn khóa học theo danh mục 
    const categoryCourses = await Courses.findAll({ where: { category: category } });
    console.log(categoryCourses);  // In ra các khóa học lấy được từ database
    // Lọc các khóa học dựa trên điểm số người dùng
    
    recommendedCourses = categoryCourses.filter(course => course.level >= 3); // Khóa học cơ bản

    let context = `Người dùng sẽ học các khóa học nâng cao sau: ${recommendedCourses.map(course => course.title).join(', ')}. 
    Hãy đưa ra kế hoạch học tập chi tiết cho người dùng dựa trên các khóa học này.`;

    const recommentProgress = await getGroqChatCompletion(context, userId);
    // Trả về danh sách khóa học gợi ý và video liên quan
    return {
      recommendedCourses: recommendedCourses.map(course => ({
        title: course.title,
        description: course.description,
        price: course.price,
        level: course.level,
      })),
      recommentProgress
    };
  } catch (error) {
    console.error('Error fetching course recommendations:', error);
    throw error;
  }
};

async function AIHintCourses(req, res) {
  try {
    const { userId, message, category} = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "User ID and message are required" });
    }

    // Gọi hàm gợi ý khóa học nếu người dùng đã hoàn thành bài kiểm tra
    const courseRecommendations = await getCourseRecommendations1(userId, category);

    // Trả về gợi ý khóa học mà không cần kiểm tra câu hỏi người dùng
    return res.status(200).json({
      success: true,
      message: `Tôi đã phân tích năng lực hiện tại của bạn. Đây là các khóa học ${category} phù hợp với năng lực hiện tại của bạn.`,
      aiResponse: courseRecommendations,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Hàm xử lý Text-to-Speech và upload âm thanh lên Cloudinary
const textToSpeech = async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ error: "Text and User ID are required" });
    }

    // Gọi API để lấy phản hồi AI
    const aiResponse = await getGroqChatCompletion(text, userId);
    if (!aiResponse) {
      return res.status(500).json({ error: "Không nhận được phản hồi từ AI" });
    }

    console.log("AI Response:", aiResponse);

    // Chuyển phản hồi AI thành âm thanh
    const audioStream = await client.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
      model_id: "eleven_turbo_v2_5",
      text: aiResponse,
    });

    if (!audioStream) {
      return res.status(500).json({ error: "Không nhận được âm thanh từ API" });
    }

    // Đảm bảo thư mục tạm tồn tại
    const tempDirectory = path.join(__dirname, "..", "temp");
    if (!fs.existsSync(tempDirectory)) {
      fs.mkdirSync(tempDirectory, { recursive: true });
    }

    const tempFilePath = path.join(tempDirectory, `${Date.now()}.mp3`);

    // Ghi stream âm thanh vào file tạm
    const writeStream = fs.createWriteStream(tempFilePath);
    audioStream.pipe(writeStream);

    writeStream.on("finish", async () => {
      try {
        // Upload âm thanh lên Cloudinary
        const audioUrl = await uploadAudioToCloudinary(tempFilePath);

        // Lưu cuộc trò chuyện vào cơ sở dữ liệu
        const conversation = await Conversations.create({
          userId,
          userMessage: text,
          aiResponse,
          audioUrl,
        });

        // Xóa file tạm sau khi upload thành công
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error("Failed to delete temporary file:", err);
          } else {
            console.log("Temporary file deleted successfully");
          }
        });

        res.status(200).json({
          success: true,
          audioUrl,
          message: "AI response converted to speech successfully",
          conversation,
        });
      } catch (error) {
        console.error("Error uploading to Cloudinary or creating conversation:", error);

        // Đảm bảo xóa file tạm trong trường hợp lỗi
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error("Failed to delete temporary file:", err);
          }
        });

        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });

    writeStream.on("error", (error) => {
      console.error("Error writing audio file:", error);
      res.status(500).json({
        success: false,
        message: "Error saving audio file.",
      });
    });
  } catch (error) {
    console.error("Error converting text to speech:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Hàm lấy tất cả cuộc trò chuyện của người dùng
async function getAllConversations(req, res) {
  try {
    const { userId } = req.query;  // Lấy userId từ query parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Lấy tất cả cuộc trò chuyện của người dùng từ cơ sở dữ liệu
    const conversations = await Conversations.findAll({
      where: { userId: userId },  // Lọc theo userId
      order: [['conversationCreationTime', 'ASC']],  // Sắp xếp theo thời gian tạo cuộc trò chuyện
      attributes: ['userMessage', 'aiResponse','audioUrl' ,'conversationCreationTime'],  // Chỉ lấy các trường cần thiết
    });

    // Kiểm tra nếu không có cuộc trò chuyện nào
    if (conversations.length === 0) {
      return res.status(404).json({ message: "No conversations found for this user." });
    }

    // Trả về tất cả cuộc trò chuyện đã lấy
    res.status(200).json({
      success: true,
      conversations,
      message: "All conversations fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching all conversations:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  createConversation,
  textToSpeech,
  createHintCourses,
  getAllConversations,
  AIHintCourses
};

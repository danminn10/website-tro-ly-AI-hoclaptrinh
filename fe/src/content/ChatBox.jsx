import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { fetchGetCourseRecommendations, fetchGetSourcesRecommendations1 } from "../services/AiSerivces";
import { fetchUpdateUser } from "../services/UserServices";
import { fetchGetAllConversations } from "../services/AiSerivces";
import { fetchUserById } from "../services/UserServices";
import { fetchTextToSpeech } from "../services/AiSerivces";
import { fetchCreatedConversation } from "../services/AiSerivces";

const fetchChatResponse = async (message) => {
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).userId : null;

  if (!userId) {
    throw new Error("User ID không tồn tại. Vui lòng đăng nhập lại.");
  }
  try {
    const response = await fetch("http://localhost:3000/conversations/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Chat API Error: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();

    if (data?.conversation?.aiResponse) {
      return data.conversation.aiResponse;
    } else {
      throw new Error("No AI response found in the conversation data.");
    }
  } catch (err) {
    console.error("Chat API Error:", err.message);
    return "Sorry, something went wrong. Please try again.";
  }
};

const fetchHintCourses = async (message) => {
  try {
    const response = await fetch(
      "http://localhost:3000/conversations/v1/hint-courses",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 8,
          message,
          score: 7,
          category: "Programming",
        }),
      }
    );
    if (!response.ok) throw new Error("Hint Courses API Error");
    const data = await response.json();
    return data?.recommendedCourses || [];
  } catch (err) {
    console.error("Hint Courses API Error:", err.message);
    return [];
  }
};

const Chatbox = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isFetchingCourses, setIsFetchingCourses] = useState(false);
  const messagesEndRef = useRef(null);
  const [showHints, setShowHints] = useState(false);
  const [quizzScore, setQuizzScore] = useState(0);
  const isFetched = useRef(false); // Tạo biến tham chiếu để kiểm tra
  const [hints, setHints] = useState([
    "Lộ trình học nâng cao",
    "Thông tin khóa học",
    "Dự án thực tế",
  ]);
  const [category, setCategory] = useState(null); // State cho category
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userId = storedUser?.userId;
  const [userId1, setUserId] = useState(null);

  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const storedUser1 = JSON.parse(localStorage.getItem("user"));
    if (storedUser1) {
      setUserId(storedUser.userId);
    }
  }, []); // Chạy một lần khi component mount
  const hasCompletedTest = storedUser?.hasCompletedTest;
  const handleInputChange = (e) => setInput(e.target.value);

  const sendMessage = useCallback(async () => {
    if (input.trim() === "" || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

    let aiResponse = "";
    let courses = [];
    setIsAIProcessing(true);

    if (/course|recommend/gi.test(userMessage)) {
      setIsFetchingCourses(true);
      courses = await fetchHintCourses(userMessage);
      aiResponse = courses.length
        ? "Here are some recommended courses for you:"
        : "No courses found.";
      setIsFetchingCourses(false);
    } else {
      aiResponse = await fetchChatResponse(userMessage);
    }

    setIsAIProcessing(false);
    setMessages((prev) => [
      ...prev,
      { text: aiResponse, sender: "ai" },
      ...courses.map((course) => ({
        text: `Course: ${course.title} - ${course.description}`,
        sender: "ai",
      })),
    ]);
    setLoading(false);
  }, [input, loading]);

  // hàm trả về gợi ý  khi người dùng chọn một gợi ý
  const sendMessageHint = useCallback(async (input, categoryInput) => {
    if (input.trim() === "" || loading) return;
  
    const userMessage = input;
    const category = categoryInput;
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
  
    let aiResponse = "";
    setIsAIProcessing(true);
  
    try {
      const response = await fetchGetCourseRecommendations(userId, userMessage, category);
  
      // Kiểm tra nếu có dữ liệu hợp lệ từ backend
      if (response && response.success && response.aiResponse) {
        const { recommendedCourses, recommentProgress } = response.aiResponse;
  
        // Cập nhật phản hồi AI
        aiResponse = response.message || "I couldn't find additional info.";
  
        // Thêm các khóa học vào phần trả lời của AI
        const courseMessages = recommendedCourses.map((course, index) => ({
          text: `Course: ${course.title}\nDescription: ${course.description}\nLevel: ${course.level} - Price: ${course.price}`,
          sender: "ai",
          key: `course-${index}`,
        }));
  
        // Thêm kế hoạch học tập vào phần trả lời của AI
        const progressMessage = {
          text: `${recommentProgress}`,
          sender: "ai",
        };
  
        setMessages((prev) => [
          ...prev,
          { text: aiResponse, sender: "ai" },
          ...courseMessages,
          progressMessage,
        ]);
      } else {
        aiResponse = "Sorry, I couldn't get a response. Please try again later.";
        setMessages((prev) => [
          ...prev,
          { text: aiResponse, sender: "ai" },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      aiResponse = "An error occurred. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { text: aiResponse, sender: "ai" },
      ]);
    } finally {
      setIsAIProcessing(false);
      setLoading(false);
    }
  }, [input, loading, userId]); // Add userId as a dependency if it's changing over time

  const textToSpeechClick = async () => {
    if (!userId) {
      console.error("User ID is required to fetch text-to-speech.");
      return;
    }

    if (!input.trim()) {
      console.error("No text provided for text-to-speech.");
      return;
    }
  
    // Cập nhật tin nhắn người dùng vào khung chat
    setMessages((prev) => [
      ...prev,
      { text: input, sender: "user" },
    ]);
    // Xóa nội dung trong input
    setInput("");

    try {
      const response = await fetchTextToSpeech(input, userId);
      if (response?.audioUrl) {
        // Thêm audioUrl vào tin nhắn mới
      setMessages((prev) => [
        ...prev,
        { text: "Here is the audio for the response:", sender: "ai", audioUrl: response.audioUrl },
      ]);
      } else {
        console.error("Audio URL not found in response.");
      }
    } catch (error) {
      console.error("Error fetching text-to-speech:", error.message);
    }
  };
  
  //recommend for newbie
  const fetchRecommendationsIfNeeded = useCallback(async () => {
    if (isFetched.current || hasCompletedTest || !userId) return; // Kiểm tra trước khi gọi hàm
      isFetched.current = true;
      try {
        const userData = await fetchUserById(userId);
        const userQuizzScore = userData.quizzScore || 0;
        console.log("userQuizzScore", userQuizzScore);

        setQuizzScore(userQuizzScore);
        const response = await fetchGetSourcesRecommendations1(
          userId,
          "recommend courses",
          "Programming",
          userQuizzScore || 0
        );

        const { message, aiResponse } = response;
        setMessages((prev) => [
          ...prev,
          { text: message, sender: "ai" },
          { text: aiResponse.recommentProgress, sender: "ai" },
        ]);

        await fetchUpdateUser(userId, { hasCompletedTest: true, quizzScore: userQuizzScore });
        console.log("User hasCompletedTest updated successfully");
      } catch (error) {
        console.error(
          "Error fetching recommendations or updating user:",
          error.message
        );
      }
  }, [userId, hasCompletedTest]);
  useEffect(() => {
    fetchRecommendationsIfNeeded();
  }, [fetchRecommendationsIfNeeded]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

   // Load lịch sử cuộc trò chuyện khi component mount
  // Hàm load dữ liệu cuộc trò chuyện từ API
  const loadConversations = async () => {
    if (!userId) {
      console.log("User ID is missing.");
      return;
    }
  
    try {
      const conversationData = await fetchGetAllConversations(userId1);
      console.log("Conversation Data:", conversationData);
  
      const parsedData = typeof conversationData === "string" ? JSON.parse(conversationData) : conversationData;
      console.log("Parsed Data:", parsedData);
  
      const conversationHistory = parsedData?.conversations || [];
      console.log("Conversation History:", conversationHistory);
      const historicalMessages = conversationHistory.flatMap((conversation) => {
        // Tin nhắn của người dùng
        const userMessage = {
          text: conversation.userMessage,
          sender: "user",
          timestamp: conversation.conversationCreationTime,
        };
  
        // Tin nhắn phản hồi AI (gộp luôn audioUrl nếu có)
        const aiMessage = conversation.audioUrl
        ? {
            text: null, // Không cần hiển thị văn bản nếu có audio
            sender: "ai",
            timestamp: conversation.conversationCreationTime,
            audioUrl: conversation.audioUrl,
          }
        : {
            text: conversation.aiResponse || "No AI response found.",
            sender: "ai",
            timestamp: conversation.conversationCreationTime,
            audioUrl: null,
          };

        console.log("Ai Message:", aiMessage);
  
        return [userMessage, aiMessage];
      });
  
      setMessages((prev) => [...prev, ...historicalMessages]);
      console.log("Previous conversations loaded successfully:", historicalMessages);
    } catch (error) {
      console.error("Error loading conversations:", error.message || error);
      setMessages([]); // Reset lại nếu có lỗi
    }
  };

  useEffect(() => {
    // Kiểm tra userId trước khi gọi API
    if (userId1) {
      loadConversations(); // Gọi loadConversations khi có userId hợp lệ
    }
  }, [userId1]); // Chạy lại khi userId thay đổi
 
  const messageStyles = useMemo(
    () => ({
      user: `p-2 rounded-lg ${
        darkMode ? "bg-indigo-500 text-white" : "bg-indigo-700 text-white"
      } ml-auto mr-2 w-fit max-w-full`,
      ai: `p-3 rounded-lg ${
        darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
      } ml-4 mr-2 max-w-[70%] w-full break-words text-sm leading-relaxed indent-4`, // Thêm indent cho phản hồi AI
    }),
    [darkMode]
  );
  
  const messageStylesAI = useMemo(
    () => ({
      user: `p-3 rounded-lg ${
        darkMode ? "bg-indigo-500 text-white" : "bg-indigo-700 text-white"
      } ml-auto mr-4 max-w-[70%]`,
      ai: `p-3 rounded-lg ${
        darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
      } ml-4 mr-4 max-w-[70%] w-full break-words text-sm leading-relaxed indent-4`, // Thêm indent cho phản hồi AI
    }),
    [darkMode]
  );
  
  // Toggle hàm để hiển thị hoặc ẩn các gợi ý
  const toggleHints = () => {
    setShowHints((prevShowHints) => !prevShowHints);
  };

  const handleHintClick = async (hint) => {
    setShowHints(false);  // Ẩn gợi ý khi click vào
  
    let message = '';
    
    // Xử lý thông điệp gửi cho AI tùy theo lựa chọn của người dùng
    if (hint === "Lộ trình học nâng cao") {
      
      message = `Tôi đã có kiến thức cơ bản về ${category} và mong muốn AI đưa ra một lộ trình học phù hợp cho người đã có kiến thức cơ bản về lập trình ${category}. Lộ trình này cần bao gồm các bước học nâng cao, các chủ đề chuyên sâu và các dự án thực tế giúp tôi phát triển kỹ năng lập trình ${category} từ mức cơ bản lên mức nâng cao.`;
      await sendMessageHint(message, category);
    } else if (hint === "Thông tin khóa học") {
      // message = `Xin vui lòng cung cấp thông tin chi tiết về khóa học ${category}. Tôi muốn biết về các nội dung học, mức độ khó, thời gian học, các bài tập thực hành, và các kỹ năng tôi sẽ học được khi tham gia khóa học này. Ngoài ra, nếu có các khóa học phù hợp với cấp độ người mới bắt đầu hoặc nâng cao trong ${category}, xin vui lòng liệt kê các khóa học đó.`;
      if (category === "Python") {
        message = `Python: Khóa học cơ bản này tập trung vào các khái niệm nền tảng như biến, kiểu dữ liệu, cấu trúc điều khiển, và các hàm. Học viên sẽ học cách sử dụng Python để giải quyết các bài toán đơn giản.`;
      } else if (category === "Java") {
        message = `Java: Khóa học cơ bản về Java bao gồm lập trình hướng đối tượng, làm quen với cú pháp Java, và xây dựng các chương trình đơn giản như máy tính hoặc quản lý danh sách.`;
      } else if (category === "JavaScript") {
        message = `JavaScript: Khóa học này hướng dẫn về các khái niệm cơ bản như biến, hàm, vòng lặp,.. và cách sử dụng JavaScript để thao tác DOM trên trình duyệt.`;
      } else {
        message = `Xin lỗi, ban chưa chọn khoa học nào. Vui lòng chọn một khoa học để xem thông tin chi tiết.`;
      }
      
      if (category != "") await fetchCreatedConversation(userId, `Thông tin khoá học ${category}`, message);
      else console.log("Category is empty");
      setMessages((prev) => [...prev, { text: message, sender: "ai" }]);
    } else if (hint === "Dự án thực tế") {
      message = `Tôi đã hoàn thành khóa học về ${category}, và bây giờ tôi muốn biết những dự án thực tế nào tôi nên thực hiện để củng cố và nâng cao kiến thức đã học. Tôi muốn những dự án này giúp tôi áp dụng lý thuyết vào thực tế, giải quyết các vấn đề cụ thể, và phát triển kỹ năng lập trình của mình trong ${category}. Nếu có những dự án nâng cao, xin vui lòng liệt kê các dự án đó và mức độ khó của mỗi dự án.`;
      await sendMessageHint(message, category);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory); // Lưu lại category người dùng chọn
  };

  return (
    <div
    className={`w-[600px] h-[700px] ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
  >
    <div
      className={`p-4 ${darkMode ? "bg-gray-700 text-white" : "bg-indigo-500 text-white"}`}
    >
        Chat with CodeAI
      </div>
      <div className=" p-4 h-[500px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 p-3 rounded-lg ${
              msg.sender === "user" ? messageStyles.user : messageStylesAI.ai
            }`}
          >
            
            {/* Hiển thị audio nếu audioUrl tồn tại */}
            {msg.audioUrl ? (
              <audio controls src={msg.audioUrl} className="mt-2 w-full">
                Your browser does not support the audio element.
              </audio>
            ) : msg.text }
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-4 border-t relative">
        {/* Gợi ý (hints) */}
        
        {/* Icon Hint Bóng Đèn (Font Awesome) */}
        <button
          onClick={() => toggleHints()} // Toggle gợi ý khi click vào bóng đèn
          className={`ml-2 mr-2 p-3 rounded-full ${
            loading ? "bg-gray-400" : "bg-indigo-500 text-white"
          } transition`}
          disabled={loading}
        >
          <i className="fas fa-lightbulb text-xl" /> {/* FontAwesome icon */}
        </button>
        {/* Chọn category */}
        <select onChange={(e) => handleCategorySelect(e.target.value)} value={category || ""} className="mr-2 p-2 rounded">
          <option value="">Select Category</option>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Java">Java</option>
        </select>
          {showHints && (
            <div className="absolute left-[-180px] top-[-10px] bg-gray-100 p-4 rounded-lg shadow-md w-[180px]">
              <ul className="space-y-2">
                {hints.map((hint, idx) => (
                  <li
                    key={idx}
                    className="text-indigo-500 cursor-pointer hover:text-indigo-700"
                    onClick={() => handleHintClick(hint)}
                  >
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Input Message */}
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className={`flex-1 p-3 rounded-lg ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
          }`}
          placeholder={loading ? "Please wait..." : "Type a message..."}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className={`ml-2 p-3 rounded-full ${
            loading ? "bg-gray-400" : "bg-indigo-500 text-white"
          } transition`}
          disabled={loading}
        >
          {loading ? "..." : "➡️"}
        </button>

        <button
          onClick={textToSpeechClick}
          className={`ml-2 p-3 rounded-full ${
            loading ? "bg-gray-400" : "bg-indigo-500 text-white"
          } transition`}
          disabled={loading}
        >
          {loading ? "..." : "🔊"}
        </button>
      </div>
      {(isAIProcessing || isFetchingCourses) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-center">
          {isAIProcessing && !isFetchingCourses && "AI is thinking..."}
          {isFetchingCourses && "Fetching course recommendations..."}
        </div>
      )}
    </div>
  );
};

Chatbox.propTypes = { darkMode: PropTypes.bool.isRequired };
export default React.memo(Chatbox);
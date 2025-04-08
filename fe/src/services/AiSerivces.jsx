import apiService from "../api/apiService";

export const fetchGetSourcesRecommendations1 = async (
  userId,
  message,
  category,
  score
) => {
  try {
    const response = await apiService.post("/conversations/v1/hint-courses", {
      userId,
      message,
      category,
      score,
    });

    return response;
  } catch (error) {
    console.error("Error fetching course recommendations:", error.message);
    throw error;
  }
};
export const fetchChatResponse = async (userId, message) => {
  try {
    const response = await apiService.post("/conversations/chat", {
      userId,
      message,
    });

    return response;
  } catch (error) {
    console.error("Error fetching chat response:", error.message);
    throw error;
  }
}
export const fetchGetCourseRecommendations = async (userId, message, category) => {
  try {
    const response = await apiService.post("/conversations/v1/ai-hint-courses", {
      userId,
      message,
      category,
    });
    // Log phản hồi từ server để kiểm tra
    console.log("API Response: ", response);
    return response;

  } catch (error) {
    console.error("Error fetching course recommendations:", error.message);
    throw error;
  }
};

export const fetchGetAllConversations = async (userId) => {
  try {
    const response = await apiService.get('/conversations', {
      params: {
        userId: userId
      }
    });
    return response;
  } catch (error) {
    console.error("Error fetching all conversations:", error.message);
    throw error;
  }
};

export const fetchTextToSpeech = async (text, userId) => {
  try {
    const response = await apiService.post('/conversations/v1/text-to-speech', {
      text: text,
      userId: userId
    });
    console.log("Text-to-speech response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching text to speech:", error.message);
    throw error;
  }
}

export const fetchCreatedConversation = async (userId, message, aiResponse) => {
  try {
    const response = await apiService.post('/conversations/conversation-hint-courses',{
      userId: userId,
      message: message,
      aiResponse: aiResponse
    });
    console.log("Created conversation response:", response);
    return response;
  } catch (error) {
    console.error("Error creating conversation:", error.message);
    throw error;
  }
}






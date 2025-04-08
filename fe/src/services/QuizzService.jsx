import apiService from "../api/apiService";

export const fetchGetQuizzById = async (id) => {
  try {
    const response = await apiService.get(`/quizzes/${id}`);

    return response;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export const fetchGetAllQuizzes = async () => {
  try {
    const response = await fetch('API_ENDPOINT_HERE');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

export const fetchUpdateQuizz = async (id, quizzScore, userId, feedbacks) => {
  try {
    const response = await apiService.put(`quizzes/${id}`, {
      quizzScore,
      userId,
      feedbacks,
    });

    console.log("Quizz updated successfully:", response);
    return response;
  } catch (error) {
    console.error(
      "Error updating quizz:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const fetchGetQuizzByTitle = async (title) => {
  try {
    const response = await apiService.get(`/quizzes/search`, {
      params: { title }, // Send title as query string
    });

    console.log("Quizzes fetched successfully:", response);
    return response; // Return the list of quizzes
  } catch (error) {
    console.error("Error fetching quizzes by title:", error.response || error.message);
    throw error; // Throw error to be handled at a higher level
  }
};

export const fetchGetQuizzesByCourseId = async (courseId) => {
  try {
    const response = await apiService.get(`/quizzes/course/${courseId}`);
    return response;
  } catch (error) {
    console.error("Error fetching quizzes by courseId:", error);
    throw error;
  }
};

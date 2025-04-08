import apiService from "../api/apiService";

export const fetchGetAllVideo = async () => {
    try {
      const response = await apiService.get("/videos");

      return response;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };

  export const fetchVideoById = async (videoId) => {
    try {
      const response = await apiService.get(`/videos/${videoId}`);
      return response;
    } catch (error) {
      console.error("Error fetching video by ID:", error);
      return null;
    }
  };
export const fetchVideosByCategory = async (category) => {
    try {
      const response = await apiService.get(`/videos/category/${category}`);
      return response;
    }
    catch (error) {
        console.log("error", error);
        return null;
    }
}
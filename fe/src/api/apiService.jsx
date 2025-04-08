import axios from "axios";
import { BASE_URL } from "./config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Start Request", request);
    return request;
  },
  (error) => {
    console.log("REQUEST ERROR", { error });
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    console.log("Response", response);
    return response.data;
  },
  (error) => {
    console.log("RESPONSE ERROR", { error });

    if (error.response) {
      if (error.response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      const message =
        error.response?.data?.errors?.message ||
        error.response?.data?.message ||
        "Unknown Error";
      return Promise.reject({ message });
    }

    return Promise.reject({ message: "Network Error" });
  }
);

export default apiService;

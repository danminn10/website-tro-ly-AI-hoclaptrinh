import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import Chatbox from "../content/ChatBox";
import LeftSidebar from "../content/LeftSidebar";
import RightSidebar from "../content/RightSidebar";
import { useAuth } from "../context/AuthContext";
import { VideoContext } from "../context/VideoContext";
import { fetchVideoById } from "../services/VideoService";
import { useQuizContext } from "../context/QuizContext";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarRightVisible, setSidebarRightVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isChatboxUp, setIsChatboxUp] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { signout } = useAuth();
  const { videoId, setVideoId, quizScore, setQuizScore } = useContext(VideoContext);
  const { selectQuiz, setSelectQuiz } = useQuizContext();

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const loadVideo = async (id) => {
      try {
        const videoData = await fetchVideoById(id);
        if (videoData) {
          setCurrentVideo(videoData);
          setIsChatboxUp(true);
          setVideoId(id);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    // Kiểm tra nếu có state từ trang test hoặc videoId từ context
    const videoToLoad = location.state?.fromVideo || videoId;
    if (videoToLoad) {
      loadVideo(videoToLoad);
    }
  }, [location.state, videoId, setVideoId]);

  const handleQuizSubmit = (score) => {
    setQuizScore(score);
    setSelectQuiz(null);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.body.classList.toggle("dark", newDarkMode);
  };

  const toggleSidebar = (side) => {
    if (side === "left") setSidebarVisible((prev) => !prev);
    else setSidebarRightVisible((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleMenuItemClick = (action) => {
    if (action === "settings") {
      console.log("Settings clicked");
    } else if (action === "logout") {
      signout();
      navigate("/");
    }
    setIsUserMenuOpen(false);
  };

  const toggleChatboxPosition = () => {
    setIsChatboxUp((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && !e.target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${darkMode ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
      <LeftSidebar sidebarVisible={sidebarVisible} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? "ml-64" : "ml-0"} ${sidebarRightVisible ? "mr-64" : "mr-0"}`}>
        <nav className="fixed top-0 left-0 w-full bg-slate-800 text-white shadow-md z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSidebar("left")}
                className="p-2 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600"
              >
                <i className="fas fa-bars"></i>
              </button>
              <button
                onClick={() => navigate("/home")}
                className="p-2 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600"
              >
                <i className="fas fa-home"></i>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
              <h1 className="text-2xl font-bold">CodeAI</h1>
            </div>
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600"
              >
                {darkMode ? "🌙" : "🌞"}
              </button>
              <div className="flex items-center space-x-2 user-menu">
                <button
                  onClick={toggleUserMenu}
                  className="p-2 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600"
                >
                  <i className="fas fa-user-circle text-2xl"></i>
                </button>
                {user && (
                  <span className="text-lg font-semibold">
                    {user.fullname || user.username || "Guest"}
                  </span>
                )}
              </div>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <ul className="py-2">
                    <li
                      onClick={() => handleMenuItemClick("settings")}
                      className="px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white cursor-pointer"
                    >
                      Settings
                    </li>
                    <li
                      onClick={() => handleMenuItemClick("logout")}
                      className="px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="pt-24 flex flex-col items-center transition-all duration-500">
          {currentVideo ? (
            <div className="flex flex-col items-center justify-center w-full h-full text-center space-y-4">
              <h2 className="text-3xl font-bold">{currentVideo.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{currentVideo.description}</p>
              <div className="relative w-full max-w-4xl aspect-video rounded-lg shadow-2xl overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={currentVideo.url}
                  title={currentVideo.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a video to view</p>
          )}
          
          <div
            className={`pt-24 flex justify-center items-center transition-all duration-500 ${
              isChatboxUp ? "translate-y-[-1800px]" : "translate-y-0"
            }`}
            style={{ zIndex: 1 }}
          >
            <Chatbox darkMode={darkMode} />
          </div>
        </div>
      </div>

      <RightSidebar sidebarRightVisible={sidebarRightVisible} />
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChatboxPosition}
          className="p-3 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600"
        >
          {isChatboxUp ? "⬇️" : "⬆️"}
        </button>
      </div>
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onClick={() => toggleSidebar("right")}
          className="p-3 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600"
        >
          <i className="fas fa-angle-left"></i>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
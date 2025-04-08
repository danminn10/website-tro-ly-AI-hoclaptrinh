import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VideoContext } from "../context/VideoContext";
import { useQuizContext } from "../context/QuizContext";
import axios from "axios";

const LeftSidebar = ({ sidebarVisible }) => {
  const [categories] = useState(["JavaScript", "Java", "Python"]);
  const [coursesByCategory, setCoursesByCategory] = useState({});
  const [videosByCategory, setVideosByCategory] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [openLevels, setOpenLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { setSelectQuiz } = useQuizContext();
  const { videoId, setVideoId } = useContext(VideoContext);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoryData = {};
        const videoData = {};

        for (const category of categories) {
          try {
            // Fetch courses
            const coursesResponse = await axios.get(
              `${API_BASE_URL}/courses/search?category=${category}`
            );
            
            const courses = coursesResponse.data;
            if (!Array.isArray(courses)) {
              console.warn(`Invalid courses data for ${category}`);
              continue;
            }

            categoryData[category] = courses;
            videoData[category] = {};

            // Fetch videos for each course
            for (const course of courses) {
              try {
                const videosResponse = await axios.get(
                  `${API_BASE_URL}/videos?courseId=${course.coursesId}`
                );
                
                const videos = videosResponse.data;
                videoData[category][course.level] = Array.isArray(videos) ? videos : [];
              } catch (err) {
                console.error(`Error fetching videos for course ${course.coursesId}:`, err);
              }
            }
          } catch (err) {
            console.error(`Error processing category ${category}:`, err);
          }
        }

        setCoursesByCategory(categoryData);
        setVideosByCategory(videoData);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categories]);

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleCourse = (category, level) => {
    setOpenLevels((prev) => ({
      ...prev,
      [`${category}-${level}`]: !prev[`${category}-${level}`],
    }));
  };

  const getVideosForCourse = (category, level) => {
    const videos = videosByCategory[category]?.[level] || [];
    return videos.map((video) => ({
      ...video,
      isLocked: false
    }));
  };

  const handleVideoClick = async (video) => {
    try {
      // Update video completion status
      const response = await axios.put(
        `${API_BASE_URL}/videos/${video.videoId}`,
        { isCompleted: true }
      );

      if (response.status === 200) {
        const updatedVideo = response.data;

        // Update local state
        setVideosByCategory((prev) => {
          const updated = { ...prev };
          for (const category in updated) {
            for (const level in updated[category]) {
              updated[category][level] = updated[category][level].map((v) =>
                v.videoId === updatedVideo.videoId ? { ...v, isCompleted: true } : v
              );
            }
          }
          return updated;
        });

        setVideoId(video.videoId);
        setSelectedVideo(video);

        // Special handling for video with ID 3
        if (video.videoId == 3) {
          navigate("/test", { 
            state: { 
              fromVideo: video.videoId,
              videoData: video,
              category: video.category,
              level: video.level,
              courseTitle: video.courseTitle,
              videoTitle: video.title
            } 
          });
        } else {
          // For other videos, stay on home page
          navigate("/home", { 
            state: { 
              videoId: video.videoId,
              category: video.category,
              level: video.level 
            }
          });
        }
      }
    } catch (error) {
      console.error("Error updating video completion:", error);
      alert("Failed to select video. Please try again.");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-indigo-600 transition-transform duration-300 ${
        sidebarVisible ? "translate-x-0" : "-translate-x-full"
      } z-40 overflow-y-auto`}
    >
      <h2 className="text-white text-lg font-bold p-4">All Course Categories</h2>

      {loading ? (
        <div className="text-white p-4">Loading courses...</div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : (
        <ul className="space-y-4 p-4">
          {categories.map((category) => (
            <li key={category} className="bg-indigo-800 text-white p-3 rounded-md">
              <div
                onClick={() => toggleCategory(category)}
                className="cursor-pointer flex justify-between items-center"
              >
                <span className="font-medium">{category}</span>
                <span className={`transition-transform ${openCategories[category] ? "rotate-90" : ""}`}>
                  ›
                </span>
              </div>

              {openCategories[category] && (
                <ul className="mt-2 space-y-2 pl-4">
                  {coursesByCategory[category]?.map((course) => (
                    <li key={course.coursesId} className="bg-indigo-700 p-2 rounded-md">
                      <div
                        onClick={() => toggleCourse(category, course.level)}
                        className="cursor-pointer flex justify-between items-center"
                      >
                        <span className="whitespace-normal break-words">
                          {course.title} <span className="text-sm opacity-80">(Level {course.level})</span>
                        </span>
                        <span className={`transition-transform ${openLevels[`${category}-${course.level}`] ? "rotate-90" : ""}`}>
                          ›
                        </span>
                      </div>

                      {openLevels[`${category}-${course.level}`] && (
                        <ul className="mt-2 space-y-2 pl-4">
                          {getVideosForCourse(category, course.level).map((video, index) => (
                            <li
                              key={video.videoId}
                              className={`p-2 rounded-md text-sm flex items-center ${
                                videoId === video.videoId 
                                  ? "bg-indigo-500 font-bold" 
                                  : "bg-indigo-600 hover:bg-indigo-500"
                              } cursor-pointer`}
                              onClick={() => handleVideoClick(video)}
                            >
                              <span className="whitespace-normal break-words flex-1">
                                {index + 1}. {video.title}
                              </span>
                              {video.isCompleted && (
                                <span className="ml-2 text-green-400"></span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default LeftSidebar;
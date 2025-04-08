import { useContext, useEffect, useState } from "react";
import { VideoContext } from "../context/VideoContext";

const RightSidebar = ({ sidebarRightVisible }) => {
  const { videoId, setVideoId } = useContext(VideoContext); // Lấy videoId từ context
  const [videoData, setVideoData] = useState(null); // Dữ liệu video (title và description)

  // Lấy thông tin video dựa trên videoId
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) {
        setVideoData({ title: "Choose Your Course", description: "" });
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/courses/all");
        const data = await response.json();

        console.log("data", data.videos);

        const foundVideo = data
          .flatMap((course) => course.videos)
          .find((video) => video.videoId === videoId);

        if (foundVideo) {
          setVideoData({
            title: foundVideo.title,
            description: foundVideo.description,
          });
          setVideoId(foundVideo.videoId);
          console.log("setVideoId", setVideoId);
        } else {
          setVideoData({ title: "Video not found", description: "" });
        }
      } catch (err) {
        console.error("Error fetching video data:", err);
        setVideoData({ title: "Error loading video", description: "" });
      }
    };
    fetchVideoData();
  }, [videoId, setVideoId]);
  const handleTitleClick = (videoId) => {
    setVideoId(videoId);
    console.log("Selected Video ID:", videoId);
  };
  return (
    <div
      className={`fixed top-20 right-0 text-center h-full bg-gradient-to-b from-indigo-600 to-indigo-500 transition-transform duration-300 ${
        sidebarRightVisible ? "translate-x-0" : "translate-x-full"
      } z-40 shadow-lg`}
      style={{ width: 320 }}
    >
      {/* Tiêu đề Sidebar */}
      <div className="bg-indigo-700 text-white text-2xl font-bold py-4 shadow-md">
        Course Detail
      </div>

      {/* Nội dung Sidebar */}
      <div className="h-[calc(100%-4rem)] flex flex-col items-center justify-start px-4 py-2 space-y-4">
        <p
          className={`text-white text-lg font-medium text-center ${
            videoData?.title === "Choose Your Course" ||
            videoData?.title === "Video not found"
              ? "text-gray-300"
              : ""
          }`}
          onClick={() => handleTitleClick()}
        >
          {videoData?.title}
        </p>
        {videoData?.description && (
          <p className="text-white text-sm font-light text-center">
            {videoData.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
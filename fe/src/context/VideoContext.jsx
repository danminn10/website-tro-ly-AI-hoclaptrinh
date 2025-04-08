import React, { createContext, useState } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videoId, setVideoId] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  return (
    <VideoContext.Provider
      value={{
        videoId,
        setVideoId,
        quizScore,
        setQuizScore,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
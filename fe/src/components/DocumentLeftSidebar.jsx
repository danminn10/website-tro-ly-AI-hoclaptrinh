import React from "react";

const DocumentLeftSidebar = ({ onItemClick }) => (
  <div className="fixed top-0 left-0 h-full w-64 bg-indigo-600 text-white shadow-lg z-40 overflow-y-auto">
    {/* Sidebar Title */}
    <h2 className="text-2xl font-bold p-4 bg-indigo-700 text-center">
      AI Concepts
    </h2>

    {/* Sidebar List Items */}
    <ul className="space-y-2 p-4">
      <li
        className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer border-b border-white truncate"
        onClick={() => onItemClick("introduction")}
      >
        Introduction to AI
      </li>
      <li
        className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer border-b border-white truncate"
        onClick={() => onItemClick("promptTips")}
      >
        Một số lưu ý khi viết prompt
      </li>
      <li
        className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer border-b border-white truncate"
        onClick={() => onItemClick("courseInfo")}
      >
        Yêu cầu thông tin về khóa học
      </li>
      <li
        className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer border-b border-white truncate"
        onClick={() => onItemClick("projectSuggestion")}
      >
        Yêu cầu gợi ý dự án
      </li>
      <li
        className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer border-b border-white truncate"
        onClick={() => onItemClick("studyPlan")}
      >
        Yêu cầu kế hoạch học tập và hướng dẫn chi tiết
      </li>
    </ul>
  </div>
);

export default DocumentLeftSidebar;

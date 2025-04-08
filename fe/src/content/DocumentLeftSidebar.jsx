import React from "react";

const DocumentLeftSidebar = () => (
  <div className="fixed top-0 left-0 h-full w-64 bg-indigo-600 text-white shadow-lg z-40 overflow-y-auto">
    {/* Sidebar Title */}
    <h2 className="text-2xl font-bold p-4 bg-indigo-700 text-center">
      AI Concepts
    </h2>

    {/* Sidebar List Items */}
    <ul className="space-y-2 p-4">
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Introduction to AI
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        AI Fundamentals
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Machine Learning Basics
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Deep Learning Concepts
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Neural Networks
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Natural Language Processing (NLP)
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Computer Vision
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        AI Tools and Frameworks
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Generative AI
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Chatbots and Virtual Assistants
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        Ethical AI Usage
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        AI in Healthcare
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        AI in Finance
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        AI in Manufacturing
      </li>
      <li className="hover:bg-indigo-700 rounded-md p-2 cursor-pointer">
        AI in Content Creation
      </li>
    </ul>
  </div>
);

export default DocumentLeftSidebar;

// src/content/DocumentRightSidebar.js
import React from "react";

const DocumentRightSidebar = ({ sidebarRightVisible }) => (
  <div
    className={`fixed top-0 right-0 h-full w-64 bg-indigo-600 transition-transform duration-300 ${
      sidebarRightVisible ? "translate-x-0" : "translate-x-full"
    } z-40`}
  >
    
  </div>
);

export default DocumentRightSidebar;

import { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import DocumentLeftSidebar from "../components/DocumentLeftSidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Note from "../prompt/Note";
import IntroductionAI from "../prompt/IntroductionAI";
import RequiredInforAboutCourse from "../prompt/RequiredInforAboutCourse";
import RequiredProjectSuggest from "../prompt/RequiredProjectSuggest";
import RequiredPlanStudy from "../prompt/RequiredPlanStudy";


const DocumentPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("introduction");
  const navigate = useNavigate();
  const { signout } = useAuth();

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark", !darkMode);
  };

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleSidebarItemClick = (page) => {
    setActivePage(page);
    setSidebarVisible(false); // Ẩn sidebar khi chọn mục
  };

  const handleMenuItemClick = (action) => {
    if (action === "settings") {
      navigate("/me/setting");
    } else if (action === "logout") {
      signout();
      navigate("/login");
    }
    setIsUserMenuOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex transition-all duration-300 ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Document Left Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-indigo-600 text-white shadow-lg transform transition-transform duration-300 ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DocumentLeftSidebar onItemClick={handleSidebarItemClick} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full bg-slate-800 text-white shadow-md z-50">
          <div className="flex items-center justify-between p-4">
            {/* Left Section */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600"
                aria-label="Toggle left sidebar"
              >
                <i className="fas fa-bars"></i>
              </button>
              <button
                onClick={() => navigate("/home")}
                className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600"
                aria-label="Home"
              >
                <i className="fas fa-home"></i>
              </button>
            </div>

            {/* Center Section */}
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
              <h1 className="text-2xl font-bold">Document Page</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600"
                aria-label="Toggle dark mode"
              >
                {darkMode ? "🌙" : "🌞"}
              </button>
              {/* User Menu */}
              <div className="flex items-center space-x-2 user-menu">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600"
                  aria-label="User profile"
                >
                  <i className="fas fa-user-circle text-2xl"></i>
                </button>
              </div>
              {/* Dropdown Menu */}
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

        {/* Main Content */}
        <div className="pt-20 px-4">
          {activePage === "introduction" && (
            <IntroductionAI darkMode={darkMode} />
          )}
          {activePage === "promptTips" && <Note darkMode={darkMode} />}
          {activePage === "courseInfo" && (
            <RequiredInforAboutCourse darkMode={darkMode} />
          )}
          {activePage === "projectSuggestion" && (
            <RequiredProjectSuggest darkMode={darkMode} />
          )}
          {activePage === "studyPlan" && (
            <RequiredPlanStudy darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;

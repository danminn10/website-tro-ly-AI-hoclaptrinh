import { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import DocumentLeftSidebar from "../content/DocumentLeftSidebar";
import DocumentRightSidebar from "../content/DocumentRightSidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DocumentPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarRightVisible, setSidebarRightVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const navigate = useNavigate();
  const { signout } = useAuth();

  // Load dark mode and user data on initial render
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
      navigate("/login"); // Redirect to login if no user is found
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
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
      <DocumentLeftSidebar sidebarVisible={sidebarVisible} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarVisible ? "ml-64" : "ml-0"
        } ${sidebarRightVisible ? "mr-64" : "mr-0"}`}
      >
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full bg-slate-800 text-white shadow-md z-50">
          <div className="flex items-center justify-between p-4">
            {/* Left Section */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSidebar("left")}
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
              <button
                onClick={() => navigate("/document")}
                className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600"
                aria-label="Book"
              >
                <i className="fas fa-book"></i>
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

              {/* User Profile */}
              <div className="flex items-center space-x-2 user-menu">
                <button
                  onClick={toggleUserMenu}
                  className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600"
                  aria-label="User profile"
                >
                  <i className="fas fa-user-circle text-2xl"></i>
                </button>
                {user && (
                  <span className="text-lg font-semibold">
                    {user.fullname || user.username || "Guest"}
                  </span>
                )}
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
      </div>

      {/* Document Right Sidebar */}
      <DocumentRightSidebar sidebarRightVisible={sidebarRightVisible} />
    </div>
  );
};

export default DocumentPage;

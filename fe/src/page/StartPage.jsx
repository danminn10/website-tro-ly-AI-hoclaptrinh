import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(100);
  const navigate = useNavigate();

  const languages = ["Java", "Python", "JavaScript"];

  useEffect(() => {
    if (isReady && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
        setProgress((prev) => prev - 33.33);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      navigate("/test");
    }
  }, [isReady, countdown, navigate]);

  const handleLanguageSelection = (language) => {
    setSelectedLanguage(language);
  };

  const handleReadyClick = () => {
    setIsReady(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Choose Language</h2>
        <div className="mb-6">
          {languages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageSelection(language)}
              className={`w-full px-4 py-2 border rounded-lg text-lg transition ${
                selectedLanguage === language
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-blue-100"
              }`}
              disabled={isReady}
            >
              {language}
            </button>
          ))}
        </div>
        {selectedLanguage && !isReady && (
          <button
            onClick={handleReadyClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Ready
          </button>
        )}
        {isReady && (
          <div className="text-center">
            <p>Countdown: {countdown}s</p>
            <div className="w-full h-4 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;

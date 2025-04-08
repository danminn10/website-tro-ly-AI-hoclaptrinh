import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchGetQuizzByTitle } from "../services/QuizzService";
import { fetchUpdateUser } from "../services/UserServices";

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userId = storedUser?.userId;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const quizzData = await fetchGetQuizzByTitle("Basic");
        
        if (quizzData && Array.isArray(quizzData[0]?.questions)) {
          setTitle(quizzData[0].title || "Untitled Quiz");
          
          const shuffledQuestions = quizzData[0].questions
            .sort(() => Math.random() - 0.5)
            .map(question => ({
              ...question,
              options: [...question.options].sort(() => Math.random() - 0.5)
            }));
          
          setQuestions(shuffledQuestions);
        } else {
          setError("Invalid quiz data format");
        }
      } catch (error) {
        console.error("Error loading quiz data:", error);
        setError("Failed to load quiz questions");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted && questions.length > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isCompleted && questions.length > 0) {
      handleNextQuestion();
    }
  }, [timeLeft, isCompleted, questions]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
      const correctAnswers = currentQuestion.correctAnswers || [];
      const isCorrect = correctAnswers.some(answer => 
        answer.toString() === selectedAnswer?.toString()
      );

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
    }

    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(30);
    } else {
      setIsCompleted(true);
      setTimeLeft(0);
    }
  };

  const handleGoHome = async () => {
    try {
      setIsLoading(true);
      const finalScore = Math.max(score, 0);

      if (!userId) {
        throw new Error("User ID is missing. Please log in.");
      }

      const updatedData = {
        quizzScore: finalScore,
        hasCompletedTest: true,
      };
      
      await fetchUpdateUser(userId, updatedData);
      
      navigate("/home", { 
        state: { 
          videoId: location.state?.fromVideo,
          category: location.state?.category,
          level: location.state?.level,
          testCompleted: true,
          score: finalScore
        } 
      });
    } catch (error) {
      console.error("Failed to update user score:", error.message);
      alert(error.message || "Failed to update user score. Please try again.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Quiz...</h1>
          <p>Please wait while we prepare your test</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-xl w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">{title}</h1>
        
        {!isCompleted ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold">
                Question {currentQuestionIndex + 1}/{questions.length}
              </h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Time: {timeLeft}s
              </div>
            </div>
            
            <p className="text-lg mb-6">
              {questions[currentQuestionIndex]?.questionText}
            </p>
            
            <div className="space-y-3">
              {questions[currentQuestionIndex]?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(option)}
                  className={`w-full px-4 py-3 border rounded-lg text-lg transition-colors ${
                    selectedAnswer === option
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  selectedAnswer
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Quiz Completed!</h2>
            <div className="mb-6">
              <p className="text-xl">
                Your score: <span className="font-bold">{score}/{questions.length}</span>
              </p>
              <p className="mt-2">
                {score >= questions.length * 0.8
                  ? "Excellent work! 🎉"
                  : score >= questions.length * 0.5
                  ? "Good job! 👍"
                  : "Keep practicing! 💪"}
              </p>
            </div>
            
            <button
              onClick={handleGoHome}
              disabled={isLoading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {isLoading ? "Processing..." : "Go to Home"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
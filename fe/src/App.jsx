import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/VideoContext"; // Import VideoProvider
import Router from "./router";
import { QuizProvider } from "./context/QuizContext";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <QuizProvider>
          <AuthProvider>
            <VideoProvider>
              <Router />
            </VideoProvider>
          </AuthProvider>
        </QuizProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
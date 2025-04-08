import PropTypes from "prop-types";
import { createContext, useState, useContext } from "react";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [selectQuiz, setSelectQuiz] = useState(null);

  return (
    <QuizContext.Provider value={{ selectQuiz, setSelectQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
QuizProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useQuizContext = () => useContext(QuizContext);
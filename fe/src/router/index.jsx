import { Route, Routes } from "react-router-dom";

import Register from "../page/Register";
import Login from "../page/Login";
import TestPage from "../page/TestPage";
import HomePage from "../page/HomePage";
import StartPage from "../page/StartPage";
import Introduction from "../page/Introduction";
import SettingPage from "../page/SettingPage";
import DocumentPage from "../page/DocumentPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Introduction />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/me/setting" element={<SettingPage />} />
      <Route path="/Documentation" element={<DocumentPage />} />
    </Routes>
  );
};

export default Router;

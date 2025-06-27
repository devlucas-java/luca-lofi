import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminPage } from "../pages/AdminPage";
import { RadioPage } from "../pages/RadioPage";
import { AboutPage } from "../pages/AboutPage";
import { TestTubeDiagonalIcon } from "lucide-react";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/radio" element={<RadioPage />} />
      <Route path="/" element={<RadioPage />} />
      <Route path="/about" element={<AboutPage />} />
            <Route path="/test" element={<TestTubeDiagonalIcon />} />
    </Routes>
  );
};

export default Router;

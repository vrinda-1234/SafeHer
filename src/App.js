// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
      </Routes>
    </Router>
  );
}

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EmergencySOS from "./pages/EmergencySOS";
import LiveLocation from "./pages/LiveLocation";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/dashboard" element={
   // <ProtectedRoute>
      <Dashboard />
  //  </ProtectedRoute>
  }/>
  <Route
  path="/sos"
  element={
   // <ProtectedRoute>
      <EmergencySOS />
    //</ProtectedRoute>
  }
/>

<Route
  path="/location"
  element={
   // <ProtectedRoute>
      <LiveLocation />
   // </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    //<ProtectedRoute>
      <Profile />
   // </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

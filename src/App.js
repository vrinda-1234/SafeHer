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
import { AuthProvider } from "./context/AuthContext";
import Contacts from "./pages/Contacts";
import TrackSOS from "./pages/TrackSOS";
export default function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
   </ProtectedRoute>
  }/>
  <Route path="/track/:id" element={<TrackSOS />} />
  <Route
  path="/sos"
  element={
    <ProtectedRoute>
      <EmergencySOS />
    </ProtectedRoute>
  }
/>

<Route
  path="/location"
  element={
    <ProtectedRoute>
      <LiveLocation />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route path="/contacts"
      element={
        <ProtectedRoute>
        <Contacts />
      </ProtectedRoute>
      }
  />    
      </Routes>
    </Router>
    </AuthProvider>
  );
}

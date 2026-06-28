import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EmergencySOS from "./pages/EmergencySOS";
import LiveLocation from "./pages/LiveLocation";
import Profile from "./pages/Profile";
import Contacts from "./pages/Contacts";
import TrackSOS from "./pages/TrackSOS";
import AIThreatDetection from "./pages/AIThreatDetection";
import SafeRoute from "./pages/SafeRoute"
import QuickExit from "./pages/QuickExit";
import Settings from "./pages/Settings";
import Location from "./pages/Location";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />

        <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />

  <Route path="/track/:id" element={<TrackSOS />} />

  <Route
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/sos" element={<EmergencySOS />} />
    <Route path="/location" element={<Location />} />
    <Route path="/contacts" element={<Contacts />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/saferoute" element={<SafeRoute />} />
    <Route path="/quick-exit" element={<QuickExit />} />
    <Route path="/settings" element={<Settings />} />
    <Route
      path="/ai-threatdetection"
      element={<AIThreatDetection />}
    />
  </Route>
</Routes>
      </Router>
    </AuthProvider>
  );
}
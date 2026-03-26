import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import PreferencesPage from "./pages/PreferencesPage";
import SwipePage from "./pages/SwipePage";
import TailorPage from "./pages/TailorPage";
import SubmitPage from "./pages/SubmitPage";
import ApplicationsPage from "./pages/ApplicationsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Navbar />
            <UploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preferences"
        element={
          <ProtectedRoute>
            <Navbar />
            <PreferencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/swipe"
        element={
          <ProtectedRoute>
            <Navbar />
            <SwipePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tailor"
        element={
          <ProtectedRoute>
            <Navbar />
            <TailorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <Navbar />
            <SubmitPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Navbar />
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

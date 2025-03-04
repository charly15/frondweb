import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import GroupsPage from "./pages/GroupsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanelPage from "./pages/AdminPanelPage";
import AuthProvider from "./context/AuthContext";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<MainLayout />}>
            <Route
              path="dashboard"
              element={<ProtectedRoute element={<DashboardPage />} />}
            />
            <Route
              path="groups"
              element={<ProtectedRoute element={<GroupsPage />} />}
            />
             <Route
              path="admin"
              element={<ProtectedRoute element={<AdminPanelPage />} />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;

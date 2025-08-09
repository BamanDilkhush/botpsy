import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AiAssistant from './pages/AiAssistant';
import VerifyEmail from './pages/VerifyEmail'; // --- NEW ---

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} /> {/* --- NEW --- */}

          {/* Protected Routes for Logged-in Users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
          </Route>

          {/* Admin-Only Routes */}
          <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;

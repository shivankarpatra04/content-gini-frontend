// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import BlogGenerator from './pages/BlogGenerator';
import BlogAnalysis from './pages/BlogAnalysis';
import PrivateRoute from './components/common/PrivateRoute';
// Auth component imports
import ResetPassword from './components/auth/ResetPassword';
import ForgotPassword from './components/auth/ForgotPassword';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/blog-generator"
                element={
                  <PrivateRoute>
                    <BlogGenerator />
                  </PrivateRoute>
                }
              />
              <Route
                path="/blog-analysis"
                element={
                  <PrivateRoute>
                    <BlogAnalysis />
                  </PrivateRoute>
                }
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold text-gray-900">404</h1>
                    <p className="text-gray-600">Page not found</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
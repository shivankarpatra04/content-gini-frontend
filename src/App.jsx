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
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <p className="text-7xl sm:text-8xl font-extrabold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
      404
    </p>
    <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
    <p className="mt-2 text-slate-500 max-w-md">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link
      to="/"
      className="mt-8 inline-flex items-center px-6 py-3 rounded-lg font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
    >
      Back to home
    </Link>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
          <Navbar />
          <main className="flex-grow pt-16">
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
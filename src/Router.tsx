// src/Router.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from 'src/store';
import Home from 'src/pages/Home';
import Search from 'src/pages/Search';
import LoginPage from 'src/pages/Login';
import SignupPage from 'src/pages/Signup';
import DefaultPage from 'src/pages/Default';
import MainLayout from 'src/containers/MainLayout';

const AppRouter: React.FC = () => {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            {/* Authenticated Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
            {/* Redirect to Home if trying to access login/signup */}
            <Route path="/login" element={<Navigate replace to="/" />} />
            <Route path="/signup" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            {/* Public Routes */}
            <Route path="/" element={<DefaultPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Redirect to DefaultPage if trying to access authenticated routes */}
            <Route path="/search" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;

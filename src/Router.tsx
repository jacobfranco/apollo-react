import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'src/store';
import { toggleTheme } from 'src/actions/settings'; // Import the toggleTheme action
import Home from 'src/pages/Home';
import Search from 'src/pages/Search';
import LoginPage from 'src/pages/Login';
import SignupPage from 'src/pages/Signup';
import DefaultPage from 'src/pages/Default';
import MainLayout from 'src/containers/MainLayout';

const AppRouter: React.FC = () => {
  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
  const darkMode = useSelector((state: AppState) => state.settings.darkMode); 
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    let prefersDarkMode;

    if (savedTheme) {
      prefersDarkMode = savedTheme === 'dark';
    } else {
      prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Dispatch the initial theme based on saved preference or system preference
    dispatch(toggleTheme(prefersDarkMode));
  }, [dispatch]);

  useEffect(() => {
    // Update the body class based on the darkMode state
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]); // Listen to changes in darkMode

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

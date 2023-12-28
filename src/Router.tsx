import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'src/store';
import { toggleTheme } from 'src/actions/settings'; // Import the toggleTheme action
import Home from 'src/pages/Home';
import Browse from 'src/pages/Browse';
import Notifications from 'src/pages/Notifications';
import Messages from 'src/pages/Messages'
import Profile from 'src/pages/Profile'
import Settings from 'src/pages/Settings'
import Login from 'src/pages/Login';
import Signup from 'src/pages/Signup';
import Default from 'src/pages/Default';
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
            <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/browse" element={<MainLayout><Browse /></MainLayout>} />
            <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
            <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            {/* Redirect to Default if trying to access login/signup */}
            <Route path="/login" element={<Navigate replace to="/" />} />
            <Route path="/signup" element={<Navigate replace to="/" />} />
          </>
        ) : (
          <>
            {/* Public Routes */}
            <Route path="/" element={<Default />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Redirect to DefaultPage if trying to access authenticated routes */}
            <Route path="/home" element={<Navigate replace to="/" />} />
            <Route path="/search" element={<Navigate replace to="/" />} />
            <Route path="/notifications" element={<Navigate replace to="/" />} />
            <Route path="/messages" element={<Navigate replace to="/" />} />
            <Route path="/profile" element={<Navigate replace to="/" />} />
            <Route path="/settings" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;

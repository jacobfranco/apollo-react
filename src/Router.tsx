import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from 'src/pages/Home';
import Search from 'src/pages/Search';
import LoginPage from 'src/pages/Login'; 
import SignupPage from 'src/pages/Signup'; 
import MainLayout from 'src/containers/MainLayout';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes using MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
        {/* Routes for authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

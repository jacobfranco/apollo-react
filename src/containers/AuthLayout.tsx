import React from 'react';
import 'src/styles/AuthLayout.css';
import { Background } from 'src/components'

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
    <Background />
    <div className="auth-content">
      {children}
    </div>
  </div>
  );
};

export default AuthLayout;

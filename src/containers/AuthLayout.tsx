import React from 'react';
import 'src/styles/AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
};

export default AuthLayout;

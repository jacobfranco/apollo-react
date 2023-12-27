import React from 'react';
import AuthLayout from 'src/containers/AuthLayout';
import Login from 'src/components/Login'; 

const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;

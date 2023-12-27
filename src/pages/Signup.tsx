import React from 'react';
import AuthLayout from '../containers/AuthLayout';
import Signup from '../components/Signup'; // Assuming Signup is a component

const SignupPage: React.FC = () => {
  return (
    <AuthLayout>
      <Signup />
    </AuthLayout>
  );
};

export default SignupPage;

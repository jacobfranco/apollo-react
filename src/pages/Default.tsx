import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/store';
import { toggleAuth } from 'src/actions/auth';

const DefaultPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleToggleAuth = () => {
    dispatch(toggleAuth(true)); // Set to true for mock authentication
    navigate('/home');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div>
      <h1>Welcome to Our App</h1>
      <button onClick={handleToggleAuth}>Toggle Auth (For Testing)</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default DefaultPage;

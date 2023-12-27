import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { logout } from 'src/actions/auth';
import { AppState, useAppDispatch } from 'src/store';
import Button from 'src/components/Button'; 

const ProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: AppState) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="profile-dropdown">
      {isAuthenticated ? (
        <>
          <img src={user?.profilePicture || 'defaultProfile.jpg'} alt="Profile" />
          <Button onClick={() => dispatch(logout())} variant="primary">Logout</Button>
        </>
      ) : (
        <>
          <Button onClick={handleLogin} variant="secondary">Login</Button>
          <Button onClick={handleSignup} variant="primary">Signup</Button>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;

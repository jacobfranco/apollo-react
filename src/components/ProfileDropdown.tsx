import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from 'src/actions/auth';
import { toggleTheme } from 'src/actions/settings'
import { AppState, useAppDispatch } from 'src/store';
import Button from 'src/components/Button';

const ProfileDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useSelector((state: AppState) => state.auth);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="profile-dropdown">
      {isAuthenticated ? (
        <>
          <img src={user?.profilePicture || 'defaultProfile.jpg'} alt="Profile" onClick={toggleDropdown} />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleToggleTheme}>Toggle Dark Mode</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </>
      ) : (
        <>
          <Button onClick={() => navigate('/login')} variant="secondary">Login</Button>
          <Button onClick={() => navigate('/signup')} variant="primary">Signup</Button>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
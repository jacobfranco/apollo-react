import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, toggleTheme } from 'src/actions';
import { RootState } from 'src/store';
import { useAppDispatch } from 'src/hooks'
import 'src/styles/components/ProfileDropdown.css';

const ProfileDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const darkMode = useSelector((state: RootState) => state.settings.darkMode);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleToggleTheme = () => {
    dispatch(toggleTheme(!darkMode));
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate('/')
  }

  return (
    <div className="profile-dropdown">
      {isAuthenticated ? (
        <>
          <img
            src={user?.profilePicture || 'defaultProfile.jpg'}
            alt="Profile"
            onClick={toggleDropdown}
            className="profile-picture"
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleToggleTheme}>Toggle Theme</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </>
      ) : (
        <div>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Signup</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

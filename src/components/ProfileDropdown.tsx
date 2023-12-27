import React from 'react';
import { useSelector } from 'react-redux';
import { logout } from 'src/actions/auth';
import { AppState, useAppDispatch } from 'src/store'; 

const ProfileDropdown: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: AppState) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className="profile-dropdown">
      {isAuthenticated ? (
        <>
          <img src={user?.profilePicture || 'defaultProfile.jpg'} alt="Profile" />
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <>
          {/* Login/Signup buttons */}
        </>
      )}
      {/* Other dropdown items */}
    </div>
  );
};

export default ProfileDropdown;

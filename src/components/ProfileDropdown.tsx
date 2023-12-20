import React from 'react';
import 'src/styles/ProfileDropdown.css';

const ProfileDropdown: React.FC = () => {
  const toggleDarkMode = () => {
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className="profile-dropdown">
      {/* Profile picture or icon */}
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
      {/* Other dropdown items */}
    </div>
  );
};

export default ProfileDropdown;

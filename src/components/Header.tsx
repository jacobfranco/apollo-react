import React from 'react';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';
import 'src/styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="logo-link">
          <img src="src/assets/logo.png" alt="Logo" className="logo" />
        </a>
        <SearchBar />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;

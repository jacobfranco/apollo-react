import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import 'src/styles/Sidebar.css'; 

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <NavLink to="/" className="link">
        <FontAwesomeIcon icon={faHome} /> Home
      </NavLink>
      <NavLink to="/search" className="link">
        <FontAwesomeIcon icon={faSearch} /> Search
      </NavLink>
      {/* Additional navigation links can be added here */}
    </nav>
  );
};

export default Sidebar;

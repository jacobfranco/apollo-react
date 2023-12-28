import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEye, faBell, faEnvelope, faUser, faGear } from '@fortawesome/free-solid-svg-icons';
import 'src/styles/Sidebar.css'; 

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <NavLink to="/home" className="link">
        <FontAwesomeIcon icon={faHome} /> Home
      </NavLink>
      <NavLink to="/browse" className="link">
        <FontAwesomeIcon icon={faEye} /> Browse
      </NavLink>
      <NavLink to="/notifications" className="link">
        <FontAwesomeIcon icon={faBell} /> Notifications
      </NavLink>
      <NavLink to="/messages" className="link">
        <FontAwesomeIcon icon={faEnvelope} /> Messages
      </NavLink>
      <NavLink to="/profile" className="link">
        <FontAwesomeIcon icon={faUser} /> Profile
      </NavLink>
      <NavLink to="/settings" className="link">
        <FontAwesomeIcon icon={faGear} /> Settings
      </NavLink>
    </nav>
  );
};

export default Sidebar;

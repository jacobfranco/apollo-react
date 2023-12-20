import React from 'react';
import Background from './Background'; // Import the Background component
import Header from './Header';
import Sidebar from './Sidebar';
import SidePanel from './SidePanel';
import 'src/styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <Background />
      <Sidebar />
      <div className="main-content">
        <Header />
        {children}
      </div>
      <SidePanel />
    </div>
  );
};

export default Layout;

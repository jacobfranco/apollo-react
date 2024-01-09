import React from 'react';
import Background from 'src/components/Background'; // Import the Background component
import Header from 'src/components/Header';
import Sidebar from 'src/components/Sidebar';
import SidePanel from 'src/components/SidePanel';
import 'src/styles/layouts/MainLayout.css';

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

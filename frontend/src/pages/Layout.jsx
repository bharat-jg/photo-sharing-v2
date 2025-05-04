import { useLocation } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import React from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

  return (
    <div className="flex">
      {!isLandingPage && <Sidebar />}
      <main className={`flex-1 ${!isLandingPage ? 'ml-20' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

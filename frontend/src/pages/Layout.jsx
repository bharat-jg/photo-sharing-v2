import Sidebar from '../components/SideBar';
import React from 'react';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar stays on the left */}
      <Sidebar />

      {/* Main content area including top navbar and page content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Top Navbar */}

        <Navbar />

        {/* Page content injected here */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

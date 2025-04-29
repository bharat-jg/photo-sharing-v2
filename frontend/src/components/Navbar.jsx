import React from 'react';
import { SearchBar } from '../pages/PhotoDetail';

const Navbar = ({ userImage }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
      <div className="flex items-center justify-between w-full ml-16 md:ml-64">
        <h1 className="text-xl font-bold text-blue-600">PhotoShare</h1>
        <SearchBar />
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={
                userImage ||
                'https://cdn-icons-png.freepik.com/256/6994/6994705.png'
              }
              alt="User"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

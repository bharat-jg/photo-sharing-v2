import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

// This component renders a sidebar with navigation links and icons for different sections of the application.
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/feed' },
    { icon: <PlusSquare size={24} />, label: 'Upload', path: '/upload' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="h-screen w-16 md:w-20 bg-white/95 backdrop-blur-sm border-r border-gray-200 fixed left-0 top-0 pt-16 z-20 shadow-lg"
    >
      <div className="flex flex-col items-center p-9">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`group relative flex items-center justify-center p-3 mb-4 rounded-xl cursor-pointer transition-all duration-200 w-[45px] h-[45px]  ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <div className="flex items-center justify-center w-6 h-6">
                {item.icon}
              </div>

              {/* Tooltip */}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 hidden group-hover:flex items-center px-3 py-2 rounded-lg bg-gray-800 text-white text-sm whitespace-nowrap shadow-lg z-30">
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                {item.label}
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl -z-10 "
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Logo */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <Link
            to="/"
            className="text-pink-600 hover:text-pink-700 font-semibold 
                               transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 3H6C4.3 3 3 4.3 3 6v12c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V6c0-1.7-1.3-3-3-3zm-6 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm3.5-3c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zM18 19H6c-.6 0-1-.4-1-1v-6h2c0 2.8 2.2 5 5 5s5-2.2 5-5h2v6c0 .6-.4 1-1 1z" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

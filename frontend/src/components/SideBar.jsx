import { useNavigate } from 'react-router-dom';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home />, label: 'Home', path: '/', active: true },
    { icon: <Compass size={24} />, label: 'Explore', path: '/explore' },
    { icon: <PlusSquare size={24} />, label: 'Create', path: '/upload' },
    {
      icon: <Bell size={24} />,
      label: 'Notifications',
      path: '/notifications',
    },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="h-screen w-16 md:w-20 bg-white border-r border-gray-200 fixed left-0 top-0 pt-16 z-20">
      <div className="flex flex-col items-center p-9">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`group relative flex items-center justify-center p-3 mb-2 w-full rounded-lg cursor-pointer ${
              item.active
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6">
              {item.icon}
            </div>

            {/* Tooltip */}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:flex items-center px-2 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap shadow-lg z-30">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

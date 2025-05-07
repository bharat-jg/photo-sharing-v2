import { User } from 'lucide-react';

export const DefaultAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-32 h-32',
  };

  return (
    <div
      className={`
      ${sizes[size]} 
      rounded-full 
      bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 
      flex items-center justify-center 
      ${className}
    `}
    >
      <User
        size={size === 'lg' ? 64 : size === 'md' ? 24 : 16}
        className="text-white/90"
      />
    </div>
  );
};

import { Heart } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { formatLikeCount } from '../utils/formatLikeCount';

// This component is a button that allows users to like or unlike a photo.
const LikeButton = ({ photoId, isLiked, likeCount, onLikeChange }) => {
  const token = localStorage.getItem('access_token');

  const handleToggleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/photos/${photoId}/like-toggle/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'liked') {
        onLikeChange(true);
      } else {
        onLikeChange(false);
      }
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

  return (
    <motion.button
      onClick={handleToggleLike}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center gap-2 p-2 rounded-full transition-all duration-200
                ${
                  isLiked
                    ? 'bg-pink-50 text-pink-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                }`}
      title={isLiked ? 'Unlike photo' : 'Like photo'}
    >
      <motion.div
        initial={false}
        animate={{ scale: isLiked ? 1 : 0.8 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <Heart
          fill={isLiked ? 'currentColor' : 'none'}
          className="w-5 h-5"
          strokeWidth={2}
        />
      </motion.div>

      <span className="text-sm font-medium">{formatLikeCount(likeCount)}</span>

      {/* Ripple effect on like */}
      {isLiked && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-full bg-pink-400"
        />
      )}
    </motion.button>
  );
};

export default LikeButton;

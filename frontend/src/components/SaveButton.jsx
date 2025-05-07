import { Bookmark } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SaveButton = ({ photoId, isSaved, onSaveChange }) => {
  const token = localStorage.getItem('access_token');

  const handleToggleSave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/photos/${photoId}/save-toggle/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'saved') {
        onSaveChange(true);
      } else {
        onSaveChange(false);
      }
    } catch (error) {
      console.error('Failed to toggle save', error);
    }
  };

  return (
    <motion.button
      onClick={handleToggleSave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-2 rounded-full transition-all duration-200 
                ${
                  isSaved
                    ? 'bg-amber-100 text-amber-500'
                    : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-500'
                }`}
      title={isSaved ? 'Remove from saved' : 'Save this photo'}
    >
      <motion.div
        initial={false}
        animate={{ scale: isSaved ? 1 : 0.8 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <Bookmark
          fill={isSaved ? 'currentColor' : 'none'}
          className="w-5 h-5"
          strokeWidth={2}
        />
      </motion.div>

      {/* Ripple effect on save */}
      {isSaved && (
        <motion.div
          initial={{ scale: 0.2, opacity: 0.5 }}
          animate={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0  rounded-full bg-amber-400"
        />
      )}
    </motion.button>
  );
};

export default SaveButton;

import { Bookmark } from 'lucide-react';
import axios from 'axios';

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
    <button
      onClick={handleToggleSave}
      className="flex items-center gap-1 transition-all hover:scale-105 hover:opacity-80"
      title="Save this photo"
    >
      {isSaved ? (
        <Bookmark fill="#ffe600" color="#ffe600" className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5 text-amber-300" />
      )}
    </button>
  );
};

export default SaveButton;

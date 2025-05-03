import { Heart } from 'lucide-react';
import axios from 'axios';
import { formatLikeCount } from '../utils/formatLikeCount';

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
    <button onClick={handleToggleLike} className="flex items-center gap-1">
      {isLiked ? (
        <Heart fill="red" color="red" className="w-5 h-5" />
      ) : (
        <Heart className="w-5 h-5 text-gray-600" />
      )}
      <span className="text-sm">{formatLikeCount(likeCount)}</span>
    </button>
  );
};

export default LikeButton;

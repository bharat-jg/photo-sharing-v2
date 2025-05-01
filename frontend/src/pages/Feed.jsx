import { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  Bookmark,
  Download,
  Share2,
  Search,
  Home,
  Compass,
  PlusSquare,
  Bell,
  User,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';

export const PhotoCard = ({ photo, onClick, isLiked, onLikeAnimation }) => {
  const [hovered, setHovered] = useState(false);
  const token = localStorage.getItem('access_token');
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.user_id || decoded.id;
    } catch (err) {
      console.error('Token decode failed:', err);
    }
  }

  const isLikedByCurrentUser = photo.likes.includes(currentUserId);

  return (
    <div
      className="relative mb-4 rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img
        src={photo.image.replace(/^image\/upload\//, '')}
        alt={photo.caption}
        className="w-full h-auto object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-sm font-medium">{photo.user.username}</span>
          </div>
          <div className="flex items-center">
            <Heart
              fill={isLikedByCurrentUser ? 'red' : 'none'}
              color={isLikedByCurrentUser ? 'red' : 'white'}
              size={16}
              className="mr-1"
            />
            <span className="text-xs">{photo.likes_count}</span>
          </div>
        </div>
      </div>

      {hovered && (
        <>
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-200"></div>
          <div className="absolute top-3 right-3 flex flex-col gap-3">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200">
              <Bookmark size={18} className="text-gray-800" />
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {isLiked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-red-500 text-5xl">🔖</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Feed() {
  const [photos, setPhotos] = useState([]);
  const [likedPhotoIds, setLikedPhotoIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get('/photos/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setPhotos(res.data);
      } catch (err) {
        console.error('Failed to fetch photos:', err);
      }
    };
    fetchPhotos();
  }, []);

  const handleLikeAnimation = (photoId) => {
    setLikedPhotoIds((prev) => [...prev, photoId]);
    setTimeout(() => {
      setLikedPhotoIds((prev) => prev.filter((id) => id !== photoId));
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Sidebar />

      <main className="pt-24 pl-16 md:pl-20 pr-4 pb-8">
        <h2 className="text-2xl font-bold mb-6">Home Feed</h2>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isLiked={likedPhotoIds.includes(photo.id) && photo.liked}
              onLikeAnimation={() => handleLikeAnimation(photo.id)}
              onClick={() => navigate(`/photos/${photo.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

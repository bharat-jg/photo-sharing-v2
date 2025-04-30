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

const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const recentSearches = ['landscape', 'portrait', 'art', 'design', 'food'];

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          placeholder="Search photos, people, or collections"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
      </div>

      {isSearchFocused && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          <p className="px-4 py-1 text-sm text-gray-500">Recent Searches</p>
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => setSearchQuery(search)}
            >
              <Search size={16} className="mr-2 text-gray-500" />
              <span>{search}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PhotoCard = ({ photo, onClick, isLiked, onLikeAnimation }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative mb-4 rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img
        src={photo.image.replace(/^image\/upload\//, '')}
        alt={photo.title}
        className="w-full h-auto object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-sm font-medium">{photo.user?.username}</span>
          </div>
          <div className="flex items-center">
            <Heart size={16} className="mr-1" />
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
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200">
              <Share2 size={18} className="text-gray-800" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200">
              <Download size={18} className="text-gray-800" />
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

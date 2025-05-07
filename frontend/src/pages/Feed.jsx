import { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId } from '../utils/auth';
import FeedSkeleton from '../components/skeletons/FeedSkeleton';

export const PhotoCard = ({ photo, onClick }) => {
  const DEFAULT_PROFILE_PHOTO =
    'https://cdn-icons-png.freepik.com/256/6994/6994705.png';
  const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/daz3cgmrp'; // Replace with your cloud name

  const [hovered, setHovered] = useState(false);
  const currentUserId = getCurrentUserId();
  const isLikedByCurrentUser =
    currentUserId && photo.likes.includes(currentUserId);

  const getProfilePhotoUrl = (photoUrl) => {
    if (!photoUrl) return DEFAULT_PROFILE_PHOTO;

    try {
      if (photoUrl.startsWith('http')) {
        return photoUrl;
      }

      if (photoUrl.startsWith('image/upload/')) {
        return `${CLOUDINARY_BASE_URL}/${photoUrl}`;
      }

      return `${CLOUDINARY_BASE_URL}/image/upload/${photoUrl}`;
    } catch (error) {
      console.error('Error processing profile photo URL:', error);
      return DEFAULT_PROFILE_PHOTO;
    }
  };

  return (
    <div
      className="relative mb-4 rounded-xl overflow-hidden cursor-pointer group transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img
        src={photo.image.replace(/^image\/upload\//, '')}
        alt={photo.caption}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Always visible overlay with user info and likes */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm p-0.5">
              <img
                src={getProfilePhotoUrl(photo.user?.profile?.profile_photo)}
                alt={`${photo.user?.username || 'User'}'s profile`}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_PROFILE_PHOTO;
                }}
                loading="lazy"
              />
            </div>
            <span className="text-white font-medium text-sm">
              {photo.user.username}
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <Heart
              size={14}
              fill={isLikedByCurrentUser ? '#ec4899' : 'none'}
              color={isLikedByCurrentUser ? '#ec4899' : 'white'}
              className="transition-colors duration-200"
            />
            <span className="text-white text-xs font-medium">
              {photo.likes_count}
            </span>
          </div>
        </div>
      </div>

      {/* Hover overlay for additional effect */}
      <div
        className={`absolute inset-0 bg-black/10 transition-opacity duration-300
                   opacity-0 group-hover:opacity-100`}
      />
    </div>
  );
};

export default function Feed() {
  const INITIAL_LIMIT = 7;
  const SCROLL_LIMIT = 6;
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  const fetchPhotos = async (currentOffset, isInitialLoad = false) => {
    if (isFetchingMore) {
      console.log('Already fetching more photos, skipping...');
      return;
    }
    
    try {
      setIsFetchingMore(true);
      const limit = isInitialLoad ? INITIAL_LIMIT : SCROLL_LIMIT;
      
      console.log(`Fetching photos with offset: ${currentOffset}, limit: ${limit}`);
      
      const res = await axios.get(
        `http://localhost:8000/api/photos/feed/?limit=${limit}&offset=${currentOffset}`
      );
      const newPhotos = res.data.results;

      console.log(`Fetched ${newPhotos.length} new photos`);
      console.log('New photos:', newPhotos);

      setPhotos((prevPhotos) => {
        const existingIds = new Set(prevPhotos.map(p => p.id));
        const filtered = newPhotos.filter(p => !existingIds.has(p.id));
        console.log(`Adding ${filtered.length} unique photos to existing ${prevPhotos.length} photos`);
        return [...prevPhotos, ...filtered];
      });

      // Update hasMore based on whether we got fewer photos than requested
      const hasMorePhotos = newPhotos.length >= limit;
      console.log(`Has more photos: ${hasMorePhotos}`);
      setHasMore(hasMorePhotos);

    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('Initial load - fetching first batch of photos');
    fetchPhotos(0, true);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isFetchingMore) {
          console.log('Intersection observed, fetching more photos');
          setOffset(prevOffset => {
            const newOffset = prevOffset + SCROLL_LIMIT;
            console.log(`Updating offset from ${prevOffset} to ${newOffset}`);
            fetchPhotos(newOffset, false);
            return newOffset;
          });
        }
      },
      { 
        rootMargin: '200px', 
        threshold: 0.1
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
      console.log('Observer attached to loader element');
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
        console.log('Observer detached from loader element');
      }
    };
  }, [hasMore, isFetchingMore]);

  if (isLoading && photos.length === 0) {
    return <FeedSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <main className="pt-12 px-6 md:px-8 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="relative z-10">Your Feed</span>
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-4 font-regular">
              Discover and share inspiring moments with others.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3.5">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={() => navigate(`/photos/${photo.id}`)}
              />
            ))}
          </div>

          {/* Loader Element - Always render it if hasMore is true */}
          {hasMore && (
            <div ref={loaderRef} className="mt-8">
              {isFetchingMore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="aspect-square bg-gray-200 animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* End of feed message */}
          {!hasMore && photos.length > 0 && (
            <div className="text-center py-8 text-gray-600">
              You've reached the end of your feed
            </div>
          )}

          {/* Empty State */}
          {photos.length === 0 && !isLoading && (
            <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm">
              <p className="text-xl text-gray-600 mb-6">
                Your feed is waiting for some magical moments
              </p>
              <button
                onClick={() => navigate('/explore')}
                className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold
                         hover:bg-gray-100 transition-colors duration-200 
                         shadow-md hover:shadow-lg"
              >
                Explore Photos
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
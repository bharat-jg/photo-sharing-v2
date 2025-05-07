import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId } from '../utils/auth';

export const PhotoCard = ({ photo, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const currentUserId = getCurrentUserId();
  const isLikedByCurrentUser =
    currentUserId && photo.likes.includes(currentUserId);

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
                src={
                  photo.user.profile_photo ||
                  'https://cdn-icons-png.freepik.com/256/6994/6994705.png'
                }
                alt={photo.user.username}
                className="w-full h-full rounded-full object-cover"
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
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialPhotos = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8000/api/photos/feed/?limit=20&offset=0'
        );
        setPhotos(res.data.results);
      } catch (err) {
        console.error('Failed to fetch photos:', err);
      }
    };

    fetchInitialPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <main className="pt-12 px-6 md:px-8 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with the design you liked */}
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="relative z-10">Your Feed</span>
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-4 font-regular">
              Discover and share inspiring moments with your others.
            </p>
          </div>

          {/* Photos Grid with enhanced styling */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3.5">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={() => navigate(`/photos/${photo.id}`)}
              />
            ))}
          </div>

          {/* Empty State with Viscora styling */}
          {photos.length === 0 && (
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

// import { useEffect, useState } from 'react';
// import axios from '../api/axios';
// import { Bookmark, Heart } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/SideBar';
// import Navbar from '../components/Navbar';
// import { getCurrentUserId } from '../utils/auth';
// import { useRef } from 'react';

// export const PhotoCard = ({ photo, onClick }) => {
//   const [hovered, setHovered] = useState(false);

//   const currentUserId = getCurrentUserId();
//   let isLikedByCurrentUser;

//   if (currentUserId) {
//     isLikedByCurrentUser = photo.likes.includes(currentUserId);
//   } else {
//     console.warn('User not logged in');
//   }

//   return (
//     <div
//       className="relative mb-4 rounded-lg overflow-hidden cursor-pointer"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onClick={onClick}
//     >
//       <img
//         src={photo.image.replace(/^image\/upload\//, '')}
//         alt={photo.caption}
//         className="w-full h-auto object-cover"
//       />

//       <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
//             <span className="text-sm font-medium">{photo.user.username}</span>
//           </div>
//           <div className="flex items-center">
//             <Heart
//               fill={isLikedByCurrentUser ? 'red' : 'none'}
//               color={isLikedByCurrentUser ? 'red' : 'white'}
//               size={16}
//               className="mr-1"
//             />
//             <span className="text-xs">{photo.likes_count}</span>
//           </div>
//         </div>
//       </div>

//       {hovered && (
//         <>
//           <div className="absolute inset-0 bg-black/40 transition-opacity duration-200"></div>
//           <div className="absolute top-3 right-3 flex flex-col gap-3">
//             {/* <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200">
//               <Bookmark size={18} className="text-gray-800" />
//             </button> */}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default function Feed() {
//   const [photos, setPhotos] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const loaderRef = useRef(null);
//   const navigate = useNavigate();
//   const LIMIT = 5;

//   const fetchPhotos = async () => {
//     if (!hasMore) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/photos/feed/?limit=${LIMIT}&offset=${offset}`
//       );
//       const newPhotos = res.data.results;

//       console.log('Fetched photos:', newPhotos);
//       console.log('Current offset:', offset);
//       console.log('Current photos:', photos);
//       console.log('Current hasMore:', hasMore);

//       setPhotos((prevPhotos) => {
//         const existingIds = new Set(prevPhotos.map((p) => p.id));
//         const filtered = newPhotos.filter((p) => !existingIds.has(p.id));
//         return [...prevPhotos, ...filtered];
//       });

//       if (!res.data.next || newPhotos.length < LIMIT) setHasMore(false);
//     } catch (err) {
//       console.error('Failed to fetch photos:', err);
//     }
//   };

//   useEffect(() => {
//     fetchPhotos();
//   }, [offset]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setOffset((prevOffset) => prevOffset + LIMIT);
//         }
//       },
//       { threshold: 1 }
//     );

//     const loader = loaderRef.current;
//     if (loader) observer.observe(loader);
//     return () => loader && observer.unobserve(loader);
//   }, [hasMore]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />

//       <main className="pt-5 pl-16 md:pl-20 pr-4 pb-8">
//         <h2 className="text-4xl font-bold mb-10 text-center">Home Feed</h2>
//         <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
//           {photos.map((photo) => (
//             <PhotoCard
//               key={photo.id}
//               photo={photo}
//               onClick={() => navigate(`/photos/${photo.id}`)}
//             />
//           ))}
//         </div>

//         {hasMore && (
//           <div
//             ref={loaderRef}
//             className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mt-4"
//           >
//             {[...Array(5)].map((_, index) => (
//               <div
//                 key={`skeleton-${index}`}
//                 className="mb-4 h-64 bg-gray-200 animate-pulse rounded-xl w-full"
//               ></div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

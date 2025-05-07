import { useState, useRef, useEffect } from 'react';
import {
  Download,
  Share2,
  Search,
  MessageCircle,
  Bookmark,
  X,
  ChevronLeft,
  Expand,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUserId } from '../utils/auth';
import { PhotoCard } from './Feed';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';
import { motion } from 'framer-motion';

const DEFAULT_PROFILE_PHOTO =
  'https://cdn-icons-png.freepik.com/256/6994/6994705.png';

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}`;

const getProfilePhotoUrl = (photoUrl) => {
  if (!photoUrl) return DEFAULT_PROFILE_PHOTO;

  try {
    // If it's already a complete URL, return it
    if (photoUrl.startsWith('http')) {
      return photoUrl;
    }

    // If it's a Cloudinary path, construct the complete URL
    if (photoUrl.startsWith('image/upload/')) {
      return `${CLOUDINARY_BASE_URL}/${photoUrl}`;
    }

    // If it's just the ID part, add both base URL and image/upload
    return `${CLOUDINARY_BASE_URL}/image/upload/${photoUrl}`;
  } catch (error) {
    console.error('Error processing profile photo URL:', error);
    return DEFAULT_PROFILE_PHOTO;
  }
};

// Format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  } else {
    return 'Just now';
  }
};

// SearchBar component (reused from previous pages)
export const SearchBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const recentSearches = [];

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

      {/* TODO: add recent searches from api */}
      {recentSearches.length > 0 && isSearchFocused && (
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

// Comment component
const Comment = ({ comment, comments, setComments, postUserId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const currentUserId = getCurrentUserId();

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this comment?'
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/comments/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex group">
        <img
          src={getProfilePhotoUrl(comment.user?.profile?.profile_photo)}
          alt={`${comment.user?.username || 'User'}'s profile`}
          className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
          onError={(e) => {
            e.target.src = DEFAULT_PROFILE_PHOTO;
          }}
          loading="lazy"
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 hover:text-pink-600 transition-colors duration-200">
                  {comment.user.first_name} {comment.user.last_name}
                </span>
                <span className="text-gray-500 text-sm">
                  @{comment.user.username}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            <p className="text-gray-800">{comment.text}</p>
            {(comment.user.id === currentUserId ||
              postUserId === currentUserId) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteComment(comment.id)}
                className="mt-2 text-red-500 text-xs font-medium hover:text-red-600 
                         transition-colors duration-200 flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Full Image Modal component
const FullImageModal = ({ isOpen, onClose, imageUrl, imageCaption }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Modal Overlay */}
      <div
        ref={modalRef}
        className="pt-10 absolute inset-0 flex justify-center"
        onClick={(e) => {
          if (e.target === modalRef.current) onClose();
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* Image container */}
        <div className="max-w-[95vw] max-h-[90vh] overflow-hidden p-2">
          <img
            src={
              imageUrl.startsWith('https://')
                ? imageUrl
                : `https://${imageUrl.split('https://')[1]}`
            }
            alt={imageCaption}
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

// Share Modal component
const ShareModal = ({ isOpen, onClose, post }) => {
  const modalRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:5173/photos/${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-md p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 relative inline-block">
            <span className="relative z-10">Share Photo</span>
            <div className="absolute -bottom-1 left-0 w-full h-2 bg-pink-500 opacity-30"></div>
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </motion.button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <img
              src={
                post.user.profile_photo ||
                'https://cdn-icons-png.freepik.com/256/6994/6994705.png'
              }
              alt={post.user.username}
              className="w-12 h-12 rounded-xl object-cover shadow-md"
            />
            <div>
              <p className="font-medium text-gray-900">
                {post.user.first_name} {post.user.last_name}
              </p>
              <p className="text-sm text-gray-500">@{post.user.username}</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={`http://localhost:5173/photos/${post.id}`}
              readOnly
              className="w-full pl-4 pr-24 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-full transition-all duration-200 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
// Main Post Page component
const PhotoDetail = () => {
  const [isOwner, setIsOwner] = useState(false); // Ensured this is top-level hook
  const { id } = useParams(); // Get photo ID from URL params
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // initial state
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const textareaRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (post) {
      setIsLiked(post.liked);
      setIsSaved(post.saved_by_user); // new line for bookmark
      setLikeCount(post.likes_count);
    }
  }, [post]);

  // Fetched photos of the user who posted the current photo
  useEffect(() => {
    const fetchUserPhotos = async () => {
      if (!post || !post.user || !post.user.id) return; // ✅ Wait for valid post

      try {
        const postUserId = post.user.id;
        const res = await axios.get(
          `http://localhost:8000/api/photos/?user_id=${postUserId}`,
          // `http://localhost:8000/api/photos/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setPhotos(res.data);
      } catch (err) {
        console.error('Failed to fetch user photos:', err);
      }
    };

    fetchUserPhotos();
  }, [post]);

  // Fetch post and comments data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/photos/${id}/`);
        setPost(res.data);
        setIsLiked(res.data.liked_by_user);
        setIsSaved(res.data.saved_by_user); // new line for bookmark
        setComments(res.data.comments || []);
      } catch (err) {
        console.error('Failed to fetch post', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  //Check if the current user is the owner of the post
  useEffect(() => {
    if (post) {
      if (currentUserId) {
        if (currentUserId === post.user.id) {
          setIsOwner(true);
        }
      }
    }
  }, [post]);

  if (loading)
    return <div className="pt-20 pl-16 md:pl-64 px-4">Loading...</div>;
  if (!post)
    return <div className="pt-20 pl-16 md:pl-64 px-4">Post not found.</div>;

  const isPostLiked = post.likes.includes(currentUserId);
  const isPostSaved = post.bookmarks.includes(currentUserId);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('access_token');

      const res = await axios.post(
        'http://localhost:8000/api/comments/',
        {
          text: commentText,
          photo: post.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new comment to the list
      setComments((prev) => [...prev, res.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment.');
    }
  };

  const handleEdit = () => {
    setNewCaption(post.caption);
    setIsEditing(true);
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post?'
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/photos/${post.id}/edit/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const submitCaptionEdit = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/photos/${post.id}/edit/`,
        { caption: newCaption },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPost((prevPost) => ({
        ...prevPost,
        caption: res.data.caption,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating caption:', err);
      alert('Failed to update caption');
    }
  };

  const focusCommentInput = () => {
    textareaRef.current?.focus();
  };

  const handleDownloadImage = async (imageUrl) => {
    try {
      const url = imageUrl.startsWith('https://')
        ? imageUrl
        : `https://${imageUrl.split('https://')[1]}`;

      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      const filename = url.split('/').pop();
      link.download = filename || 'downloaded-image.jpg';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <main className="pt-12 px-6 md:px-8 lg:px-12 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <ChevronLeft size={20} className="mr-1" />
              <span className="font-medium">Go Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Main Image Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left Side - Image */}
                <div className="md:w-2/3 relative">
                  <div className="relative aspect-[4/3] bg-gray-50">
                    <img
                      src={
                        post.image.startsWith('https://')
                          ? post.image
                          : `https://${post.image.split('https://')[1]}`
                      }
                      alt={post.caption}
                      className="absolute inset-0 w-full h-full object-contain p-7"
                    />
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
                    >
                      <Expand size={20} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Right Side - Info & Actions */}
                <div className="md:w-1/3 flex flex-col">
                  {/* User Info Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={getProfilePhotoUrl(
                            post.user?.profile?.profile_photo
                          )}
                          alt={`${post.user?.username || 'User'}'s profile`}
                          className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
                          onError={(e) => {
                            e.target.src = DEFAULT_PROFILE_PHOTO;
                          }}
                          loading="lazy"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {post.first_name} {post.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{post.user.username}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatRelativeTime(
                          new Date(post.created_at).toLocaleString()
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Caption Section */}
                  <div className="p-6 pt-2 border-b border-gray-100 flex-grow">
                    {isEditing ? (
                      <div className="space-y-4">
                        <textarea
                          value={newCaption}
                          onChange={(e) => setNewCaption(e.target.value)}
                          className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                          rows={3}
                          placeholder="Write a caption..."
                        />
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={submitCaptionEdit}
                            className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors duration-200"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-gray-800">
                          <p className="text-gray-400 italic">caption</p>{' '}
                          {post.caption}
                        </div>
                        {isOwner && (
                          <div className="flex gap-3">
                            <button
                              onClick={handleEdit}
                              className="text-pink-600 text-sm hover:text-pink-700 transition-colors duration-200 flex items-center gap-1"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={handleDeletePost}
                              className="text-red-500 text-sm hover:text-red-600 transition-colors duration-200 flex items-center gap-1"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <LikeButton
                          photoId={post.id}
                          isLiked={isPostLiked}
                          likeCount={post.likes_count}
                          onLikeChange={async () => {
                            const res = await axios.get(
                              `http://localhost:8000/api/photos/${post.id}/`
                            );
                            setPost(res.data);
                          }}
                        />
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          onClick={focusCommentInput}
                        >
                          <MessageCircle size={20} className="text-gray-700" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          onClick={() => setIsShareModalOpen(true)}
                        >
                          <Share2 size={20} className="text-gray-700" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <SaveButton
                          photoId={post.id}
                          isSaved={isPostSaved}
                          onSaveChange={async () => {
                            const res = await axios.get(
                              `http://localhost:8000/api/photos/${post.id}/`
                            );
                            setPost(res.data);
                          }}
                        />
                        <motion.button
                          onClick={() =>
                            handleDownloadImage(
                              post.image.replace(/^image\/upload\//, '')
                            )
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-pink-500 p-2 rounded-full font-medium hover:bg-pink-50 transition-all duration-200"
                        >
                          <Download size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section as a separate full-width card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold relative inline-block">
                    <span className="relative z-10">Comments</span>
                    <div className="absolute -bottom-1 left-0 w-full h-2 bg-pink-200 opacity-50"></div>
                  </h3>
                  <span className="text-sm text-gray-500">
                    {comments.length}{' '}
                    {comments.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>

                {/* Comment Input */}
                <div className="flex mb-6">
                  <img
                    src={getProfilePhotoUrl(post.user?.profile?.profile_photo)}
                    alt={`${post.user?.username || 'User'}'s profile`}
                    className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
                    onError={(e) => {
                      e.target.src = DEFAULT_PROFILE_PHOTO;
                    }}
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      placeholder="Add a comment..."
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      rows={2}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    {commentText.trim() && (
                      <div className="flex justify-end mt-2">
                        <button
                          className="bg-pink-600 text-white px-6 py-2.5 rounded-full hover:bg-pink-700 transition-colors duration-200"
                          onClick={handlePostComment}
                        >
                          Post Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comments={comments}
                      setComments={setComments}
                      comment={comment}
                      postUserId={post.user.id}
                    />
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* More Photos Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 relative inline-block">
                <span className="relative z-10">
                  More from @{post.user.username}
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
              </h3>
              {/* Photos Grid with enhanced styling */}
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3.5">
                {photos
                  .filter((photo) => photo.id !== post.id)
                  .map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      isLiked={isPostLiked}
                      onClick={() => navigate(`/photos/${photo.id}`)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FullImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={post.image}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={post}
      />
    </div>
  );
};

export default PhotoDetail;

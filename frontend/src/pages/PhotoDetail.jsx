import { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Download,
  Share2,
  Search,
  Home,
  Compass,
  PlusSquare,
  Bell,
  User,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  X,
  ChevronLeft,
  Flag,
  Link,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getCurrentUserId } from '../utils/auth'; // Adjust the import path as necessary

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

  const recentSearches = [
    'landscape photography',
    'portrait ideas',
    'street art',
    'minimalist design',
    'food photography',
  ];

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

// Sidebar component (reused from previous pages)

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

      // Remove the deleted comment from the list of comments
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex">
        <img
          src="https://cdn-icons-png.freepik.com/256/6994/6994705.png?ga=GA1.1.1704611719.1745213202&semt=ais_hybrid"
          alt={comment.user.username}
          className="w-8 h-8 rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                {/* <span className="font-medium text-gray-900">
                  {comment.user.displayName}
                </span> */}
                <span className="text-gray-500 text-sm ml-2">
                  @{comment.user.username}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            <p className="text-gray-800">{comment.text}</p>
            {(comment.user.id === currentUserId.user_id ||
              postUserId === currentUserId.user_id) && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 text-xs mt-2"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
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
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={modalRef} className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Share</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://cdn-icons-png.freepik.com/256/6994/6994705.png?ga=GA1.1.1704611719.1745213202&semt=ais_hybrid"
              alt={post.caption}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              {/* <h4 className="font-medium">{post.user.username}</h4> */}
              <p className="text-sm  text-gray-500">by @{post.user.username}</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={`http://localhost:5173/photos/${post.id}`}
              readOnly
              className="w-full pl-4 pr-20 py-2 bg-gray-100 rounded-lg focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm px-3 py-1 rounded-full cursor-pointer ${
                copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const textareaRef = useRef(null);

  // Fetch post and comments data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/photos/${id}/`);
        setPost(res.data);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error('Failed to fetch post', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Check if the current user is the owner of the post
  useEffect(() => {
    if (post) {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.user_id || decoded.id; // Adjust based on your JWT payload
          if (userId === post.user.id) {
            setIsOwner(true);
          }
        } catch (err) {
          console.error('Invalid token:', err);
        }
      }
    }
  }, [post]); // Depend on `post` to trigger whenever `post` changes

  if (loading)
    return <div className="pt-20 pl-16 md:pl-64 px-4">Loading...</div>;
  if (!post)
    return <div className="pt-20 pl-16 md:pl-64 px-4">Post not found.</div>;

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

      // After successful deletion, navigate to the homepage or other page
      navigate('/'); // Or wherever you want the user to go
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

  const handleCommentClick = () => {
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="pt-20 pl-16 md:pl-64 pr-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ChevronLeft size={20} className="mr-1" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="md:flex">
              <div className="md:w-2/3 relative">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={
                      post.image.startsWith('https://')
                        ? post.image
                        : `https://${post.image.split('https://')[1]}`
                    }
                    alt={post.caption}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors cursor-pointer"
                  >
                    <span className="sr-only">View full size</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14L21 3"></path>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="md:w-1/3 border-l border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <img
                      src={
                        post.user.profile_photo ||
                        'https://cdn-icons-png.freepik.com/256/6994/6994705.png?ga=GA1.1.1704611719.1745213202&semt=ais_hybrid'
                      } // Display profile photo, or fallback
                      alt={post.user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{post.user.username}</h3>
                      <p className="text-sm text-gray-500">
                        @{post.user.username}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 border-b border-gray-100">
                  {isEditing ? (
                    <div className="my-4">
                      <textarea
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        className="w-full min-h-20 max-h-50 p-2 border rounded"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={submitCaptionEdit}
                          className="px-3 py-1 h-7 bg-blue-500 text-white rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1 h-7 bg-gray-300 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg font-medium my-2">{post.caption}</p>
                  )}
                  <div className="text-sm text-gray-500 mb-2">
                    {/* Format created_at based on your desired format */}
                    {formatRelativeTime(
                      new Date(post.created_at).toLocaleString()
                    )}

                    {isOwner && (
                      <div className="actions">
                        <button
                          onClick={handleEdit}
                          className="btn btn-edit text-blue-500 text-xs mt-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDeletePost}
                          className="btn btn-delete text-red-500 text-xs mt-2 ml-3"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        className={`flex items-center focus:outline-none ${
                          isLiked ? 'text-red-500' : 'text-gray-700'
                        }`}
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart
                          size={20}
                          className={
                            isLiked
                              ? 'fill-red-500 cursor-pointer'
                              : 'cursor-pointer'
                          }
                        />
                      </button>
                      <button
                        className="flex items-center text-gray-700 focus:outline-none cursor-pointer"
                        onClick={handleCommentClick}
                      >
                        <MessageCircle size={20} />
                      </button>
                      <button
                        className="flex items-center text-gray-700 focus:outline-none cursor-pointer"
                        onClick={() => setIsShareModalOpen(true)}
                      >
                        <Share2 size={20} />
                      </button>
                    </div>
                    <button
                      className={`focus:outline-none ${
                        isSaved ? 'text-yellow-500' : 'text-gray-700'
                      }`}
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark
                        size={20}
                        className={
                          isSaved
                            ? 'fill-yellow-500 cursor-pointer'
                            : 'cursor-pointer'
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Comments</h3>
                <button
                  className="text-gray-500 text-sm cursor-pointer"
                  onClick={() => setShowComments((prev) => !prev)}
                >
                  {showComments ? 'Hide comments' : 'Show comments'}
                </button>
              </div>

              {showComments && (
                <>
                  <div className="flex mb-6">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                    <div className="flex-1">
                      <textarea
                        ref={textareaRef}
                        placeholder="Add a comment..."
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      ></textarea>
                      {commentText.trim() && (
                        <div className="flex justify-end mt-2">
                          <button
                            className="bg-blue-600 text-white px-4 py-1 rounded-full"
                            onClick={handlePostComment}
                          >
                            Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {comments.map((comment) => (
                      // <Comment key={comment.id} comment={comment} />
                      <Comment
                        key={comment.id}
                        comments={comments}
                        setComments={setComments}
                        comment={comment}
                        postUserId={post.user.id}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">
              More from @{post.user.username}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={`/api/placeholder/300/300?text=Photo ${i}`}
                    alt={`Related photo ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
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

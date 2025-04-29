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

// Mock data for a single photo post
const mockPost = {
  id: 1,
  url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_oxsGZfkSE6T2lirH80SKKy9vkD780XxqFuQn5YYa3A&s&ec=72940544',
  title: 'Golden Hour in the Mountains',
  description:
    'Captured this beautiful moment during sunset hike. The light was absolutely magical and created these stunning golden tones across the landscape.',
  user: {
    username: 'nature_explorer',
    displayName: 'Alex Thompson',
    avatar: '/api/placeholder/50/50',
  },
  stats: {
    likes: 1243,
    comments: 87,
    saves: 324,
    views: 15782,
  },
  createdAt: '2025-04-20T14:35:00Z',
};

// Mock comments data
const mockComments = [
  {
    id: 1,
    user: {
      username: 'photo_enthusiast',
      displayName: 'Jamie Wilson',
      avatar: '/api/placeholder/50/50',
    },
    content:
      'This is absolutely breathtaking! The colors are so vibrant. What post-processing software did you use?',
    createdAt: '2025-04-20T15:12:00Z',
    likes: 24,
    replies: [],
  },
  {
    id: 2,
    user: {
      username: 'mountain_climber',
      displayName: 'Chris Parker',
      avatar: '/api/placeholder/50/50',
    },
    content:
      'I recognize this spot! Was just there last month. The light is so special during this time of year.',
    createdAt: '2025-04-20T16:45:00Z',
    likes: 18,
    replies: [
      {
        id: 21,
        user: {
          username: 'nature_explorer',
          displayName: 'Alex Thompson',
          avatar: '/api/placeholder/50/50',
        },
        content:
          'Yes! Late April is perfect for the golden light here. Glad you recognized it!',
        createdAt: '2025-04-20T17:10:00Z',
        likes: 8,
      },
    ],
  },
  {
    id: 3,
    user: {
      username: 'camera_geek',
      displayName: 'Taylor Reed',
      avatar: '/api/placeholder/50/50',
    },
    content:
      'The dynamic range on the new Sony sensors is incredible. You captured so much detail in both the shadows and highlights.',
    createdAt: '2025-04-21T09:25:00Z',
    likes: 32,
    replies: [],
  },
];

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
const Comment = ({ comment, isReply = false }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className={`${isReply ? 'ml-12 mt-3' : 'mb-6'}`}>
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
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-800">{comment.text}</p>
          </div>

          {isReplying && (
            <div className="mt-3 flex">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="text-gray-500 mr-2"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded-full"
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isReply && comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              <button
                className="text-blue-600 text-sm flex items-center"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? 'Hide replies'
                  : `Show ${comment.replies.length} replies`}
              </button>

              {showReplies && (
                <div className="mt-2">
                  {comment.replies.map((reply) => (
                    <Comment key={reply.id} comment={reply} isReply={true} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Full Image Modal component
const FullImageModal = ({ isOpen, onClose, imageUrl, imageTitle }) => {
  const modalRef = useRef(null);
  console.log(imageUrl);

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
      <div
        ref={modalRef}
        className="relative w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => {
          if (e.target === modalRef.current) onClose();
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="max-w-screen-xl max-h-screen p-4">
          <img
            src={
              imageUrl.startsWith('https://')
                ? imageUrl
                : `https://${imageUrl.split('https://')[1]}`
            }
            alt={imageTitle}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>

        {/* Caption */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          <h3 className="text-xl font-medium">{imageTitle}</h3>
        </div>
      </div>
    </div>
  );
};

// Share Modal component
const ShareModal = ({ isOpen, onClose, post }) => {
  const modalRef = useRef(null);
  const [copied, setCopied] = useState(false);

  //   const shareOptions = [
  //     { name: 'Copy Link', icon: <Link size={20} /> },
  //     { name: 'Facebook', icon: '📘' },
  //     { name: 'Twitter', icon: '🐦' },
  //     { name: 'Instagram', icon: '📷' },
  //     { name: 'Pinterest', icon: '📌' },
  //     { name: 'Email', icon: '✉️' },
  //   ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://photoshare.example.com/post/${post.id}`
    );
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
              alt={post.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium">{post.title}</h4>
              <p className="text-sm text-gray-500">by @{post.user.username}</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={`https://photoshare.example.com/post/${post.id}`}
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/photos/${id}/`);
        setPost(res.data);
        console.log(res.data);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error('Failed to fetch post', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <button className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
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

                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold mb-2">{post.caption}</h2>
                  <p className="text-gray-700 mb-4">{post.caption}</p>
                  <div className="text-sm text-gray-500 mb-2">
                    {/* Format created_at based on your desired format */}
                    <div>{new Date(post.created_at).toLocaleString()}</div>
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
                          className={isLiked ? 'fill-red-500' : ''}
                        />
                      </button>
                      <button
                        className="flex items-center text-gray-700 focus:outline-none"
                        onClick={() => setShowComments(!showComments)}
                      >
                        <MessageCircle size={20} />
                      </button>
                      <button
                        className="flex items-center text-gray-700 focus:outline-none"
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
                        className={isSaved ? 'fill-yellow-500' : ''}
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
                      <Comment key={comment.id} comment={comment} />
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
        imageTitle={post.caption}
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

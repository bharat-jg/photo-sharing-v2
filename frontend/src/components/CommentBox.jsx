import { useState } from 'react';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

// This component allows users to add comments to a photo. 
const CommentBox = ({ photoId, onNewComment }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `/comments/`,
        {
          photo: photoId,
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      onNewComment(res.data);
      setText('');
    } catch (err) {
      console.error('Comment failed:', err);
    }
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 relative"
    >
      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
        <input
          type="text"
          className="flex-grow px-4 py-2 bg-transparent text-gray-700 placeholder-gray-400 
                   focus:outline-none"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <motion.button
          type="submit"
          disabled={loading || !text.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 
                    transition-all duration-200 ${
                      loading || !text.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-pink-600 text-white hover:bg-pink-700 shadow-md'
                    }`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              Post
              <Send size={16} />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default CommentBox;

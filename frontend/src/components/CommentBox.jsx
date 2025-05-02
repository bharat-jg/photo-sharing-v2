import { useState } from 'react';
import axios from '../api/axios';

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
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        type="text"
        className="border rounded px-2 py-1 flex-grow"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
      >
        Post
      </button>
    </form>
  );
};

export default CommentBox;

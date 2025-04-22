import axios from '../api/axios'
import { useState } from 'react'

const LikeButton = ({ photoId, liked, likesCount, onUpdate }) => {
  const [loading, setLoading] = useState(false)

  const toggleLike = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }

      await axios.post(`/photos/${photoId}/like-toggle/`, {}, config)
      const res = await axios.get(`/photos/${photoId}/`, config)
      const updatedPhoto = res.data

      onUpdate(updatedPhoto.liked, updatedPhoto.likes_count)
    } catch (err) {
      console.error('Like error:', err)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`mt-2 text-sm font-medium flex items-center gap-1 transition-colors duration-300 ${
        liked ? 'text-red-600' : 'text-gray-500'
      }`}
    >
      <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
      <span>{likesCount}</span>
    </button>
  )
}

export default LikeButton

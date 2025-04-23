import axios from '../api/axios'
import { useState } from 'react'

const LikeButton = ({ photoId, liked, likesCount, onUpdate }) => {
  const [loading, setLoading] = useState(false)

const toggleLike = async () => {
    setLoading(true)
    try {
      const url = `/photos/${photoId}/like-toggle/`
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
  
      await axios.post(url, {}, config)
  
      // Refetch updated photo data
      const res = await axios.get(`/photos/${photoId}/`, config)
      const updatedPhoto = res.data
  
      // Update parent state with the fresh data
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
      className={`mt-2 text-sm font-medium ${liked ? 'text-red-600' : 'text-gray-500'}`}
    >
      {liked ? '❤️ Liked' : '🤍 Like'} ({likesCount})
    </button>
  )
}

export default LikeButton
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import LikeButton from '../components/LikeButton'
import PhotoModal from '../components/PhotoModal'
import { motion, AnimatePresence } from 'framer-motion'

const Feed = () => {
  const [photos, setPhotos] = useState([])
  const [likedPhotoIds, setLikedPhotoIds] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get('/photos/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        setPhotos(res.data)
      } catch (err) {
        console.error('Failed to fetch photos:', err)
      }
    }
    fetchPhotos()
  }, [])

  const handleLikeAnimation = (photoId) => {
    setLikedPhotoIds((prev) => [...prev, photoId])
    setTimeout(() => {
      setLikedPhotoIds((prev) => prev.filter(id => id !== photoId))
    }, 800)
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">📌 Photo Feed</h1>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="break-inside-avoid mb-4 bg-white rounded-xl shadow">
            
            {/* Image */}
            <div onClick={() => setSelectedPhoto(photo)} className="relative cursor-pointer">
              <img
                src={photo.image.replace(/^image\/upload\//, '')}
                alt="Uploaded"
                className="w-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
              />

              {/* Like animation - only on like */}
              <AnimatePresence>
                {likedPhotoIds.includes(photo.id) && photo.liked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-red-500 text-6xl">❤️</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Like Button */}
            <div className="px-3 py-2">
              <LikeButton
                photoId={photo.id}
                liked={photo.liked}
                likesCount={photo.likes_count}
                onUpdate={(newLiked, newCount) => {
                  setPhotos(prev =>
                    prev.map(p =>
                      p.id === photo.id
                        ? { ...p, liked: newLiked, likes_count: newCount }
                        : p
                    )
                  )
                  if (newLiked) handleLikeAnimation(photo.id)
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onCommentAdded={(newComment) => {
            setPhotos(prev =>
              prev.map(p =>
                p.id === selectedPhoto.id
                  ? { ...p, comments: [newComment, ...p.comments] }
                  : p
              )
            )
            setSelectedPhoto(prev => ({
              ...prev,
              comments: [newComment, ...prev.comments]
            }))
          }}
        />
      )}
    </div>
  )
}

export default Feed

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LikeButton from './LikeButton'
import CommentBox from './CommentBox'

export default function PhotoModal({ photo, onClose, onCommentAdded }) {
  const [localPhoto, setLocalPhoto] = useState({
    ...photo,
    profile_photo: photo.profile_photo || 'https://cdn-icons-png.freepik.com/256/6994/6994705.png?ga=GA1.1.1704611719.1745213202&semt=ais_hybrid'
  })

  const handleLikeUpdate = (newLiked, newCount) => {
    setLocalPhoto(prev => ({
      ...prev,
      liked: newLiked,
      likes_count: newCount
    }))
  }

  const handleNewComment = (comment) => {
    const updated = {
      ...localPhoto,
      comments: [comment, ...localPhoto.comments]
    }
    setLocalPhoto(updated)
    onCommentAdded(comment) // Update parent (Feed.jsx)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl p-6 max-w-4xl w-full flex flex-col md:flex-row gap-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
         <img
  src={localPhoto.image.replace(/^image\/upload\//, '')}
  alt="Enlarged"
  className="md:w-1/2 w-full max-h-[70vh] object-contain rounded-xl"
/>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={localPhoto.profile_photo}
                className="w-10 h-10 rounded-full"
                alt="Profile"
              />
              <span className="font-semibold">{localPhoto.username}</span>
            </div>

            <p className="text-grey-800 mb-3">{localPhoto.caption}</p>

            <LikeButton
              photoId={localPhoto.id}
              liked={localPhoto.liked}
              likesCount={localPhoto.likes_count}
              onUpdate={handleLikeUpdate}
            />

            <div className="mt-4 overflow-y-auto max-h-52 space-y-2 text-sm">
              {localPhoto.comments.map(comment => (
                <p key={comment.id}>
                  <b>{comment.user.username}:</b> {comment.text}
                </p>
              ))}
            </div>
            <div className="border-t pt-2">
            <CommentBox
              photoId={localPhoto.id}
              onNewComment={handleNewComment}
            />
          </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

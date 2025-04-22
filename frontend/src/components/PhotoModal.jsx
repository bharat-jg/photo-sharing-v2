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
        className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl p-6 max-w-4xl w-full h-[80vh] flex flex-col md:flex-row gap-6 overflow-hidden"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left - Image */}
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <img
              src={localPhoto.image.replace(/^image\/upload\//, '')}
              alt="Enlarged"
              className="object-contain max-h-full rounded-xl"
            />
          </div>

          {/* Right - Details */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* User Info */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={localPhoto.profile_photo}
                className="w-10 h-10 rounded-full"
                alt="Profile"
              />
              <span className="font-semibold">{localPhoto.username}</span>
            </div>

            {/* Caption */}
            <p className="text-lg font-semibold text-gray-800 mb-3">
              {localPhoto.caption}
            </p>

            {/* Like Button */}
            <LikeButton
              photoId={localPhoto.id}
              liked={localPhoto.liked}
              likesCount={localPhoto.likes_count}
              onUpdate={handleLikeUpdate}
            />

            {/* Comments Scrollable */}
            <div className="mt-4 flex-1 overflow-y-auto pr-2 space-y-2 text-sm">
            {localPhoto.comments.length === 0 ? (
    <p className="text-gray-500">No comments yet</p>
  ) : (
    localPhoto.comments.map(comment => (
      <p key={comment.id}>
        <b>{comment.user.username}:</b> {comment.text}
      </p>
    ))
  )}
            </div>

            {/* Comment Box at Bottom */}
            <div className="border-t pt-2 mt-2">
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

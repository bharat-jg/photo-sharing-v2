import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LikeButton from './LikeButton';
import CommentBox from './CommentBox';

export default function PhotoModal({
  photo,
  onClose,
  onCommentAdded,
  onLikeUpdated,
}) {
  const [localPhoto, setLocalPhoto] = useState({
    ...photo,
    profile_photo:
      photo.profile_photo ||
      'https://cdn-icons-png.freepik.com/256/6994/6994705.png?ga=GA1.1.1704611719.1745213202&semt=ais_hybrid',
  });

  const handleLikeUpdate = (newLiked, newCount) => {
    setLocalPhoto((prev) => ({
      ...prev,
      liked: newLiked,
      likes_count: newCount,
    }));
    if (onLikeUpdated) {
      onLikeUpdated(localPhoto.id, newLiked, newCount);
    }
  };

  const handleNewComment = (comment) => {
    const updated = {
      ...localPhoto,
      comments: [comment, ...localPhoto.comments],
    };
    setLocalPhoto(updated);
    onCommentAdded(comment);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl p-4 max-w-5xl w-full h-[80vh] flex flex-col md:flex-row gap-6 shadow-lg relative overflow-hidden"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="md:w-1/2 w-full h-full flex items-center justify-center">
            <img
              src={localPhoto.image.replace(/^image\/upload\//, '')}
              alt="Enlarged"
              className="h-full w-full object-contain rounded-xl"
            />
          </div>

          {/* Right Side Info */}
          <div className="flex-1 flex flex-col">
            {/* User info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={localPhoto.profile_photo}
                className="w-10 h-10 rounded-full object-cover"
                alt="Profile"
              />
              <span className="font-semibold text-gray-800">
                {localPhoto.username}
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              {/* Save Button */}
              <button className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full hover:bg-red-600">
                Save
              </button>

              {/* Meatballs Menu (⋮) */}
              <div className="relative group">
                <button className="text-gray-700 text-xl font-bold">⋮</button>
                <div className="absolute right-0 mt-2 hidden group-hover:block w-40 bg-white border border-gray-200 shadow-md rounded-md z-10">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Download Image
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Hide Post
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Report
                  </button>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Embed
                  </button>
                </div>
              </div>
            </div>

            {/* Caption Below */}
            <p className="text-gray-800 font-semibold text-base">
              {localPhoto.caption}
            </p>
            <div className="left-0">
              <LikeButton
                photoId={localPhoto.id}
                liked={localPhoto.liked}
                likesCount={localPhoto.likes_count}
                onUpdate={handleLikeUpdate}
              />
            </div>

            {/* Comments */}
            <div className="mt-4 overflow-y-auto flex-1 pr-1 space-y-2 text-sm">
              {localPhoto.comments.map((comment) => (
                <p key={comment.id}>
                  <b>{comment.user.username}:</b> {comment.text}
                </p>
              ))}
            </div>

            {/* Comment Box */}
            <div className="border-t mt-4 pt-3">
              <p> what do you think?</p>

              <CommentBox
                photoId={localPhoto.id}
                onNewComment={handleNewComment}
              />
            </div>
          </div>

          {/* Close Button (optional UI polish) */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

const UploadPhoto = () => {
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImage(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption.trim()) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();

      await axios.post(
        '/photos/',
        {
          image: cloudData.secure_url,
          caption,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      navigate('/');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  // Update the handleFileChange function
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(''); // Clear any previous errors

    if (file) {
      // Check file size (20MB = 20 * 1024 * 1024 bytes)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes

      if (file.size > maxSize) {
        setError('File size must be less than 20MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // If validations pass, set the image
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-10 px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col w-full max-w-5xl mx-auto overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Share Your Moment</h1>
          <p className="text-white/80 mt-2">
            Upload a photo to share with the community
          </p>
        </div>

        <div className="flex flex-grow p-8 gap-8">
          {/* Left: Upload Area */}
          <div className="flex-1">
            {!imagePreview ? (
              <label
                htmlFor="file-upload"
                className="group relative flex flex-col items-center justify-center w-full h-[400px] border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-pink-500 transition-all duration-200 bg-gray-50/50"
              >
                <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 rounded-2xl transition-colors duration-200" />
                <Upload
                  size={48}
                  className="text-gray-400 mb-4 group-hover:text-pink-500 transition-colors duration-200"
                />
                <p className="text-gray-700 text-center font-medium">
                  Drop your photo here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports high-quality JPG files under 20MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                {error && (
                  <p className="absolute bottom-4 left-0 right-0 text-center text-red-500 text-sm bg-red-50 py-2">
                    {error}
                  </p>
                )}
              </label>
            ) : (
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Right: Form Fields */}
          <div className="w-[400px] flex flex-col">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write something about your photo..."
                  className="w-full p-3 min-h-[120px] max-h-[200px] bg-gray-50 rounded-xl border border-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
                           transition-all duration-200 resize-none"
                  required
                />
              </div>

              {image && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <ImageIcon size={16} />
                  <span>Selected: {image.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 mt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={uploading || !image}
                className={`w-full py-3 px-6 rounded-full text-white font-semibold 
                         transition-all duration-200 flex items-center justify-center
                         ${
                           uploading || !image
                             ? 'bg-gray-300 cursor-not-allowed'
                             : 'bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg'
                         }`}
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Share Photo'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPhoto;

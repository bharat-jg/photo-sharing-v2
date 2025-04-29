import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UploadPhoto = () => {
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-lg flex flex-col w-full max-w-5xl h-[660px] overflow-hidden"
      >
        {/* Heading */}

        <div className="flex flex-grow">
          {/* Left: Upload Area */}

          <div className="flex flex-col items-center justify-center w-1/2 bg-gray-50 border-r border-gray-200 p-6">
            {!imagePreview ? (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-120 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-pink-500 transition"
              >
                <span className="text-4xl mb-2">⬆️</span>
                <p className="text-gray-700 text-center">
                  Choose a file or drag and drop
                  <br />
                  it here
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Use high-quality .jpg files under 20MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            ) : (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain rounded-xl"
              />
            )}
          </div>

          {/* Right: Form Fields */}
          <div className="w-1/2 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Upload your photo
              </h1>
              <h2>Select an image file to share with community</h2>

              <textarea
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full px-4 py-2 min-h-11 max-h-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />

              {image && (
                <p className="text-sm text-green-600">Selected: {image.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={uploading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  uploading
                    ? 'bg-pink-300 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700'
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload Now'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                {/* Drag & drop coming soon 🚀 */}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default UploadPhoto;

import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { div } from 'framer-motion/client'

const UploadPhoto = () => {
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = e => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!image || !caption.trim()) return

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', image)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      })

      const cloudData = await cloudRes.json()

      await axios.post('/photos/', {
        image: cloudData.secure_url,
        caption
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      navigate('/')
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    

    <div className="flex w-[100%] items-center justify-center h-[100vh] bg-gradient-to-br from-pink-50 to-pink-100 px-4 border border-black">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transition-transform transform hover:scale-[1.02]">
   
   <div className="text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Upload Your Photo</h1>
        <p className="text-gray-600 mb-6">Select an image file to share with the community.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex justify-center items-center bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition"
          >
            📁 Select Photo
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </label>

          {image && (
            <p className="text-sm text-green-600">Selected: {image.name}</p>
          )}

          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Enter a caption..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 rounded-lg text-white font-bold transition ${
              uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Now'}
          </button>
        </form>

        <p className="mt-8 text-xs text-gray-400">Drag & drop coming soon 🚀</p>
      </div>
    </div>
    </div>
   

    
  )
}

export default UploadPhoto

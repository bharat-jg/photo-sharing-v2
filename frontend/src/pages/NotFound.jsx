import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-12 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl max-w-lg w-full mx-4"
      >
        <div className="relative inline-block">
          <h1 className="text-6xl font-bold mr-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
            404
          </h1>
          <div className="absolute bottom-1 left-0 w-full h-3 bg-pink-500 opacity-20 transform -rotate-2"></div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4 relative inline-block">
          <span className="relative z-10">Page Not Found</span>
          <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
        </h2>

        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 
                     rounded-full font-semibold hover:shadow-lg transform transition-all 
                     duration-200 inline-block"
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;

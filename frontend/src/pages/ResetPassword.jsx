import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    const isValidPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
      password
    );

    if (!isValidPassword) {
      setPasswordError(
        'Password must be at least 8 characters and include a capital letter, number, and special character.'
      );
      setIsLoading(false); 
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/password-reset-confirm/${uid}/${token}/`,
        { password }
      );

      if (res.status === 200) {
        setPasswordError(null);
        setPasswordSuccess('Password reset successfully!');

        setTimeout(() => {
          setIsLoading(false);
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      setPasswordError(
        error.response?.data?.error || 'Something went wrong. Try again.'
      );
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 relative inline-block">
            <span className="relative z-10">Reset Password</span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
          </h2>
          <p className="text-gray-600 mt-2">
            Please enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-pink-500 
                         focus:border-transparent transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Password must be at least 8 characters and include a capital
              letter, number, and special character
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white font-semibold py-3 px-6 
                     rounded-full shadow-md hover:bg-pink-700 
                     transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
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
                Resetting Password...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {passwordError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-lg bg-red-50 text-red-700"
          >
            {passwordError}
          </motion.div>
        )}

        {passwordSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-lg bg-green-50 text-green-700"
          >
            {passwordSuccess}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

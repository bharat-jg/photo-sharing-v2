import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {   
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/token/', form);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r  bg-[linear-gradient(135deg,_#00C9FF,_#7F00FF,_#E100FF)] ">
      <motion.div
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6">Welcome 👋</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            </div>
            <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-pink-500 hover:text-pink-600 font-medium">
              Forgot Password?
            </Link>
     
          
          </div>
          {error && (
            <p className="text-sm text-red-500 font-medium text-center -mt-2">{error}</p>
          )}
          <motion.button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl shadow transition-all duration-200"
            style={{ backgroundColor: '#ec4899', color: 'white' }}
         whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </form> <div className="mt-4 text-center">
  <p className="text-sm text-gray-600">
  Don't have an account?{' '}
   
    <Link to="/register" className="text-pink-600 hover:text-pink-700 font-semibold">
      Sign Up here
    </Link>
  </p>
</div>
      </motion.div>
       
    </div>
  );
};

export default Login;

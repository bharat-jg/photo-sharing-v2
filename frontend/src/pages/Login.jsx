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
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        navigate('/'); // Redirect to feed page after successful login
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2 relative inline-block">
            <span className="relative z-10">Welcome</span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
          </h2>
          <p className="text-gray-600">Sign in to share your moments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-pink-500 
                       focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-pink-500 
                       focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-pink-600 hover:text-pink-700 font-medium 
                       transition-colors duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p
              className="text-sm text-red-500 font-medium text-center bg-red-50 
                         py-2 px-4 rounded-lg"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-3 px-6 
                     rounded-full shadow-md hover:bg-pink-700 
                     transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-pink-600 hover:text-pink-700 font-semibold 
                       transition-colors duration-200"
            >
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

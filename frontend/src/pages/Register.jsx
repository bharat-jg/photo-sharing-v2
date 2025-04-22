import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    const isValidPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(form.password);

    if (!isValidPassword) {
      setError("Password must be at least 8 characters and include a capital letter, number, and special character.");
      return;
    }
    
  
    try {
      await axios.post('/register/', form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };
  

  return (
    <div className="flex items-center justify-center bg-gradient-to-br min-h-screen bg-[linear-gradient(135deg,_#00C9FF,_#7F00FF,_#E100FF)]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transition-transform transform hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-pink-600 mb-6 text-center tracking-tight">
          Join Us on PinClone 📌
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              required
            />
          </div>

          <div>
  <label className="text-sm font-medium text-gray-700">Password</label>
  <input
    name="password"
    type="password"
    placeholder="••••••••"
    onChange={handleChange}
    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
    required
  />
  {form.password && !/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password) && (
    <p className="text-xs text-red-500 mt-1">
      Must be at least 8 characters with 1 uppercase letter and 1 number
    </p>
  )}
</div>


          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl shadow transition-all duration-200"
            style={{ backgroundColor: '#ec4899', color: 'white' }}
          >
            Sign Up
          </button>

          {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;

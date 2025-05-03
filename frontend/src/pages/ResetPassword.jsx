import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      }

      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 1500);
    } catch (error) {
      setPasswordError(
        error.response?.data?.error || 'Something went wrong. Try again.'
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
        {passwordError && (
          <p className="text-red-500 text-sm mt-2">{passwordError}</p>
        )}
        {passwordSuccess && (
          <p className="text-green-600 text-sm mt-2">{passwordSuccess}</p>
        )}
      </form>
    </div>
  );
}

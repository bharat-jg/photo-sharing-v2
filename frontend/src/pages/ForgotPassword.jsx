import { useState } from 'react';
import axios from '../api/axios';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/change-password/', {
        username,
        new_password: newPassword,
      });
      setSuccess('Password changed successfully!');
      setError('');
    } catch (err) {
      setError('Could not change password. Check username.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-md"
          >
            Change Password
          </button>
          {success && <p className="text-green-600 text-sm">{success}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
{/* change-password.py in views # views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

@api_view(['POST'])
def change_password(request):
    username = request.data.get('username')
    new_password = request.data.get('new_password')

    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
*/}
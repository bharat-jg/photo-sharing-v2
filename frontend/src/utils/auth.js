import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Return the current user's ID
export const getCurrentUserId = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.user_id || null;
  } catch (e) {
    console.error('Token decode error:', e);
    return null;
  }
};

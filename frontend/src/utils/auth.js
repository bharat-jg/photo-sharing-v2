import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Return the full user object decoded from JWT
export const getCurrentUser = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    return jwtDecode(token); // returns the full user object: { user_id, username, exp, ... }
  } catch (e) {
    console.error('Token decode error:', e);
    return null;
  }
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

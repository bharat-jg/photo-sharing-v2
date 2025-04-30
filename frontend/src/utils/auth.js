import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getCurrentUserId = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    return jwtDecode(token); // returns { user_id, username, exp, ... }
  } catch (e) {
    return null;
  }
};

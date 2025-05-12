import { Navigate } from 'react-router-dom';

// This component checks if the user is authenticated before allowing access to certain routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return token !== null && token !== '' && token !== 'undefined';
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import UploadPhoto from './pages/UploadPhoto';
import './index.css';
import ForgotPassword from './pages/ForgotPassword';
import PhotoDetail from './pages/PhotoDetail';
import Explore from './pages/explore';
import ProfilePage from './pages/ProfilePage';
import Layout from './pages/Layout';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    return token !== null && token !== '' && token !== 'undefined';
  };

  // Initial auth check
  useEffect(() => {
    setIsAuth(checkAuth());
  }, []);

  // Listen for storage events, with debounce to prevent recursive updates
  useEffect(() => {
    const handleStorageChange = () => {
      const currentAuthState = checkAuth();
      if (isAuth !== currentAuthState) {
        setIsAuth(currentAuthState);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuth]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/feed" replace /> : <LandingPage />}
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/feed" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuth ? <Navigate to="/feed" replace /> : <Register />}
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPhoto />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route
          path="/photos/:id"
          element={
            <ProtectedRoute>
              <PhotoDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;

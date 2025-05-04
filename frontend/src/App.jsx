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
import Navbar from './components/Navbar'; // adjust path
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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

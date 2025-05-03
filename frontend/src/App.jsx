import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import { isAuthenticated } from './utils/auth';
import UploadPhoto from './pages/UploadPhoto';
import './index.css';
import ForgotPassword from './pages/ForgotPassword';
import PhotoDetail from './pages/PhotoDetail';
import Explore from './pages/explore';
import ProfilePage from './pages/ProfilePage';
import Layout from './pages/Layout';
import Navbar from './components/Navbar'; // adjust path
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Feed /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={
            <>
              <UploadPhoto />
            </>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
}

export default App;

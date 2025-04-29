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
import Notifications from './pages/Notifications';
import ProfilePage from './pages/ProfilePage';
import Layout from './pages/Layout';
import Navbar from './components/Navbar'; // adjust path

function App() {
  return (
    // <Router>
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
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
    // </Router>
  );
}

export default App;

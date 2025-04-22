import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import { isAuthenticated } from './utils/auth'
import UploadPhoto from './pages/UploadPhoto'
import './index.css';


function App() {

  return (
    <Routes>
      <Route path="/" element={isAuthenticated() ? <Feed /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<><UploadPhoto /></>} />
    </Routes>
  )
}

export default App

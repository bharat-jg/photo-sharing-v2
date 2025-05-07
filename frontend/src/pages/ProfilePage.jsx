import { useEffect, useState } from 'react';
import axios from 'axios';
import { PencilIcon, XIcon, CheckIcon } from 'lucide-react';
import { PhotoCard } from './Feed';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldValues, setFieldValues] = useState({});
  const [photos, setPhotos] = useState([]);
  const [sortOption, setSortOption] = useState(
    () => localStorage.getItem('sortOption') || 'recent'
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [savedSortOption, setSavedSortOption] = useState('recent');
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'uploaded';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  console.log('savedPhotos', savedPhotos);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab }); // update the URL
  };

  useEffect(() => {
    const fetchSavedPhotos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/api/photos/saved/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedPhotos(res.data);
      } catch (err) {
        console.error('Failed to load saved photos', err);
      }
    };
    if (activeTab === 'saved') fetchSavedPhotos();
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('sortOption', sortOption);
  }, [sortOption]);

  useEffect(() => {
    if (userData?.id) {
      fetchPhotos();
    }
  }, [userData?.id, sortOption]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/api/profile/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
        setOriginalUserData(res.data);
        setFieldValues({
          name: res.data.first_name + ' ' + res.data.last_name,
          email: res.data.email,
          username: res.data.username,
          bio: res.data.bio || '',
        });
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    fetchUserData();
  }, []);

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/photos/?user_id=${userData?.id}&sort_by=${sortOption}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPhotos(response.data);
    } catch (error) {
      console.error('Failed to fetch photos', error);
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field);
    setFieldErrors({});
  };

  const handleCancelEdit = () => {
    setFieldValues({
      name: originalUserData.first_name + ' ' + originalUserData.last_name,
      email: originalUserData.email,
      username: originalUserData.username,
      bio: originalUserData.bio || '',
    });
    setEditingField(null);
    setFieldErrors({});
  };

  const handleFieldChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldSave = async (field) => {
    const token = localStorage.getItem('access_token');
    const payload = {};

    if (field === 'name') {
      const [first_name, ...lastArr] = fieldValues.name.trim().split(' ');
      payload.first_name = first_name;
      payload.last_name = lastArr.join(' ');
    } else {
      payload[field] = fieldValues[field];
    }

    try {
      const res = await axios.patch(
        'http://localhost:8000/api/profile/me/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(res.data);
      setOriginalUserData(res.data);
      setEditingField(null);
      setFieldErrors({});
    } catch (err) {
      const errorMsg = err.response?.data?.[field]?.[0] || 'Invalid input';
      setFieldErrors({ [field]: errorMsg });
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleChangePassword = async () => {
    // Validation
    const isValidPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
      newPassword
    );

    if (!isValidPassword) {
      setPasswordError(
        'Password must be at least 8 characters and include a capital letter, number, and special character.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/auth/change-password/',
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setPasswordError('');
      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => handleCloseModal(), 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setPasswordError(error.response.data.detail);
      } else {
        setPasswordError('Something went wrong. Try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleLogout = () => {
    // Clear user authentication data (localStorage, sessionStorage, etc.)
    localStorage.removeItem('access_token'); // Or clear cookies, or use your logout API if needed

    // Redirect to login page
    navigate('/login'); // Adjust the path as per your routing setup
  };

  if (!userData) return <p>Loading...</p>;

  const { profile_photo, posts_count } = userData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Profile Header */}
      <div className="p-8 mt-5">
        <div className="flex items-center space-x-8  mb-8">
          <div className="rounded-full w-32 h-32 border-4 border-pink-500 overflow-hidden shadow-lg">
            <img
              src={profile_photo || '/placeholder.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 relative inline-block">
              <span className="relative z-10">{fieldValues.name}</span>
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
            </h1>
            <p className="text-lg text-gray-600">@{fieldValues.username}</p>
            <p className="text-gray-700 mt-4 max-w-xl">{fieldValues.bio}</p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200 px-8 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex space-x-8  ">
          {['profile', 'uploaded', 'saved'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(`${tab}`)}
              className={`py-4 px-1 relative ${
                activeTab === tab
                  ? 'text-pink-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="capitalize">{tab}</span>
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="px-8 py-6">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6 relative inline-block">
                <span className="relative z-10">Personal Information</span>
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
              </h2>
              <div className="space-y-6">
                {['name', 'email', 'username', 'bio'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      {field === 'name'
                        ? 'Full Name'
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      {editingField === field ? (
                        <>
                          {field === 'bio' ? (
                            <div className="flex-1">
                              <textarea
                                value={fieldValues[field] || ''}
                                onChange={(e) => {
                                  if (e.target.value.length <= 150) {
                                    handleFieldChange(field, e.target.value);
                                  }
                                }}
                                rows={3}
                                placeholder="Write something about yourself..."
                                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 
                                         focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                              />
                              <p className="text-sm text-gray-400 text-right mt-1">
                                {fieldValues[field]?.length || 0}/150 characters
                              </p>
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={fieldValues[field] || ''}
                              onChange={(e) =>
                                handleFieldChange(field, e.target.value)
                              }
                              className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 
                                       focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                          )}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleFieldSave(field)}
                              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <XIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {fieldValues[field] || ''}
                          </span>
                          <button
                            onClick={() => handleEditClick(field)}
                            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    {fieldErrors[field] && (
                      <p className="text-red-500 text-sm mt-2">
                        {fieldErrors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Card */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6 relative inline-block">
                  <span className="relative z-10">Security</span>
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
                </h2>
                <div className="space-y-6">
                  {/* Password Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Password
                    </label>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800">••••••••</span>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-6 py-2 bg-pink-600 text-white rounded-full 
                                 hover:bg-pink-700 transition-colors duration-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Account
                    </label>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800">
                        Log out of your account
                      </span>
                      <button
                        onClick={() => setShowLogoutConfirmation(true)}
                        className="px-6 py-2 border-2 border-pink-400  text-gray-700 rounded-full 
                                 hover:bg-pink-100 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photos Sections */}
        {(activeTab === 'uploaded' || activeTab === 'saved') && (
          <div>
            {activeTab === 'uploaded' && (
              <div className="flex justify-between items-center mb-8">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="px-4 py-2 bg-white rounded-full border border-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            )}

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
              {(activeTab === 'uploaded' ? photos : savedPhotos).length > 0 ? (
                (activeTab === 'uploaded' ? photos : savedPhotos).map(
                  (photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      onClick={() => navigate(`/photos/${photo.id}`)}
                    />
                  )
                )
              ) : (
                <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
                  <p className="text-xl text-gray-600">
                    No {activeTab} photos yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block">
              <span className="relative z-10">Change Password</span>
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500 opacity-30 transform -rotate-1"></div>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-pink-500 
                     focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-pink-500 
                     focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-pink-500 
                     focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm"
              >
                {passwordError}
              </motion.p>
            )}

            {passwordSuccess && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-green-50 text-green-600 rounded-xl text-sm"
              >
                {passwordSuccess}
              </motion.p>
            )}

            <div className="flex justify-end mt-8 space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-medium 
                   hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChangePassword}
                className="px-6 py-2.5 bg-pink-600 text-white rounded-full font-medium 
                   hover:bg-pink-700 shadow-md hover:shadow-lg 
                   transition-all duration-200"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
              You will be logged out of your account.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full 
                         hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-pink-600 text-white rounded-full 
                         hover:bg-pink-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

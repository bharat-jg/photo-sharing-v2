import { useEffect, useState } from 'react';
import axios from 'axios';
import { PencilIcon, XIcon, CheckIcon } from 'lucide-react';
import { PhotoCard } from './Feed';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('uploaded');
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

  const navigate = useNavigate();

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

  if (!userData) return <p>Loading...</p>;

  const { profile_photo, posts_count } = userData;

  return (
    <div className="bg-gray-50 min-h-screen ml-20">
      {/* Profile Header */}
      <div className="p-8 mt-20 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="rounded-full w-32 h-32 border-4 border-red-500 overflow-hidden">
            <img
              src={profile_photo || '/placeholder.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {fieldValues.name}
            </h1>
            <p className="text-gray-500">@{fieldValues.username}</p>
            <p className="text-gray-700 mt-2 max-w-xl">{fieldValues.bio}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-8 sticky top-0 bg-white z-10">
        <div className="flex space-x-8">
          {['profile', 'uploaded'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 relative ${
                activeTab === tab
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="capitalize">{tab}</span>
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                {['name', 'email', 'username', 'bio'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
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
                                className="text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md p-2 w-full resize-none"
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
                              className="flex-1 text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md p-2 w-full max-w-xl"
                              placeholder="Enter value"
                            />
                          )}

                          <div className="flex space-x-2">
                            <CheckIcon
                              title="Save"
                              className="w-5 h-5 text-green-500 hover:text-green-600 cursor-pointer transition"
                              onClick={() => handleFieldSave(field)}
                            />
                            <XIcon
                              title="Cancel"
                              className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer transition"
                              onClick={handleCancelEdit}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-800 flex-1 break-words min-h-[36px] border-1 rounded-md p-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full max-w-xl">
                            {fieldValues[field] || ''}
                          </span>
                          <button
                            title="Edit"
                            className="text-gray-400 hover:text-blue-500 transition"
                            onClick={() => handleEditClick(field)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {fieldErrors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Password
                    </label>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800">••••••••</span>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Change Password
                      </button>

                      {showPasswordModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
                            <h2 className="text-xl font-semibold mb-4">
                              Change Password
                            </h2>

                            <div className="space-y-4">
                              <input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) =>
                                  setCurrentPassword(e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                              />
                              <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                              />
                              <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                              />
                            </div>

                            {passwordError && (
                              <p className="text-red-500 text-sm mt-2">
                                {passwordError}
                              </p>
                            )}
                            {passwordSuccess && (
                              <p className="text-green-600 text-sm mt-2">
                                {passwordSuccess}
                              </p>
                            )}

                            <div className="flex justify-end mt-6 space-x-3">
                              <button
                                onClick={() => handleCloseModal()}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uploaded' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="border p-2 rounded-md"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
              {photos.length > 0 ? (
                photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onClick={() => navigate(`/photos/${photo.id}`)}
                  />
                ))
              ) : (
                <p className="text-gray-500">No uploaded photos yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

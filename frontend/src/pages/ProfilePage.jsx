import { useState } from 'react';
import {
  PencilIcon,
  LockIcon,
  GlobeIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('uploaded');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Mock data
  const user = {
    name: 'Payal Ashtikar',
    username: '@PayalAshtikar',
    bio: 'Professional photographer and digital artist. Capturing the world one frame at a time.',
    posts: 128,
    email: 'Payal.Ashtikar@example.com',
    joinedDate: 'January 2018',
  };

  // Mock uploads data
  const uploads = [
    {
      id: 1,
      imageUrl: '/api/placeholder/400/300',
      title: 'Mountain Sunset',
      likes: 234,
    },
    {
      id: 2,
      imageUrl: '/api/placeholder/400/500',
      title: 'City Nightscape',
      likes: 187,
    },
    {
      id: 3,
      imageUrl: '/api/placeholder/400/400',
      title: 'Forest Path',
      likes: 312,
    },
    {
      id: 4,
      imageUrl: '/api/placeholder/400/300',
      title: 'Ocean Waves',
      likes: 176,
    },
    {
      id: 5,
      imageUrl: '/api/placeholder/400/450',
      title: 'Desert Dunes',
      likes: 203,
    },
    {
      id: 6,
      imageUrl: '/api/placeholder/400/350',
      title: 'Autumn Colors',
      likes: 265,
    },
  ];

  // Mock albums data
  const albums = [
    {
      id: 1,
      coverUrl: '/api/placeholder/300/300',
      title: 'Landscapes',
      itemCount: 24,
      isPrivate: false,
    },
    {
      id: 2,
      coverUrl: '/api/placeholder/300/300',
      title: 'Architecture',
      itemCount: 18,
      isPrivate: false,
    },
    {
      id: 3,
      coverUrl: '/api/placeholder/300/300',
      title: 'Personal',
      itemCount: 32,
      isPrivate: true,
    },
    {
      id: 4,
      coverUrl: '/api/placeholder/300/300',
      title: 'Travel 2024',
      itemCount: 47,
      isPrivate: false,
    },
    {
      id: 5,
      coverUrl: '/api/placeholder/300/300',
      title: 'Client Work',
      itemCount: 15,
      isPrivate: true,
    },
  ];

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedItems([]);
  };

  const deleteSelectedItems = () => {
    // Handle delete logic here
    alert(`Deleting items: ${selectedItems.join(', ')}`);
    setSelectedItems([]);
    setIsSelectMode(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen ml-20">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 w-full">
          <img
            src="/api/placeholder/1200/400"
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Photo */}
        <div className="absolute left-8 -bottom-16">
          <div className="rounded-full w-32 h-32 border-4 border-white overflow-hidden">
            <img
              src="/api/placeholder/200/200"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="absolute right-8 bottom-4">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md flex items-center hover:bg-gray-50"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* User Info Section */}
      <div className="pt-20 px-8 pb-6">
        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
        <p className="text-gray-500 mb-2">{user.username}</p>
        <p className="text-gray-700 mb-4 max-w-2xl">{user.bio}</p>

        {/* Stats */}
        <div className="flex space-x-6">
          <div className="text-center">
            <span className="block font-bold text-gray-800">{user.posts}</span>
            <span className="text-sm text-gray-500">Posts</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-8 sticky top-0 bg-white z-10">
        <div className="flex space-x-8">
          {['profile', 'uploaded', 'albums'].map((tab) => (
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

      {/* Tab Content */}
      <div className="px-8 py-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">{user.name}</span>
                    <button className="text-gray-400 hover:text-blue-500">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">{user.email}</span>
                    <button className="text-gray-400 hover:text-blue-500">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Bio
                  </label>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 truncate max-w-xs">
                      {user.bio}
                    </span>
                    <button className="text-gray-400 hover:text-blue-500">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
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
                      <button className="text-blue-500 text-sm font-medium">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Tab */}
        {activeTab === 'uploaded' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4 items-center">
                <select className="border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <option>All Uploads</option>
                  <option>Public</option>
                  <option>Private</option>
                </select>

                <select className="border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                  <option>Oldest</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={toggleSelectMode}
                  className={`px-4 py-2 rounded-lg ${
                    isSelectMode
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isSelectMode ? 'Cancel Selection' : 'Select Items'}
                </button>

                {isSelectMode && selectedItems.length > 0 && (
                  <button
                    onClick={deleteSelectedItems}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete ({selectedItems.length})
                  </button>
                )}
              </div>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploads.map((item) => (
                <div
                  key={item.id}
                  className={`group relative rounded-lg overflow-hidden ${
                    isSelectMode && selectedItems.includes(item.id)
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                    {!isSelectMode && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                          <PencilIcon className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="text-sm">{item.likes} likes</div>
                    </div>

                    {isSelectMode && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={() => toggleItemSelection(item.id)}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 ${
                            selectedItems.includes(item.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-white'
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums Tab */}
        {activeTab === 'albums' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Albums</h2>

              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Album
              </button>
            </div>

            {/* Albums Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square">
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {album.isPrivate ? (
                        <div className="bg-gray-800 bg-opacity-75 p-1.5 rounded-full">
                          <LockIcon className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="bg-gray-800 bg-opacity-75 p-1.5 rounded-full">
                          <GlobeIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="flex space-x-2">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                          <PencilIcon className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-800">{album.title}</h3>
                    <p className="text-sm text-gray-500">
                      {album.itemCount} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

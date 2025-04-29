import React from 'react';

const notifications = [
  'Anna liked your photo.',
  'You have a new follower: John.',
  'New comment on your post.',
  'Mira mentioned you in a comment.',
];

const Notifications = () => {
  return (
    <div className="pt-24 pl-16 md:pl-20 pr-4 pb-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {notifications.map((note, idx) => (
          <div key={idx} className="p-4 hover:bg-gray-50 transition">
            <p className="text-gray-700">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

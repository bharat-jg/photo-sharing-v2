import React from 'react';

const Explore = () => {
  const topics = ['Nature', 'People', 'Art', 'Travel', 'Animals', 'Technology'];

  return (
    <div className="pt-24 pl-16 md:pl-20 pr-4 pb-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Explore</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="h-40 bg-blue-100 rounded-xl flex items-center justify-center text-lg font-semibold text-blue-800 shadow hover:shadow-md transition"
          >
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;

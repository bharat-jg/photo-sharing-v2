import React from 'react';

export default function UserProfileSkeleton() {
  return (
    <div className="animate-pulse p-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="flex gap-8 mt-4">
            <div className="space-y-1">
              <div className="h-5 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="space-y-1">
              <div className="h-5 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="space-y-1">
              <div className="h-5 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, idx) => (
          <div key={idx} className="aspect-square bg-gray-300 rounded-lg">
            <div className="h-full w-full animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

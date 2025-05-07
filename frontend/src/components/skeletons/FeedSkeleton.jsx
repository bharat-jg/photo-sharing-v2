import React from 'react';

export default function FeedSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <main className="pt-12 px-6 md:px-8 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <div className="text-center mb-16 animate-pulse">
            <div className="h-12 w-48 bg-gray-300 rounded-lg mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-300 rounded-lg mx-auto"></div>
          </div>

          {/* Photos Grid Skeleton */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3.5">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="relative mb-4 rounded-xl overflow-hidden animate-pulse"
              >
                {/* Image placeholder */}
                <div className="aspect-[3/4] w-full bg-gray-300"></div>

                {/* User info and likes placeholder */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gray-300"></div>
                      <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-300 px-3 py-1 rounded-full">
                      <div className="h-3 w-8 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

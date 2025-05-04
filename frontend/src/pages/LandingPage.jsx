import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl font-bold text-white mb-8">
            Share Your Moments
          </h1>
          <p className="text-xl text-white mb-12 max-w-2xl">
            Join our community and share your most precious moments with friends
            and family. Create memories that last forever.
          </p>
          <div className="space-x-6">
            <Link
              to="/register"
              className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

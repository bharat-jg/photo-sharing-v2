import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const StatCard = ({ number, label }) => (
  <motion.div whileHover={{ y: -5 }} className="text-center">
    <h3 className="text-4xl font-bold text-white mb-2">{number}</h3>
    <p className="text-white/80">{label}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center min-h-screen text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-bold text-white mb-8"
            >
              Share Your Moments
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white mb-12 max-w-2xl"
            >
              Join our vibrant community and share your most precious moments.
              Create, connect, and inspire through the power of visual
              storytelling.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-x-6"
            >
              <Link
                to="/register"
                className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors inline-block"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📸"
              title="Share Instantly"
              description="Upload and share your photos with just a few clicks"
            />
            <FeatureCard
              icon="💫"
              title="Beautiful Galleries"
              description="Showcase your work in stunning, customizable galleries"
            />
            <FeatureCard
              icon="🤝"
              title="Engage & Connect"
              description="Join a community of passionate photographers"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <StatCard number="100K+" label="Active Users" />
            <StatCard number="1M+" label="Photos Shared" />
            <StatCard number="50K+" label="Daily Interactions" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Sharing?</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of photographers who are already sharing their
            stories
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

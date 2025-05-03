import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const isValidPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
      form.password
    );

    if (!isValidPassword) {
      setError(
        'Password must be at least 8 characters and include a capital letter, number, and special character.'
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await axios.post('/register/', form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }

    // Simulate registration
    // setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    //   // Navigate would happen here in a real application
    //   console.log('Registration successful');
    // }, 1500);
  };

  // Material Design elevation effect on scroll
  const handleScroll = (e) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const appBar = document.getElementById('app-bar');

    if (scrollTop > 10) {
      appBar.classList.add('elevated');
    } else {
      appBar.classList.remove('elevated');
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-white overflow-hidden"
      onScroll={handleScroll}
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* App Bar */}
      <div
        id="app-bar"
        className="flex items-center px-4 h-16 bg-white shadow-sm transition-shadow duration-300 z-10"
      >
        <div className="flex items-center space-x-3">
          <svg
            className="w-8 h-8 text-purple-700"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18 3H6C4.3 3 3 4.3 3 6v12c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V6c0-1.7-1.3-3-3-3zm-6 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm3.5-3c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zM18 19H6c-.6 0-1-.4-1-1v-6h2c0 2.8 2.2 5 5 5s5-2.2 5-5h2v6c0 .6-.4 1-1 1z" />
          </svg>
          <span className="text-xl font-medium text-gray-900">Photoshare</span>
        </div>
        <div className="ml-auto">
          <button
            className="py-1 px-4 text-sm font-medium text-purple-700 hover:bg-purple-50 rounded-full transition-colors duration-200"
            onClick={() => console.log('Login clicked')}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
        <div className="max-w-lg mx-auto">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            {/* Card Header */}
            <div className="bg-purple-700 py-6 px-6">
              <h1 className="text-2xl font-medium text-white">
                Create account
              </h1>
              <p className="text-purple-200 mt-1">
                Join our community of photographers
              </p>
            </div>

            {/* Stepper */}
            <div className="flex px-6 pt-6">
              <div className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 0
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  1
                </div>
                <div className="h-1 flex-1 mx-2 bg-gray-200">
                  <div
                    className={`h-full bg-purple-700 transition-all duration-300 ${
                      step >= 1 ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  2
                </div>
                <div className="h-1 flex-1 mx-2 bg-gray-200">
                  <div
                    className={`h-full bg-purple-700 transition-all duration-300 ${
                      step >= 2 ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  3
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                        </div>
                        <input
                          name="username"
                          type="text"
                          placeholder="Choose a username"
                          value={form.username}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition duration-150 ease-in-out sm:text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        This will be your public display name
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <input
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition duration-150 ease-in-out sm:text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          value={form.password}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition duration-150 ease-in-out sm:text-sm"
                        />
                      </div>
                      <div className="mt-1">
                        <div className="flex items-center">
                          <div
                            className={`h-1 w-1/3 rounded-l ${
                              form.password.length >= 8
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          ></div>
                          <div
                            className={`h-1 w-1/3 ${
                              /[A-Z]/.test(form.password) &&
                              /\d/.test(form.password)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          ></div>
                          <div
                            className={`h-1 w-1/3 rounded-r ${
                              /[\W_]/.test(form.password)
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Must contain at least 8 characters, one uppercase
                          letter, one number, and one special character
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition duration-150 ease-in-out sm:text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Ready to create your account
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Review your information before continuing
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-gray-500">Username</span>
                        <span className="text-sm font-medium">
                          {form.username}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="text-sm font-medium">
                          {form.email}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-gray-500">Password</span>
                        <span className="text-sm font-medium">••••••••</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        I agree to the{' '}
                        <a
                          href="#"
                          className="text-purple-600 hover:text-purple-500"
                        >
                          Terms
                        </a>{' '}
                        and{' '}
                        <a
                          href="#"
                          className="text-purple-600 hover:text-purple-500"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150"
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150"
                      style={{ backgroundColor: '#6200EE' }}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-150"
                      style={{ backgroundColor: '#6200EE' }}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : null}
                      Create account
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-purple-700 hover:text-purple-600"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FAB - Floating Action Button */}
      <div className="fixed right-6 bottom-6">
        <button
          className="w-14 h-14 rounded-full bg-teal-400 text-white shadow-lg flex items-center justify-center focus:outline-none hover:bg-teal-500 transition-all duration-150 transform hover:scale-105"
          style={{ backgroundColor: '#03DAC6' }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Register;

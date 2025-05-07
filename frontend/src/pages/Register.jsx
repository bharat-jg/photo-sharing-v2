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

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('/register/', form);
      navigate('/login');
    } catch (err) {
      // Handle specific error cases
      if (err.response) {
        switch (err.response.status) {
          case 400:
            // Handle validation errors from backend
            if (err.response.data.username) {
              setError(`Username error: ${err.response.data.username}`);
            } else if (err.response.data.email) {
              setError(`Email error: ${err.response.data.email}`);
            } else if (err.response.data.password) {
              setError(`Password error: ${err.response.data.password}`);
            } else if (err.response.data.detail) {
              setError(err.response.data.detail);
            } else {
              setError('Please check your input and try again.');
            }
            break;
          case 409:
            // Handle conflict errors (duplicate username/email)
            if (err.response.data.type === 'username') {
              setError(
                'This username is already taken. Please choose another one.'
              );
            } else if (err.response.data.type === 'email') {
              setError(
                'This email is already registered. Try logging in instead.'
              );
            } else {
              setError('This account already exists.');
            }
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError('Something went wrong. Please try again.');
        }
      } else if (err.request) {
        // Handle network errors
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setError(''); // Clear previous errors

    if (step === 0) {
      // Validate username
      if (!form.username.trim()) {
        setError('Username is required');
        return;
      }
      if (form.username.length < 3) {
        setError('Username must be at least 3 characters long');
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email.trim()) {
        setError('Email is required');
        return;
      }
      if (!emailRegex.test(form.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // If all validations pass, move to next step
      setStep(1);
      return;
    } else if (step === 1) {
      // Validate password
      if (!form.password) {
        setError('Password is required');
        return;
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(form.password)) {
        setError(
          'Password must contain at least 8 characters, one uppercase letter, one number, and one special character'
        );
        return;
      }

      // Validate confirm password
      if (!form.confirmPassword) {
        setError('Please confirm your password');
        return;
      }

      // Check if passwords match
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // If all validations pass, move to next step
      setStep(2);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create your account
            </h1>
            <p className="text-white/80">
              Join our creative community of photographers
            </p>
          </div>

          {/* Stepper */}
          <div className="px-8 pt-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />

              {/* Active Progress Line */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-pink-600 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />

              {/* Step Circles */}
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="relative z-10 flex items-center justify-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
            ${
              step >= num - 1
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-400 border-2 border-gray-200'
            }`}
                  >
                    {step > num - 1 ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      num
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent form submission on enter key
                if (step === 2) {
                  handleSubmit(e);
                }
              }}
              className="space-y-6"
            >
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
                        required
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
                        required
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
                      <span className="text-sm font-medium">{form.email}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-500">Password</span>
                      <span className="text-sm font-medium">••••••••</span>
                    </div>
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
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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

              <div className="flex justify-between pt-6">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border-2 border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back
                  </button>
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors duration-200 ml-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors duration-200 ml-auto flex items-center"
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
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
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-pink-600 hover:text-pink-700 font-semibold"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator

    try {
      const response = await axios.post('https://mis.minisports.gov.rw/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      setLoading(false); // Stop loading after the request completes

      if (response.status === 200) {
        // Handle successful login
        const data = response.data;

        // Save token and user data in localStorage
        localStorage.setItem('isAuthenticated', 'true'); // Optional flag to track login state
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        localStorage.setItem('token', data.token); // Store the auth token

        // Optionally, store the "remember me" status (useful for persistent login)
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        // Handle unexpected status codes
        setErrorMessage('Unexpected response from the server.');
      }
    } catch (error) {
      setLoading(false); // Stop loading on error
      if (error.response) {
        // Server responded with a status other than 200
        setErrorMessage(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        // Network error or other issues
        setErrorMessage('Something went wrong. Please try again later.');
        console.error('Login error:', error.message);
      }
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo/logo.svg" alt="MINISPORTS" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">MIS - MINISPORTS</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-2">Login to continue</h2>
          <p className="text-gray-500 mb-6">Welcome back, enter your credentials to continue</p>

          {/* Error message display */}
          {errorMessage && (
            <div className="text-red-500 mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? 
                    <EyeOff className="w-5 h-5 text-gray-400" /> :
                    <Eye className="w-5 h-5 text-gray-400" />
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

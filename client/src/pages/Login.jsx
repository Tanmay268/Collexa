
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [resetData, setResetData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      const errorMessage = err?.message || err?.data?.message || err?.response?.data?.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await forgotPassword(resetData.email);
      setMode('reset');
      setMessage(`Password reset OTP sent to ${resetData.email}`);
    } catch (err) {
      setError(err.message || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await resetPassword(resetData);
      setMode('login');
      setFormData((prev) => ({ ...prev, email: resetData.email, password: '' }));
      setResetData({ email: resetData.email, otp: '', newPassword: '' });
      setMessage('Password reset successful. Please login with your new password.');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleResetChange = (e) => {
    setResetData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-3 py-6 sm:px-4 sm:py-8">
      <div className="max-w-md w-full">
        <div className="mb-5 text-center sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome Back' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {mode === 'login'
              ? 'Sign in to your Collexa account'
              : mode === 'forgot'
              ? 'We will send an OTP to your registered email'
              : 'Enter the OTP and choose a new password'}
          </p>
        </div>

        <form
          onSubmit={mode === 'login' ? handleSubmit : mode === 'forgot' ? handleForgotPassword : handleResetPassword}
          className="space-y-4 rounded-2xl bg-white p-5 shadow-sm sm:space-y-5 sm:p-8"
        >
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              {message}
            </div>
          )}

          {mode === 'login' && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your-email@vitstudent.ac.in"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <div>
              <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-900 mb-2">
                Registered Email
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                required
                value={resetData.email}
                onChange={handleResetChange}
                placeholder="your-email@vitstudent.ac.in"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                style={{ fontSize: '16px' }}
              />
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div>
                <label htmlFor="reset-email-confirm" className="block text-sm font-semibold text-gray-900 mb-2">
                  Registered Email
                </label>
                <input
                  id="reset-email-confirm"
                  name="email"
                  type="email"
                  required
                  value={resetData.email}
                  onChange={handleResetChange}
                  placeholder="your-email@vitstudent.ac.in"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-900 mb-2">
                  Reset OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={resetData.otp}
                  onChange={(e) => setResetData((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent tracking-[0.35em]"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[46px] w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-0 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-700 disabled:bg-blue-400 sm:min-h-[52px] sm:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                <div className="w-5 h-5 spinner"></div>
                <span>
                  {mode === 'login' ? 'Signing in...' : mode === 'forgot' ? 'Sending OTP...' : 'Resetting password...'}
                </span>
              </span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : mode === 'forgot' ? (
              'Send Reset OTP'
            ) : (
              'Reset Password'
            )}
          </button>

          {mode === 'login' ? (
            <>
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setError('');
                    setMessage('');
                    setResetData((prev) => ({ ...prev, email: formData.email }));
                  }}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="pt-2 text-center text-sm sm:pt-1">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-semibold">
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'reset' ? 'forgot' : 'login');
                  setError('');
                  setMessage('');
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                {mode === 'reset' ? 'Back' : 'Back to login'}
              </button>
              {mode === 'reset' && (
                <button
                  type="button"
                  onClick={async () => {
                    setError('');
                    setMessage('');
                    setLoading(true);
                    try {
                      await forgotPassword(resetData.email);
                      setMessage(`A new reset OTP was sent to ${resetData.email}`);
                    } catch (err) {
                      setError(err.message || 'Failed to resend reset OTP');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="font-semibold text-brand-600 hover:text-brand-700 disabled:text-blue-300"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

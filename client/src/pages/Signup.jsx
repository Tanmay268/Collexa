// Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [otp, setOtp] = useState('');
  const [signupStep, setSignupStep] = useState('details');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup, verifySignupOtp, resendSignupOtp } = useAuth();
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!formData.email.endsWith('@vitstudent.ac.in')) {
      setError('Please use your VIT student email (@vitstudent.ac.in)');
      setLoading(false);
      return;
    }

    try {
      await signup(formData);
      setSignupStep('otp');
      setMessage(`OTP sent to ${formData.email}`);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await verifySignupOtp({
        ...formData,
        otp,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await resendSignupOtp(formData.email);
      setMessage(`A new OTP was sent to ${formData.email}`);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-3 py-6 sm:px-4 sm:py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="mb-5 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg sm:mb-4 sm:h-20 sm:w-20">
            <span className="text-white font-bold text-3xl sm:text-4xl">C</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Join the VIT Collexa community</p>
        </div>

        <form
          onSubmit={signupStep === 'details' ? handleSignupSubmit : handleOtpSubmit}
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

          {signupStep === 'details' ? (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  VIT Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your-name@vitstudent.ac.in"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
                <p className="mt-1 text-xs text-gray-500">Must be a VIT student email</p>
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
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-600">
                Enter the 6-digit OTP sent to <span className="font-semibold">{formData.email}</span>.
              </div>
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-900 mb-2">
                  Verification OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-[0.4em]"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-0 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 disabled:bg-blue-400 sm:min-h-[52px] sm:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                <div className="w-5 h-5 spinner"></div>
                <span>{signupStep === 'details' ? 'Sending OTP...' : 'Verifying OTP...'}</span>
              </span>
            ) : (
              signupStep === 'details' ? 'Send OTP' : 'Verify OTP'
            )}
          </button>

          {signupStep === 'otp' && (
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setSignupStep('details')}
                className="text-gray-600 hover:text-gray-900"
              >
                Edit details
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-blue-300"
              >
                Resend OTP
              </button>
            </div>
          )}

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

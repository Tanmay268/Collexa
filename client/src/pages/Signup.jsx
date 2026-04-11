// Signup.jsx
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Toast = ({ message, onClose }) => (
  <div className="fixed right-3 top-3 z-50 w-[calc(100%-1.5rem)] max-w-sm rounded-2xl border border-green-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:right-4 sm:top-4">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
        ✓
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">OTP Sent</p>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 transition hover:text-slate-700"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  </div>
);

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
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const toastTimeoutRef = useRef(null);
  
  const { signup, verifySignupOtp, resendSignupOtp } = useAuth();
  const navigate = useNavigate();

  const showToast = (text) => {
    setToast(text);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast('');
    }, 3500);
  };

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
      const successMessage = `OTP sent to ${formData.email}`;
      setMessage(successMessage);
      showToast(successMessage);
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
      const successMessage = `A new OTP was sent to ${formData.email}`;
      setMessage(successMessage);
      showToast(successMessage);
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
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <div className="max-w-md w-full">
        <div className="mb-5 text-center sm:mb-8">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent tracking-[0.4em]"
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
                className="text-brand-600 hover:text-brand-700 font-semibold disabled:text-blue-300"
              >
                Resend OTP
              </button>
            </div>
          )}

          <div className="pt-2 text-center text-sm sm:pt-1">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

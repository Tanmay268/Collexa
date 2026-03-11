import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { firebaseAuth } from '../lib/firebase';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'PG', 'Research'];
const ACCOUNT_TYPE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'buyer-seller', label: 'Buyer + Seller' },
];

export default function Profile() {
  const {
    user,
    logout,
    updateProfile,
    verifyProfilePhone,
    refreshProfile,
  } = useAuth();
  const [form, setForm] = useState({
    name: '',
    year: '',
    department: '',
    accountType: 'student',
  });
  const [phoneDraft, setPhoneDraft] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [saving, setSaving] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const recaptchaVerifierRef = useRef(null);
  const confirmationResultRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      year: user.year || '',
      department: user.department || '',
      accountType: user.accountType || 'student',
    });
    setPhoneDraft(user.phone || '');
  }, [user]);

  useEffect(() => () => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  }, []);

  const phoneMatchesSaved = phoneDraft === (user?.phone || '');
  const phoneStatusLabel = phoneMatchesSaved
    ? (user?.phoneVerified ? 'Verified' : 'Not verified')
    : 'Pending verification';

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const data = await updateProfile(form);
      setMessage(data.message || 'Profile updated successfully.');
      await refreshProfile();
    } catch (updateError) {
      setError(updateError.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    setSendingOtp(true);
    setMessage('');
    setError('');

    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(firebaseAuth, 'phone-recaptcha', {
          size: 'normal',
        });
      }

      const confirmationResult = await signInWithPhoneNumber(
        firebaseAuth,
        `+91${phoneDraft}`,
        recaptchaVerifierRef.current
      );

      confirmationResultRef.current = confirmationResult;
      setOtpSent(true);
      setMessage('Phone OTP sent successfully.');
    } catch (otpError) {
      setError(otpError.message || 'Failed to send phone OTP.');
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyPhone = async () => {
    setVerifyingPhone(true);
    setMessage('');
    setError('');

    try {
      if (!confirmationResultRef.current) {
        throw new Error('Send OTP first.');
      }

      const credential = await confirmationResultRef.current.confirm(phoneOtp);
      const firebaseIdToken = await credential.user.getIdToken();
      const data = await verifyProfilePhone({ phone: phoneDraft, firebaseIdToken });

      await signOut(firebaseAuth);
      confirmationResultRef.current = null;
      setOtpSent(false);
      setMessage(data.message || 'Phone verified successfully.');
      setPhoneOtp('');
    } catch (verifyError) {
      setError(verifyError.message || 'Failed to verify phone.');
    } finally {
      setVerifyingPhone(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-600 sm:text-base">{user?.email}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs sm:text-sm">
                {user?.isVerified && <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700">Email verified</span>}
                {user?.phoneVerified && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Phone verified</span>}
                {user?.isAdmin && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">Admin</span>}
              </div>
            </div>
          </div>
          <button onClick={logout} className="rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700">
            Logout
          </button>
        </div>

        {(message || error) && (
          <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {error || message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={handleSaveProfile} className="rounded-2xl border border-gray-100 p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
              <p className="mt-1 text-sm text-gray-500">Update your personal details used across the marketplace.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="year">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={form.year}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="accountType">
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={form.accountType}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  {ACCOUNT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="department">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleFormChange}
                  placeholder="CSE, ECE, Mechanical, MBA..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Phone Verification</h2>
                <p className="mt-1 text-sm text-gray-500">Verify your phone number before it is shown to buyers or sellers.</p>
              </div>

              <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                value={phoneDraft}
                onChange={(event) => setPhoneDraft(event.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleSendPhoneOtp}
                disabled={sendingOtp || phoneDraft.length !== 10}
                className="mt-4 inline-flex min-h-[42px] items-center justify-center rounded-xl border border-blue-200 px-4 py-2.5 font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <div id="phone-recaptcha" className="mt-4" />

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="phoneOtp">
                  Enter OTP
                </label>
                <input
                  id="phoneOtp"
                  value={phoneOtp}
                  onChange={(event) => setPhoneOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit OTP"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyPhone}
                disabled={!otpSent || verifyingPhone || phoneDraft.length !== 10 || phoneOtp.length !== 6}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {verifyingPhone ? 'Verifying...' : 'Verify Phone'}
              </button>

              <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Current status: <span className="font-medium text-gray-900">{phoneStatusLabel}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Links</h2>
              <div className="grid gap-3">
                <Link to="/my-listings" className="rounded-xl bg-blue-50 px-4 py-3 text-center font-medium text-blue-700 hover:bg-blue-100">
                  My Listings
                </Link>
                <Link to="/create-listing" className="rounded-xl bg-green-50 px-4 py-3 text-center font-medium text-green-700 hover:bg-green-100">
                  Create Listing
                </Link>
                <Link to="/bug-report" className="rounded-xl bg-amber-50 px-4 py-3 text-center font-medium text-amber-700 hover:bg-amber-100">
                  Report a Bug
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

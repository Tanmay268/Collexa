import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'PG', 'Research'];
const ACCOUNT_TYPE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'buyer-seller', label: 'Buyer + Seller' },
];

export default function Profile() {
  const { user, logout, updateProfile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    year: '',
    department: '',
    accountType: 'student',
    phone: '',
    showPhoneNumber: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      year: user.year || '',
      department: user.department || '',
      accountType: user.accountType || 'student',
      phone: user.phone || '',
      showPhoneNumber: !!user.showPhoneNumber,
    });
  }, [user]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-600 sm:text-base break-all max-w-[200px] sm:max-w-md">{user?.email}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs sm:text-sm">
                {user?.isVerified && <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700">Email verified</span>}
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 mt-2 pt-4 border-t border-gray-100">
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => handleFormChange({ target: { name: 'phone', value: e.target.value.replace(/\D/g, '').slice(0, 10), type: 'text' } })}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
                />
                
                <div className="mt-4 flex items-start bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center h-5">
                    <input
                      id="showPhoneNumber"
                      name="showPhoneNumber"
                      type="checkbox"
                      checked={form.showPhoneNumber}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-brand-600 bg-white border-gray-300 rounded focus:ring-brand-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="showPhoneNumber" className="font-medium text-gray-900">Show Phone Globally</label>
                    <p className="text-gray-500 mt-0.5 text-xs">Set this as my default preference for all future listings.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-600 px-5 py-3 font-medium text-white hover:bg-brand-700 disabled:bg-blue-400"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Links</h2>
              <div className="grid gap-3">
                <Link to="/my-listings" className="rounded-xl bg-blue-50 px-4 py-3 text-center font-medium text-brand-700 hover:bg-blue-100">
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

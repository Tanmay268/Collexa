import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.isVerified && <p className="text-sm text-green-600">✓ Verified Student</p>}
            </div>
          </div>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{user?.phone || 'Not provided'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Year</p>
            <p className="font-medium">{user?.year || 'Not provided'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-medium">{user?.department || 'Not provided'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Account Type</p>
            <p className="font-medium">{user?.isAdmin ? 'Admin' : 'Student'}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/my-listings" className="bg-blue-50 text-blue-600 p-4 rounded hover:bg-blue-100 text-center">
              My Listings
            </Link>
            <Link to="/create-listing" className="bg-green-50 text-green-600 p-4 rounded hover:bg-green-100 text-center">
              Create Listing
            </Link>
            <Link to="/bug-report" className="bg-amber-50 text-amber-700 p-4 rounded hover:bg-amber-100 text-center">
              Report a Bug
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-3">
          <div className="flex items-center">
            <Link to="/" className="inline-flex min-h-[44px] items-center gap-2 text-xl font-bold text-blue-600 sm:min-h-0 sm:text-2xl">
              <span>Collexa</span>
            </Link>
            <span className="ml-2 hidden min-h-[44px] items-center text-sm text-gray-500 sm:inline-flex sm:min-h-0">VIT Marketplace</span>
          </div>


          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-base font-medium text-white transition hover:bg-blue-700 sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                >
                  <span className="sm:hidden">+</span>
                  <span className="hidden sm:inline">+ Create Listing</span>
                </Link>
                <Link
                  to="/my-listings"
                  className="inline-flex min-h-[44px] items-center justify-center leading-none text-sm text-gray-700 transition hover:text-blue-600 sm:min-h-0 sm:text-base"
                >
                  <span className="sm:hidden">List</span>
                  <span className="hidden sm:inline">My Listings</span>
                </Link>
                <div className="relative group">
                  <button className="inline-flex min-h-[44px] items-center space-x-2 text-gray-700 hover:text-blue-600 sm:min-h-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden max-w-28 truncate sm:inline">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/bug-report"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Report Bug
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex min-h-[44px] items-center justify-center text-sm text-gray-700 transition hover:text-blue-600 sm:min-h-0 sm:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:min-h-0 sm:px-4 sm:text-base"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

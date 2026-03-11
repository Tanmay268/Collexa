import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-0">
          <div className="flex min-w-0 items-start justify-between">
            <div className="flex min-w-0 items-center">
              <Link
                to="/"
                className="inline-flex min-h-[40px] min-w-0 items-center text-lg font-bold text-blue-600 sm:min-h-0 sm:text-2xl"
              >
                <span className="truncate">Collexa</span>
              </Link>
              <span className="ml-2 inline-flex items-center text-xs text-gray-500 sm:text-sm">
                Marketplace
              </span>
            </div>

            {isAuthenticated && (
              <div className="relative group sm:hidden">
                <button className="inline-flex min-h-[38px] max-w-[9rem] items-center justify-center rounded-full bg-blue-600 px-3 text-sm font-semibold text-white">
                  <span className="truncate">{user?.name}</span>
                </button>
                <div className="absolute right-0 z-10 mt-2 hidden w-48 rounded-lg bg-white py-2 shadow-lg group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/bug-report" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Report Bug
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:min-h-0 sm:px-4"
                >
                  + Create Listing
                </Link>
                <Link
                  to="/my-listings"
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 sm:min-h-0"
                >
                  My Listings
                </Link>
                <div className="relative hidden group sm:block">
                  <button className="inline-flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-28 truncate">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 z-10 mt-2 hidden w-48 rounded-lg bg-white py-2 shadow-lg group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/bug-report" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Report Bug
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
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
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 sm:min-h-0"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:min-h-0 sm:px-4"
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

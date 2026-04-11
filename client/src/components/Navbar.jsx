import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification.id || notification._id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-0">
          <div className="flex min-w-0 items-start justify-between">
            <div className="flex min-w-0 items-center">
              <Link
                to="/"
                className="inline-flex min-h-[40px] min-w-0 items-center text-lg font-bold text-brand-600 sm:min-h-0 sm:text-2xl"
              >
                <span className="truncate">Collexa</span>
              </Link>
              <span className="ml-2 inline-flex items-center text-xs text-gray-500 sm:text-sm">
                Marketplace
              </span>
            </div>

            {isAuthenticated && (
              <div className="relative group sm:hidden">
                <button className="inline-flex min-h-[38px] max-w-[9rem] items-center justify-center rounded-full bg-brand-600 px-3 text-sm font-semibold text-white">
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

          <div className="flex flex-wrap items-center gap-2 pb-1 sm:pb-0">
            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="flex h-[38px] w-[38px] items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-brand-600 outline-none focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <div className="absolute left-0 sm:right-0 sm:left-auto z-10 mt-2 hidden w-80 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 group-hover:block max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-brand-600 hover:text-blue-800">
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet</div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id || n._id} 
                            onClick={() => handleNotificationClick(n)}
                            className={`cursor-pointer px-4 py-3 transition hover:bg-gray-50 ${!n.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <p className={`text-sm ${!n.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                              {n.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  to="/create-listing"
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 sm:min-h-0 sm:px-4"
                >
                  + Create Listing
                </Link>
                <Link
                  to="/my-listings"
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-brand-600 sm:min-h-0"
                >
                  My Listings
                </Link>
                <div className="relative hidden group sm:block">
                  <button className="inline-flex items-center space-x-2 text-gray-700 hover:text-brand-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
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
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-brand-600 sm:min-h-0"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex min-h-[38px] flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 sm:min-h-0 sm:px-4"
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

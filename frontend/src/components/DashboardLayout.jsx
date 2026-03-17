import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/listings', label: 'My Listings', sellerOnly: true },
  { to: '/app/pricing', label: 'Pricing' },
  { to: '/app/settings', label: 'Settings' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <Link
                to="/app/dashboard"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Dashboard
              </Link>
              <nav className="flex items-center gap-1" aria-label="App navigation">
                {navItems.map((item) => {
                  if (item.sellerOnly && user?.role !== 'seller') return null;
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
              >
                ← Marketplace
              </Link>
              {user?.role === 'seller' && (
                <Link
                  to="/add-property"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600"
                >
                  Add property
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui';

export default function Dashboard() {
  const { user } = useAuth();
  const [myListingsCount, setMyListingsCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'seller') {
      setLoading(false);
      return;
    }
    api.get('/property/my-listings')
      .then(({ data }) => setMyListingsCount(data.length))
      .catch(() => setMyListingsCount(0))
      .finally(() => setLoading(false));
  }, [user?.role]);

  const plan = user?.planId;
  const maxListings = plan?.maxListings ?? 3;
  const canAddMore = user?.role === 'seller' && myListingsCount !== null && myListingsCount < maxListings;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Manage your account and listings from here.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {user?.role === 'seller' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">My listings</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {myListingsCount ?? 0}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                of {maxListings} on {plan?.name ?? 'Free'} plan
              </p>
              <Link
                to="/app/listings"
                className="mt-4 inline-block text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                View all →
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current plan</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {plan?.name ?? 'Free'}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {plan?.priceMonthly === 0 ? 'Free forever' : `$${plan?.priceMonthly}/mo`}
            </p>
            <Link
              to="/app/pricing"
              className="mt-4 inline-block text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline"
            >
              Change plan →
            </Link>
          </div>

          {user?.role === 'seller' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Quick action</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                Add property
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {canAddMore ? 'List a new property' : 'Upgrade to add more'}
              </p>
              <Link
                to={canAddMore ? '/add-property' : '/app/pricing'}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600"
              >
                {canAddMore ? 'Add property' : 'Upgrade plan'}
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Account</p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white truncate">
              {user?.email}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 capitalize">
              {user?.role}
            </p>
            <Link
              to="/app/settings"
              className="mt-4 inline-block text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline"
            >
              Settings →
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Getting started</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>• Browse the <Link to="/" className="text-sky-600 dark:text-sky-400 hover:underline">marketplace</Link> to see all listings.</li>
          {user?.role === 'seller' && (
            <>
              <li>• Add up to {maxListings} properties on your current plan.</li>
              <li>• Upgrade to Pro or Enterprise for more listings and features.</li>
            </>
          )}
          <li>• Update your profile in Settings.</li>
        </ul>
      </div>
    </div>
  );
}

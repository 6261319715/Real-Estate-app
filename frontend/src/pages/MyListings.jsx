import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
import { getErrorMessage } from '../utils/helpers';

export default function MyListings() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/property/my-listings')
      .then(({ data }) => setProperties(data))
      .catch((err) => setError(getErrorMessage(err, 'Failed to load listings.')))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    api.delete(`/property/${id}`)
      .then(() => setProperties((prev) => prev.filter((p) => p._id !== id)))
      .catch((err) => alert(getErrorMessage(err, 'Failed to delete.')));
  };

  if (user?.role !== 'seller') {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">Only sellers have listings. Switch to a seller account or browse the marketplace.</p>
        <Link to="/" className="mt-4 inline-block text-sky-600 dark:text-sky-400 hover:underline">Browse marketplace</Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner label="Loading your listings..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Listings</h1>
        <Link
          to="/add-property"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 w-fit"
        >
          Add property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">You haven't listed any properties yet.</p>
          <Link to="/add-property" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium bg-sky-500 text-white hover:bg-sky-600">
            Add your first property
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Property</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Price</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Location</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                          <img
                            src={p.images?.[0] || 'https://placehold.co/100?text=No+image'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white line-clamp-1">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sky-600 dark:text-sky-400 font-medium">${p.price?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-sm line-clamp-1">{p.location}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 capitalize">{p.propertyType}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/property/${p._id}`} className="text-sky-600 dark:text-sky-400 hover:underline text-sm mr-4">View</Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id, p.title)}
                        className="text-red-600 dark:text-red-400 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

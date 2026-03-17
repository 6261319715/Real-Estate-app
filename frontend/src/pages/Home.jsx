import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
import { getErrorMessage } from '../utils/helpers';

const PROPERTY_TYPES = [
  { value: '', label: 'All types' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat' },
  { value: 'land', label: 'Land' },
];

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const listingsRef = useRef(null);

  const fetchProperties = useCallback(() => {
    setError(null);
    setLoading(true);
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (propertyType) params.set('type', propertyType);
    if (minPrice !== '') params.set('minPrice', minPrice);
    if (maxPrice !== '') params.set('maxPrice', maxPrice);
    api.get(`/property?${params}`)
      .then(({ data }) => setProperties(data))
      .catch((err) => {
        setProperties([]);
        setError(getErrorMessage(err, 'Failed to load properties.'));
      })
      .finally(() => setLoading(false));
  }, [location, propertyType, minPrice, maxPrice]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* ========== HERO SECTION ========== */}
      <section className="relative bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-lg sm:text-xl text-sky-100 leading-relaxed">
              Search by location, filter by price and type. Connect directly with sellers.
            </p>
          </div>
          {/* Hero search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
                <input
                  type="text"
                  placeholder="City, area or address..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && listingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-white focus:border-white shadow-inner"
                />
              </div>
              <button
                type="button"
                onClick={() => listingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3.5 rounded-xl font-semibold bg-white text-sky-700 hover:bg-sky-50 transition-colors shadow-lg shrink-0"
              >
                Search
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/#listings"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium border-2 border-white/80 text-white hover:bg-white/10 transition-colors"
            >
              Browse all listings
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium bg-white text-sky-700 hover:bg-sky-50 transition-colors shadow-lg"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Easy Search</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Filter by location, price, and property type to find exactly what you need.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real Listings</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Verified properties with photos and detailed descriptions from real sellers.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Direct Contact</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Message sellers directly through our platform. No middlemen, no hassle.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">List for Free</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Sellers can create an account and list properties at no cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            <div className="flex flex-col items-center text-center">
              <span className="w-12 h-12 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-lg mb-4">1</span>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Sign up</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Create a free account as a buyer or seller in under a minute.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="w-12 h-12 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-lg mb-4">2</span>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Search or list</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Browse properties with filters, or add your own listing with photos.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="w-12 h-12 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-lg mb-4">3</span>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Connect</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Contact sellers through the listing page and take the next step.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SEARCH + PROPERTY LISTING GRID ========== */}
      <section ref={listingsRef} id="listings" className="py-12 sm:py-16 bg-white dark:bg-slate-800/30 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Browse Properties
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Use the search and filters below, or scroll to see all listings.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-10">
            <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search by location</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                  type="text"
                  placeholder="City, area or address..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
            <div className="p-4 md:p-5 flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Property type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  {PROPERTY_TYPES.map(({ value, label }) => (
                    <option key={value || 'all'} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Min price ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    className="w-36 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max price ($)</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    className="w-36 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <LoadingSpinner label="Loading listings..." />
          ) : error ? (
            <div className="py-8">
              <ErrorMessage message={error} onRetry={fetchProperties} />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">No properties found. Try adjusting your search or filters.</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">To add sample data, run in the backend folder: <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">npm run seed</code></p>
              <Link to="/signup" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium bg-sky-500 text-white hover:bg-sky-600">Sign up to list a property</Link>
            </div>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
                {properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-16 sm:py-20 bg-sky-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to sell your property?</h2>
          <p className="text-sky-100 mb-8">Create a free seller account and list your property in minutes. Reach serious buyers directly.</p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold bg-white text-sky-700 hover:bg-sky-50 transition-colors shadow-lg"
          >
            Get started – it's free
          </Link>
        </div>
      </section>
    </div>
  );
}

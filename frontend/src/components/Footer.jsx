import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link to="/" className="text-xl font-bold text-white hover:text-sky-400 transition-colors">
              Real Estate
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Find your perfect home. Browse properties, connect with sellers, and make your move with confidence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-sky-400 transition-colors">All Listings</Link></li>
              <li><Link to="/?type=house" className="hover:text-sky-400 transition-colors">Houses</Link></li>
              <li><Link to="/?type=flat" className="hover:text-sky-400 transition-colors">Flats</Link></li>
              <li><Link to="/?type=land" className="hover:text-sky-400 transition-colors">Land</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              {user ? (
                <>
                  <li><span className="text-slate-400">{user.name}</span></li>
                  {user.role === 'seller' && (
                    <li><Link to="/add-property" className="hover:text-sky-400 transition-colors">Add property</Link></li>
                  )}
                  <li><button type="button" onClick={handleLogout} className="text-left text-slate-300 hover:text-sky-400 transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit">Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-sky-400 transition-colors">Log in</Link></li>
                  <li><Link to="/signup" className="hover:text-sky-400 transition-colors">Sign up</Link></li>
                  <li><Link to="/add-property" className="hover:text-sky-400 transition-colors">List your property</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <p className="text-sm">
              Have questions? Log in and use the contact form on any listing to reach sellers directly.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
          © {currentYear} Real Estate Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

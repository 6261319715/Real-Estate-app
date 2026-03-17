import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          Real Estate
        </Link>
        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`navbar-nav ${menuOpen ? 'navbar-nav-open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Listings</Link>
          {user ? (
            <>
              <Link to="/app/dashboard" onClick={closeMenu}>Dashboard</Link>
              {user.role === 'seller' && (
                <Link to="/app/listings" onClick={closeMenu}>My Listings</Link>
              )}
              {user.role === 'seller' && (
                <Link to="/add-property" onClick={closeMenu}>Add Property</Link>
              )}
              <Link to="/app/pricing" onClick={closeMenu}>Pricing</Link>
              <span className="navbar-user" title={user.email}>Hi, {user.name}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
      {menuOpen && <div className="navbar-backdrop" onClick={closeMenu} aria-hidden="true" />}
    </header>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Checks if admin is logged in (sessionStorage).
 * @returns {boolean}
 */
function isAdminAuthed() {
  return sessionStorage.getItem('hirehub_admin_authed') === '1';
}

/**
 * Header component with navigation and login/logout.
 */
export default function Header({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = React.useState(isAdminAuthed());

  React.useEffect(() => {
    setAuthed(isAdminAuthed());
    // Listen for login/logout events from other tabs
    function handleStorage(e) {
      if (e.key === 'hirehub_admin_authed') {
        setAuthed(isAdminAuthed());
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('hirehub_admin_authed');
    setAuthed(false);
    if (typeof onLogout === 'function') onLogout();
    if (location.pathname === '/admin') {
      navigate('/');
    }
  }

  function handleLogoClick(e) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <header>
      <a
        href="/"
        className="header-title"
        style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', cursor: 'pointer' }}
        onClick={handleLogoClick}
        aria-label="HireHub Home"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: 'inline', verticalAlign: 'middle' }} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#2d6cdf"/>
          <path d="M10 22V10h3v4.5h6V10h3v12h-3v-5.5h-6V22h-3z" fill="#fff"/>
        </svg>
        <span>HireHub Onboarding Portal</span>
      </a>
      <nav className="header-nav">
        <a
          href="/"
          className={location.pathname === '/' ? 'active' : ''}
          onClick={e => {
            if (location.pathname === '/') e.preventDefault();
          }}
        >
          Home
        </a>
        <a
          href="/apply"
          className={location.pathname === '/apply' ? 'active' : ''}
          onClick={e => {
            if (location.pathname === '/apply') e.preventDefault();
          }}
        >
          Apply
        </a>
        <a
          href="/admin"
          className={location.pathname === '/admin' ? 'active' : ''}
          onClick={e => {
            if (location.pathname === '/admin') e.preventDefault();
          }}
        >
          Admin
        </a>
        {authed ? (
          <button
            className="button secondary"
            style={{
              marginLeft: 12,
              padding: '0.4em 1.1em',
              fontSize: '1em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              background: 'var(--color-accent)',
              color: '#fff',
              borderRadius: 'var(--radius)',
              transition: 'background var(--transition)'
            }}
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        ) : (
          <a
            href="/admin"
            className="button secondary"
            style={{
              marginLeft: 12,
              padding: '0.4em 1.1em',
              fontSize: '1em',
              borderRadius: 'var(--radius)',
              background: 'var(--color-primary)',
              color: '#fff',
              boxShadow: 'none',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background var(--transition)'
            }}
            onClick={e => {
              if (location.pathname === '/admin') e.preventDefault();
              else navigate('/admin');
            }}
            aria-label="Admin Login"
          >
            Login
          </a>
        )}
      </nav>
    </header>
  );
}

Header.propTypes = {
  onLogout: PropTypes.func
};
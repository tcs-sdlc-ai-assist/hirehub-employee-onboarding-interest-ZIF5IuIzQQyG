import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AdminLogin component
 * - Hardcoded password: 'hirehubadmin'
 * - On success: sets sessionStorage 'hirehub_admin_authed' = '1'
 * - On tab close: clears sessionStorage
 * - Shows error messages
 * - Calls onLoginSuccess() prop if provided
 */
export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear sessionStorage on tab close
  useEffect(() => {
    function handleUnload() {
      sessionStorage.removeItem('hirehub_admin_authed');
    }
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (password === 'hirehubadmin') {
        sessionStorage.setItem('hirehub_admin_authed', '1');
        if (typeof onLoginSuccess === 'function') onLoginSuccess();
      } else {
        setError('Incorrect password.');
      }
      setLoading(false);
    }, 350);
  }

  return (
    <div className="form-container" style={{ marginTop: '4rem' }}>
      <div className="form-title">Admin Login</div>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="admin-password">Admin Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
            placeholder="Enter admin password"
          />
        </div>
        <button className="button" type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

AdminLogin.propTypes = {
  onLoginSuccess: PropTypes.func
};
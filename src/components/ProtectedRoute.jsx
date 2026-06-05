import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AdminLogin from './AdminLogin';

/**
 * ProtectedRoute component for /admin
 * - Checks sessionStorage 'hirehub_admin_authed'
 * - If authed, renders children; else renders AdminLogin
 */
export default function ProtectedRoute({ children }) {
  const [authed, setAuthed] = useState(
    sessionStorage.getItem('hirehub_admin_authed') === '1'
  );

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'hirehub_admin_authed') {
        setAuthed(sessionStorage.getItem('hirehub_admin_authed') === '1');
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function handleLoginSuccess() {
    setAuthed(true);
  }

  if (!authed) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};
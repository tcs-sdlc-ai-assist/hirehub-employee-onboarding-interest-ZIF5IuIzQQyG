import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Header component
function Header() {
  const location = useLocation();
  return (
    <header>
      <div className="header-title">HireHub Onboarding Portal</div>
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
      </nav>
    </header>
  );
}

// Landing Page
function LandingPage() {
  return (
    <main className="landing">
      <h1 className="landing-title">Welcome to HireHub Onboarding Portal</h1>
      <p className="landing-subtitle">
        Seamlessly apply for onboarding or manage submissions as an admin.
      </p>
      <div className="landing-actions">
        <a href="/apply">
          <button className="button">Apply Now</button>
        </a>
        <a href="/admin">
          <button className="button secondary">Admin Dashboard</button>
        </a>
      </div>
    </main>
  );
}

// Interest Form (Apply)
function InterestForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Lazy import validators and storage
  const [validators, setValidators] = useState(null);
  const [storage, setStorage] = useState(null);

  React.useEffect(() => {
    let mounted = true;
    Promise.all([
      import('./utils/validators.js'),
      import('./utils/storage.js'),
    ]).then(([v, s]) => {
      if (mounted) {
        setValidators(v);
        setStorage(s);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!validators || !storage) {
    return (
      <div className="form-container">
        <div className="form-title">Apply for Onboarding</div>
        <div>Loading...</div>
      </div>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSuccess('');
  }

  function validateAll() {
    const errs = {};
    errs.name = validators.validateName(form.name);
    errs.email = validators.validateEmail(form.email);
    errs.mobile = validators.validateMobile(form.mobile);
    errs.department = validators.validateDepartment(form.department);
    if (!errs.email && storage.isEmailDuplicate(form.email)) {
      errs.email = 'This email has already been used to apply.';
    }
    Object.keys(errs).forEach(k => {
      if (!errs[k]) delete errs[k];
    });
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      storage.addSubmission({
        id,
        ...form,
        status: 'pending',
      });
      setSuccess('Application submitted successfully!');
      setForm({
        name: '',
        email: '',
        mobile: '',
        department: '',
      });
      setErrors({});
    } catch (err) {
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <div className="form-title">Apply for Onboarding</div>
      {success && <div className="form-success">{success}</div>}
      {errors.form && <div className="form-error">{errors.form}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            name="name"
            id="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            name="email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="mobile">Mobile Number</label>
          <input
            name="mobile"
            id="mobile"
            type="tel"
            value={form.mobile}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />
          {errors.mobile && <div className="form-error">{errors.mobile}</div>}
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <input
            name="department"
            id="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />
          {errors.department && <div className="form-error">{errors.department}</div>}
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

// Admin Login
function AdminLogin({ onLogin, error }) {
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    if (password.trim() === '') {
      setLocalError('Password is required.');
      return;
    }
    onLogin(password);
  }

  return (
    <div className="form-container">
      <div className="form-title">Admin Login</div>
      {error && <div className="form-error">{error}</div>}
      {localError && <div className="form-error">{localError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="admin-password">Admin Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button className="button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
  error: PropTypes.string,
};

// Admin Dashboard
function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // { type: 'view'|'delete', submission }
  const [statusUpdating, setStatusUpdating] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    import('./utils/storage.js')
      .then(s => {
        if (mounted) {
          setStorage(s);
          setSubmissions(s.getSubmissions());
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Failed to load submissions.');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function refresh() {
    if (storage) {
      setSubmissions(storage.getSubmissions());
    }
  }

  function handleStatus(id, status) {
    setStatusUpdating(true);
    try {
      storage.updateSubmission(id, { status });
      refresh();
      setModal(null);
    } catch {
      setError('Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  }

  function handleDelete(id) {
    try {
      storage.deleteSubmission(id);
      refresh();
      setModal(null);
    } catch {
      setError('Failed to delete submission.');
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-title">Admin Dashboard</div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-title">Admin Dashboard</div>
      {error && <div className="form-error">{error}</div>}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                  No submissions found.
                </td>
              </tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.name}</td>
                  <td>{sub.email}</td>
                  <td>{sub.mobile}</td>
                  <td>{sub.department}</td>
                  <td>
                    <span
                      className={
                        'status-badge ' +
                        (sub.status === 'approved'
                          ? 'success'
                          : sub.status === 'rejected'
                          ? 'error'
                          : 'pending')
                      }
                    >
                      {sub.status ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="button secondary"
                      style={{ marginRight: 8, padding: '0.4em 1em', fontSize: '0.95em' }}
                      onClick={() => setModal({ type: 'view', submission: sub })}
                    >
                      View
                    </button>
                    <button
                      className="button error"
                      style={{ padding: '0.4em 1em', fontSize: '0.95em' }}
                      onClick={() => setModal({ type: 'delete', submission: sub })}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <button className="modal-close" onClick={() => setModal(null)} aria-label="Close">
              &times;
            </button>
            {modal.type === 'view' && (
              <>
                <h2 style={{ marginBottom: 12 }}>Submission Details</h2>
                <div style={{ marginBottom: 8 }}>
                  <b>Name:</b> {modal.submission.name}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>Email:</b> {modal.submission.email}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>Mobile:</b> {modal.submission.mobile}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>Department:</b> {modal.submission.department}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <b>Status:</b>{' '}
                  <span
                    className={
                      'status-badge ' +
                      (modal.submission.status === 'approved'
                        ? 'success'
                        : modal.submission.status === 'rejected'
                        ? 'error'
                        : 'pending')
                    }
                  >
                    {modal.submission.status
                      ? modal.submission.status.charAt(0).toUpperCase() +
                        modal.submission.status.slice(1)
                      : 'Pending'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="button success"
                    disabled={statusUpdating}
                    onClick={() => handleStatus(modal.submission.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="button error"
                    disabled={statusUpdating}
                    onClick={() => handleStatus(modal.submission.id, 'rejected')}
                  >
                    Reject
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setModal(null)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
            {modal.type === 'delete' && (
              <>
                <h2 style={{ marginBottom: 12 }}>Delete Submission</h2>
                <div style={{ marginBottom: 16 }}>
                  Are you sure you want to delete the submission for{' '}
                  <b>{modal.submission.name}</b>?
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="button error"
                    onClick={() => handleDelete(modal.submission.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ProtectedRoute for /admin
function ProtectedRoute({ children }) {
  const [authed, setAuthed] = useState(false);
  const [tried, setTried] = useState(false);
  const [error, setError] = useState('');
  // For demo, hardcoded password
  const ADMIN_PASSWORD = 'hirehubadmin';

  function handleLogin(pw) {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
    setTried(true);
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} error={tried ? error : ''} />;
  }
  return children;
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<InterestForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
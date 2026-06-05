import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * Candidate Interest Form
 * Fields: Full Name, Email, Mobile, Department
 * Validates, checks duplicate email, saves to localStorage, shows success/error messages.
 */
export default function InterestForm({ showBack }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validators, setValidators] = useState(null);
  const [storage, setStorage] = useState(null);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    Promise.all([
      import('../utils/validators.js'),
      import('../utils/storage.js')
    ])
      .then(([v, s]) => {
        if (mounted) {
          setValidators(v);
          setStorage(s);
        }
      })
      .catch(() => {
        setLoadError('Failed to load form. Please refresh the page.');
      });
    return () => {
      mounted = false;
    };
  }, []);

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
    if (!validators || !storage) return;
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
        status: 'pending'
      });
      setSuccess('Application submitted successfully!');
      setForm({
        name: '',
        email: '',
        mobile: '',
        department: ''
      });
      setErrors({});
    } catch (err) {
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  function handleBack(e) {
    e.preventDefault();
    navigate('/');
  }

  if (loadError) {
    return (
      <div className="form-container">
        <div className="form-title">Apply for Onboarding</div>
        <div className="form-error">{loadError}</div>
        <div style={{ marginTop: 16 }}>
          <button className="button secondary" onClick={handleBack}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!validators || !storage) {
    return (
      <div className="form-container">
        <div className="form-title">Apply for Onboarding</div>
        <div>Loading...</div>
      </div>
    );
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
            placeholder="e.g. Jane Doe"
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
            placeholder="e.g. jane@example.com"
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
            placeholder="e.g. 9876543210"
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
            placeholder="e.g. Engineering"
          />
          {errors.department && <div className="form-error">{errors.department}</div>}
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
      <div style={{ marginTop: 18, textAlign: 'center' }}>
        <a
          href="/"
          onClick={handleBack}
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'underline',
            fontWeight: 500,
            fontSize: '1rem'
          }}
        >
          &larr; Back to Home
        </a>
      </div>
    </div>
  );
}

InterestForm.propTypes = {
  showBack: PropTypes.bool
};
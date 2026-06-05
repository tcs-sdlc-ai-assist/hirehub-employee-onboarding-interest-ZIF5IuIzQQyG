import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * EditModal
 * - Modal overlay for editing a submission.
 * - Pre-fills fields (Name, Mobile, Department), email is read-only.
 * - Validates changes, updates localStorage, closes on save/cancel.
 * - Styled per UI guidelines.
 *
 * Props:
 *   submission: { id, name, email, mobile, department, status }
 *   onClose: function
 *   onSaved: function (optional, called after successful save)
 */
export default function EditModal({ submission, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: submission.name || '',
    email: submission.email || '',
    mobile: submission.mobile || '',
    department: submission.department || ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [validators, setValidators] = useState(null);
  const [storage, setStorage] = useState(null);
  const [loadError, setLoadError] = useState('');

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
        setLoadError('Failed to load form. Please refresh.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  }

  function validateAll() {
    const errs = {};
    errs.name = validators.validateName(form.name);
    errs.mobile = validators.validateMobile(form.mobile);
    errs.department = validators.validateDepartment(form.department);
    Object.keys(errs).forEach(k => {
      if (!errs[k]) delete errs[k];
    });
    return errs;
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!validators || !storage) return;
    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      storage.updateSubmission(submission.id, {
        name: form.name,
        mobile: form.mobile,
        department: form.department
      });
      if (typeof onSaved === 'function') onSaved();
      onClose();
    } catch {
      setErrors({ form: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  function handleBackdrop(e) {
    e.stopPropagation();
    // Do not close on backdrop click, only onClose button
  }

  if (loadError) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={handleBackdrop} tabIndex={-1} aria-modal="true" role="dialog">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
          <div className="form-error">{loadError}</div>
        </div>
      </div>
    );
  }

  if (!validators || !storage) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={handleBackdrop} tabIndex={-1} aria-modal="true" role="dialog">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={handleBackdrop}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{ maxWidth: 420, width: '95vw' }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="form-title" style={{ marginBottom: 12, textAlign: 'left' }}>
          Edit Submission
        </div>
        {errors.form && <div className="form-error">{errors.form}</div>}
        <form onSubmit={handleSave} noValidate>
          <div>
            <label htmlFor="edit-name">Full Name</label>
            <input
              name="name"
              id="edit-name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={saving}
              autoComplete="off"
              placeholder="e.g. Jane Doe"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div>
            <label htmlFor="edit-email">Email Address</label>
            <input
              name="email"
              id="edit-email"
              type="email"
              value={form.email}
              disabled
              style={{ background: '#f1f5f9', color: '#888', cursor: 'not-allowed' }}
            />
          </div>
          <div>
            <label htmlFor="edit-mobile">Mobile Number</label>
            <input
              name="mobile"
              id="edit-mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              disabled={saving}
              autoComplete="off"
              placeholder="e.g. 9876543210"
            />
            {errors.mobile && <div className="form-error">{errors.mobile}</div>}
          </div>
          <div>
            <label htmlFor="edit-department">Department</label>
            <input
              name="department"
              id="edit-department"
              type="text"
              value={form.department}
              onChange={handleChange}
              disabled={saving}
              autoComplete="off"
              placeholder="e.g. Engineering"
            />
            {errors.department && <div className="form-error">{errors.department}</div>}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button
              className="button success"
              type="submit"
              disabled={saving}
              style={{ minWidth: 100 }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{ minWidth: 100 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    department: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func
};
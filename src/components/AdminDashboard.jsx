import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AdminDashboard
 * - Shows stats: total submissions, unique departments, latest submission
 * - Renders submissions table with view/edit/delete
 * - Edit modal for updating status
 * - Protected by sessionStorage 'hirehub_admin_authed'
 */

function formatDate(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  if (isNaN(d)) return '';
  return d.toLocaleString();
}

function getUniqueDepartments(submissions) {
  const set = new Set();
  submissions.forEach(s => {
    if (s.department && typeof s.department === 'string') {
      set.add(s.department.trim());
    }
  });
  return Array.from(set);
}

function getLatestSubmission(submissions) {
  if (!submissions.length) return null;
  // Try to use id as timestamp if possible, else last in array
  // But since id is uuid/random, just use last in array (latest added)
  return submissions[submissions.length - 1];
}

function statusBadge(status) {
  let cls = 'status-badge pending';
  let txt = 'Pending';
  if (status === 'approved') {
    cls = 'status-badge success';
    txt = 'Approved';
  } else if (status === 'rejected') {
    cls = 'status-badge error';
    txt = 'Rejected';
  }
  return <span className={cls}>{txt}</span>;
}

function EditModal({ submission, onClose, onSave, saving }) {
  const [status, setStatus] = useState(submission.status || 'pending');
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 style={{ marginBottom: 12 }}>Edit Submission</h2>
        <div style={{ marginBottom: 8 }}>
          <b>Name:</b> {submission.name}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Email:</b> {submission.email}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Mobile:</b> {submission.mobile}
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>Department:</b> {submission.department}
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>Status:</b>{' '}
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            disabled={saving}
            style={{
              padding: '0.4em 1em',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              fontSize: '1em',
              marginLeft: 8
            }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="button success"
            disabled={saving}
            onClick={() => onSave(status)}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="button secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
EditModal.propTypes = {
  submission: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool
};

function SubmissionTable({ submissions, onEdit, onDelete }) {
  return (
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
                <td>{statusBadge(sub.status)}</td>
                <td>
                  <button
                    className="button secondary"
                    style={{ marginRight: 8, padding: '0.4em 1em', fontSize: '0.95em' }}
                    onClick={() => onEdit(sub)}
                  >
                    Edit
                  </button>
                  <button
                    className="button error"
                    style={{ padding: '0.4em 1em', fontSize: '0.95em' }}
                    onClick={() => onDelete(sub)}
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
  );
}
SubmissionTable.propTypes = {
  submissions: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState(null);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState(null); // { submission }
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null); // { submission }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    import('../utils/storage.js')
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

  function handleEdit(sub) {
    setEditModal({ submission: sub });
  }

  function handleEditSave(newStatus) {
    if (!storage || !editModal) return;
    setSaving(true);
    try {
      storage.updateSubmission(editModal.submission.id, { status: newStatus });
      setEditModal(null);
      refresh();
    } catch {
      setError('Failed to update submission.');
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(sub) {
    setDeleteModal({ submission: sub });
  }

  function handleDeleteConfirm() {
    if (!storage || !deleteModal) return;
    setDeleting(true);
    try {
      storage.deleteSubmission(deleteModal.submission.id);
      setDeleteModal(null);
      refresh();
    } catch {
      setError('Failed to delete submission.');
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteCancel() {
    setDeleteModal(null);
  }

  // Stats
  const total = submissions.length;
  const departments = getUniqueDepartments(submissions);
  const latest = getLatestSubmission(submissions);

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
      <div className="dashboard-title" style={{ marginBottom: 24 }}>
        Admin Dashboard
      </div>
      {error && <div className="form-error">{error}</div>}
      <div style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        marginBottom: 32
      }}>
        <div style={{
          flex: '1 1 180px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '1.5rem 1.2rem',
          minWidth: 180
        }}>
          <div style={{ color: 'var(--color-text-light)', fontWeight: 500, marginBottom: 6 }}>
            Total Submissions
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {total}
          </div>
        </div>
        <div style={{
          flex: '1 1 180px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '1.5rem 1.2rem',
          minWidth: 180
        }}>
          <div style={{ color: 'var(--color-text-light)', fontWeight: 500, marginBottom: 6 }}>
            Departments
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
            {departments.length > 0 ? departments.join(', ') : '—'}
          </div>
        </div>
        <div style={{
          flex: '2 1 280px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '1.5rem 1.2rem',
          minWidth: 220
        }}>
          <div style={{ color: 'var(--color-text-light)', fontWeight: 500, marginBottom: 6 }}>
            Latest Submission
          </div>
          {latest ? (
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                {latest.name}
              </div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.98rem' }}>
                {latest.email}
              </div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.98rem' }}>
                {latest.department}
              </div>
            </div>
          ) : (
            <div style={{ color: '#888' }}>—</div>
          )}
        </div>
      </div>
      <SubmissionTable
        submissions={submissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {editModal && (
        <EditModal
          submission={editModal.submission}
          onClose={() => setEditModal(null)}
          onSave={handleEditSave}
          saving={saving}
        />
      )}
      {deleteModal && (
        <div className="modal-backdrop" onClick={handleDeleteCancel}>
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <button className="modal-close" onClick={handleDeleteCancel} aria-label="Close">
              &times;
            </button>
            <h2 style={{ marginBottom: 12 }}>Delete Submission</h2>
            <div style={{ marginBottom: 16 }}>
              Are you sure you want to delete the submission for{' '}
              <b>{deleteModal.submission.name}</b>?
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="button error"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="button secondary"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
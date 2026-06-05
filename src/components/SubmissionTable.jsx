import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a colored badge for department.
 */
function DepartmentBadge({ department }) {
  const colors = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-error)'
  ];
  // Simple hash for color selection
  let colorIdx = 0;
  if (department && typeof department === 'string') {
    let sum = 0;
    for (let i = 0; i < department.length; ++i) {
      sum += department.charCodeAt(i);
    }
    colorIdx = sum % colors.length;
  }
  return (
    <span
      style={{
        display: 'inline-block',
        background: colors[colorIdx],
        color: '#fff',
        borderRadius: 12,
        padding: '0.2em 0.9em',
        fontWeight: 600,
        fontSize: '0.98em',
        letterSpacing: '0.01em'
      }}
    >
      {department}
    </span>
  );
}
DepartmentBadge.propTypes = {
  department: PropTypes.string
};

/**
 * Renders a status badge.
 */
function StatusBadge({ status }) {
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
StatusBadge.propTypes = {
  status: PropTypes.string
};

/**
 * Formats a date string.
 */
function formatDate(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  if (isNaN(d)) return '';
  return d.toLocaleString();
}

/**
 * SubmissionTable component
 * @param {Object} props
 * @param {Array} props.submissions
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 */
export default function SubmissionTable({ submissions, onEdit, onDelete }) {
  return (
    <div className="table-container" style={{ width: '100%' }}>
      <table className="table" style={{ minWidth: 900 }}>
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Submitted On</th>
            <th>Status</th>
            <th style={{ minWidth: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', color: '#888', fontSize: '1.05em', padding: '2.5em 0' }}>
                No submissions yet.
              </td>
            </tr>
          ) : (
            submissions.map((sub, idx) => (
              <tr key={sub.id}>
                <td>{idx + 1}</td>
                <td>{sub.name}</td>
                <td>{sub.email}</td>
                <td>{sub.mobile}</td>
                <td>
                  <DepartmentBadge department={sub.department} />
                </td>
                <td>
                  {sub.id && sub.id.length === 36 && sub.id[14] === '4'
                    ? '' // uuid v4, can't extract time
                    : formatDate(sub.createdAt || sub.submittedAt || '')}
                </td>
                <td>
                  <StatusBadge status={sub.status} />
                </td>
                <td>
                  <button
                    className="button secondary"
                    style={{ marginRight: 8, padding: '0.4em 1em', fontSize: '0.95em' }}
                    onClick={() => onEdit(sub)}
                    aria-label={`Edit submission for ${sub.name}`}
                  >
                    Edit
                  </button>
                  <button
                    className="button error"
                    style={{ padding: '0.4em 1em', fontSize: '0.95em' }}
                    onClick={() => onDelete(sub)}
                    aria-label={`Delete submission for ${sub.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>
        {`
        @media (max-width: 900px) {
          .table-container {
            overflow-x: auto;
          }
          .table {
            min-width: 700px;
          }
        }
        @media (max-width: 600px) {
          .table {
            min-width: 500px;
            font-size: 0.97em;
          }
          .table th, .table td {
            padding: 0.5em;
          }
        }
        `}
      </style>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
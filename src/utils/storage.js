/****
 * LocalStorage CRUD utilities for onboarding submissions.
 * All submissions are stored under 'hirehub_submissions' key as a JSON array.
 * Handles corrupted data gracefully (returns [] on parse error).
 */

/**
 * @typedef {Object} Submission
 * @property {string} id - Unique identifier (e.g., uuid)
 * @property {string} name
 * @property {string} email
 * @property {string} mobile
 * @property {string} department
 * @property {string} [status] - e.g., 'pending', 'approved', 'rejected'
 */

/** @type {string} */
const STORAGE_KEY = 'hirehub_submissions';

/**
 * Safely parses stored submissions array from localStorage.
 * @returns {Submission[]} Array of submissions, or [] if none/corrupted.
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    // Corrupted data, clear it
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/**
 * Saves the given submissions array to localStorage.
 * @param {Submission[]} submissions
 * @returns {void}
 */
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    // Storage quota exceeded or other error
    // Optionally, could surface this error to UI
  }
}

/**
 * Adds a new submission to localStorage.
 * @param {Submission} submission
 * @returns {void}
 */
export function addSubmission(submission) {
  const submissions = getSubmissions();
  submissions.push(submission);
  saveSubmissions(submissions);
}

/**
 * Updates an existing submission by id.
 * @param {string} id
 * @param {Partial<Submission>} updates
 * @returns {boolean} true if updated, false if not found
 */
export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  const idx = submissions.findIndex(s => s.id === id);
  if (idx === -1) return false;
  submissions[idx] = { ...submissions[idx], ...updates };
  saveSubmissions(submissions);
  return true;
}

/**
 * Deletes a submission by id.
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found
 */
export function deleteSubmission(id) {
  const submissions = getSubmissions();
  const filtered = submissions.filter(s => s.id !== id);
  if (filtered.length === submissions.length) return false;
  saveSubmissions(filtered);
  return true;
}

/**
 * Checks if an email already exists in submissions (case-insensitive).
 * Optionally exclude a submission id (for edit forms).
 * @param {string} email
 * @param {string} [excludeId]
 * @returns {boolean}
 */
export function isEmailDuplicate(email, excludeId) {
  const submissions = getSubmissions();
  const lower = email.trim().toLowerCase();
  return submissions.some(
    s =>
      s.email &&
      typeof s.email === 'string' &&
      s.email.trim().toLowerCase() === lower &&
      (!excludeId || s.id !== excludeId)
  );
}
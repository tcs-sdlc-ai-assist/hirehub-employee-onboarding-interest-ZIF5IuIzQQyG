/**
 * Validates a name field (required, min 2 chars, letters and spaces only).
 * @param {string} name
 * @returns {string} Error message or empty string
 */
export function validateName(name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'Name is required.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters.';
  }
  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return 'Name can only contain letters and spaces.';
  }
  return '';
}

/**
 * Validates an email field (required, valid email format).
 * @param {string} email
 * @returns {string} Error message or empty string
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return 'Email is required.';
  }
  const trimmed = email.trim();
  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return '';
}

/**
 * Validates a mobile number (required, 10-15 digits, numbers only).
 * @param {string} mobile
 * @returns {string} Error message or empty string
 */
export function validateMobile(mobile) {
  if (!mobile || typeof mobile !== 'string' || mobile.trim() === '') {
    return 'Mobile number is required.';
  }
  const trimmed = mobile.trim();
  if (!/^\d{10,15}$/.test(trimmed)) {
    return 'Mobile number must be 10 to 15 digits.';
  }
  return '';
}

/**
 * Validates a department field (required, min 2 chars).
 * @param {string} department
 * @returns {string} Error message or empty string
 */
export function validateDepartment(department) {
  if (!department || typeof department !== 'string' || department.trim() === '') {
    return 'Department is required.';
  }
  const trimmed = department.trim();
  if (trimmed.length < 2) {
    return 'Department must be at least 2 characters.';
  }
  return '';
}
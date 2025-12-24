/**
 * Input Validation Utilities
 * Provides security-focused validation for user inputs
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true, error: '' };
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  if (trimmedUsername.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (trimmedUsername.length > 50) {
    return { valid: false, error: 'Username must not exceed 50 characters' };
  }

  // Allow alphanumeric, underscore, hyphen, and dot
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;

  if (!usernameRegex.test(trimmedUsername)) {
    return { valid: false, error: 'Username can only contain letters, numbers, dots, underscores, and hyphens' };
  }

  return { valid: true, error: '' };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, error: string, strength: string }
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required', strength: 'none' };
  }

  if (password.length === 0) {
    return { valid: false, error: 'Password is required', strength: 'none' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (max 128 characters)', strength: 'none' };
  }

  // Check for password strength
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const criteriasMet = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (criteriasMet < 2) {
    return {
      valid: false,
      error: 'Password must contain at least 2 of: uppercase, lowercase, numbers, special characters',
      strength: 'weak'
    };
  }

  let strength = 'weak';
  if (password.length >= 12 && criteriasMet >= 3) {
    strength = 'strong';
  } else if (password.length >= 10 && criteriasMet >= 2) {
    strength = 'medium';
  }

  return { valid: true, error: '', strength };
}

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove any HTML tags and trim whitespace
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validate username or email input
 * Determines if input is email or username and validates accordingly
 * @param {string} input - Username or email to validate
 * @returns {Object} { valid: boolean, error: string, type: 'email'|'username' }
 */
export function validateUsernameOrEmail(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Username or email is required', type: null };
  }

  const trimmedInput = input.trim();

  // Check if input looks like an email
  if (trimmedInput.includes('@')) {
    const emailValidation = validateEmail(trimmedInput);
    return { ...emailValidation, type: 'email' };
  } else {
    const usernameValidation = validateUsername(trimmedInput);
    return { ...usernameValidation, type: 'username' };
  }
}

/**
 * Check for common password patterns that should be avoided
 * @param {string} password - Password to check
 * @param {string} username - Username to check against
 * @returns {Object} { valid: boolean, error: string }
 */
export function checkPasswordPatterns(password, username = '') {
  if (!password) {
    return { valid: true, error: '' };
  }

  const lowerPassword = password.toLowerCase();

  // Check if password contains username
  if (username && lowerPassword.includes(username.toLowerCase())) {
    return { valid: false, error: 'Password should not contain your username' };
  }

  // Common weak passwords
  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 'letmein',
    'welcome', 'monkey', '1234567890', 'password123'
  ];

  if (commonPasswords.includes(lowerPassword)) {
    return { valid: false, error: 'This password is too common' };
  }

  // Sequential characters
  if (/(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    if (password.length < 12) {
      return { valid: false, error: 'Avoid using sequential characters' };
    }
  }

  // Repeated characters
  if (/(.)\1{3,}/.test(password)) {
    return { valid: false, error: 'Avoid using repeated characters' };
  }

  return { valid: true, error: '' };
}

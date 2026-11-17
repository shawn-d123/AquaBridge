const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sign-in and sign-up validation (REG-004). Each message says how to fix the problem.
 * @returns {Record<string, string>} errors keyed by field id; empty when valid
 */
export function validateAuth({ name = '', email = '', password = '' }, mode) {
  const e = {};
  if (mode === 'register' && !name.trim()) e.name = 'Enter your full name';
  if (!email.trim()) e.email = 'Enter your email address';
  else if (!EMAIL.test(email.trim())) e.email = 'Enter an email address in the correct format, like name@example.com';
  if (!password) e.password = 'Enter your password';
  else if (mode === 'register' && password.length < 8) e.password = 'Password must be 8 characters or more';
  return e;
}

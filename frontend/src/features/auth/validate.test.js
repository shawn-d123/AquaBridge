import { describe, expect, it } from 'vitest';
import { validateAuth } from './validate';

describe('validateAuth (SH-05, REG-004)', () => {
  it('reports empty fields', () => {
    expect(validateAuth({}, 'login')).toEqual({ email: 'Enter your email address', password: 'Enter your password' });
    expect(validateAuth({}, 'register')).toHaveProperty('name');
  });

  it('reports a badly formatted email', () => {
    expect(validateAuth({ email: 'jordan@', password: 'x' }, 'login').email).toMatch(/correct format/);
  });

  it('needs 8+ characters only when creating an account', () => {
    expect(validateAuth({ email: 'a@b.co', password: 'short' }, 'login')).toEqual({});
    expect(validateAuth({ name: 'A', email: 'a@b.co', password: 'short' }, 'register')).toHaveProperty('password');
  });
});

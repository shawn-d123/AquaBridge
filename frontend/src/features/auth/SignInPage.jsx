/**
 * Sign in and Create an account (SH-05 · Farhan). Mock authentication: the university-provided login component
 * replaces this form later. Keep the validation, the "You'll go back to" notice and the return path.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useStore } from '../../services/store';
import { Button } from '../../shared/components/Button';
import { Notice } from '../../shared/components/Feedback';
import { describedBy, ErrorSummary, Field } from '../../shared/components/Form';
import { cx, page } from '../../shared/styles';
import { clearPending, readPending, useAuth } from './auth';
import { validateAuth } from './validate';

const FIELDS = ['name', 'email', 'password'];

export function SignInPage() {
  const { toast } = useStore();
  const { currentUser, signIn, register, signOut } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'register' ? 'register' : 'login';
  const isLogin = mode === 'login';
  const [pending] = useState(readPending);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  // After a failed submit, move focus to the first field with an error (REG-004).
  useEffect(() => {
    const first = FIELDS.find((f) => errors[f]);
    if (first) document.getElementById(first)?.focus();
  }, [errors]);

  const onInput = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const switchMode = (next) => (e) => {
    e.preventDefault();
    setErrors({});
    setParams(next === 'register' ? { mode: 'register' } : {}, { replace: true });
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateAuth(form, mode);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (isLogin) signIn(form.email);
    else register(form);
    clearPending();
    toast(isLogin ? 'You are signed in' : 'Your account has been created');
    navigate(pending?.to || '/account/listings', { replace: true });
  };

  if (currentUser)
    return (
      <div className={cx(page, 'grid max-w-[600px] gap-6')}>
        <h1>You’re already signed in</h1>
        <p className="text-md">
          You are signed in as <strong>{currentUser.name}</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button to={pending?.to || '/account/listings'}>
            {pending ? `Continue to ${pending.label}` : 'Go to my listings'}
          </Button>
          <Button
            variant="quiet"
            onClick={() => {
              signOut();
              toast('You have signed out');
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );

  return (
    <div className={cx(page, 'max-w-[600px]')}>
      <div className="mb-8 grid gap-4">
        <h1>{isLogin ? 'Sign in' : 'Create an account'}</h1>
        {pending ? (
          <Notice tone="pri" title={`You’ll go back to: ${pending.label}`}>
            {pending.name === 'editor'
              ? 'Your rehoming answers are saved and will fill in the listing.'
              : 'Anything you entered is kept.'}
          </Notice>
        ) : (
          <p className="text-md text-ink-2">One account lets you rehome and adopt.</p>
        )}
      </div>

      <ErrorSummary errors={errors} autoFocus={false} />

      <form className="grid gap-6" noValidate onSubmit={submit}>
        {!isLogin && (
          <Field id="name" label="Full name" error={errors.name}>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={onInput('name')}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={describedBy('name', { error: errors.name })}
            />
          </Field>
        )}
        <Field id="email" label="Email address" error={errors.email}>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={onInput('email')}
            autoComplete="email"
            spellCheck={false}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email', { error: errors.email })}
          />
        </Field>
        <Field
          id="password"
          label="Password"
          hint={isLogin ? undefined : 'At least 8 characters.'}
          error={errors.password}
        >
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={onInput('password')}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            aria-invalid={!!errors.password}
            aria-describedby={describedBy('password', { hint: !isLogin, error: errors.password })}
          />
        </Field>
        <div>
          <Button type="submit">{isLogin ? 'Sign in' : 'Create account'}</Button>
        </div>
      </form>

      <p className="mt-6">
        {isLogin ? (
          <>
            No account?{' '}
            <Link to="/signin?mode=register" onClick={switchMode('register')}>
              Create one
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/signin" onClick={switchMode('login')}>
              Sign in
            </Link>
          </>
        )}
      </p>

      <div className="rounded-ab border-warn/60 mt-10 grid gap-1 border-2 border-dashed px-4 py-3 text-sm">
        <span className="text-warn font-semibold">Sample sign-in (Sprint 1)</span>
        <span>
          The university-provided login replaces this form. Any valid email and password signs in as the sample user
          Jordan Lee; creating an account makes a new empty account in this browser.
        </span>
      </div>
    </div>
  );
}

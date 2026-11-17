/**
 * Mock authentication module (SH-05 · Farhan).
 *
 * Every feature reads the signed-in user through useAuth(); guarded routes use <RequireAuth>. When the
 * university-provided login component arrives, only this file and SignInPage need to change.
 *
 *   const { currentUser, signIn, register, signOut } = useAuth();
 */
import { useCallback, useMemo } from 'react';
import { SAMPLE_USER, USERS } from '../../services/contracts';
import { useStore } from '../../services/store';

/** Look up a user record from the sample users or accounts created on the sign-up screen. */
export function userById(state, id) {
  if (!id) return null;
  const u = USERS[id] || state.accounts?.[id];
  return u ? { id, ...u } : null;
}

export function useAuth() {
  const { state, update } = useStore();
  const currentUser = userById(state, state.user);

  /** Mock sign in: any valid email signs in as the sample user (U-01, Jordan Lee). */
  const signIn = useCallback(() => {
    update((s) => {
      s.user = SAMPLE_USER;
    });
    return SAMPLE_USER;
  }, [update]);

  /** Mock sign up: creates a new empty account in this browser and signs in as it. */
  const register = useCallback(
    ({ name, email }) =>
      update((s) => {
        const id = `U-${String(s.seq.user++).padStart(2, '0')}`;
        s.accounts[id] = { name: name.trim(), email: email.trim() };
        s.user = id;
        return id;
      }),
    [update],
  );

  const signOut = useCallback(() => {
    clearPending();
    update((s) => {
      s.user = null;
    });
  }, [update]);

  return useMemo(
    () => ({ currentUser, signedIn: !!currentUser, signIn, register, signOut }),
    [currentUser, signIn, register, signOut],
  );
}

/*
  Pending action ("return to action"). Remembers where a signed-out user was heading, and which item, so they land
  there after signing in. Kept in sessionStorage, never in the URL, so nothing sensitive is exposed.
*/
const PENDING_KEY = 'aquabridge-pending-action';

/** @param {{ to: string, name: string, label: string, itemId?: string }} action */
export function savePending(action) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(action));
  } catch {
    /* storage blocked: the user will land on the default page instead */
  }
}

export function readPending() {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_KEY)) || null;
  } catch {
    return null;
  }
}

export function clearPending() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* nothing to clear */
  }
}

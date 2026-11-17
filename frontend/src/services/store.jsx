/**
 * App state shared by every feature, saved in this browser (localStorage) so a reload keeps the demo where it was.
 *
 *   const { state, update, reset, toast } = useStore();
 *   update((s) => { s.intake.answers.kind = 'plant'; });   // change a copy; saved and re-rendered
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { seed } from './seed';

/** Bump when seed.js or a saved data shape changes, so browsers holding old data start fresh. */
export const DATA_VERSION = 1;
export const STORAGE_KEY = 'aquabridge-frontend';

const StoreContext = createContext(null);

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version === DATA_VERSION && Array.isArray(saved.listings)) return saved;
  } catch {
    /* unreadable or unavailable: start from the sample data */
  }
  return { ...seed(), version: DATA_VERSION };
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

export function StoreProvider({ children, initial }) {
  const [state, setState] = useState(() => (initial ? { ...initial, version: DATA_VERSION } : load()));
  const [toastMsg, setToastMsg] = useState(null);
  const ref = useRef(state);
  const timer = useRef(null);

  const commit = useCallback((next) => {
    ref.current = next;
    save(next);
    setState(next);
  }, []);

  const update = useCallback(
    (fn) => {
      const draft = structuredClone(ref.current);
      const result = fn(draft);
      commit(draft);
      return result;
    },
    [commit],
  );

  const reset = useCallback(() => commit({ ...seed(), version: DATA_VERSION }), [commit]);

  const toast = useCallback((msg) => {
    setToastMsg({ msg, at: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const value = useMemo(() => ({ state, update, reset, toast, toastMsg }), [state, update, reset, toast, toastMsg]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

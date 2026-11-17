/**
 * Site frame (SH-04 · Farhan): skip link, header with account menu, the current page, footer and toast.
 * Also sets the browser title to match the page and opens every new page scrolled to the top.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { clearPending, useAuth } from '../features/auth/auth';
import { matchRoute, ROUTES, to } from '../routes';
import { pendingCountFor } from '../services/requestService';
import { useStore } from '../services/store';
import { Chevron, Logo } from './components/Art';
import { Toast } from './components/Feedback';
import { cx, wrap } from './styles';

const MAIN_LINKS = [
  ['browse', 'Browse listings'],
  ['rehome', 'Rehome'],
  ['species', 'Species guide'],
  ['help', 'How it works'],
];

const NAV_LINK =
  'relative flex min-h-16 items-center px-3 text-md font-semibold whitespace-nowrap text-ink no-underline hover:text-primary hover:underline ' +
  "aria-[current=page]:text-primary aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-0 aria-[current=page]:after:h-1 aria-[current=page]:after:bg-primary aria-[current=page]:after:content-[''] " +
  'max-xl:min-h-12 max-xl:px-0 max-xl:aria-[current=page]:after:hidden max-xl:aria-[current=page]:underline';
const MENU_ITEM =
  'flex w-full items-center justify-between gap-3 rounded-ab-sm px-3 py-2.5 text-left text-md text-ink no-underline hover:bg-mist hover:text-ink ' +
  'aria-[current=page]:font-semibold aria-[current=page]:text-primary max-xl:px-0';
const BADGE = 'min-w-6 rounded-full bg-bad px-1.5 text-center text-xs leading-6 font-bold text-white tabular-nums';
const GROUP = 'px-3 pt-3 text-xs font-semibold text-ink-2 max-xl:px-0';

export function Header() {
  const { state, toast } = useStore();
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = matchRoute(location.pathname);
  const section = ROUTES[name].section || name;

  // Each menu remembers the page it was opened on, so it closes by itself when the page changes.
  const [navOpenOn, setNavOpenOn] = useState(null);
  const [acctOpenOn, setAcctOpenOn] = useState(null);
  const navOpen = navOpenOn === location.key;
  const acctOpen = acctOpenOn === location.key;
  const acctRef = useRef(null);
  const acctBtn = useRef(null);
  const menuBtn = useRef(null);

  const pending = pendingCountFor(state, currentUser?.id);

  useEffect(() => {
    if (!navOpen && !acctOpen) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      (acctOpen ? acctBtn : menuBtn).current?.focus();
      setAcctOpenOn(null);
      setNavOpenOn(null);
    };
    const onClick = (e) => {
      if (acctOpen && acctRef.current && !acctRef.current.contains(e.target)) setAcctOpenOn(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [navOpen, acctOpen]);

  const toggleAccount = () => {
    setAcctOpenOn(acctOpen ? null : location.key);
    if (!acctOpen) requestAnimationFrame(() => acctRef.current?.querySelector('a')?.focus());
  };

  const accountLink = (route, text, badge) => (
    <Link to={to(route)} className={MENU_ITEM} aria-current={name === route ? 'page' : undefined}>
      <span>{text}</span>
      {badge ? (
        <span className={BADGE}>
          {badge} <span className="sr-only">new</span>
        </span>
      ) : null}
    </Link>
  );

  // Sign out in two steps: go to the homepage first, then clear the user once we are there. Clearing it first would
  // make the guard on the current account page send the user to Sign in instead of home.
  const doSignOut = () => navigate('/', { state: { signOut: true } });
  const signOutRequested = location.state?.signOut && !!currentUser;
  useEffect(() => {
    if (!signOutRequested) return;
    signOut();
    toast('You have signed out');
  }, [signOutRequested, signOut, toast]);

  return (
    <header className="border-line bg-surface sticky top-0 z-20 border-b">
      <div className={cx(wrap, 'relative flex min-h-16 items-center gap-8')}>
        <Link
          to="/"
          className="text-ink hover:text-ink flex items-center gap-2.5 text-xl font-bold tracking-[-0.01em] no-underline"
        >
          <Logo />
          AquaBridge
        </Link>

        <nav
          id="site-nav"
          aria-label="Main"
          className={cx(
            'flex flex-1 items-center gap-2',
            'max-xl:border-line max-xl:bg-surface max-xl:shadow-card max-xl:absolute max-xl:inset-x-0 max-xl:top-full max-xl:flex-col max-xl:items-stretch max-xl:gap-0 max-xl:border-b max-xl:px-6 max-xl:pb-4',
            !navOpen && 'max-xl:hidden',
          )}
        >
          <ul className="m-0 flex list-none items-center p-0 max-xl:flex-col max-xl:items-stretch">
            {MAIN_LINKS.map(([route, text]) => (
              <li key={route}>
                <Link to={to(route)} className={NAV_LINK} aria-current={section === route ? 'page' : undefined}>
                  {text}
                </Link>
              </li>
            ))}
          </ul>

          <div className="max-xl:border-line ml-auto flex items-center gap-4 max-xl:ml-0 max-xl:flex-col max-xl:items-stretch max-xl:gap-0 max-xl:border-t max-xl:pt-2">
            {currentUser ? (
              <div className="relative" ref={acctRef}>
                <button
                  ref={acctBtn}
                  type="button"
                  onClick={toggleAccount}
                  aria-expanded={acctOpen}
                  aria-controls="account-menu"
                  className="group rounded-ab-sm text-md text-ink hover:bg-mist flex min-h-11 items-center gap-2 px-2 font-semibold max-xl:hidden"
                >
                  Your account{' '}
                  {pending ? (
                    <span className={BADGE}>
                      {pending} <span className="sr-only">new requests</span>
                    </span>
                  ) : null}
                  <Chevron />
                </button>
                <div
                  id="account-menu"
                  className={cx(
                    'rounded-ab border-line bg-surface shadow-card absolute top-[calc(100%+8px)] right-0 z-30 w-72 border p-2',
                    'max-xl:static max-xl:grid max-xl:w-auto max-xl:border-0 max-xl:p-0 max-xl:shadow-none',
                    acctOpen ? 'grid' : 'hidden',
                  )}
                >
                  <p className="text-ink-2 px-3 pt-2 pb-1 text-sm max-xl:px-0">
                    Signed in as <strong className="text-ink">{currentUser.name}</strong>
                  </p>
                  <p className={GROUP}>Rehoming</p>
                  {accountLink('mylistings', 'My listings')}
                  {accountLink('incoming', 'Requests for my listings', pending)}
                  <p className={cx(GROUP, 'border-line mt-2 border-t')}>Adopting</p>
                  {accountLink('habitat', 'My tanks and ponds')}
                  {accountLink('myrequests', 'My adoption requests')}
                  <div className="border-line mt-2 border-t pt-2">
                    <button type="button" className={MENU_ITEM} onClick={doSignOut}>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/signin" onClick={clearPending} className={cx(NAV_LINK, 'px-0')}>
                  Sign in
                </Link>
                <Link
                  to="/signin?mode=register"
                  onClick={clearPending}
                  className="rounded-ab-sm bg-primary hover:bg-primary-hover inline-flex min-h-11 items-center justify-center px-4 font-semibold whitespace-nowrap text-white no-underline hover:text-white max-xl:my-2"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="ml-auto xl:hidden">
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setNavOpenOn(navOpen ? null : location.key)}
            aria-expanded={navOpen}
            aria-controls="site-nav"
            className="group rounded-ab-sm text-ink hover:bg-mist flex min-h-11 items-center gap-2 px-2 font-semibold"
          >
            {navOpen ? 'Close' : 'Menu'}
            {pending && !navOpen ? (
              <span className={BADGE}>
                {pending} <span className="sr-only">new requests</span>
              </span>
            ) : null}
            <Chevron />
          </button>
        </div>
      </div>
    </header>
  );
}

const FOOT_LINK = 'text-ink underline underline-offset-3 hover:text-ink hover:decoration-2 text-left';
const REPO = 'https://github.com/shawn-d123/AquaBridge';
const JIRA = 'https://dsouzashawn305.atlassian.net/jira/software/projects/KAN/boards/1';

export function Footer() {
  const { reset, toast } = useStore();
  const navigate = useNavigate();
  const resetData = () => {
    reset();
    clearPending();
    navigate('/');
    toast('Sample data has been reset');
  };
  const group = (title, items) => (
    <nav aria-label={title} className="grid content-start gap-2">
      <h2 className="text-md">{title}</h2>
      <ul className="m-0 grid list-none gap-2 p-0">
        {items.map(([text, target]) => (
          <li key={text}>
            {typeof target === 'function' ? (
              <button type="button" onClick={target} className={FOOT_LINK}>
                {text}
              </button>
            ) : target.startsWith('http') ? (
              <a href={target} className={FOOT_LINK} target="_blank" rel="noreferrer">
                {text} <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <Link to={target} className={FOOT_LINK}>
                {text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <footer className="border-primary bg-mist mt-auto border-t-4 text-sm">
      <div
        className={cx(
          wrap,
          'grid grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] gap-10 py-12 max-lg:grid-cols-2 max-sm:grid-cols-1',
        )}
      >
        <div className="grid content-start gap-3">
          <p className="flex items-center gap-2 text-lg font-bold">
            <Logo />
            AquaBridge
          </p>
          <p className="text-ink-2 max-w-[40ch]">
            Free rehoming for aquarium and pond fish, shrimp and plants in the UK, so they go to a suitable new home
            instead of being released.
          </p>
        </div>
        {group('Using AquaBridge', [
          ['Browse listings', '/browse'],
          ['Rehome an animal or plant', '/rehome'],
          ['Species guide', '/species'],
          ['How it works', '/how-it-works'],
          ['Never release them', '/how-it-works#never-release'],
          ['Accessibility', '/accessibility'],
          ['Privacy', '/privacy'],
          ['Contact', '/contact'],
        ])}
        {group('For the team', [
          ['Reset sample data', resetData],
          ['Live prototype', 'https://aquabridge-zeta.vercel.app/prototype/'],
          ['Sprint 1 backlog', 'https://aquabridge-zeta.vercel.app/backlog/'],
        ])}
        {group('Project links', [
          ['Jira board', JIRA],
          ['Code on GitHub', REPO],
        ])}
      </div>
      <div className="border-line border-t">
        <div className={cx(wrap, 'text-ink-2 flex flex-wrap justify-between gap-x-6 gap-y-1 py-4')}>
          <p>Sample data only. Guidance results are examples, not legal or veterinary advice.</p>
          <p>CS2701 Group B14 · Shawn D’Souza · Muhammad Farhan Ul Haque · Midhir Maru</p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }) {
  const location = useLocation();
  const mainRef = useRef(null);
  const firstLoad = useRef(true);
  const { name } = matchRoute(location.pathname);

  // Browser title matches the page heading, e.g. "My listings · AquaBridge".
  useEffect(() => {
    document.title =
      name === 'home' ? 'AquaBridge · Rehome or adopt aquarium and pond life' : `${ROUTES[name].title} · AquaBridge`;
  }, [name]);

  // New pages open at the top (or at #section) and move focus to the page for keyboard and screen reader users.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView();
        el.focus?.({ preventScroll: true });
        return;
      }
    }
    window.scrollTo(0, 0);
    if (!firstLoad.current) mainRef.current?.focus({ preventScroll: true });
    firstLoad.current = false;
  }, [location.key, location.hash]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="bg-surface text-ink absolute -left-[9999px] z-50 px-4 py-3 font-semibold focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" tabIndex={-1} ref={mainRef} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

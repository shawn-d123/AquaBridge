/**
 * Route map (SH-04 · Farhan coordinates). One entry per screen.
 *
 *   path     URL pattern (React Router)
 *   title    Page heading and browser title ("My listings · AquaBridge")
 *   owner    Who builds the screen
 *   section  Main header link that stays highlighted on this screen
 *   auth     true when signed-out users must sign in first (SH-05 route guard)
 *
 * Teammates: add or change your own screens here and in App.jsx in the same pull request.
 */
import { matchPath } from 'react-router';

export const ROUTES = {
  home: { path: '/', title: 'Home', owner: 'Farhan (shared homepage)' },
  browse: { path: '/browse', title: 'Browse listings', owner: 'Shawn', section: 'browse' },
  // '/listings/new' must come before '/listings/:id' so matchRoute finds the editor first.
  editor: { path: '/listings/new', title: 'Create your listing', owner: 'Shawn', section: 'rehome', auth: true },
  listing: { path: '/listings/:id', title: 'Listing details', owner: 'Shawn', section: 'browse' },
  editListing: { path: '/listings/:id/edit', title: 'Edit listing', owner: 'Shawn', auth: true },
  rehome: { path: '/rehome', title: 'Rehoming questions', owner: 'Farhan', section: 'rehome' },
  review: { path: '/rehome/review', title: 'Check your answers', owner: 'Farhan', section: 'rehome' },
  guidance: { path: '/rehome/guidance', title: 'Your rehoming guidance', owner: 'Farhan', section: 'rehome' },
  species: { path: '/species', title: 'Species guide', owner: 'Farhan', section: 'species' },
  speciesDetail: { path: '/species/:id', title: 'Species guide', owner: 'Farhan', section: 'species' },
  signin: { path: '/signin', title: 'Sign in', owner: 'Farhan (mock auth)' },
  mylistings: { path: '/account/listings', title: 'My listings', owner: 'Shawn', auth: true },
  incoming: { path: '/account/incoming', title: 'Requests for my listings', owner: 'Shawn', auth: true },
  habitat: { path: '/account/habitat', title: 'My tanks and ponds', owner: 'Midhir', auth: true },
  compat: { path: '/check/:id', title: 'Compatibility check', owner: 'Midhir', section: 'browse', auth: true },
  request: { path: '/request/:id/:hab', title: 'Request to adopt', owner: 'Midhir', section: 'browse', auth: true },
  myrequests: { path: '/account/requests', title: 'My adoption requests', owner: 'Midhir', auth: true },
  help: { path: '/how-it-works', title: 'How it works', owner: 'Farhan', section: 'help' },
  accessibility: { path: '/accessibility', title: 'Accessibility', owner: 'Farhan' },
  privacy: { path: '/privacy', title: 'Privacy', owner: 'Farhan' },
  contact: { path: '/contact', title: 'Contact', owner: 'Farhan' },
  notFound: { path: '*', title: 'Page not found', owner: 'Farhan' },
};

/** Build a URL for a screen: to('listing', { id: 'L-1044' }) → '/listings/L-1044'. */
export function to(name, params = {}) {
  const r = ROUTES[name];
  if (!r) throw new Error(`Unknown route: ${name}`);
  return r.path.replace(/:(\w+)/g, (_, key) => encodeURIComponent(params[key] ?? ''));
}

/** Which screen a pathname belongs to, and its URL params. Unknown paths return 'notFound'. */
export function matchRoute(pathname) {
  for (const [name, r] of Object.entries(ROUTES)) {
    if (r.path === '*') continue;
    const m = matchPath({ path: r.path, end: true }, pathname);
    if (m) return { name, params: m.params };
  }
  return { name: 'notFound', params: {} };
}

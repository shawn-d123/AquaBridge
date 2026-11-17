/**
 * Route table (SH-04 · Farhan coordinates). Every screen in routes.js has a route here.
 * Guarded screens are wrapped in <RequireAuth> (SH-05). Teammates swap their placeholder for the real page.
 */
import { Route, Routes } from 'react-router';
import { SignInPage } from './features/auth/SignInPage';
import { GuidancePage } from './features/guidance/GuidancePage';
import { RehomePage } from './features/guidance/RehomePage';
import { ReviewPage } from './features/guidance/ReviewPage';
import { SpeciesListPage, SpeciesPage } from './features/guidance/SpeciesPages';
import { CompatPage, HabitatPage, MyRequestsPage, RequestPage } from './features/habitat/HabitatPlaceholders';
import { HomePage } from './features/home/HomePage';
import { AccessibilityPage, ContactPage, HowItWorksPage, NotFoundPage, PrivacyPage } from './features/home/InfoPages';
import {
  BrowsePage,
  EditorPage,
  IncomingPage,
  ListingPage,
  MyListingsPage,
} from './features/listings/ListingPlaceholders';
import { ROUTES } from './routes';
import { Layout } from './shared/Layout';
import { RequireAuth } from './shared/RequireAuth';

/** Screen for each route name. */
const SCREENS = {
  home: <HomePage />,
  browse: <BrowsePage />,
  editor: <EditorPage />,
  editListing: <EditorPage />,
  listing: <ListingPage />,
  rehome: <RehomePage />,
  review: <ReviewPage />,
  guidance: <GuidancePage />,
  species: <SpeciesListPage />,
  speciesDetail: <SpeciesPage />,
  signin: <SignInPage />,
  mylistings: <MyListingsPage />,
  incoming: <IncomingPage />,
  habitat: <HabitatPage />,
  compat: <CompatPage />,
  request: <RequestPage />,
  myrequests: <MyRequestsPage />,
  help: <HowItWorksPage />,
  accessibility: <AccessibilityPage />,
  privacy: <PrivacyPage />,
  contact: <ContactPage />,
  notFound: <NotFoundPage />,
};

export function App() {
  return (
    <Layout>
      <Routes>
        {Object.entries(ROUTES).map(([name, r]) => (
          <Route
            key={name}
            path={r.path}
            element={r.auth ? <RequireAuth>{SCREENS[name]}</RequireAuth> : SCREENS[name]}
          />
        ))}
      </Routes>
    </Layout>
  );
}

/** Journey tests for Farhan's features (F-07, SH-04, SH-05). */
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from './test/renderApp';

const next = (user) => user.click(screen.getByRole('button', { name: /continue|check your answers/i }));

/** Answer all four questions. Defaults give the eligible neon tetra example. */
async function answerAll(
  user,
  { kind = 'An animal', species = /neon tetra/i, qty = '6', condition = 'Healthy', health } = {},
) {
  await user.click(screen.getByLabelText(new RegExp(kind)));
  await next(user);
  await user.selectOptions(screen.getByLabelText('Species'), screen.getByRole('option', { name: species }));
  await user.type(screen.getByLabelText(/how many/i), qty);
  await next(user);
  await user.click(screen.getByLabelText(condition));
  if (health) await user.type(screen.getByLabelText(/describe the problem/i), health);
  await user.selectOptions(screen.getByLabelText(/why are you rehoming/i), 'moving');
  await next(user);
  await user.type(screen.getByLabelText(/town and postcode/i), 'Slough, SL1');
  await user.click(screen.getByLabelText('Within a month'));
  await next(user);
}

describe('homepage and navigation (SH-04)', () => {
  it('shows the search box and Start rehoming link, and the header links', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: /rehome or adopt/i })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search listings/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Start rehoming' })[0]).toHaveAttribute('href', '/rehome');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    ['Browse listings', 'Rehome', 'Species guide', 'How it works', 'Sign in', 'Create an account'].forEach((n) =>
      expect(within(nav).getByRole('link', { name: n })).toBeInTheDocument(),
    );
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });

  it('search opens Browse listings with the term', async () => {
    const { user } = renderApp('/');
    await user.type(screen.getByRole('searchbox', { name: /search listings/i }), 'tetra');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByText(/showing results for/i)).toHaveTextContent('tetra');
    expect(screen.getByRole('link', { name: /neon tetras/i })).toBeInTheDocument();
  });

  it('highlights the parent section and sets the browser title', () => {
    renderApp('/species/SP-002');
    expect(screen.getByRole('link', { name: 'Species guide', current: 'page' })).toBeInTheDocument();
    expect(document.title).toBe('Species guide · AquaBridge');
  });

  it('unknown routes show the not-found page', () => {
    renderApp('/nowhere');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('every content page loads', () => {
    for (const [url, heading] of [
      ['/how-it-works', 'How AquaBridge works'],
      ['/accessibility', 'Accessibility'],
      ['/privacy', 'Privacy'],
      ['/contact', 'Contact'],
    ]) {
      const { unmount } = renderApp(url);
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
      unmount();
    }
  });
});

describe('sign in, guards and return to action (SH-05)', () => {
  it('shows errors next to the fields and moves focus to the first one', async () => {
    const { user } = renderApp('/signin');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('There is a problem');
    expect(screen.getByLabelText('Email address')).toHaveFocus();
    await user.type(screen.getByLabelText('Email address'), 'jordan@');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getAllByText(/correct format/)[0]).toBeInTheDocument();
  });

  it('sends signed-out users to sign in and returns them to the page they wanted', async () => {
    const { user } = renderApp('/check/L-1044');
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText('You’ll go back to: Compatibility check')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Email address'), 'jordan.lee@example.com');
    await user.type(screen.getByLabelText('Password'), 'anything');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('heading', { name: 'Compatibility check' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Three Java ferns on driftwood' })).toBeInTheDocument();
  });

  it('creates an account, then the account menu opens, closes with Escape, and signs out', async () => {
    const { user } = renderApp('/signin?mode=register');
    await user.type(screen.getByLabelText('Full name'), 'Sam Patel');
    await user.type(screen.getByLabelText('Email address'), 'sam@example.com');
    await user.type(screen.getByLabelText('Password'), 'longenough');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('heading', { name: 'My listings' })).toBeInTheDocument();

    const menuButton = screen.getByRole('button', { name: /your account/i });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Sam Patel')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(screen.getByRole('heading', { level: 1, name: /rehome or adopt/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /your account/i })).not.toBeInTheDocument();
  });

  it('shows the pending request count for the sample user', async () => {
    const { user } = renderApp('/signin');
    await user.type(screen.getByLabelText('Email address'), 'jordan.lee@example.com');
    await user.type(screen.getByLabelText('Password'), 'x');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('button', { name: /your account 2 new requests/i })).toBeInTheDocument();
  });
});

describe('guided rehoming journey (F-01 to F-06)', () => {
  it('blocks Continue with an error summary and keeps answers on Back', async () => {
    const { user } = renderApp('/rehome');
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
    await next(user);
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an animal or a plant');
    await user.click(screen.getByLabelText(/a plant/i));
    await next(user);
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /where is it growing/i })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/how many/i), '600');
    await next(user);
    expect(screen.getByRole('alert')).toHaveTextContent('between 1 and 500');
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.getByLabelText(/a plant/i)).toBeChecked();
  });

  it('asks about health only when not healthy', async () => {
    const { user } = renderApp('/rehome');
    await user.click(screen.getByLabelText(/an animal/i));
    await next(user);
    await user.selectOptions(screen.getByLabelText('Species'), screen.getByRole('option', { name: /neon tetra/i }));
    await user.type(screen.getByLabelText(/how many/i), '6');
    await next(user);
    expect(screen.queryByLabelText(/describe the problem/i)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('Minor issues'));
    expect(screen.getByLabelText(/describe the problem/i)).toBeInTheDocument();
    await user.click(screen.getByLabelText('Healthy'));
    expect(screen.queryByLabelText(/describe the problem/i)).not.toBeInTheDocument();
  });

  it('eligible: review, change an answer, guidance, sign in, pre-filled editor, publish', async () => {
    const { user } = renderApp('/rehome');
    await answerAll(user);

    expect(screen.getByRole('heading', { name: 'Check your answers' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Change how many' }));
    const qty = screen.getByLabelText(/how many/i);
    await user.clear(qty);
    await user.type(qty, '8');
    await next(user);
    expect(screen.getByRole('heading', { name: 'Check your answers' })).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Get my guidance' }));
    expect(screen.getByRole('heading', { name: 'You can create a listing' })).toBeInTheDocument();
    expect(screen.getByText('Can be listed')).toBeInTheDocument();
    expect(screen.getByText('Illustrative only')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create my listing' }));
    expect(screen.getByText('You’ll go back to: Create your listing')).toBeInTheDocument();
    expect(screen.getByText(/rehoming answers are saved/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText('Email address'), 'jordan.lee@example.com');
    await user.type(screen.getByLabelText('Password'), 'x');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByText('Filled in from your rehoming answers')).toBeInTheDocument();
    expect(screen.getByText('8 neon tetras need a new home')).toBeInTheDocument();
    expect(screen.getByText('Slough, SL1')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Publish listing' }));
    expect(screen.getByRole('heading', { name: '8 neon tetras need a new home' })).toBeInTheDocument();
  });

  it('needs review for an unidentified animal', async () => {
    const { user } = renderApp('/rehome');
    await answerAll(user, { species: /not sure/i });
    await user.click(screen.getByRole('button', { name: 'Get my guidance' }));
    expect(screen.getByRole('heading', { name: 'We need more information first' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create my listing' })).not.toBeInTheDocument();
    expect(screen.getByText(/identify it/i)).toBeInTheDocument();
  });

  it('needs review when unwell', async () => {
    const { user } = renderApp('/rehome');
    await answerAll(user, { condition: 'Unwell or under treatment', health: 'Fin rot' });
    await user.click(screen.getByRole('button', { name: 'Get my guidance' }));
    expect(screen.getByRole('heading', { name: 'We need more information first' })).toBeInTheDocument();
    expect(screen.getByText(/Fin rot/)).toBeInTheDocument();
  });

  it('restricted species cannot be listed, even by typing the editor address', async () => {
    const { user, unmount } = renderApp('/rehome');
    await answerAll(user, { species: /red-eared slider/i, qty: '1' });
    await user.click(screen.getByRole('button', { name: 'Get my guidance' }));
    expect(screen.getByRole('heading', { name: 'This can’t be listed publicly' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create my listing' })).not.toBeInTheDocument();
    unmount();

    // Same saved draft, now signed in, typing /listings/new directly.
    const saved = JSON.parse(localStorage.getItem('aquabridge-frontend'));
    renderApp('/listings/new', { initial: { ...saved, user: 'U-01' } });
    expect(screen.getByText('This can’t be listed yet')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Publish listing' })).not.toBeInTheDocument();
  });

  it('keeps the draft after a reload and never puts answers in the URL', async () => {
    const { user, unmount } = renderApp('/rehome');
    await user.click(screen.getByLabelText(/an animal/i));
    await next(user);
    await user.type(screen.getByLabelText(/how many/i), '12');
    expect(window.location.search).toBe('');
    unmount();

    renderApp('/rehome');
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/how many/i)).toHaveValue(12);
  });

  it('shows the care needs panel once a species is chosen', async () => {
    const { user } = renderApp('/rehome');
    await user.click(screen.getByLabelText(/a plant/i));
    await next(user);
    await user.selectOptions(screen.getByLabelText('Species'), screen.getByRole('option', { name: /java fern/i }));
    const panel = screen.getByRole('region', { name: /care needs: java fern/i });
    expect(within(panel).getByText('18 to 28 °C')).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: /read the full guide/i })).toHaveAttribute(
      'href',
      '/species/SP-005',
    );
  });
});

describe('species guide (F-08)', () => {
  it('searches by common or scientific name and shows an empty state', async () => {
    const { user } = renderApp('/species');
    expect(screen.getByText('9 species found')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'paracheirodon');
    expect(screen.getByText('1 species found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Neon tetra' })).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByText('No species match your search.')).toBeInTheDocument();
  });

  it('species page shows care ranges with units and live listings', () => {
    renderApp('/species/SP-007');
    expect(screen.getByRole('heading', { level: 1, name: 'Hardy water lily' })).toBeInTheDocument();
    expect(screen.getByText('500 litres')).toBeInTheDocument();
    expect(screen.getByText('At least 30 cm')).toBeInTheDocument();
    expect(screen.getByText('1 looking for a home now')).toBeInTheDocument();
  });

  it('restricted species are marked and link to what to do instead', () => {
    renderApp('/species/SP-008');
    expect(screen.getByText('Restricted: cannot be listed')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /what to do instead/i })[0]).toHaveAttribute(
      'href',
      '/how-it-works#never-release',
    );
  });

  it('unknown species IDs show Species not found', () => {
    renderApp('/species/SP-000');
    expect(screen.getByRole('heading', { name: 'Species not found' })).toBeInTheDocument();
  });
});

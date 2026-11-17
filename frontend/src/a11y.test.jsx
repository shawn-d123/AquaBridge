/**
 * Automated accessibility checks (axe-core) on Farhan's screens. jsdom cannot measure colour contrast, so that rule is
 * checked by eye against the design system instead.
 */
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { seed } from './services/seed';
import { renderApp } from './test/renderApp';

/** A finished, eligible intake so the review and guidance pages have something to show. */
function withIntake(signedIn) {
  const s = seed();
  s.user = signedIn ? 'U-01' : null;
  s.intake = {
    step: 4,
    fromReview: false,
    id: 'IC-301',
    answers: {
      kind: 'animal',
      speciesId: 'SP-002',
      quantity: '6',
      condition: 'healthy',
      reason: 'moving',
      location: 'Slough, SL1',
      urgency: 'week',
    },
    outcome: { intakeId: 'IC-301', outcome: 'eligible', reasons: ['Example reason.'] },
  };
  return s;
}

const PAGES = [
  ['/', false],
  ['/rehome', false],
  ['/rehome/review', false],
  ['/rehome/guidance', false],
  ['/signin', false],
  ['/signin?mode=register', false],
  ['/species', false],
  ['/species/SP-002', false],
  ['/species/SP-008', false],
  ['/how-it-works', false],
  ['/accessibility', false],
  ['/privacy', false],
  ['/contact', false],
  ['/nowhere', false],
  ['/account/listings', true],
  ['/listings/new', true],
];

describe('accessibility (axe-core)', () => {
  it.each(PAGES)('%s has no violations', async (url, signedIn) => {
    const { container, unmount } = renderApp(url, { initial: withIntake(signedIn) });
    const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    unmount();
    expect(result.violations.map((v) => `${v.id}: ${v.help} — ${v.nodes[0]?.html.slice(0, 120)}`)).toEqual([]);
  });
});

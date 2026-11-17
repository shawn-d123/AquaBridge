/**
 * Guided rehoming logic (Farhan): questionnaire validation (F-01/F-02), example guidance rules (F-04)
 * and the handoff payload for Shawn's listing editor (F-06). Pure functions, so they are easy to test.
 *
 * These are ILLUSTRATIVE Sprint 1 rules, not a legal or veterinary decision.
 */
import { CONDITION, URGENCY } from '../../services/contracts';
import { getSpecies, suggestTitle } from '../../services/species';

export const STEPS = ['Organism', 'Species', 'Condition', 'Location'];
export const STEP_COUNT = STEPS.length;

export const QUESTIONS = {
  1: 'What are you rehoming?',
  2: 'Which species is it, and how many?',
  3: 'How is it doing?',
  4: 'Where is it, and how soon does it need a home?',
};

/** Errors for one questionnaire step, keyed by field. An empty object means the step is valid. */
export function validateStep(step, a = {}) {
  const e = {};
  if (step === 1 && !['animal', 'plant'].includes(a.kind)) e.kind = 'Choose an animal or a plant';
  if (step === 2) {
    const s = getSpecies(a.speciesId);
    if (!s || (s.kind !== a.kind && s.kind !== 'any'))
      e.speciesId = 'Choose a species, or choose “I’m not sure what it is”';
    const q = String(a.quantity ?? '').trim();
    if (!q) e.quantity = 'Enter how many you are rehoming';
    else if (!/^\d+$/.test(q) || +q < 1 || +q > 500) e.quantity = 'Enter a whole number between 1 and 500';
  }
  if (step === 3) {
    if (!CONDITION[a.condition]) e.condition = 'Choose the description closest to its condition';
    else if (a.condition !== 'healthy' && !a.health?.trim())
      e.health = 'Describe the problem or treatment, for example “white spot, treated with salt for a week”';
    if (!a.reason) e.reason = 'Choose why you are rehoming';
  }
  if (step === 4) {
    if (!a.location || a.location.trim().length < 3)
      e.location = 'Enter a town and postcode district of at least 3 characters, like “Ealing, W5”';
    if (!URGENCY[a.urgency]) e.urgency = 'Choose how soon it needs a new home';
  }
  return e;
}

/** First step that still has an error, or null when every answer is complete. */
export function firstIncompleteStep(a) {
  for (let n = 1; n <= STEP_COUNT; n++) if (Object.keys(validateStep(n, a)).length) return n;
  return null;
}

/**
 * Example guidance rules (F-04):
 *   restricted species                  → restricted
 *   unidentified species, or unwell     → needs_review
 *   otherwise                           → eligible
 * @returns {{ outcome: import('../../services/contracts').GuidanceOutcome, reasons: string[] }}
 */
export function evaluateIntake(a) {
  const s = getSpecies(a.speciesId);
  if (!s) return { outcome: 'needs_review', reasons: ['No species was chosen, so we cannot check it.'] };

  if (s.status === 'restricted')
    return {
      outcome: 'restricted',
      reasons: [
        `${s.common} is on our example list of restricted species.`,
        'Ordinary rehoming listings cannot be published for restricted species.',
      ],
    };

  const reasons = [];
  if (s.status === 'unknown')
    reasons.push(
      'You told us you are not sure what it is, so we cannot check whether it is restricted or what care it needs.',
    );
  if (a.condition === 'unwell')
    reasons.push(
      `You described it as unwell or under treatment${a.health ? ` (“${a.health.trim()}”)` : ''}. Moving it now could spread disease to an adopter’s tank or pond.`,
    );
  if (reasons.length) return { outcome: 'needs_review', reasons };

  reasons.push(`${s.common} is a supported species with care information on AquaBridge.`);
  reasons.push(
    a.condition === 'minor'
      ? 'You described minor issues. Mention them in your listing so adopters know what to expect.'
      : 'You described it as healthy.',
  );
  reasons.push('Nothing in your answers suggests a restriction.');
  return { outcome: 'eligible', reasons };
}

/** Next steps for each outcome. Urgent cases ("within a week") get a short-term suggestion first. */
export function nextSteps(outcome, a) {
  const s = getSpecies(a.speciesId);
  const urgent =
    a.urgency === 'week'
      ? [
          'Short on time? Ask a local aquatic shop or fishkeeping club whether they can take it in while you look for a home.',
        ]
      : [];
  if (outcome === 'eligible')
    return [
      ...urgent,
      'Ask a local fishkeeping club to share your listing with members.',
      'Keep caring for it as normal until the handover is confirmed.',
    ];
  if (outcome === 'needs_review')
    return [
      ...urgent,
      s?.status === 'unknown'
        ? 'Ask a specialist aquatic shop to identify it, then answer the questions again.'
        : 'Wait until treatment has finished and it has been healthy for two weeks, then answer the questions again.',
      a.condition === 'unwell'
        ? 'Speak to a vet with fish experience about treatment.'
        : 'Take clear photos to help with identification.',
      'Keep it in its current tank or pond in the meantime.',
    ];
  return [
    ...urgent,
    'Keep caring for it where it is now. Never release it into ponds, rivers or drains.',
    'Contact a specialist rescue or your local authority for advice on what is allowed.',
    'Read the GOV.UK guidance on invasive non-native species.',
  ];
}

/**
 * Handoff to the listing editor (F-06). Returns the pre-fill payload only for a complete, ELIGIBLE intake, so
 * needs-review and restricted cases can never reach the editor, even by typing the URL.
 * @returns {import('../../services/contracts').ListingPrefill | null}
 */
export function getHandoff(intake) {
  const a = intake?.answers || {};
  if (!intake?.id || firstIncompleteStep(a)) return null;
  if (evaluateIntake(a).outcome !== 'eligible') return null;
  const s = getSpecies(a.speciesId);
  return {
    intakeId: intake.id,
    speciesId: a.speciesId,
    quantity: +a.quantity,
    condition: a.condition,
    health: a.condition === 'healthy' ? '' : a.health?.trim() || '',
    location: a.location.trim(),
    urgency: a.urgency,
    reason: a.reason,
    details: a.details?.trim() || '',
    suggestedTitle: suggestTitle(s, a.quantity),
  };
}

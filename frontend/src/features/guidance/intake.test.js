import { describe, expect, it } from 'vitest';
import { evaluateIntake, firstIncompleteStep, getHandoff, nextSteps, validateStep } from './intake';

const tetras = {
  kind: 'animal',
  speciesId: 'SP-002',
  quantity: '6',
  condition: 'healthy',
  reason: 'moving',
  location: 'Slough, SL1',
  urgency: 'month',
};

describe('validateStep (F-01, F-02)', () => {
  it('requires animal or plant on step 1', () => {
    expect(validateStep(1, {})).toHaveProperty('kind');
    expect(validateStep(1, { kind: 'plant' })).toEqual({});
  });

  it('requires a species that matches the type', () => {
    expect(validateStep(2, { kind: 'animal', quantity: 1 })).toHaveProperty('speciesId');
    expect(validateStep(2, { kind: 'plant', speciesId: 'SP-002', quantity: 1 })).toHaveProperty('speciesId');
    expect(validateStep(2, { kind: 'plant', speciesId: 'SP-000', quantity: 1 })).toEqual({});
  });

  it.each([
    ['', true],
    ['0', true],
    ['501', true],
    ['2.5', true],
    ['abc', true],
    ['1', false],
    ['500', false],
  ])('quantity %s → error: %s', (quantity, hasError) => {
    expect('quantity' in validateStep(2, { kind: 'animal', speciesId: 'SP-002', quantity })).toBe(hasError);
  });

  it('asks for a health description only when not healthy', () => {
    expect(validateStep(3, { condition: 'healthy', reason: 'time' })).toEqual({});
    expect(validateStep(3, { condition: 'minor', reason: 'time' })).toHaveProperty('health');
    expect(validateStep(3, { condition: 'unwell', health: '  ', reason: 'time' })).toHaveProperty('health');
    expect(validateStep(3, { condition: 'unwell', health: 'White spot', reason: 'time' })).toEqual({});
  });

  it('needs a location of 3+ characters and an urgency', () => {
    expect(validateStep(4, { location: 'W5', urgency: 'week' })).toHaveProperty('location');
    expect(validateStep(4, { location: 'Ealing, W5' })).toHaveProperty('urgency');
    expect(validateStep(4, { location: 'Ealing, W5', urgency: 'week' })).toEqual({});
  });

  it('every error says how to fix it', () => {
    const all = {
      ...validateStep(1, {}),
      ...validateStep(2, {}),
      ...validateStep(3, { condition: 'minor' }),
      ...validateStep(4, {}),
    };
    Object.values(all).forEach((msg) => expect(msg).toMatch(/^(Choose|Enter|Describe)/));
  });

  it('finds the first incomplete step', () => {
    expect(firstIncompleteStep({})).toBe(1);
    expect(firstIncompleteStep({ ...tetras, urgency: undefined })).toBe(4);
    expect(firstIncompleteStep(tetras)).toBeNull();
  });
});

describe('evaluateIntake (F-04)', () => {
  it('eligible for a healthy supported species, with reasons from the answers', () => {
    const g = evaluateIntake(tetras);
    expect(g.outcome).toBe('eligible');
    expect(g.reasons.join(' ')).toContain('Neon tetra');
  });

  it('minor issues are still eligible', () => {
    expect(evaluateIntake({ ...tetras, condition: 'minor', health: 'Torn fin' }).outcome).toBe('eligible');
  });

  it('needs review when unidentified', () => {
    expect(evaluateIntake({ ...tetras, speciesId: 'SP-000' }).outcome).toBe('needs_review');
  });

  it('needs review when unwell, quoting the description', () => {
    const g = evaluateIntake({ ...tetras, condition: 'unwell', health: 'Fin rot' });
    expect(g.outcome).toBe('needs_review');
    expect(g.reasons.join(' ')).toContain('Fin rot');
  });

  it('restricted species are restricted even when healthy', () => {
    expect(evaluateIntake({ ...tetras, speciesId: 'SP-008' }).outcome).toBe('restricted');
    expect(evaluateIntake({ ...tetras, kind: 'plant', speciesId: 'SP-009' }).outcome).toBe('restricted');
  });

  it('urgent cases get a short-term suggestion first', () => {
    expect(nextSteps('eligible', { ...tetras, urgency: 'week' })[0]).toMatch(/Short on time/);
    expect(nextSteps('eligible', tetras)[0]).not.toMatch(/Short on time/);
    expect(nextSteps('restricted', { ...tetras, speciesId: 'SP-008' }).join(' ')).toMatch(/Never release/);
  });
});

describe('getHandoff (F-06)', () => {
  it('returns the agreed payload for an eligible intake', () => {
    expect(getHandoff({ id: 'IC-301', answers: { ...tetras, details: ' Fed flake ' } })).toEqual({
      intakeId: 'IC-301',
      speciesId: 'SP-002',
      quantity: 6,
      condition: 'healthy',
      health: '',
      location: 'Slough, SL1',
      urgency: 'month',
      reason: 'moving',
      details: 'Fed flake',
      suggestedTitle: '6 neon tetras need a new home',
    });
  });

  it('refuses needs-review, restricted, incomplete and unsaved intakes', () => {
    expect(getHandoff({ id: 'IC-1', answers: { ...tetras, speciesId: 'SP-000' } })).toBeNull();
    expect(getHandoff({ id: 'IC-1', answers: { ...tetras, speciesId: 'SP-008' } })).toBeNull();
    expect(getHandoff({ id: 'IC-1', answers: { ...tetras, location: '' } })).toBeNull();
    expect(getHandoff({ id: null, answers: tetras })).toBeNull();
  });
});

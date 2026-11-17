import { describe, expect, it } from 'vitest';
import { countLabel, getSpecies, listSpecies, suggestTitle } from './species';

describe('species catalogue (F-05)', () => {
  const all = listSpecies();

  it('has at least 7 supported, 2 restricted and 1 unknown species, with animals and plants', () => {
    const by = (st) => all.filter((s) => s.status === st);
    expect(by('supported').length).toBeGreaterThanOrEqual(7);
    expect(by('restricted').length).toBeGreaterThanOrEqual(2);
    expect(by('unknown')).toHaveLength(1);
    expect(by('supported').some((s) => s.kind === 'plant')).toBe(true);
    expect(by('supported').some((s) => s.kind === 'animal')).toBe(true);
  });

  it('every supported species has the care fields the other features need', () => {
    all
      .filter((s) => s.status === 'supported')
      .forEach((s) => {
        expect(s.id).toMatch(/^SP-\d{3}$/);
        expect(s.temp).toHaveLength(2);
        expect(s.ph).toHaveLength(2);
        expect(s.minVol).toBeGreaterThan(0);
        expect(s.habitats.length).toBeGreaterThan(0);
      });
  });

  it('listSpecies filters by kind and always offers "not sure"', () => {
    const plants = listSpecies('plant');
    expect(plants.every((s) => s.kind === 'plant' || s.kind === 'any')).toBe(true);
    expect(plants.some((s) => s.id === 'SP-000')).toBe(true);
    expect(listSpecies(undefined, { guide: true }).some((s) => s.id === 'SP-000')).toBe(false);
  });

  it('getSpecies returns a copy with its ID, or undefined', () => {
    expect(getSpecies('SP-005')).toMatchObject({ id: 'SP-005', common: 'Java fern' });
    expect(getSpecies('SP-999')).toBeUndefined();
  });

  it('builds count labels and suggested titles', () => {
    const tetra = getSpecies('SP-002');
    expect(countLabel(tetra, 6)).toBe('6 neon tetras');
    expect(countLabel(tetra, 1)).toBe('1 Neon tetra');
    expect(suggestTitle(tetra, 1)).toBe('Neon tetra needs a new home');
  });
});

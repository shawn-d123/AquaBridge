import { describe, expect, it } from 'vitest';
import { matchRoute, ROUTES, to } from './routes';

describe('route map (SH-04)', () => {
  it('builds URLs from names', () => {
    expect(to('listing', { id: 'L-1044' })).toBe('/listings/L-1044');
    expect(to('request', { id: 'L-1044', hab: 'H-201' })).toBe('/request/L-1044/H-201');
    expect(() => to('nope')).toThrow();
  });

  it('matches every path back to its own route', () => {
    for (const [name, r] of Object.entries(ROUTES)) {
      if (r.path === '*') continue;
      const url = r.path.replace(/:(\w+)/g, 'X-1');
      expect(matchRoute(url).name).toBe(name);
    }
  });

  it('sends /listings/new to the editor, not a listing called "new"', () => {
    expect(matchRoute('/listings/new').name).toBe('editor');
  });

  it('unknown paths are not found', () => {
    expect(matchRoute('/does/not/exist').name).toBe('notFound');
  });
});

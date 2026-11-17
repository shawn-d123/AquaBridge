import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

// jsdom has no layout, so scrolling is a no-op in tests.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(cleanup);

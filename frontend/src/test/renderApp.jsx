import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { App } from '../App';
import { StoreProvider } from '../services/store';

/** Render the whole app at a URL. Pass `initial` state to skip the saved browser data. */
export function renderApp(url = '/', { initial } = {}) {
  const user = userEvent.setup();
  const utils = render(
    <MemoryRouter initialEntries={[url]}>
      <StoreProvider initial={initial}>
        <App />
      </StoreProvider>
    </MemoryRouter>,
  );
  return { user, ...utils };
}

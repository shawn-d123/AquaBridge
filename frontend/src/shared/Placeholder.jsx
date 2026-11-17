import { cx, page } from './styles';

/**
 * Stand-in for a teammate's screen, so every route in the route map loads and the journeys can be clicked through.
 * Delete the placeholder when the real screen is merged.
 */
export function Placeholder({ title, owner, tickets, children }) {
  return (
    <div className={cx(page, 'grid gap-6')}>
      <h1>{title}</h1>
      <div className="rounded-ab border-warn/60 grid max-w-2xl gap-1 border-2 border-dashed px-4 py-3 text-sm">
        <span className="text-warn font-semibold">Placeholder screen</span>
        <span>
          Built by {owner} ({tickets}). This stand-in only exists so the route map and Farhan’s journeys can be tested.
        </span>
      </div>
      {children}
    </div>
  );
}

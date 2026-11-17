import { cx } from '../styles';

/** Wording and colour for each status value. The word is always shown, so colour is never the only signal. */
const STATUS = {
  draft: ['', 'Draft'],
  active: ['ok', 'Live'],
  reserved: ['warn', 'Reserved'],
  rehomed: ['pri', 'Rehomed'],
  withdrawn: ['', 'Withdrawn'],
  pending: ['warn', 'Waiting for owner'],
  accepted: ['pri', 'Accepted'],
  declined: ['bad', 'Declined'],
  completed: ['ok', 'Completed'],
  eligible: ['ok', 'Can be listed'],
  needs_review: ['warn', 'Needs checking first'],
  restricted: ['bad', 'Restricted'],
};
const TONE = {
  '': 'bg-mute-soft text-ink',
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
  pri: 'bg-primary-soft text-primary-hover',
};

/** Status tag: <Chip status="eligible" /> or <Chip tone="warn">Needs a home soon</Chip> */
export function Chip({ status, tone, children }) {
  const t = tone ?? STATUS[status]?.[0] ?? '';
  return (
    <strong
      className={cx(
        'rounded-ab-sm inline-block px-2 py-0.5 text-xs leading-snug font-semibold whitespace-nowrap',
        TONE[t],
      )}
    >
      {children ?? STATUS[status]?.[1] ?? status}
    </strong>
  );
}

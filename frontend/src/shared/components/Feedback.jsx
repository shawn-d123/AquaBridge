import { Link } from 'react-router';
import { useStore } from '../../services/store';
import { cx } from '../styles';

const NOTICE = {
  info: 'border-ink-2 bg-mist',
  pri: 'border-primary bg-primary-soft',
  warn: 'border-warn bg-warn-soft',
  bad: 'border-bad bg-bad-soft',
  ok: 'border-ok bg-ok-soft',
};

/** Inset with a coloured left edge for information, warnings and errors. */
export function Notice({ tone = 'info', title, children, className }) {
  return (
    <div className={cx('grid gap-1 border-l-4 px-5 py-4', NOTICE[tone], className)}>
      {title && <strong className="text-md font-bold">{title}</strong>}
      {children && <div className="text-sm">{children}</div>}
    </div>
  );
}

/** Important warning text with a "!" icon, used for "never release them" messages. */
export function Warning({ children, className }) {
  return (
    <div className={cx('flex items-start gap-3', className)}>
      <span
        aria-hidden="true"
        className="bg-ink grid size-8 flex-none place-items-center rounded-full text-lg leading-none font-bold text-white"
      >
        !
      </span>
      <p className="pt-1 font-semibold">
        <span className="sr-only">Warning: </span>
        {children}
      </p>
    </div>
  );
}

/** Empty state: a message plus one action. */
export function Empty({ title, children }) {
  return (
    <div className="rounded-ab bg-mist grid justify-items-start gap-3 p-8">
      <p className="text-md font-semibold">{title}</p>
      {children}
    </div>
  );
}

/** Back link at the top of a page. */
export function BackLink({ children = 'Back', ...rest }) {
  return (
    <Link
      className="text-ink hover:text-ink inline-flex items-center gap-1.5 text-sm underline underline-offset-3 before:inline-block before:size-2 before:-rotate-45 before:border-t-2 before:border-l-2 before:border-current before:content-['']"
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Short confirmation message, announced to screen readers. */
export function Toast() {
  const { toastMsg } = useStore();
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        'rounded-ab bg-ink shadow-card fixed bottom-6 left-1/2 z-40 max-w-[calc(100%-32px)] -translate-x-1/2 px-5 py-3 text-sm font-semibold text-white',
        !toastMsg && 'sr-only',
      )}
    >
      {toastMsg?.msg}
    </div>
  );
}

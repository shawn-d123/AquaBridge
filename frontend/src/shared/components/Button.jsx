import { Link } from 'react-router';
import { cx } from '../styles';

const VARIANT = {
  primary:
    'min-h-11 px-5 py-2.5 bg-primary text-white shadow-[0_2px_0_var(--color-primary-hover)] hover:bg-primary-hover hover:text-white',
  secondary:
    'min-h-11 px-5 py-2.5 bg-surface-2 text-ink shadow-[0_2px_0_var(--color-line)] hover:bg-line hover:text-ink',
  quiet: 'px-1 py-2 text-primary underline underline-offset-3 hover:text-primary-hover hover:decoration-2',
};

/**
 * Button. Renders a router link with `to`, otherwise a <button>.
 * variant: primary (one per screen) · secondary · quiet
 */
export function Button({ variant = 'primary', to, className, type = 'button', ...rest }) {
  const cls = cx(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-ab-sm text-md leading-tight font-semibold no-underline transition-colors active:translate-y-px',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT[variant],
    className,
  );
  if (to) return <Link to={to} className={cls} {...rest} />;
  return <button type={type} className={cls} {...rest} />;
}

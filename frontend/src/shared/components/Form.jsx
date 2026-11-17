import { useEffect, useRef } from 'react';
import { cx } from '../styles';

/**
 * Field: label, hint, error, then the control. Pass `legend` instead of `label` for a radio group (<fieldset>).
 * Fields are required unless `optional` is set, which adds "(optional)" after the label.
 */
export function Field({ id, label, legend, legendClass, optional, hint, error, className, children }) {
  const cls = cx('grid min-w-0 gap-1.5', error && 'has-error border-l-4 border-bad pl-4', className);
  const title = (
    <>
      {legend || label}
      {optional && <span className="text-ink-2 font-normal"> (optional)</span>}
    </>
  );
  const extra = (
    <>
      {hint && (
        <span id={`${id}-hint`} className="text-ink-2 text-sm">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="text-bad text-sm font-semibold">
          <span className="sr-only">Error: </span>
          {error}
        </span>
      )}
    </>
  );
  if (legend)
    return (
      <fieldset className={cls} aria-describedby={error ? `${id}-error` : undefined}>
        <legend className={cx('mb-1.5 font-semibold', legendClass)}>{title}</legend>
        {extra}
        {children}
      </fieldset>
    );
  return (
    <div className={cls}>
      <label htmlFor={id} className="font-semibold">
        {title}
      </label>
      {extra}
      {children}
    </div>
  );
}

/** aria-describedby value for a control inside a Field. */
export const describedBy = (id, { hint, error } = {}) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

/** Large radio button with a title and optional hint. */
export function Choice({ name, value, checked, onChange, title, sub }) {
  const id = `${name}-${value}`;
  return (
    <div className="flex items-start gap-3">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="accent-primary mt-0.5 size-7 flex-none cursor-pointer"
      />
      <label htmlFor={id} className="grid cursor-pointer gap-0.5 pt-0.5">
        <span className="font-semibold">{title}</span>
        {sub && <span className="text-ink-2 text-sm">{sub}</span>}
      </label>
    </div>
  );
}

/**
 * "There is a problem" box shown after a failed submit. It takes focus so screen readers announce it, and each
 * message links to its field. Pass autoFocus={false} to move focus to the first field instead. errors: { field: message } · targets: { field: elementId } when they differ.
 */
export function ErrorSummary({ errors, targets = {}, autoFocus = true }) {
  const ref = useRef(null);
  const list = Object.entries(errors || {});
  useEffect(() => {
    if (autoFocus && list.length) ref.current?.focus();
  }, [errors, list.length, autoFocus]);
  if (!list.length) return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="rounded-ab border-bad mb-8 grid gap-2 border-4 p-5">
      <h2 className="text-lg">There is a problem</h2>
      <ul className="m-0 grid list-none gap-1 p-0">
        {list.map(([field, msg]) => {
          const target = targets[field] || field;
          return (
            <li key={field}>
              <a
                href={`#${target}`}
                className="text-bad font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(target)?.focus();
                }}
              >
                {msg}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Radio list used for filters. options: [[value, label, count], …] */
export function RadioList({ name, legend, value, onChange, options }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1 font-semibold">{legend}</legend>
      {options.map(([v, text, count]) => (
        <div key={v} className="flex items-center gap-2.5">
          <input
            type="radio"
            id={`${name}-${v}`}
            name={name}
            checked={value === v}
            onChange={() => onChange(v)}
            className="accent-primary size-5 flex-none cursor-pointer"
          />
          <label htmlFor={`${name}-${v}`} className="cursor-pointer">
            {text}
            {count !== undefined && <span className="text-ink-2"> ({count})</span>}
          </label>
        </div>
      ))}
    </fieldset>
  );
}

/** Shared layout class strings. Prefer these over repeating long utility lists. */
export const cx = (...c) => c.filter(Boolean).join(' ');

export const wrap = 'mx-auto w-full max-w-page px-4 sm:px-6';
export const page = `${wrap} pt-8 pb-20`;
export const readable = 'max-w-[66ch]';
export const panel = 'rounded-ab bg-mist p-6';
export const bullets = 'm-0 grid list-disc gap-2 pl-[1.2em] marker:text-ink-2';
export const sticky = 'lg:sticky lg:top-24';
export const cardGrid = 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-10';
/** Label/value summary list with dividers. */
export const kv =
  'm-0 grid grid-cols-[minmax(110px,auto)_1fr] text-sm [&>dd]:m-0 [&>dd]:border-b [&>dd]:border-line [&>dd]:py-2.5 [&>dd]:tabular-nums [&>dt]:border-b [&>dt]:border-line [&>dt]:py-2.5 [&>dt]:pr-4 [&>dt]:font-semibold';

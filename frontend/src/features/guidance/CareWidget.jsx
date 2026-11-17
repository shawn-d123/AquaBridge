import { Link } from 'react-router';
import { to } from '../../routes';
import { getSpecies } from '../../services/species';
import { Notice } from '../../shared/components/Feedback';
import { cx, panel } from '../../shared/styles';
import { CareList } from './CareList';

/** Care needs panel (F-05) beside the questionnaire, review and guidance pages. */
export function CareWidget({ speciesId }) {
  const s = getSpecies(speciesId);
  if (!s) return <div className={cx(panel, 'text-ink-2 text-sm')}>Choose a species to see its care needs.</div>;
  return (
    <section className={cx(panel, 'grid gap-3')} aria-labelledby="care-title">
      <div className="grid gap-0.5">
        <h2 id="care-title" className="text-lg">
          Care needs: {s.common}
        </h2>
        <p className="text-ink-2 text-sm">
          <i>{s.sci}</i>
        </p>
      </div>
      <CareList species={s} full={false} />
      {s.status === 'restricted' && (
        <Notice tone="bad" title="Restricted species">
          This species cannot be listed on AquaBridge.
        </Notice>
      )}
      {s.status === 'unknown' && (
        <Notice tone="warn" title="Not identified yet">
          We need to know what it is before we can show care needs.
        </Notice>
      )}
      <p className="text-sm">{s.care}</p>
      {s.status !== 'unknown' && (
        <p className="text-sm">
          <Link to={to('speciesDetail', { id: s.id })}>
            Read the full guide <span className="sr-only">to {s.common}</span>
          </Link>
        </p>
      )}
      <p className="text-ink-2 text-xs">Sample data, not checked by a specialist.</p>
    </section>
  );
}

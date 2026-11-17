/**
 * PLACEHOLDER listing card until Shawn's S-02 card is merged. Used by Farhan's homepage ("Recently listed")
 * and species pages ("looking for a home now"). Keep the same props: <ListingCard listing={l} />.
 */
import { Link } from 'react-router';
import { to } from '../../routes';
import { getSpecies, pondOnly, UNKNOWN_SPECIES_ID } from '../../services/species';
import { Chip } from '../../shared/components/Chip';
import { SpeciesArt } from '../../shared/components/SpeciesArt';

const town = (location = '') => location.split(',')[0].trim();

export function ListingCard({ listing: l }) {
  const s = getSpecies(l.speciesId) || getSpecies(UNKNOWN_SPECIES_ID);
  return (
    <article className="group relative flex flex-col gap-3">
      <div className="rounded-ab bg-mist relative aspect-[16/10] overflow-hidden">
        <SpeciesArt speciesId={l.speciesId} pond={pondOnly(s)} />
        {l.urgency === 'week' && (
          <span className="absolute top-3 left-3">
            <Chip tone="warn">Needs a home soon</Chip>
          </span>
        )}
      </div>
      <div className="grid gap-1">
        <h3 className="text-lg leading-snug">
          <Link
            to={to('listing', { id: l.id })}
            className="text-ink hover:text-ink no-underline group-hover:underline after:absolute after:inset-0 after:content-['']"
          >
            {l.title}
          </Link>
        </h3>
        <p className="text-ink-2 text-sm">
          {s.common} · {l.qty} available
        </p>
        <p className="text-ink-2 text-sm">
          {town(l.location)} · Listed {l.created}
        </p>
      </div>
    </article>
  );
}

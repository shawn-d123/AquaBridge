/**
 * PLACEHOLDERS for Midhir's habitat and adopter screens (M-01 to M-09). They exist so the guarded routes and the
 * return-to-action after sign-in can be tested. Replace each one with Midhir's screen.
 */
import { Link, useParams } from 'react-router';
import { useStore } from '../../services/store';
import { getSpecies } from '../../services/species';
import { Placeholder } from '../../shared/Placeholder';
import { CareList } from '../guidance/CareList';

export function HabitatPage() {
  return <Placeholder title="My tanks and ponds" owner="Midhir" tickets="M-01, M-02" />;
}

export function CompatPage() {
  const { id } = useParams();
  const { state } = useStore();
  const l = state.listings.find((x) => x.id === id);
  return (
    <Placeholder title="Compatibility check" owner="Midhir" tickets="M-03, M-04">
      {l ? (
        <>
          <p>
            Checking against <Link to={`/listings/${l.id}`}>{l.title}</Link>. The species care ranges come from Farhan’s
            catalogue:
          </p>
          <div className="max-w-xl">
            <CareList species={getSpecies(l.speciesId)} />
          </div>
        </>
      ) : (
        <p>Listing not found.</p>
      )}
    </Placeholder>
  );
}

export function RequestPage() {
  return <Placeholder title="Request to adopt" owner="Midhir" tickets="M-06" />;
}

export function MyRequestsPage() {
  return <Placeholder title="My adoption requests" owner="Midhir" tickets="M-07, M-09" />;
}

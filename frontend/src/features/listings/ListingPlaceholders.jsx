/**
 * PLACEHOLDERS for Shawn's listing screens (S-01 to S-07). They exist so Farhan's routes, homepage search,
 * route guards and the F-06 pre-fill handoff can be clicked through and tested. Replace each one with Shawn's screen.
 */
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { CONDITION, URGENCY } from '../../services/contracts';
import { getSpecies } from '../../services/species';
import { useStore } from '../../services/store';
import { listForOwner } from '../../services/requestService';
import { freshIntake } from '../../services/seed';
import { Button } from '../../shared/components/Button';
import { Chip } from '../../shared/components/Chip';
import { Notice } from '../../shared/components/Feedback';
import { Placeholder } from '../../shared/Placeholder';
import { cardGrid, kv } from '../../shared/styles';
import { useAuth } from '../auth/auth';
import { CareList } from '../guidance/CareList';
import { getHandoff } from '../guidance/intake';
import { ListingCard } from './ListingCard';

export function BrowsePage() {
  const { state } = useStore();
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();
  const results = state.listings.filter(
    (l) =>
      l.status === 'active' &&
      (!q || `${l.title} ${getSpecies(l.speciesId)?.common} ${l.location}`.toLowerCase().includes(q)),
  );
  return (
    <Placeholder title="Browse listings" owner="Shawn" tickets="S-02, S-09">
      {q && (
        <p>
          Showing results for <strong>“{params.get('q')}”</strong>. <Link to="/browse">Clear search</Link>
        </p>
      )}
      <p className="font-semibold">{results.length} listings</p>
      <div className={cardGrid}>
        {results.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </Placeholder>
  );
}

export function ListingPage() {
  const { id } = useParams();
  const { state } = useStore();
  const l = state.listings.find((x) => x.id === id);
  if (!l) return <Placeholder title="Listing not found" owner="Shawn" tickets="S-03" />;
  const s = getSpecies(l.speciesId);
  return (
    <Placeholder title={l.title} owner="Shawn" tickets="S-03 · care data from Farhan’s F-05">
      <p className="max-w-[66ch]">{l.description}</p>
      <section className="grid max-w-xl gap-3">
        <h2 className="text-xl">Care needs</h2>
        <CareList species={s} />
        {s && (
          <p className="text-sm">
            <Link to={`/species/${s.id}`}>Read the full {s.common} guide</Link>
          </p>
        )}
      </section>
      {l.status === 'active' && (
        <div>
          <Button to={`/check/${l.id}`}>Check compatibility</Button>
        </div>
      )}
    </Placeholder>
  );
}

/** Shows that Farhan's F-06 handoff arrives pre-filled. Shawn's real editor (S-01) replaces this. */
export function EditorPage() {
  const { state, update, toast } = useStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const prefill = getHandoff(state.intake);

  if (!prefill)
    return (
      <Placeholder title="Create your listing" owner="Shawn" tickets="S-01">
        <Notice
          tone={state.intake.outcome ? 'bad' : 'pri'}
          title={state.intake.outcome ? 'This can’t be listed yet' : 'Start with the rehoming questions'}
        >
          {state.intake.outcome
            ? 'Only answers with “Can be listed” guidance can create a listing.'
            : 'Listings are created from your rehoming answers, so nothing has to be typed twice.'}
        </Notice>
        <div>
          <Button to={state.intake.outcome ? '/rehome/guidance' : '/rehome'}>
            {state.intake.outcome ? 'See your guidance' : 'Start rehoming'}
          </Button>
        </div>
      </Placeholder>
    );

  const s = getSpecies(prefill.speciesId);
  const publish = () => {
    const id = update((d) => {
      const newId = `L-${d.seq.listing++}`;
      d.listings.unshift({
        id: newId,
        owner: currentUser.id,
        speciesId: prefill.speciesId,
        title: prefill.suggestedTitle,
        qty: prefill.quantity,
        location: prefill.location,
        condition: prefill.condition,
        urgency: prefill.urgency,
        status: 'active',
        created: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        description: prefill.details || prefill.suggestedTitle,
        careNotes: prefill.health,
        intakeId: prefill.intakeId,
      });
      d.intake = freshIntake(); // F-06: the draft is cleared once a listing is published
      return newId;
    });
    toast('Your listing is live');
    navigate(`/listings/${id}`);
  };

  return (
    <Placeholder title="Create your listing" owner="Shawn" tickets="S-01 · pre-fill from Farhan’s F-06">
      <Notice tone="ok" title="Filled in from your rehoming answers">
        Reference {prefill.intakeId}. Nothing needs typing twice.
      </Notice>
      <dl className={`${kv} max-w-xl`}>
        <dt>Title</dt>
        <dd>{prefill.suggestedTitle}</dd>
        <dt>Species</dt>
        <dd>{s.common}</dd>
        <dt>How many</dt>
        <dd>{prefill.quantity}</dd>
        <dt>Condition</dt>
        <dd>{CONDITION[prefill.condition]}</dd>
        <dt>Location</dt>
        <dd>{prefill.location}</dd>
        <dt>How soon</dt>
        <dd>{URGENCY[prefill.urgency]}</dd>
        <dt>Details</dt>
        <dd>{prefill.details || 'Not given'}</dd>
      </dl>
      <div>
        <Button onClick={publish}>Publish listing</Button>
      </div>
    </Placeholder>
  );
}

export function MyListingsPage() {
  const { state } = useStore();
  const { currentUser } = useAuth();
  const mine = state.listings.filter((l) => l.owner === currentUser.id);
  return (
    <Placeholder title="My listings" owner="Shawn" tickets="S-04, S-05">
      {mine.length ? (
        <ul className="m-0 grid max-w-2xl list-none gap-3 p-0">
          {mine.map((l) => (
            <li key={l.id} className="border-line flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <Link to={`/listings/${l.id}`}>{l.title}</Link>
              <Chip status={l.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p>
          You have no listings yet. <Link to="/rehome">Start rehoming</Link>
        </p>
      )}
    </Placeholder>
  );
}

export function IncomingPage() {
  const { state } = useStore();
  const { currentUser } = useAuth();
  const requests = listForOwner(state, currentUser.id);
  return (
    <Placeholder title="Requests for my listings" owner="Shawn" tickets="S-06, S-07, S-10">
      <p>
        {requests.filter((r) => r.status === 'pending').length} waiting for your decision, {requests.length} in total.
      </p>
    </Placeholder>
  );
}

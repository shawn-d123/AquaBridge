/**
 * Guidance outcome (F-04) and handoff to the listing editor (F-06) · Farhan.
 * Example rules only: never a legal or veterinary decision.
 */
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../auth/auth';
import { freshIntake } from '../../services/seed';
import { countLabel, getSpecies } from '../../services/species';
import { useStore } from '../../services/store';
import { Button } from '../../shared/components/Button';
import { Chip } from '../../shared/components/Chip';
import { Notice } from '../../shared/components/Feedback';
import { bullets, cx, sticky } from '../../shared/styles';
import { CareWidget } from './CareWidget';
import { firstIncompleteStep, nextSteps } from './intake';
import { QuestionLayout } from './QuestionLayout';

const EDGE = { ok: 'border-ok', warn: 'border-warn', bad: 'border-bad' };

/** Result box with a thick coloured left edge. */
export function Outcome({ tone, children }) {
  return (
    <section className={cx('rounded-r-ab bg-mist grid gap-3 border-l-8 px-6 py-5', EDGE[tone])}>{children}</section>
  );
}

const HEADLINE = {
  eligible: ['ok', 'You can create a listing', 'Your answers fit our guidance for a public listing.'],
  needs_review: [
    'warn',
    'We need more information first',
    'A public listing isn’t available yet. Here’s what to do next.',
  ],
  restricted: ['bad', 'This can’t be listed publicly', 'Ordinary rehoming listings are not offered for this species.'],
};

export function GuidancePage() {
  const { state, update } = useStore();
  const { signedIn } = useAuth();
  const navigate = useNavigate();
  const { answers: a, outcome: g } = state.intake;

  if (firstIncompleteStep(a)) return <Navigate to="/rehome" replace />;
  if (!g) return <Navigate to="/rehome/review" replace />;

  const s = getSpecies(a.speciesId);
  const [tone, title, summary] = HEADLINE[g.outcome];
  const eligible = g.outcome === 'eligible';

  const changeAnswers = () => {
    update((d) => {
      d.intake.step = 1;
    });
    navigate('/rehome/review');
  };
  const startAgain = () => {
    update((d) => {
      d.intake = freshIntake();
    });
    navigate('/rehome');
  };

  return (
    <QuestionLayout
      aside={
        <aside className={cx(sticky, 'max-lg:hidden')}>
          <CareWidget speciesId={a.speciesId} />
        </aside>
      }
    >
      <div className="grid max-w-2xl gap-10">
        <div className="grid gap-2">
          <p className="text-md text-ink-2">
            Your rehoming guidance{s && s.status !== 'unknown' ? ` for ${countLabel(s, a.quantity)}` : ''}
          </p>
          <Outcome tone={tone}>
            <div>
              <Chip status={g.outcome} />
            </div>
            <h1>{title}</h1>
            <p className="text-md">{summary}</p>
          </Outcome>
        </div>

        <section className="grid gap-3" aria-labelledby="why">
          <h2 id="why" className="text-lg">
            Why you’re seeing this
          </h2>
          <ul className={bullets}>
            {g.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section className="grid gap-3" aria-labelledby="next">
          <h2 id="next" className="text-lg">
            {eligible ? 'Also worth doing' : 'What you can do next'}
          </h2>
          <ul className={bullets}>
            {nextSteps(g.outcome, a).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-4">
            {eligible && <Button onClick={() => navigate('/listings/new')}>Create my listing</Button>}
            <Button variant={eligible ? 'secondary' : 'primary'} onClick={changeAnswers}>
              Change my answers
            </Button>
            <Button variant="quiet" onClick={startAgain}>
              Start again
            </Button>
          </div>
          {eligible && !signedIn && (
            <p className="text-ink-2 text-sm">
              You’ll be asked to sign in. Your answers are kept and used to fill in the listing.
            </p>
          )}
        </div>

        <Notice title="Illustrative only">
          Sprint 1 uses example rules. This guidance is not a legal or veterinary decision. Reference {g.intakeId}.
        </Notice>
      </div>
    </QuestionLayout>
  );
}

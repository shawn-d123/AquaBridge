/** Check your answers (F-03 · Farhan): one row per answer with a Change link back to that question. */
import { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { CONDITION, GROWN_IN, REASON, URGENCY } from '../../services/contracts';
import { getSpecies } from '../../services/species';
import { useStore } from '../../services/store';
import { Button } from '../../shared/components/Button';
import { BackLink } from '../../shared/components/Feedback';
import { cx, sticky } from '../../shared/styles';
import { CareWidget } from './CareWidget';
import { evaluateIntake, firstIncompleteStep, STEP_COUNT } from './intake';
import { QuestionLayout } from './QuestionLayout';

const ROW =
  'grid grid-cols-[minmax(0,34%)_1fr_auto] gap-x-4 gap-y-1 border-b border-line py-3 max-sm:grid-cols-[1fr_auto]';

/** The rows shown on the review page: [label, answer, step that asks it]. Exported for tests. */
export function reviewRows(a) {
  return [
    ['Type', a.kind === 'plant' ? 'Plant' : 'Animal', 1],
    ['Species', getSpecies(a.speciesId)?.common, 2],
    ['How many', a.quantity, 2],
    a.kind === 'plant' && ['Growing in', GROWN_IN[a.grownIn || 'aquarium'], 2],
    ['Condition', CONDITION[a.condition], 3],
    a.condition !== 'healthy' && ['Problem or treatment', a.health, 3],
    ['Reason for rehoming', REASON[a.reason], 3],
    ['Location', a.location, 4],
    ['How soon', URGENCY[a.urgency], 4],
    ['Other details', a.details?.trim(), 4],
  ].filter(Boolean);
}

export function ReviewPage() {
  const { state, update } = useStore();
  const navigate = useNavigate();
  const a = state.intake.answers;
  const incomplete = firstIncompleteStep(a);

  // Someone who arrives here with unanswered questions is taken to the first one.
  useEffect(() => {
    if (incomplete)
      update((s) => {
        s.intake.step = incomplete;
      });
  }, [incomplete, update]);
  if (incomplete) return <Navigate to="/rehome" replace />;

  const change = (step) => (e) => {
    e.preventDefault();
    update((s) => {
      s.intake.step = step;
      s.intake.fromReview = true;
    });
    navigate('/rehome');
  };

  const getGuidance = () => {
    update((s) => {
      s.intake.id = s.intake.id || `IC-${s.seq.intake++}`;
      s.intake.outcome = { intakeId: s.intake.id, ...evaluateIntake(s.intake.answers) };
    });
    navigate('/rehome/guidance');
  };

  return (
    <QuestionLayout
      back={
        <BackLink to="/rehome" onClick={change(STEP_COUNT)}>
          Back
        </BackLink>
      }
      aside={
        <aside className={cx(sticky, 'max-lg:hidden')}>
          <CareWidget speciesId={a.speciesId} />
        </aside>
      }
    >
      <div className="max-w-2xl">
        <h1 className="mb-3">Check your answers</h1>
        <p className="text-md text-ink-2 mb-8">
          Your guidance is based only on what you tell us. Change anything that isn’t right.
        </p>
        <dl className="border-line m-0 border-t">
          {reviewRows(a).map(([label, value, step]) => (
            <div key={label} className={ROW}>
              <dt className="font-semibold max-sm:col-span-2">{label}</dt>
              <dd className={cx('m-0 break-words', !value && 'text-ink-2')}>{value || 'Not given'}</dd>
              <dd className="m-0 text-right">
                <Link to="/rehome" onClick={change(step)}>
                  Change <span className="sr-only">{label.toLowerCase()}</span>
                </Link>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8">
          <Button onClick={getGuidance}>Get my guidance</Button>
        </div>
      </div>
    </QuestionLayout>
  );
}

/**
 * Guided rehoming questionnaire (F-01 shell · F-02 questions · Farhan).
 * Four steps, one question per page, usable without an account. Answers are a draft saved in this browser,
 * so Back, Continue and a page reload never lose them.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CONDITION, GROWN_IN, REASON, URGENCY } from '../../services/contracts';
import { freshIntake } from '../../services/seed';
import { listSpecies } from '../../services/species';
import { useStore } from '../../services/store';
import { Button } from '../../shared/components/Button';
import { BackLink, Notice, Warning } from '../../shared/components/Feedback';
import { Choice, describedBy, ErrorSummary, Field } from '../../shared/components/Form';
import { cx, sticky } from '../../shared/styles';
import { CareWidget } from './CareWidget';
import { firstIncompleteStep, QUESTIONS, STEP_COUNT, STEPS, validateStep } from './intake';
import { QuestionLayout } from './QuestionLayout';

/** Element each error links to from the error summary (radio groups link to their first option). */
const TARGET = { kind: 'kind-animal', condition: 'condition-healthy', urgency: 'urgency-week' };

export function RehomePage() {
  const { state, update } = useStore();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { step, answers: a, fromReview } = state.intake;
  const hasDraft = step === 1 && Object.keys(a).length > 0 && !fromReview;

  const set = (key, value) =>
    update((s) => {
      const ans = s.intake.answers;
      ans[key] = value;
      if (key === 'kind') {
        delete ans.speciesId; // species lists differ for animals and plants
        if (value === 'animal') delete ans.grownIn;
      }
      if (key === 'condition' && value === 'healthy') delete ans.health;
      s.intake.outcome = null; // answers changed, so any earlier guidance is out of date
    });
  const onInput = (key) => (e) => set(key, e.target.value);

  const goTo = (n) => {
    setErrors({});
    update((s) => {
      s.intake.step = n;
    });
    window.scrollTo(0, 0);
  };

  const onContinue = (e) => {
    e.preventDefault();
    const errs = validateStep(step, a);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // From a "Change" link: go straight back to Check your answers, unless the change means a later
    // question now needs answering (for example switching animal → plant clears the species).
    const incomplete = firstIncompleteStep(a);
    if (step === STEP_COUNT || (fromReview && !incomplete)) {
      update((s) => {
        s.intake.fromReview = false;
      });
      navigate('/rehome/review');
    } else goTo(fromReview && incomplete ? incomplete : step + 1);
  };

  const startAgain = () => {
    setErrors({});
    update((s) => {
      s.intake = freshIntake();
    });
  };

  const err = (k) => errors[k];
  const heading = <h1 className="text-2xl">{QUESTIONS[step]}</h1>;
  let body;

  if (step === 1)
    body = (
      <Field id="kind" legend={heading} legendClass="mb-2" error={err('kind')}>
        <p className="text-ink-2">We support a small list of aquarium and pond species to start with.</p>
        <div className="mt-2 grid gap-3">
          <Choice
            name="kind"
            value="animal"
            checked={a.kind === 'animal'}
            onChange={(v) => set('kind', v)}
            title="An animal"
            sub="Fish, shrimp, snails or turtles"
          />
          <Choice
            name="kind"
            value="plant"
            checked={a.kind === 'plant'}
            onChange={(v) => set('kind', v)}
            title="A plant"
            sub="Aquarium or pond plants"
          />
        </div>
      </Field>
    );

  if (step === 2)
    body = (
      <div className="grid gap-8">
        {heading}
        <Field
          id="speciesId"
          label="Species"
          hint="If you’re not sure, choose “I’m not sure what it is”."
          error={err('speciesId')}
        >
          <select
            id="speciesId"
            value={a.speciesId || ''}
            onChange={onInput('speciesId')}
            className="max-w-md"
            aria-describedby={describedBy('speciesId', { hint: 1, error: err('speciesId') })}
          >
            <option value="">Choose a species</option>
            {listSpecies(a.kind).map((s) => (
              <option key={s.id} value={s.id}>
                {s.common}
                {s.status === 'unknown' ? '' : ` (${s.sci})`}
              </option>
            ))}
          </select>
        </Field>
        <Field id="quantity" label="How many are you rehoming?" hint="Between 1 and 500." error={err('quantity')}>
          <input
            type="number"
            id="quantity"
            min="1"
            max="500"
            step="1"
            inputMode="numeric"
            value={a.quantity ?? ''}
            onChange={onInput('quantity')}
            className="max-w-32"
            aria-describedby={describedBy('quantity', { hint: 1, error: err('quantity') })}
          />
        </Field>
        {a.kind === 'plant' && (
          <Field id="grownIn" legend="Where is it growing at the moment?">
            <div className="grid gap-3">
              {Object.entries(GROWN_IN).map(([k, v]) => (
                <Choice
                  key={k}
                  name="grownIn"
                  value={k}
                  checked={(a.grownIn || 'aquarium') === k}
                  onChange={(x) => set('grownIn', x)}
                  title={v}
                />
              ))}
            </div>
          </Field>
        )}
      </div>
    );

  if (step === 3)
    body = (
      <div className="grid gap-8">
        <Field id="condition" legend={heading} legendClass="mb-2" error={err('condition')}>
          <div className="grid gap-3">
            {Object.entries(CONDITION).map(([k, v]) => (
              <Choice
                key={k}
                name="condition"
                value={k}
                checked={a.condition === k}
                onChange={(x) => set('condition', x)}
                title={v}
              />
            ))}
          </div>
        </Field>
        {a.condition && a.condition !== 'healthy' && (
          <Field
            id="health"
            label="Describe the problem or treatment"
            hint="This helps us suggest the right next step."
            error={err('health')}
          >
            <textarea
              id="health"
              value={a.health ?? ''}
              onChange={onInput('health')}
              className="max-w-xl"
              aria-describedby={describedBy('health', { hint: 1, error: err('health') })}
              placeholder={
                a.kind === 'plant'
                  ? 'For example, some yellowing leaves and snails present'
                  : 'For example, white spot, treated with salt for a week'
              }
            />
          </Field>
        )}
        <Field id="reason" label="Why are you rehoming?" error={err('reason')}>
          <select
            id="reason"
            value={a.reason || ''}
            onChange={onInput('reason')}
            className="max-w-md"
            aria-describedby={describedBy('reason', { error: err('reason') })}
          >
            <option value="">Choose a reason</option>
            {Object.entries(REASON).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
      </div>
    );

  if (step === 4)
    body = (
      <div className="grid gap-8">
        {heading}
        <Field
          id="location"
          label="Town and postcode district"
          hint="For example, Uxbridge, UB8. Only the town and the first half of the postcode are ever shown."
          error={err('location')}
        >
          <input
            type="text"
            id="location"
            value={a.location ?? ''}
            onChange={onInput('location')}
            autoComplete="off"
            className="max-w-md"
            aria-describedby={describedBy('location', { hint: 1, error: err('location') })}
          />
        </Field>
        <Field id="urgency" legend="How soon does it need a new home?" error={err('urgency')}>
          <div className="grid gap-3">
            {Object.entries(URGENCY).map(([k, v]) => (
              <Choice
                key={k}
                name="urgency"
                value={k}
                checked={a.urgency === k}
                onChange={(x) => set('urgency', x)}
                title={v}
              />
            ))}
          </div>
        </Field>
        <Field
          id="details"
          label="Anything else an adopter should know?"
          optional
          hint="For example, tank mates, feeding, or equipment you could include."
        >
          <textarea
            id="details"
            value={a.details ?? ''}
            onChange={onInput('details')}
            className="max-w-xl"
            aria-describedby="details-hint"
          />
        </Field>
      </div>
    );

  return (
    <QuestionLayout
      back={
        step > 1 ? (
          <BackLink to="/rehome" onClick={(e) => (e.preventDefault(), goTo(step - 1))}>
            Back
          </BackLink>
        ) : (
          <BackLink to="/">Back to home</BackLink>
        )
      }
      aside={
        <aside className={cx('grid gap-6', sticky)}>
          {step > 1 && a.speciesId && <CareWidget speciesId={a.speciesId} />}
          <Warning>
            Never release aquatic animals or plants into ponds, rivers or drains. It harms wildlife and can be an
            offence.
          </Warning>
        </aside>
      }
    >
      <form noValidate onSubmit={onContinue} className="max-w-2xl">
        <ErrorSummary errors={errors} targets={TARGET} />
        {hasDraft && (
          <Notice tone="pri" title="We’ve kept your answers from last time" className="mb-8">
            Carry on where you left off, or{' '}
            <button type="button" onClick={startAgain} className="text-primary underline underline-offset-3">
              start again
            </button>
            .
          </Notice>
        )}
        <p className="text-md text-ink-2 mb-2">
          Step {step} of {STEP_COUNT}
          <span className="sr-only">{`: ${STEPS[step - 1]}`}</span>
        </p>
        <div aria-hidden="true" className="bg-surface-2 mb-6 h-1.5 max-w-xs overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-[width]"
            style={{ width: `${(step / STEP_COUNT) * 100}%` }}
          />
        </div>
        {body}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button type="submit">{step < STEP_COUNT && !fromReview ? 'Continue' : 'Check your answers'}</Button>
          {fromReview && step < STEP_COUNT && (
            <span className="text-ink-2 text-sm">You’ll go back to your answers.</span>
          )}
        </div>
      </form>
    </QuestionLayout>
  );
}

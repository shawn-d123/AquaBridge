import { page } from '../../shared/styles';

/** Two-column layout for the questionnaire, review and guidance pages: main content plus a side panel on wide screens. */
export function QuestionLayout({ back, aside, children }) {
  return (
    <div className={page}>
      {back && <p className="mb-8">{back}</p>}
      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-12 max-lg:grid-cols-1 max-lg:gap-8">
        <div>{children}</div>
        {aside}
      </div>
    </div>
  );
}

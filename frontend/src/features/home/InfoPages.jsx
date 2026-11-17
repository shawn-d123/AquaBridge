/** Content pages (SH-04 · Farhan): How it works, Accessibility, Privacy, Contact, and the not-found page. */
import { Link } from 'react-router';
import { Warning } from '../../shared/components/Feedback';
import { cx, page, readable } from '../../shared/styles';

const prose = cx(readable, 'grid gap-4 [&_h2]:mt-6 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6');

function Article({ title, lede, aside, children }) {
  return (
    <div className={page}>
      <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-16 max-lg:grid-cols-1 max-lg:gap-8">
        <article className={prose}>
          <h1>{title}</h1>
          {lede && <p className="text-ink-2 text-lg">{lede}</p>}
          {children}
        </article>
        {aside && <aside className="lg:pt-2">{aside}</aside>}
      </div>
    </div>
  );
}

/** Numbered list of steps. items: [[title, text], …] */
export function Steps({ items }) {
  return (
    <ol className="m-0 grid list-none p-0 [counter-reset:step]">
      {items.map(([title, text]) => (
        <li
          key={title}
          className="border-line before:text-primary grid grid-cols-[2.25rem_1fr] gap-3 border-t py-3 [counter-increment:step] before:font-bold before:content-[counter(step)]"
        >
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-ink-2 text-sm">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const SECTION = 'grid gap-4 scroll-mt-24 focus:outline-none';

export function HowItWorksPage() {
  return (
    <Article
      title="How AquaBridge works"
      lede="AquaBridge helps people who can no longer keep aquarium or pond animals and plants find them a suitable new home, and helps adopters check they can care for them first. It is free, and nothing is bought or sold."
      aside={
        <nav aria-label="Contents" className="grid gap-2 lg:sticky lg:top-24">
          <h2 className="text-md">Contents</h2>
          <ul className="border-line m-0 grid list-none gap-2 border-l-2 p-0 pl-4 text-sm">
            <li>
              <a href="#rehoming">Rehoming yours</a>
            </li>
            <li>
              <a href="#adopting">Adopting</a>
            </li>
            <li>
              <a href="#never-release">Never release them</a>
            </li>
            <li>
              <a href="#why">Why it matters</a>
            </li>
          </ul>
        </nav>
      }
    >
      <section id="rehoming" tabIndex={-1} className={SECTION}>
        <h2>Rehoming yours</h2>
        <p>You do not need an account to start. You only sign in when you are ready to publish a listing.</p>
        <Steps
          items={[
            ['Answer a few questions', 'What it is, how many, its health, where you are and how soon it needs to go.'],
            [
              'Read your guidance',
              'We tell you whether it can be listed. If not, we explain why and what to do instead.',
            ],
            ['Publish your listing', 'Your answers fill in most of the listing. You add a title and a description.'],
            ['Choose an adopter', 'Each request includes an introduction and a summary of the adopter’s tank or pond.'],
            ['Confirm the handover', 'The listing closes once you and the adopter have both confirmed it happened.'],
          ]}
        />
        <p>
          <Link to="/rehome" className="font-semibold">
            Start rehoming
          </Link>
        </p>
      </section>

      <section id="adopting" tabIndex={-1} className={SECTION}>
        <h2>Adopting</h2>
        <Steps
          items={[
            ['Browse listings', 'No account needed. Filter by animals or plants, and by aquarium or pond.'],
            ['Read the care needs', 'Each listing shows the temperature, pH and smallest tank size the species needs.'],
            ['Save your tank or pond', 'Enter its details once and reuse them for every listing.'],
            [
              'Check compatibility',
              'We compare your setup with the care needs and explain anything that does not match.',
            ],
            [
              'Send a request',
              'If it is a potential match, introduce yourself to the owner and follow the request from your account.',
            ],
          ]}
        />
        <p>A compatibility result is a guide, not a guarantee. Always talk to the owner before you collect.</p>
        <p>
          <Link to="/browse" className="font-semibold">
            Browse listings
          </Link>
        </p>
      </section>

      <section id="never-release" tabIndex={-1} className={SECTION}>
        <h2>Never release them</h2>
        <Warning>Do not release aquarium or pond animals or plants into rivers, lakes, ponds or drains.</Warning>
        <p>
          Released fish and plants can carry disease and spread quickly through waterways. Some, such as red-eared
          sliders and parrot’s feather, are listed as invasive in England and Wales, and releasing them is an offence.
        </p>
        <p>If you cannot keep something and it cannot be listed:</p>
        <ul>
          <li>keep caring for it where it is for now</li>
          <li>ask a local aquatic shop or fishkeeping club whether they take in rehomes</li>
          <li>contact a specialist rescue or your local authority for advice</li>
          <li>read the GOV.UK guidance on invasive non-native species</li>
        </ul>
      </section>

      <section id="why" tabIndex={-1} className={SECTION}>
        <h2>Why it matters</h2>
        <p>
          AquaBridge supports UN Sustainable Development Goal 14, Life below water. Every animal or plant that goes to a
          suitable home instead of being released is one less risk to native rivers and ponds.
        </p>
      </section>
    </Article>
  );
}

export function AccessibilityPage() {
  return (
    <Article title="Accessibility" lede="We want everyone to be able to use AquaBridge.">
      <p>This site aims to meet WCAG 2.2 AA. You should be able to:</p>
      <ul>
        <li>use every page with a keyboard, with a visible focus outline</li>
        <li>skip straight to the main content with the first link on every page</li>
        <li>zoom to 400% without content being cut off, and use it on a phone in a single column</li>
        <li>use it with a screen reader: errors, statuses and confirmations are announced</li>
      </ul>
      <p>
        Text uses Atkinson Hyperlegible Next, a typeface designed by the Braille Institute to be easier to read for
        people with low vision.
      </p>
      <h2>Known issues</h2>
      <p>Species pictures are illustrations. Real listings will need photos with text descriptions.</p>
      <p>
        If you find a problem, <Link to="/contact">tell us</Link>.
      </p>
    </Article>
  );
}

export function PrivacyPage() {
  return (
    <Article title="Privacy" lede="During Sprint 1 AquaBridge uses sample data stored in your browser only.">
      <p>
        Nothing you enter is sent to a server. Your rehoming answers, listings and requests are saved in this browser’s
        storage so the demo keeps working when you reload. Your answers are never put in a web address.
      </p>
      <p>You can clear everything with “Reset sample data” in the footer.</p>
      <h2>In the real service</h2>
      <p>
        Adopters will only ever see a listing’s town and postcode district. Owners will see a summary of an adopter’s
        tank or pond, never their address.
      </p>
    </Article>
  );
}

export function ContactPage() {
  return (
    <Article title="Contact" lede="AquaBridge is a student project for CS2701 at Brunel University London (Group B14).">
      <p>For questions about the project, contact the AquaBridge team. The product owner is Shawn D’Souza.</p>
      <p>For problems with an animal’s health, contact a vet with fish experience.</p>
    </Article>
  );
}

export function NotFoundPage() {
  return (
    <div className={page}>
      <h1 className="mb-4">Page not found</h1>
      <div className="grid max-w-[60ch] gap-4">
        <p>If you typed the web address, check it is correct. If you pasted it, check you copied the whole address.</p>
        <p>
          You can <Link to="/browse">browse listings</Link>, <Link to="/rehome">start rehoming</Link> or go to the{' '}
          <Link to="/">homepage</Link>.
        </p>
      </div>
    </div>
  );
}

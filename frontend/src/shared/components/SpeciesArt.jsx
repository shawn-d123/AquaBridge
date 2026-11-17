import { cx } from '../styles';

/*
  Species illustrations, drawn in the same flat style as the homepage aquarium.
  Used on listing cards and pages in place of photos until owners can upload their own.
*/

const INK = '#12324A';

function Goldfish() {
  return (
    <g transform="translate(168 98)">
      <path d="M-34 0 C-60 -34 -86 -24 -80 0 C-86 24 -60 34 -34 0Z" fill="#F8AE66" />
      <ellipse rx="46" ry="32" fill="#F5934A" />
      <path d="M-16 -29 C-6 -52 18 -50 20 -27Z" fill="#F8AE66" />
      <ellipse cx="-4" cy="18" rx="14" ry="7" fill="#F8BC80" transform="rotate(22 -4 18)" />
      <circle cx="23" cy="-7" r="10" fill="#FFFFFF" />
      <circle cx="26" cy="-7" r="5.2" fill={INK} />
      <circle cx="27.6" cy="-9.2" r="1.6" fill="#FFFFFF" />
      <path d="M36 8 Q40 12 36 16" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Tetra({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22 0 L-38 -11 L-38 11Z" fill="#A8CFEA" />
      <ellipse rx="27" ry="11" fill="#D7EAF6" />
      <path d="M-16 -2 H18" stroke="#2F80CF" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M-16 5.5 H5" stroke="#E2574C" strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="16" cy="-3" r="3.2" fill={INK} />
    </g>
  );
}

function Minnow({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22 0 L-38 -12 L-34 0 L-38 12Z" fill="#E8584B" />
      <ellipse rx="28" ry="10" fill="#C9D6CF" />
      <path d="M-18 1 H18" stroke="#E7C267" strokeWidth="3" strokeLinecap="round" />
      <path d="M-4 -9 L4 -16 L8 -8Z" fill="#E8584B" />
      <circle cx="17" cy="-2" r="3" fill={INK} />
    </g>
  );
}

function Shrimp({ x, y, s = 1, flip }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C-5 -17 12 -29 29 -22 C39 -17 36 -5 27 -2 C17 0 7 5 0 0Z" fill="#E8584B" />
      <path
        d="M29 -22 C41 -36 51 -38 61 -41 M29 -19 C43 -29 53 -29 63 -31"
        stroke="#E8584B"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="25" cy="-17" r="2.2" fill={INK} />
      <path d="M6 0 L0 7 M13 0 L10 7 M20 -1 L19 6" stroke="#E8584B" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function Fern() {
  const leaf = (cx, cy, r, rot) => (
    <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="9" ry={r} transform={`rotate(${rot} ${cx} ${cy})`} />
  );
  return (
    <g>
      <path d="M70 168 C110 146 190 142 250 160 L262 150 L262 166 C276 170 272 182 258 184 L76 186Z" fill="#BE8F62" />
      <path d="M100 168 C140 156 190 154 232 162" stroke="#A47548" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g fill="#3E9B6A">
        {[
          leaf(118, 120, 34, -28),
          leaf(138, 104, 44, -8),
          leaf(160, 112, 40, 14),
          leaf(184, 98, 48, 6),
          leaf(206, 116, 38, 26),
          leaf(226, 128, 30, 38),
        ]}
      </g>
      <g stroke="#2B7A50" strokeWidth="2" fill="none">
        <path d="M118 150 L118 122 M138 154 L140 104 M160 154 L162 112 M184 152 L186 98 M206 152 L206 116 M226 156 L224 128" />
      </g>
    </g>
  );
}

function Hornwort() {
  const stem = (x, h, sway) => (
    <g key={x}>
      <path
        d={`M${x} 190 C${x + sway} ${190 - h / 2} ${x - sway} ${190 - h * 0.8} ${x + sway / 2} ${190 - h}`}
        stroke="#2E8A5C"
        strokeWidth="3"
        fill="none"
      />
      {Array.from({ length: Math.floor(h / 16) }, (_, i) => {
        const y = 182 - i * 16;
        const cx = x + (i % 2 ? sway / 3 : -sway / 3);
        return (
          <g key={i} stroke="#46B37F" strokeWidth="2.4" strokeLinecap="round">
            <path d={`M${cx} ${y} l-14 -8 M${cx} ${y} l14 -8 M${cx} ${y} l-10 -14 M${cx} ${y} l10 -14`} />
          </g>
        );
      })}
    </g>
  );
  return <g>{[stem(110, 150, 10), stem(160, 168, -12), stem(210, 140, 8)]}</g>;
}

function Lily() {
  return (
    <g>
      <ellipse cx="110" cy="122" rx="56" ry="18" fill="#4FA36E" />
      <path d="M110 122 L166 118" stroke="#3A8A58" strokeWidth="2" />
      <ellipse cx="226" cy="138" rx="44" ry="14" fill="#5DB27B" />
      <path d="M226 138 L270 136" stroke="#3A8A58" strokeWidth="2" />
      <g transform="translate(176 112)">
        <ellipse cx="0" cy="6" rx="34" ry="9" fill="#3A8A58" />
        {[-48, -24, 0, 24, 48].map((r) => (
          <ellipse key={r} cx="0" cy="-12" rx="9" ry="22" fill="#F2A7C3" transform={`rotate(${r} 0 4)`} />
        ))}
        {[-30, 0, 30].map((r) => (
          <ellipse key={r} cx="0" cy="-10" rx="7" ry="16" fill="#F7C9DA" transform={`rotate(${r} 0 4)`} />
        ))}
        <circle cx="0" cy="-2" r="6" fill="#F3C845" />
      </g>
    </g>
  );
}

function Turtle() {
  return (
    <g transform="translate(160 108)">
      <ellipse cx="-44" cy="16" rx="12" ry="7" fill="#6E9F53" />
      <ellipse cx="38" cy="18" rx="12" ry="7" fill="#6E9F53" />
      <path d="M-50 4 C-44 -40 44 -40 50 4Z" fill="#4E7F3A" />
      <path d="M-30 -10 L0 -26 L30 -10 L0 2Z" fill="#5E9147" stroke="#3E6A2E" strokeWidth="2" />
      <ellipse cx="62" cy="-4" rx="16" ry="11" fill="#6E9F53" />
      <path d="M58 -2 L74 -6" stroke="#D9473B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="66" cy="-8" r="2.4" fill={INK} />
    </g>
  );
}

function Unknown() {
  return (
    <g transform="translate(160 100)" fill="none" stroke="#7F96A3" strokeWidth="5" strokeLinecap="round">
      <path d="M-14 -16 C-14 -34 14 -34 14 -16 C14 -4 0 -2 0 10" />
      <circle cx="0" cy="26" r="1.5" fill="#7F96A3" />
    </g>
  );
}

const SUBJECT = {
  'SP-001': () => <Goldfish />,
  'SP-002': () => (
    <>
      <Tetra x={120} y={84} />
      <Tetra x={196} y={104} s={0.9} />
      <Tetra x={146} y={132} s={0.8} />
    </>
  ),
  'SP-003': () => (
    <>
      <Shrimp x={118} y={150} s={1.25} />
      <Shrimp x={206} y={164} s={1} flip />
    </>
  ),
  'SP-004': () => (
    <>
      <Minnow x={130} y={88} />
      <Minnow x={206} y={118} s={0.9} />
      <Minnow x={150} y={140} s={0.8} />
    </>
  ),
  'SP-005': () => <Fern />,
  'SP-006': () => <Hornwort />,
  'SP-007': () => <Lily />,
  'SP-008': () => <Turtle />,
  'SP-009': () => <Hornwort />,
};

/** Illustration for a species. `pond` switches to pond water. */
export function SpeciesArt({ speciesId, pond, className, label }) {
  const Subject = SUBJECT[speciesId] || Unknown;
  const id = `w-${speciesId}-${pond ? 'p' : 'a'}`;
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={cx('block h-full w-full', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pond ? '#DCEBDD' : '#E3F4EF'} />
          <stop offset="1" stopColor={pond ? '#B9D3B8' : '#B9E2D7'} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#${id})`} />
      <path d="M0 176 Q80 166 160 174 T320 172 V200 H0Z" fill={pond ? '#C9B98F' : '#EBDDB5'} />
      <Subject />
    </svg>
  );
}

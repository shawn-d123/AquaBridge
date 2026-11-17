/**
 * Species catalogue (F-05 · Farhan). Small, agreed list of sample species with care ranges.
 * Sample reference data, not checked by a specialist.
 *
 * Other features (Shawn's listing pages, Midhir's compatibility check) read species ONLY through
 * getSpecies(id) and listSpecies(kind), never by importing SPECIES directly.
 */

/** @type {Record<string, Omit<import('./contracts').Species, 'id'>>} */
const SPECIES = {
  'SP-001': {
    common: 'Fancy goldfish',
    plural: 'fancy goldfish',
    sci: 'Carassius auratus',
    kind: 'animal',
    group: 'cold',
    habitats: ['aquarium'],
    temp: [10, 24],
    ph: [7.0, 8.0],
    minVol: 110,
    status: 'supported',
    care: 'Coldwater fish that produce a lot of waste. Needs strong filtration and weekly partial water changes. Fancy varieties do better indoors than in ponds.',
  },
  'SP-002': {
    common: 'Neon tetra',
    plural: 'neon tetras',
    sci: 'Paracheirodon innesi',
    kind: 'animal',
    group: 'trop',
    habitats: ['aquarium'],
    temp: [20, 26],
    ph: [6.0, 7.0],
    minVol: 54,
    status: 'supported',
    care: 'Shoaling fish. Keep in groups of six or more in a heated, planted tank with soft water.',
  },
  'SP-003': {
    common: 'Cherry shrimp',
    plural: 'cherry shrimp',
    sci: 'Neocaridina davidi',
    kind: 'animal',
    group: 'trop',
    habitats: ['aquarium'],
    temp: [18, 26],
    ph: [6.5, 8.0],
    minVol: 20,
    status: 'supported',
    care: 'Peaceful and hardy. Sensitive to copper-based medicines and to sudden changes in water chemistry.',
  },
  'SP-004': {
    common: 'White Cloud Mountain minnow',
    plural: 'White Cloud Mountain minnows',
    sci: 'Tanichthys albonubes',
    kind: 'animal',
    group: 'cold',
    habitats: ['aquarium'],
    temp: [14, 22],
    ph: [6.5, 8.0],
    minVol: 60,
    status: 'supported',
    care: 'Coldwater shoaling fish. Does not need a heater in most UK homes. Keep in groups of six or more.',
  },
  'SP-005': {
    common: 'Java fern',
    plural: 'Java ferns',
    sci: 'Microsorum pteropus',
    kind: 'plant',
    group: 'plant',
    habitats: ['aquarium'],
    temp: [18, 28],
    ph: [6.0, 7.5],
    minVol: 20,
    light: 'low',
    status: 'supported',
    care: 'Slow-growing. Tie the rhizome to wood or rock; burying it in gravel causes rot.',
  },
  'SP-006': {
    common: 'Hornwort',
    plural: 'hornwort plants',
    sci: 'Ceratophyllum demersum',
    kind: 'plant',
    group: 'plant',
    habitats: ['aquarium', 'pond'],
    temp: [4, 28],
    ph: [6.0, 8.0],
    minVol: 20,
    light: 'medium',
    status: 'supported',
    care: 'Native to the UK. Fast-growing oxygenator that can float or be anchored.',
  },
  'SP-007': {
    common: 'Hardy water lily',
    plural: 'hardy water lilies',
    sci: 'Nymphaea (hardy cultivars)',
    kind: 'plant',
    group: 'pond',
    habitats: ['pond'],
    temp: [4, 30],
    ph: [6.5, 8.0],
    minVol: 500,
    minDepth: 30,
    light: 'high',
    status: 'supported',
    care: 'Pond only. Plant in an aquatic basket 30 to 90 cm deep, in full sun.',
  },
  'SP-008': {
    common: 'Red-eared slider',
    plural: 'red-eared sliders',
    sci: 'Trachemys scripta elegans',
    kind: 'animal',
    group: 'cold',
    status: 'restricted',
    care: 'Example restricted species. Listed as an invasive species of special concern in England and Wales; selling, exchanging and releasing it are restricted.',
  },
  'SP-009': {
    common: "Parrot's feather",
    plural: "parrot's feather plants",
    sci: 'Myriophyllum aquaticum',
    kind: 'plant',
    group: 'plant',
    status: 'restricted',
    care: 'Example restricted species. Listed as an invasive non-native plant in England and Wales and banned from sale.',
  },
  'SP-000': {
    common: "I'm not sure what it is",
    plural: 'unidentified animals or plants',
    sci: 'Unidentified',
    kind: 'any',
    group: 'cold',
    status: 'unknown',
    care: 'We cannot give care guidance until the organism is identified.',
  },
};

export const UNKNOWN_SPECIES_ID = 'SP-000';

const withId = (id) => (SPECIES[id] ? { id, ...SPECIES[id] } : undefined);

/** One species by ID, or undefined. */
export const getSpecies = (id) => withId(id);

/**
 * Species for a picker or list.
 * listSpecies('animal') / listSpecies('plant') include the "I'm not sure" option; listSpecies() returns everything.
 * Pass { guide: true } to leave out the "not sure" entry (used by the public species guide).
 */
export function listSpecies(kind, { guide = false } = {}) {
  return Object.keys(SPECIES)
    .map(withId)
    .filter((s) => !kind || s.kind === kind || s.kind === 'any')
    .filter((s) => !guide || s.status !== 'unknown');
}

/** True when the species lives only in ponds (used to pick pond water in illustrations). */
export const pondOnly = (s) => s?.habitats?.length === 1 && s.habitats[0] === 'pond';

/** "1 Neon tetra" / "6 neon tetras". */
export const countLabel = (s, n) => (+n > 1 ? `${n} ${s.plural}` : `1 ${s.common}`);

/** Suggested listing title for the editor pre-fill: "6 neon tetras need a new home". */
export const suggestTitle = (s, n) => (+n > 1 ? `${n} ${s.plural} need a new home` : `${s.common} needs a new home`);

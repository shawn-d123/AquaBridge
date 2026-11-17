/**
 * Shared contracts (SH-03, Shawn coordinates). Status values, labels and data shapes every feature agrees on.
 * Farhan owns the Species and Intake parts below; Shawn owns Listing/Request; Midhir owns Habitat.
 *
 * ID prefixes: SP-### species · IC-### intake · L-#### listing · H-### habitat · R-### request · U-## user
 */

export const LISTING_STATUS = ['draft', 'active', 'reserved', 'rehomed', 'withdrawn'];
export const REQUEST_STATUS = ['pending', 'accepted', 'declined', 'withdrawn', 'completed'];
export const COMPAT_OUTCOME = ['potential_match', 'needs_information', 'blocked'];
export const GUIDANCE_OUTCOME = ['eligible', 'needs_review', 'restricted'];
export const SPECIES_STATUS = ['supported', 'restricted', 'unknown'];

export const CONDITION = { healthy: 'Healthy', minor: 'Minor issues', unwell: 'Unwell or under treatment' };
export const URGENCY = { week: 'Within a week', month: 'Within a month', flexible: 'No rush' };
export const REASON = {
  moving: 'Moving home',
  closing: 'Closing down the tank or pond',
  outgrown: 'Outgrown the setup',
  time: 'No longer have time',
  other: 'Something else',
};
export const GROWN_IN = { aquarium: 'Aquarium', pond: 'Pond' };

/** Sample users. Any sign-in uses the sample account U-01 until the university login is integrated. */
export const USERS = {
  'U-01': { name: 'Jordan Lee', email: 'jordan.lee@example.com' },
  'U-03': { name: 'Priya Nair' },
  'U-04': { name: 'Tom Hughes' },
  'U-05': { name: 'Aisha Bello' },
  'U-06': { name: 'Daniel Kerr' },
};
export const SAMPLE_USER = 'U-01';

/**
 * @typedef {'eligible'|'needs_review'|'restricted'} GuidanceOutcome
 * @typedef {'supported'|'restricted'|'unknown'} SpeciesStatus
 *
 * @typedef {Object} Species                         Farhan · services/species.js
 * @property {string} id                             SP-###
 * @property {string} common                         "Neon tetra"
 * @property {string} plural                         "neon tetras"
 * @property {string} sci                            Scientific name
 * @property {'animal'|'plant'|'any'} kind
 * @property {'trop'|'cold'|'plant'|'pond'} group
 * @property {('aquarium'|'pond')[]} [habitats]
 * @property {[number, number]} [temp]               °C
 * @property {[number, number]} [ph]
 * @property {number} [minVol]                       Litres
 * @property {number} [minDepth]                     cm, pond plants only
 * @property {'low'|'medium'|'high'} [light]         Plants only
 * @property {string} care
 * @property {SpeciesStatus} status
 *
 * @typedef {Object} IntakeAnswers                   Farhan · draft questionnaire answers (never put in the URL)
 * @property {'animal'|'plant'} kind
 * @property {string} speciesId
 * @property {number|string} quantity                1 to 500
 * @property {'aquarium'|'pond'} [grownIn]           Plants only
 * @property {'healthy'|'minor'|'unwell'} condition
 * @property {string} [health]                       Required when condition is not healthy
 * @property {keyof REASON} reason
 * @property {string} location                       Town and postcode district, e.g. "Uxbridge, UB8"
 * @property {'week'|'month'|'flexible'} urgency
 * @property {string} [details]
 *
 * @typedef {Object} IntakeOutcome                   Farhan · produced by evaluateIntake (F-04)
 * @property {string} intakeId                       IC-###
 * @property {GuidanceOutcome} outcome
 * @property {string[]} reasons
 *
 * @typedef {Object} ListingPrefill                  Farhan → Shawn handoff payload (F-06), read with getHandoff()
 * @property {string} intakeId
 * @property {string} speciesId
 * @property {number} quantity
 * @property {'healthy'|'minor'|'unwell'} condition
 * @property {string} [health]
 * @property {string} location
 * @property {'week'|'month'|'flexible'} urgency
 * @property {string} reason
 * @property {string} [details]
 * @property {string} suggestedTitle
 *
 * @typedef {Object} Listing                         Shawn
 * @property {string} id                             L-####
 * @property {string} owner                          U-##
 * @property {string} speciesId
 * @property {string} title
 * @property {number} qty
 * @property {string} location
 * @property {'healthy'|'minor'|'unwell'} condition
 * @property {'week'|'month'|'flexible'} urgency
 * @property {'draft'|'active'|'reserved'|'rehomed'|'withdrawn'} status
 * @property {string} created
 * @property {string} description
 * @property {string} careNotes
 * @property {string|null} [intakeId]
 *
 * @typedef {Object} AdoptionRequest                 Shawn (service) · Midhir (adopter screens)
 * @property {string} id                             R-###
 * @property {string} listingId
 * @property {string} adopter
 * @property {string} habitatId
 * @property {'pending'|'accepted'|'declined'|'withdrawn'|'completed'} status
 */

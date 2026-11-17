/**
 * PLACEHOLDER for Shawn's shared mock request service (S-08).
 * Only the read used by the header badge is here. Replace this file with Shawn's version when it is merged;
 * the header keeps working as long as listForOwner(state, ownerId) has the same signature.
 */

/** Requests made on listings that belong to ownerId. */
export function listForOwner(state, ownerId) {
  const mine = new Set(state.listings.filter((l) => l.owner === ownerId).map((l) => l.id));
  return state.requests.filter((r) => mine.has(r.listingId));
}

/** Number of requests waiting for the owner's decision (shown as the badge in the account menu). */
export const pendingCountFor = (state, ownerId) =>
  ownerId ? listForOwner(state, ownerId).filter((r) => r.status === 'pending').length : 0;

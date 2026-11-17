import { kv } from '../../shared/styles';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Care ranges for a species as a summary list (F-05). The ONE component used by the listing page, care needs panel,
 * compatibility check and species guide, so values and units are always shown the same way.
 *   <CareList species={getSpecies('SP-002')} />          full = false hides planting depth and light
 */
export function CareList({ species: s, full = true }) {
  if (!s?.temp) return null;
  return (
    <dl className={kv}>
      <dt>Water temperature</dt>
      <dd>
        {s.temp[0]} to {s.temp[1]} °C
      </dd>
      <dt>pH</dt>
      <dd>
        {s.ph[0].toFixed(1)} to {s.ph[1].toFixed(1)}
      </dd>
      <dt>Smallest tank or pond</dt>
      <dd>{s.minVol} litres</dd>
      <dt>Lives in</dt>
      <dd>{cap(s.habitats.map((h) => (h === 'aquarium' ? 'an aquarium' : 'a pond')).join(' or '))}</dd>
      {full && s.minDepth && (
        <>
          <dt>Planting depth</dt>
          <dd>At least {s.minDepth} cm</dd>
        </>
      )}
      {full && s.light && (
        <>
          <dt>Light</dt>
          <dd>{cap(s.light)}</dd>
        </>
      )}
    </dl>
  );
}

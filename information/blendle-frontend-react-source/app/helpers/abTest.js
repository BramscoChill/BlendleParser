import { ABTest } from 'ab';

export function pickVariant(experiment) {
  return ABTest({
    // eslint-disable-line new-cap
    name: experiment.name,
    cookiePath: '/',
    variations: experiment.variants.reduce((map, variant) => {
      map[variant] = () => {};
      return map;
    }, {}),
  }).assignedVariation;
}

export function hasForcedVariant(search, experimentName) {
  return search.indexOf(`abjs-setvar-${experimentName}`) !== -1;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/abTest.js
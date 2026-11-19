
import { B787_CG_ENVELOPES } from '../utilit/b787WeightBalanceEngine';

const buildPolygon = (phase, maximumWeight) => {
  const envelope = B787_CG_ENVELOPES[phase];

  const interpolate = (points, weight) => {
    for (let i = 0; i < points.length - 1; i++) {
      const [w1, cg1] = points[i];
      const [w2, cg2] = points[i + 1];

      if (weight >= w1 && weight <= w2) {
        const fraction = (weight - w1) / (w2 - w1);
        return cg1 + fraction * (cg2 - cg1);
      }
    }

    return points[points.length - 1][1];
  };

  const minimumWeight = Math.max(
    envelope.forward[0][0],
    envelope.aft[0][0]
  );

  const weights = [
    minimumWeight,
    maximumWeight,
    ...envelope.forward.map(point => point[0]),
    ...envelope.aft.map(point => point[0])
  ]
    .filter(weight =>
      weight >= minimumWeight &&
      weight <= maximumWeight
    )
    .filter((weight, index, array) =>
      array.indexOf(weight) === index
    )
    .sort((a, b) => a - b);

  const forward = weights.map(weight => [
    interpolate(envelope.forward, weight),
    weight
  ]);

  const aft = [...weights].reverse().map(weight => [
    interpolate(envelope.aft, weight),
    weight
  ]);

  return [...forward, ...aft];
};

export const b787Envelope = {
  manufacturer: 'BOEING',
  model: 'B787-9',

  trainingOnly: true,

  weightLimits: {
    mzfw: 181436,
    mtow: 252650,
    mlw: 192776
  },

  chartScale: {
    minWeight: 110000,
    maxWeight: 270000,
    minCg: 8,
    maxCg: 40
  },

  zfwPolygon: buildPolygon('ZFW', 181436),
  towPolygon: buildPolygon('TAKEOFF', 252650),
  ldwPolygon: buildPolygon('LANDING', 192776)
};

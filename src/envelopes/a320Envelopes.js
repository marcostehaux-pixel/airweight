
import { A320_CG_ENVELOPES } from '../utilit/a320WeightBalanceEngine';

const buildPolygon = (phase, maximumWeight) => {
  const envelope = A320_CG_ENVELOPES[phase];

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

export const a320Envelope = {
  manufacturer: 'AIRBUS',
  model: 'A320',

  trainingOnly: true,

  weightLimits: {
    mzfw: 61000,
    mtow: 77000,
    mlw: 64500
  },

  chartScale: {
    minWeight: 37000,
    maxWeight: 80000,
    minCg: 15,
    maxCg: 46
  },

  zfwPolygon: buildPolygon('ZFW', 61000),
  towPolygon: buildPolygon('TAKEOFF', 77000),
  ldwPolygon: buildPolygon('LANDING', 64500)
};

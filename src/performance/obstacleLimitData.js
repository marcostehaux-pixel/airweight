
/**
 * OPERDAT TRAINING
 * B737-800W — OBSTACLE LIMIT
 *
 * Generic training model configuration.
 *
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

export const OBSTACLE_LIMIT_CONFIG = {
  aircraft: 'B737-800W',

  calculation: 'OBSTACLE_LIMIT',

  supportedFlaps: [1, 5, 10, 15, 25],

  referenceConfiguration: {
    packs: 'ON',
    engineAntiIce: false,
    wingAntiIce: false
  },

  // FLAPS 1 chart domains.
  // These ranges will be reviewed against
  // each additional flap chart.
  chartDomains: {
    obstacleHeightFt: {
      min: 0,
      max: 1000
    },

    distanceFromBrakeReleaseM: {
      min: 2500,
      max: 9000
    },

    oatC: {
      min: 0,
      max: 50
    },

    pressureAltitudeFt: {
      min: 0,
      max: 10000
    },

    windComponentKt: {
      min: -20,
      max: 40
    }
  },

  // Sign convention:
  // Positive wind = headwind.
  // Negative wind = tailwind.
  windConvention: {
    headwind: 'POSITIVE',
    tailwind: 'NEGATIVE'
  },

  obstacleHeightReference:
    'LOWEST_POINT_OF_RUNWAY',

  obstacleDistanceReference:
    'BRAKE_RELEASE_POINT',

  corrections: {
    1: {
      packsOffKg: 600,
      engineAntiIceKg: -300,
      engineAndWingAntiIceKg: -1700
    }
  },

  // Numerical training curves will be added
  // in the next step.
  referenceData: {
    1: null,
    5: null,
    10: null,
    15: null,
    25: null
  },

  restrictions: {
    improvedClimbPermitted: false,
    extrapolationPermitted: false,
    operationalUsePermitted: false
  },

  dataValidated: false,
  status: 'TRAINING_MODEL_IN_DEVELOPMENT'
}

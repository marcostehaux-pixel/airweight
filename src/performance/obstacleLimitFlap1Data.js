
/**
 * OPERDAT TRAINING
 * B737-800W — OBSTACLE LIMIT — FLAPS 1
 *
 * Stage 1: Obstacle Height / Distance
 *
 * SIMULATED TRAINING DATA.
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 * NOT FOR OPERATIONAL USE.
 */

const HEIGHTS_FT = [
  0, 100, 200, 300, 400,
  500, 600, 700, 800, 900, 1000
]

const DISTANCES_M = [
  2500, 3000, 3500, 4000, 4500,
  5000, 5500, 6000, 6500, 7000,
  7500, 8000, 8500, 9000
]

const MAX_TRAINING_WEIGHT_KG = 86100

/**
 * Provisional training formula.
 *
 * The 25,000 kg intercept and the coefficients
 * below are invented for simulation. They are
 * NOT extracted from the Boeing chart.
 */

function calculateReferenceWeightKg(
  obstacleHeightFt,
  distanceM
) {
  // Generic training-only model.
  // Coefficients are simulated, not Boeing data.

  const referenceDistanceM = 5000
  const referenceHeightFt = 450
  const referenceWeightKg = 68000

  const distanceEffectKg =
    (distanceM - referenceDistanceM) * 5.0

  const heightEffectKg =
    (obstacleHeightFt - referenceHeightFt) * 30

  const distanceHeightInteractionKg =
    (obstacleHeightFt - referenceHeightFt) *
    (referenceDistanceM - distanceM) *
    0.001

  const rawWeightKg =
    referenceWeightKg +
    distanceEffectKg -
    heightEffectKg -
    distanceHeightInteractionKg

  return Math.max(
    0,
    Math.min(
      MAX_TRAINING_WEIGHT_KG,
      Math.round(rawWeightKg / 100) * 100
    )
  )
}


function buildReferenceGrid() {
  return HEIGHTS_FT.map(obstacleHeightFt => ({
    obstacleHeightFt,

    points: DISTANCES_M.map(distanceM => ({
      distanceM,

      referenceWeightKg:
        calculateReferenceWeightKg(
          obstacleHeightFt,
          distanceM
        )
    }))
  }))
}

export const OBSTACLE_LIMIT_FLAP1 = {
  aircraft: 'B737-800W',

  calculation: 'OBSTACLE_LIMIT',

  flaps: 1,

  referenceConfiguration: {
    packs: 'ON',
    engineAntiIce: false,
    wingAntiIce: false
  },

  referenceConditions: {
    oatC: 30,
    pressureAltitudeFt: 0,
    windComponentKt: 0
  },

  heightDistanceGrid: buildReferenceGrid(),

  interpolation: {
    obstacleHeight: 'LINEAR',
    distance: 'LINEAR',
    extrapolationPermitted: false
  },

  modelParameters: {
    heightsFt: HEIGHTS_FT,
    distancesM: DISTANCES_M,
    maxTrainingWeightKg: MAX_TRAINING_WEIGHT_KG
  },

  dataValidated: false,

  status: 'SIMULATED_TRAINING_DATA',

  operationalUsePermitted: false
}

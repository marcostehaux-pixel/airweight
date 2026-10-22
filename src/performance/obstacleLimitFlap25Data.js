
/**
 * OPERDAT TRAINING
 * B737-800W — OBSTACLE LIMIT — FLAPS 25
 *
 * Simulated training data.
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
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

function calculateReferenceWeightKg(
  obstacleHeightFt,
  distanceM
) {
  const referenceDistanceM = 5000
  const referenceHeightFt = 450

  // Provisional FLAPS 25 training reference.
  const referenceWeightKg = 62500

  const distanceEffectKg =
    (distanceM - referenceDistanceM) * 5.4

  const heightEffectKg =
    (obstacleHeightFt - referenceHeightFt) * 26

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

export const OBSTACLE_LIMIT_FLAP25 = {
  aircraft: 'B737-800W',
  calculation: 'OBSTACLE_LIMIT',
  flaps: 25,

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

  configurationCorrectionsKg: {
    packsOff: 650,
    engineAntiIce: -300,
    engineAndWingAntiIce: -1750
  },

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

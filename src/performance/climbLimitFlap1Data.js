
/**
 * OPERDAT TRAINING
 * B737-800W
 *
 * SECOND SEGMENT CLIMB LIMIT — FLAPS 1
 *
 * Generic simulated training model.
 *
 * The model preserves the previously agreed
 * PA 0 ft and PA 1000 ft reference points.
 *
 * Other altitude curves are generated using
 * provisional training assumptions.
 *
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

const TEMPERATURES_C = [
  0, 10, 20, 25, 30, 35,
  40, 45, 50, 55, 60
]

const ALTITUDES_FT = [
  -2000, -1000, 0, 1000, 2000,
  3000, 4000, 5000, 6000,
  7000, 8000, 9000, 10000
]

const MAX_WEIGHT_KG = 86100

// Reference curve agreed for PA 0 ft.
const PA_ZERO_WEIGHTS_KG = [
  86100, 86100, 86100, 86100,
  86100, 86100, 86100, 84400,
  82500, 80500, 78600
]

// Reference curve agreed for PA 1000 ft.
const PA_1000_WEIGHTS_KG = [
  86100, 86100, 86100, 86100,
  85900, 84200, 82400, 80500,
  78600, 76700, 74800
]

/**
 * Provisional altitude penalty.
 *
 * Penalty grows with PA and OAT.
 * It is intentionally non-linear and
 * is used only to create a coherent
 * training dataset.
 */
function calculateAltitudePenaltyKg(
  pressureAltitudeFt,
  oatC
) {
  const altitudeThousands =
    Math.max(0, pressureAltitudeFt - 1000) / 1000

  const temperatureFactor =
    1 + Math.max(0, oatC - 20) * 0.012

  const altitudePenalty =
    altitudeThousands * 1450

  const nonlinearPenalty =
    Math.pow(altitudeThousands, 1.35) * 115

  return (
    altitudePenalty + nonlinearPenalty
  ) * temperatureFactor
}

function getReferenceWeightKg(oatC, index) {
  if (index < 0 || index >= TEMPERATURES_C.length) {
    throw new Error('Invalid temperature index')
  }

  if (oatC !== TEMPERATURES_C[index]) {
    throw new Error('Temperature grid mismatch')
  }

  return PA_1000_WEIGHTS_KG[index]
}

function calculateTrainingWeightKg(
  pressureAltitudeFt,
  oatC,
  index
) {
  // Preserve the previously agreed curves.
  if (pressureAltitudeFt === 0) {
    return PA_ZERO_WEIGHTS_KG[index]
  }

  if (pressureAltitudeFt === 1000) {
    return PA_1000_WEIGHTS_KG[index]
  }

  // Negative PA: provisional improvement
  // relative to PA 0 ft.
  if (pressureAltitudeFt < 0) {
    const improvementKg =
      Math.abs(pressureAltitudeFt) / 1000 * 1200

    return Math.min(
      MAX_WEIGHT_KG,
      PA_ZERO_WEIGHTS_KG[index] + improvementKg
    )
  }

  const referenceWeightKg =
    getReferenceWeightKg(oatC, index)

  const penaltyKg =
    calculateAltitudePenaltyKg(
      pressureAltitudeFt,
      oatC
    )

  return Math.max(
    0,
    Math.min(
      MAX_WEIGHT_KG,
      referenceWeightKg - penaltyKg
    )
  )
}

function buildAltitudeCurves() {
  return ALTITUDES_FT.map(pressureAltitudeFt => ({
    pressureAltitudeFt,

    points: TEMPERATURES_C.map((oatC, index) => ({
      oatC,

      weightKg:
        Math.round(
          calculateTrainingWeightKg(
            pressureAltitudeFt,
            oatC,
            index
          ) / 100
        ) * 100
    }))
  }))
}

export const CLIMB_LIMIT_FLAP1 = {
  aircraft: 'B737-800W',

  flaps: 1,

  calculation: 'SECOND_SEGMENT_CLIMB',

  referenceConfiguration: {
    packs: 'ON',
    engineAntiIce: false,
    wingAntiIce: false
  },

  altitudeCurves: buildAltitudeCurves(),

  environmentalLimit: {
    // No separate numeric environmental
    // boundary is applied at this stage.
    // The training weight ceiling is 86100 kg.
    points: [],
    applied: false,
    maxTrainingWeightKg: MAX_WEIGHT_KG
  },

  interpolation: {
    temperature: 'PIECEWISE_LINEAR',
    pressureAltitude: 'LINEAR_BETWEEN_CURVES',
    extrapolationPermitted: false
  },

  corrections: {
    packsOffKg: 1450,
    engineAntiIceKg: -300,
    engineAndWingAntiIceKg: -1700
  },

  modelParameters: {
    temperatureGridC: TEMPERATURES_C,
    altitudeGridFt: ALTITUDES_FT,
    maxTrainingWeightKg: MAX_WEIGHT_KG
  },

  dataValidated: false,
  status: 'SIMULATED_TRAINING_DATA',
  operationalUsePermitted: false
}

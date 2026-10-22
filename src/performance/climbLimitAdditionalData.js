
import { CLIMB_LIMIT_FLAP1 } from './climbLimitFlap1Data.js'
import { CLIMB_LIMIT_CONFIG } from './climbLimitData.js'

/**
 * OPERDAT TRAINING
 * B737-800W — SECOND SEGMENT CLIMB LIMIT
 *
 * FLAPS 5, 10, 15 and 25.
 *
 * Simulated training curves derived from the
 * FLAPS 1 training reference matrix.
 *
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

const MAX_WEIGHT_KG = 86100

// Provisional training penalties relative to FLAPS 1.
// Higher flap settings produce lower climb-limit weights.
const FLAP_PENALTIES_KG = {
  5: 1600,
  10: 3300,
  15: 5100,
  25: 8500
}

function buildClimbCurves(flaps) {
  const basePenaltyKg = FLAP_PENALTIES_KG[flaps]

  return CLIMB_LIMIT_FLAP1.altitudeCurves.map(curve => ({
    pressureAltitudeFt: curve.pressureAltitudeFt,

    points: curve.points.map(point => {
      const altitudeFactor =
        1 + Math.max(0, curve.pressureAltitudeFt) / 20000

      const temperatureFactor =
        1 + Math.max(0, point.oatC - 25) * 0.008

      const penaltyKg =
        basePenaltyKg *
        altitudeFactor *
        temperatureFactor

      const weightKg = Math.max(
        0,
        Math.min(
          MAX_WEIGHT_KG,
          point.weightKg - penaltyKg
        )
      )

      return {
        oatC: point.oatC,
        weightKg: Math.round(weightKg / 100) * 100
      }
    })
  }))
}

function buildClimbTable(flaps) {
  return {
    aircraft: 'B737-800W',
    flaps,
    calculation: 'SECOND_SEGMENT_CLIMB',

    referenceConfiguration: {
      packs: 'ON',
      engineAntiIce: false,
      wingAntiIce: false
    },

    altitudeCurves: buildClimbCurves(flaps),

    environmentalLimit: {
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
      ...CLIMB_LIMIT_CONFIG.corrections[flaps]
    },

    modelParameters: {
      basePenaltyKg: FLAP_PENALTIES_KG[flaps],
      maxTrainingWeightKg: MAX_WEIGHT_KG
    },

    dataValidated: false,
    status: 'SIMULATED_TRAINING_DATA',
    operationalUsePermitted: false
  }
}

export const CLIMB_LIMIT_FLAP5 = buildClimbTable(5)
export const CLIMB_LIMIT_FLAP10 = buildClimbTable(10)
export const CLIMB_LIMIT_FLAP15 = buildClimbTable(15)
export const CLIMB_LIMIT_FLAP25 = buildClimbTable(25)

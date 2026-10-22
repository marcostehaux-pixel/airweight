
import { FIELD_LIMIT_CONFIG } from './fieldLimitData.js'
import { interpolateTemperature } from './fieldLimitEngine.js'

/**
 * OPERDAT TRAINING
 * B737-800W — FIELD LIMIT — FLAPS 15 — DRY
 *
 * Generic simulated training model.
 * Based on the FLAPS 5 training grid with a
 * provisional field-length advantage.
 *
 * NOT Boeing-certified performance data.
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

const MAX_REFERENCE_WEIGHT_KG = 86100
const LENGTH_ADVANTAGE_M = 220

const LENGTH_GRID_M = [
  1200, 1400, 1600, 1800, 2000,
  2200, 2400, 2600, 2800, 3000,
  3200, 3400, 3600, 3800, 4000
]

const TEMPERATURE_GRID_C = [
  -40, -13, -9, -5, -1, 3,
  7, 11, 15, 30, 50
]

const ALTITUDE_GRID_FT = [
  0, 2000, 4000, 6000, 8000, 10000
]

function interpolateLength(rows, lengthM, oatC) {
  const sorted = [...rows].sort(
    (a, b) =>
      a.correctedFieldLengthM -
      b.correctedFieldLengthM
  )

  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  if (lengthM <= first.correctedFieldLengthM) {
    return interpolateTemperature(first.weightsKg, oatC)
  }

  if (lengthM >= last.correctedFieldLengthM) {
    return interpolateTemperature(last.weightsKg, oatC)
  }

  const upperIndex = sorted.findIndex(
    row => row.correctedFieldLengthM >= lengthM
  )

  const upper = sorted[upperIndex]
  const lower = sorted[upperIndex - 1]

  const lowerWeight = interpolateTemperature(
    lower.weightsKg,
    oatC
  )

  const upperWeight = interpolateTemperature(
    upper.weightsKg,
    oatC
  )

  const fraction =
    (lengthM - lower.correctedFieldLengthM) /
    (upper.correctedFieldLengthM -
      lower.correctedFieldLengthM)

  return lowerWeight +
    fraction * (upperWeight - lowerWeight)
}

function buildFlap15ReferencePoints() {
  const points = []

  for (const altitudeFt of ALTITUDE_GRID_FT) {
    const altitudeRows =
      FIELD_LIMIT_CONFIG.referencePoints.filter(
        row => row.pressureAltitudeFt === altitudeFt
      )

    if (altitudeRows.length !== LENGTH_GRID_M.length) {
      throw new Error(
        `Incomplete FLAPS 5 reference grid at ${altitudeFt} ft`
      )
    }

    for (const lengthM of LENGTH_GRID_M) {
      const effectiveLengthM = Math.min(
        4000,
        lengthM + LENGTH_ADVANTAGE_M
      )

      const weightsKg = {}

      for (const oatC of TEMPERATURE_GRID_C) {
        const weight = interpolateLength(
          altitudeRows,
          effectiveLengthM,
          oatC
        )

        weightsKg[String(oatC)] = Math.min(
          MAX_REFERENCE_WEIGHT_KG,
          Math.round(weight / 100) * 100
        )
      }

      points.push({
        pressureAltitudeFt: altitudeFt,
        correctedFieldLengthM: lengthM,
        weightsKg
      })
    }
  }

  return points
}

export const FLAP15_FIELD_LIMIT = {
  aircraft: 'B737-800W',
  flaps: 15,
  runwayCondition: 'DRY',

  source: 'GENERIC TRAINING MODEL',
  referenceDocument:
    'FPPM — FLAPS 15 field-limit chart, qualitative reference only',

  referenceConfiguration: {
    packs: 'ON',
    antiIce: 'OFF',
    windKt: 0,
    runwaySlopePercent: 0
  },

  // Provisional corrections, not verified
  // against the FLAPS 15 FPPM chart.
  corrections: {
    packsOffKg: 400,
    engineAntiIceKg: -200,
    engineAndWingAntiIceKg: -900
  },

  modelParameters: {
    lengthAdvantageM: LENGTH_ADVANTAGE_M,
    maxReferenceWeightKg: MAX_REFERENCE_WEIGHT_KG
  },

  referencePoints: buildFlap15ReferencePoints(),

  status: 'TRAINING_ONLY',
  operationalUsePermitted: false
}


import { CLIMB_LIMIT_CONFIG } from './climbLimitData.js'
import { CLIMB_LIMIT_FLAP1 } from './climbLimitFlap1Data.js'

import {
  CLIMB_LIMIT_FLAP5,
  CLIMB_LIMIT_FLAP10,
  CLIMB_LIMIT_FLAP15,
  CLIMB_LIMIT_FLAP25
} from './climbLimitAdditionalData.js'

/**
 * OPERDAT TRAINING
 * B737-800W — SECOND SEGMENT CLIMB LIMIT
 *
 * Supported FLAPS: 1, 5, 10, 15, 25
 *
 * Generic simulated training model.
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 *
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

const CLIMB_TABLES = {
  1: CLIMB_LIMIT_FLAP1,
  5: CLIMB_LIMIT_FLAP5,
  10: CLIMB_LIMIT_FLAP10,
  15: CLIMB_LIMIT_FLAP15,
  25: CLIMB_LIMIT_FLAP25
}

function interpolate(x, x1, x2, y1, y2) {
  if (x1 === x2) return y1

  return y1 + (y2 - y1) * ((x - x1) / (x2 - x1))
}

function interpolateTemperature(points, oatC) {
  const sorted = [...points].sort(
    (a, b) => a.oatC - b.oatC
  )

  if (!sorted.length) {
    throw new Error(
      'CLIMB LIMIT temperature data missing'
    )
  }

  if (
    oatC < sorted[0].oatC ||
    oatC > sorted[sorted.length - 1].oatC
  ) {
    throw new Error(
      'OAT outside CLIMB LIMIT reference range'
    )
  }

  const exact = sorted.find(
    point => point.oatC === oatC
  )

  if (exact) return exact.weightKg

  const upperIndex = sorted.findIndex(
    point => point.oatC > oatC
  )

  const lower = sorted[upperIndex - 1]
  const upper = sorted[upperIndex]

  return interpolate(
    oatC,
    lower.oatC,
    upper.oatC,
    lower.weightKg,
    upper.weightKg
  )
}

function interpolateAltitude(
  altitudeCurves,
  oatC,
  pressureAltitudeFt
) {
  const sorted = [...altitudeCurves].sort(
    (a, b) =>
      a.pressureAltitudeFt - b.pressureAltitudeFt
  )

  if (!sorted.length) {
    throw new Error(
      'CLIMB LIMIT altitude data missing'
    )
  }

  if (
    pressureAltitudeFt <
      sorted[0].pressureAltitudeFt ||
    pressureAltitudeFt >
      sorted[sorted.length - 1].pressureAltitudeFt
  ) {
    throw new Error(
      'Pressure altitude outside CLIMB LIMIT reference range'
    )
  }

  const exact = sorted.find(
    curve =>
      curve.pressureAltitudeFt === pressureAltitudeFt
  )

  if (exact) {
    return interpolateTemperature(
      exact.points,
      oatC
    )
  }

  const upperIndex = sorted.findIndex(
    curve =>
      curve.pressureAltitudeFt > pressureAltitudeFt
  )

  const lower = sorted[upperIndex - 1]
  const upper = sorted[upperIndex]

  const lowerWeight = interpolateTemperature(
    lower.points,
    oatC
  )

  const upperWeight = interpolateTemperature(
    upper.points,
    oatC
  )

  return interpolate(
    pressureAltitudeFt,
    lower.pressureAltitudeFt,
    upper.pressureAltitudeFt,
    lowerWeight,
    upperWeight
  )
}

export function calculateClimbLimit({
  flaps = 1,
  oatC,
  pressureAltitudeFt,
  packsOff = false,
  engineAntiIce = false,
  wingAntiIce = false
}) {
  const selectedFlaps = Number(flaps)
  const temperature = Number(oatC)
  const altitude = Number(pressureAltitudeFt)

  if (
    !CLIMB_LIMIT_CONFIG.supportedFlaps.includes(
      selectedFlaps
    )
  ) {
    throw new Error(
      'Unsupported CLIMB LIMIT flap setting'
    )
  }

  const table = CLIMB_TABLES[selectedFlaps]

  if (!table) {
    throw new Error(
      `CLIMB LIMIT FLAPS ${selectedFlaps} not available`
    )
  }

  if (
    !Number.isFinite(temperature) ||
    !Number.isFinite(altitude)
  ) {
    throw new Error(
      'Invalid OAT or pressure altitude'
    )
  }

  if (wingAntiIce && !engineAntiIce) {
    throw new Error(
      'Wing Anti-Ice requires Engine Anti-Ice'
    )
  }

  if (packsOff && engineAntiIce) {
    throw new Error(
      'PACKS OFF with Anti-Ice is not supported'
    )
  }

  // 1. Reference climb-limit weight.
  const referenceWeightKg = interpolateAltitude(
    table.altitudeCurves,
    temperature,
    altitude
  )

  // 2. Flap-specific configuration corrections.
  const corrections =
    CLIMB_LIMIT_CONFIG.corrections[selectedFlaps]

  let correctionKg = 0

  if (packsOff) {
    correctionKg += corrections.packsOffKg
  }

  if (engineAntiIce && wingAntiIce) {
    correctionKg +=
      corrections.engineAndWingAntiIceKg
  } else if (engineAntiIce) {
    correctionKg +=
      corrections.engineAntiIceKg
  }

  // 3. Provisional training weight ceiling.
  // This is NOT a digitized Environmental Limit.
  const maxTrainingWeightKg =
    table.environmentalLimit.maxTrainingWeightKg

  const climbLimitWeightKg = Math.min(
    maxTrainingWeightKg,
    referenceWeightKg + correctionKg
  )

  return {
    aircraft: 'B737-800W',
    calculation: 'SECOND_SEGMENT_CLIMB',
    flaps: selectedFlaps,

    oatC: temperature,
    pressureAltitudeFt: altitude,

    packsOff,
    engineAntiIce,
    wingAntiIce,

    referenceWeightKg:
      Math.round(referenceWeightKg),

    correctionKg,

    climbLimitWeightKg:
      Math.round(climbLimitWeightKg),

    environmentalLimitApplied: false,
    status: 'TRAINING_ONLY'
  }
}


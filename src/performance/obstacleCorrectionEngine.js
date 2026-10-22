
/**
 * OPERDAT TRAINING
 * B737-800W — OBSTACLE LIMIT CORRECTIONS
 *
 * Generic simulated training corrections.
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

const REFERENCE_OAT_C = 30
const REFERENCE_PA_FT = 0
const MAX_TRAINING_WEIGHT_KG = 86100

function validateRange(value, min, max, label) {
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new Error(
      `${label} outside training reference range`
    )
  }
}

export function calculateObstacleCorrections({
  referenceWeightKg,
  oatC,
  pressureAltitudeFt,
  windComponentKt
}) {
  const referenceWeight = Number(referenceWeightKg)
  const temperature = Number(oatC)
  const altitude = Number(pressureAltitudeFt)
  const wind = Number(windComponentKt)

  validateRange(
    referenceWeight,
    0,
    MAX_TRAINING_WEIGHT_KG,
    'Reference weight'
  )

  validateRange(temperature, 0, 50, 'OAT')
  validateRange(altitude, 0, 10000, 'Pressure altitude')
  validateRange(wind, -20, 40, 'Wind component')

  // STAGE 2 — Temperature correction.
  // Higher OAT reduces obstacle-limited weight.
  const oatCorrectionKg =
    -(temperature - REFERENCE_OAT_C) * 220

  const weightAfterOatKg =
    referenceWeight + oatCorrectionKg

  // STAGE 3 — Pressure altitude correction.
  // Higher PA reduces obstacle-limited weight.
  const paCorrectionKg =
    -(altitude / 1000) * 1050

  const weightAfterPaKg =
    weightAfterOatKg + paCorrectionKg

  // STAGE 4 — Wind correction.
  // Positive = headwind; negative = tailwind.
  const windCorrectionKg =
    wind >= 0
      ? wind * 180
      : wind * 320

  const weightAfterWindKg =
    weightAfterPaKg + windCorrectionKg

  return {
    referenceWeightKg: Math.round(referenceWeight),

    oatCorrectionKg: Math.round(oatCorrectionKg),
    weightAfterOatKg: Math.round(weightAfterOatKg),

    paCorrectionKg: Math.round(paCorrectionKg),
    weightAfterPaKg: Math.round(weightAfterPaKg),

    windCorrectionKg: Math.round(windCorrectionKg),
    weightAfterWindKg: Math.round(weightAfterWindKg),

    // No environmental-limit chart is modeled.
    // This is a provisional training ceiling.
    correctedWeightKg: Math.round(
      Math.max(
        0,
        Math.min(
          MAX_TRAINING_WEIGHT_KG,
          weightAfterWindKg
        )
      )
    ),

    status: 'SIMULATED_TRAINING_DATA',
    operationalUsePermitted: false
  }
}

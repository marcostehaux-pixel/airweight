
import { calculateDryCorrectedFieldLength } from './runwayCorrectionEngine.js'
import { calculateFieldLimitReference } from './fieldLimitEngine.js'
import { calculateConfigurationCorrections } from './configurationCorrectionEngine.js'

import { FLAP1_FIELD_LIMIT } from './flap1FieldLimitData.js'
import { FLAP10_FIELD_LIMIT } from './flap10FieldLimitData.js'
import { FLAP15_FIELD_LIMIT } from './flap15FieldlimitData.js'
import { FLAP25_FIELD_LIMIT } from './flap25FieldLimitData.js'

/**
 * OPERDAT TRAINING
 * B737-800W
 *
 * FIELD LIMIT — DRY RUNWAY
 * Supported flaps: 1, 5, 10, 15, 25
 *
 * FLAPS 1, 10, 15 and 25 use simulated
 * training reference grids.
 *
 * FLAPS 5 retains its existing reference grid.
 *
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

const FLAP_TABLES = {
  1: FLAP1_FIELD_LIMIT,
  10: FLAP10_FIELD_LIMIT,
  15: FLAP15_FIELD_LIMIT,
  25: FLAP25_FIELD_LIMIT
}

const SUPPORTED_FLAPS = [1, 5, 10, 15, 25]

function calculateTrainingConfigurationCorrections({
  flaps,
  runwayCondition = 'DRY',
  packsOff,
  engineAntiIce,
  wingAntiIce
}) {
  // Reuse existing configuration safety validation.
  calculateConfigurationCorrections({
    packsOff,
    engineAntiIce,
    wingAntiIce
  })

  const corrections = FLAP_TABLES[flaps].corrections
const wetCorrections = {
  1: {
    packsOffKg: 400,
    engineAntiIceKg: -200,
    engineAndWingAntiIceKg: -800
  },
  10: {
    packsOffKg: 400,
    engineAntiIceKg: -200,
    engineAndWingAntiIceKg: -850
  },
  15: {
    packsOffKg: 450,
    engineAntiIceKg: -200,
    engineAndWingAntiIceKg: -850
  },
  25: {
    packsOffKg: 450,
    engineAntiIceKg: -200,
    engineAndWingAntiIceKg: -850
  }
}

const activeCorrections =
  runwayCondition === 'WET'
    ? wetCorrections[flaps]
    : corrections
  let fieldLimitCorrectionKg = 0

if (packsOff) {
  fieldLimitCorrectionKg += activeCorrections.packsOffKg
}

if (engineAntiIce && wingAntiIce) {
  fieldLimitCorrectionKg +=
    activeCorrections.engineAndWingAntiIceKg
} else if (engineAntiIce) {
  fieldLimitCorrectionKg +=
    activeCorrections.engineAntiIceKg
}

return { fieldLimitCorrectionKg }

}

export function calculateTakeoffFieldLimit({
  toraM,
  slopePercent,
  windComponentKt,
  oatC,
  pressureAltitudeFt,
runwayCondition = 'DRY',
flaps = 5,
  packsOff = false,
  engineAntiIce = false,
  wingAntiIce = false
}) {
  const selectedFlaps = Number(flaps)
if (!['DRY', 'WET'].includes(runwayCondition)) {
  throw new Error(
    'FIELD LIMIT supports DRY and WET runway only'
  )
}

  if (!SUPPORTED_FLAPS.includes(selectedFlaps)) {
    throw new Error(
      'FIELD LIMIT supports FLAPS 1, 5, 10, 15 and 25 only'
    )
  }

  // 1. Configuration corrections.
  const configuration =
  selectedFlaps === 5 && runwayCondition === 'WET'
    ? (() => {
        // Preserve existing configuration validation.
        calculateConfigurationCorrections({
          packsOff,
          engineAntiIce,
          wingAntiIce
        })

        let fieldLimitCorrectionKg = 0

        if (packsOff) {
          fieldLimitCorrectionKg += 400
        }

        if (engineAntiIce && wingAntiIce) {
          fieldLimitCorrectionKg -= 850
        } else if (engineAntiIce) {
          fieldLimitCorrectionKg -= 200
        }

        return { fieldLimitCorrectionKg }
      })()
    : selectedFlaps === 5
      ? calculateConfigurationCorrections({
          packsOff,
          engineAntiIce,
          wingAntiIce
        })
      : calculateTrainingConfigurationCorrections({
          flaps: selectedFlaps,
          runwayCondition,
          packsOff,
          engineAntiIce,
          wingAntiIce
        })

  // 2. Shared runway correction.
  const runway = calculateDryCorrectedFieldLength({
    toraM,
    slopePercent,
    windComponentKt
  })

  // 3. Flap-specific reference data.
  const referenceInput = {
    correctedFieldLengthM: runway.correctedFieldLengthM,
    oatC,
    pressureAltitudeFt
  }

  if (selectedFlaps !== 5) {
    referenceInput.referencePoints =
      FLAP_TABLES[selectedFlaps].referencePoints
  }

  const referenceFieldLimitKg =
    calculateFieldLimitReference(referenceInput)

  // 4. Apply configuration corrections.
  const wetPenaltyKg =
  runwayCondition === 'WET' ? -800 : 0

const correctedFieldLimitKg =
  referenceFieldLimitKg +
  configuration.fieldLimitCorrectionKg +
  wetPenaltyKg

  return {
    aircraft: 'B737-800W',
    runwayCondition,
    flaps: selectedFlaps,

    toraM,
    slopePercent,
    windComponentKt,
    oatC,
    pressureAltitudeFt,

    packsOff,
    engineAntiIce,
    wingAntiIce,
    wetPenaltyKg,

    slopeCorrectedM: runway.slopeCorrectedM,
    correctedFieldLengthM: runway.correctedFieldLengthM,

    referenceFieldLimitKg:
      Math.round(referenceFieldLimitKg),

    fieldLimitCorrectionKg:
      configuration.fieldLimitCorrectionKg,

    fieldLimitWeightKg:
      Math.round(correctedFieldLimitKg),

    status: 'TRAINING_ONLY'
  }
}





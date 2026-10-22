
import { CONFIGURATION_CORRECTIONS as C } from './configurationCorrectionData.js'

/**
 * OPERDAT TRAINING
 * B737-800WSFP2
 *
 * Packs / Anti-Ice configuration corrections
 * TRAINING ONLY
 */

export function calculateConfigurationCorrections({
  packsOff = false,
  engineAntiIce = false,
  wingAntiIce = false
} = {}) {

  for (const [name, value] of Object.entries({
    packsOff,
    engineAntiIce,
    wingAntiIce
  })) {
    if (typeof value !== 'boolean') {
      throw new TypeError(`${name} must be boolean`)
    }
  }

  // Wing Anti-Ice requires Engine Anti-Ice.
  if (wingAntiIce && !engineAntiIce) {
    throw new Error(
      'Wing Anti-Ice cannot be selected without Engine Anti-Ice'
    )
  }

  // Combined Packs OFF + Anti-Ice corrections
  // require further FCOM verification.
  if (packsOff && engineAntiIce) {
    throw new Error(
      'Combined Packs OFF and Anti-Ice corrections not yet validated'
    )
  }

  let fieldLimitCorrectionKg = 0
  let climbLimitCorrectionKg = 0

  if (packsOff) {
    fieldLimitCorrectionKg = C.packsOff.fieldLimitKg
    climbLimitCorrectionKg = C.packsOff.climbLimitKg
  } else if (engineAntiIce && wingAntiIce) {
    fieldLimitCorrectionKg = C.engineAndWingAntiIce.fieldLimitKg
    climbLimitCorrectionKg = C.engineAndWingAntiIce.climbLimitKg
  } else if (engineAntiIce) {
    fieldLimitCorrectionKg = C.engineAntiIce.fieldLimitKg
    climbLimitCorrectionKg = C.engineAntiIce.climbLimitKg
  }

  return {
    packsOff,
    engineAntiIce,
    wingAntiIce,
    fieldLimitCorrectionKg,
    climbLimitCorrectionKg,
    status: 'TRAINING_ONLY'
  }
}

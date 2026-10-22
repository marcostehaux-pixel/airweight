
/**
 * OPERDAT TRAINING
 * Boeing 737-800WSFP2
 *
 * Performance Dispatch FCOM R49
 * Packs / Anti-Ice corrections
 *
 * TRAINING ONLY
 * Not approved for operational use.
 */

export const CONFIGURATION_CORRECTIONS = {
  packsOff: {
    fieldLimitKg: 400,
    climbLimitKg: 1500
  },

  engineAntiIce: {
    fieldLimitKg: -200,
    climbLimitKg: -250
  },

  engineAndWingAntiIce: {
    fieldLimitKg: -900,
    climbLimitKg: -1400
  }
}

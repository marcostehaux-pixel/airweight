
/**
 * OPERDAT TRAINING
 * B737-800W — TAKEOFF CLIMB LIMIT
 *
 * Second Segment Climb
 *
 * Reference configuration:
 * PACKS ON / ANTI-ICE OFF
 *
 * TRAINING ONLY — NOT FOR OPERATIONAL USE
 */

export const CLIMB_LIMIT_CONFIG = {
  aircraft: 'B737-800W',

  calculation: 'SECOND_SEGMENT_CLIMB',

  referenceConfiguration: {
    packs: 'ON',
    engineAntiIce: false,
    wingAntiIce: false
  },

  supportedFlaps: [1, 5, 10, 15, 25],

  inputs: {
    oatC: {
      unit: 'C',
      minimum: -60,
      maximum: 70
    },

    pressureAltitudeFt: {
      unit: 'FT',
      minimum: -2000,
      maximum: 10000
    }
  },

  corrections: {
    1: {
      packsOffKg: 1450,
      engineAntiIceKg: -300,
      engineAndWingAntiIceKg: -1700
    },

    5: {
      packsOffKg: 1350,
      engineAntiIceKg: -300,
      engineAndWingAntiIceKg: -1650
    },

    10: {
      packsOffKg: 1300,
      engineAntiIceKg: -250,
      engineAndWingAntiIceKg: -1600
    },

    15: {
      packsOffKg: 1250,
      engineAntiIceKg: -250,
      engineAndWingAntiIceKg: -1550
    },

    25: {
      packsOffKg: 1200,
      engineAntiIceKg: -250,
      engineAndWingAntiIceKg: -1500
    }
  },

  // Reference matrices will be added after
  // reading and checking the FPPM charts.
  referencePoints: {
    1: [],
    5: [],
    10: [],
    15: [],
    25: []
  },

  status: 'TRAINING_ONLY',
  operationalUsePermitted: false
}


import {
  calculateObstacleHeightDistance
} from './obstacleHeightDistanceEngine.js'

import {
  calculateObstacleCorrections
} from './obstacleCorrectionEngine.js'

import {
  OBSTACLE_LIMIT_FLAP5
} from './obstacleLimitFlap5Data.js'

import {
  OBSTACLE_LIMIT_FLAP10
} from './obstacleLimitFlap10Data.js'

import {
  OBSTACLE_LIMIT_FLAP15
} from './obstacleLimitFlap15Data.js'

import {
  OBSTACLE_LIMIT_FLAP25
} from './obstacleLimitFlap25Data.js'

/**
 * OPERDAT TRAINING
 * B737-800W — OBSTACLE LIMIT ENGINE
 *
 * FLAPS 1 AND 5
 * SIMULATED TRAINING PERFORMANCE DATA.
 *
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

const MAX_TRAINING_WEIGHT_KG = 86100

const FLAP_CORRECTIONS = {
  1: {
    packsOff: 600,
    engineAntiIce: -300,
    engineAndWingAntiIce: -1700
  },
  5: OBSTACLE_LIMIT_FLAP5.configurationCorrectionsKg,
  10: OBSTACLE_LIMIT_FLAP10.configurationCorrectionsKg,
  15: OBSTACLE_LIMIT_FLAP15.configurationCorrectionsKg,
  25: OBSTACLE_LIMIT_FLAP25.configurationCorrectionsKg
}

export function calculateObstacleLimit({
  flaps = 1,
  obstacleHeightFt,
  distanceFromBrakeReleaseM,
  oatC,
  pressureAltitudeFt,
  windComponentKt = 0,
  packsOff = false,
  engineAntiIce = false,
  wingAntiIce = false
}) {
  const selectedFlaps = Number(flaps)

  const corrections = FLAP_CORRECTIONS[selectedFlaps]

  if (!corrections) {
    throw new Error(
      'OBSTACLE LIMIT: unsupported flaps configuration'
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

  // 1. Height / Distance reference.
  const heightDistance =
    calculateObstacleHeightDistance({
      flaps: selectedFlaps,
      obstacleHeightFt,
      distanceFromBrakeReleaseM
    })

  // 2. OAT / PA / Wind corrections.
  const atmospheric =
    calculateObstacleCorrections({
      referenceWeightKg:
        heightDistance.referenceWeightKg,
      oatC,
      pressureAltitudeFt,
      windComponentKt
    })

  // 3. Aircraft configuration corrections.
  let configurationCorrectionKg = 0

  if (packsOff) {
    configurationCorrectionKg +=
      corrections.packsOff
  }

  if (engineAntiIce && wingAntiIce) {
    configurationCorrectionKg +=
      corrections.engineAndWingAntiIce
  } else if (engineAntiIce) {
    configurationCorrectionKg +=
      corrections.engineAntiIce
  }

  // 4. Final simulated obstacle-limit weight.
  const rawObstacleLimitKg =
    atmospheric.weightAfterWindKg +
    configurationCorrectionKg

  const obstacleLimitWeightKg = Math.round(
    Math.max(
      0,
      Math.min(
        MAX_TRAINING_WEIGHT_KG,
        rawObstacleLimitKg
      )
    )
  )

  return {
    aircraft: 'B737-800W',
    calculation: 'OBSTACLE_LIMIT',

    flaps: selectedFlaps,

    obstacleHeightFt: Number(obstacleHeightFt),
    distanceFromBrakeReleaseM:
      Number(distanceFromBrakeReleaseM),

    oatC: Number(oatC),
    pressureAltitudeFt: Number(pressureAltitudeFt),
    windComponentKt: Number(windComponentKt),

    packsOff,
    engineAntiIce,
    wingAntiIce,

    referenceWeightKg:
      heightDistance.referenceWeightKg,

    oatCorrectionKg:
      atmospheric.oatCorrectionKg,

    paCorrectionKg:
      atmospheric.paCorrectionKg,

    windCorrectionKg:
      atmospheric.windCorrectionKg,

    configurationCorrectionKg,

    obstacleLimitWeightKg,

    status: 'SIMULATED_TRAINING_DATA',
    operationalUsePermitted: false
  }
}

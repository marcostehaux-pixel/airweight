
/**
 * OPERDAT TRAINING
 * B737-800W — OBSTACLE HEIGHT / DISTANCE
 *
 * FLAPS 1 AND 5
 * SIMULATED TRAINING DATA.
 * NOT FOR OPERATIONAL USE.
 */

import {
  OBSTACLE_LIMIT_FLAP1
} from './obstacleLimitFlap1Data.js'

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

const FLAP_DATA = {
  1: OBSTACLE_LIMIT_FLAP1,
  5: OBSTACLE_LIMIT_FLAP5,
  10: OBSTACLE_LIMIT_FLAP10,
  15: OBSTACLE_LIMIT_FLAP15,
  25: OBSTACLE_LIMIT_FLAP25
}

function interpolate(x, x1, x2, y1, y2) {
  if (x1 === x2) return y1

  return y1 +
    ((x - x1) / (x2 - x1)) * (y2 - y1)
}

function interpolateDistance(points, distanceM) {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]

    if (
      distanceM >= a.distanceM &&
      distanceM <= b.distanceM
    ) {
      return interpolate(
        distanceM,
        a.distanceM,
        b.distanceM,
        a.referenceWeightKg,
        b.referenceWeightKg
      )
    }
  }

  throw new Error('OUT OF CHART RANGE')
}

export function calculateObstacleHeightDistance({
  flaps = 1,
  obstacleHeightFt,
  distanceFromBrakeReleaseM
}) {
  const selectedFlaps = Number(flaps)
  const height = Number(obstacleHeightFt)
  const distance = Number(distanceFromBrakeReleaseM)

  const data = FLAP_DATA[selectedFlaps]

  if (!data) {
    throw new Error('Unsupported OBSTACLE LIMIT flaps')
  }

  const grid = data.heightDistanceGrid
  const heights = data.modelParameters.heightsFt
  const distances = data.modelParameters.distancesM

  if (
    obstacleHeightFt === '' ||
    obstacleHeightFt == null ||
    distanceFromBrakeReleaseM === '' ||
    distanceFromBrakeReleaseM == null ||
    !Number.isFinite(height) ||
    !Number.isFinite(distance) ||
    height < heights[0] ||
    height > heights[heights.length - 1] ||
    distance < distances[0] ||
    distance > distances[distances.length - 1]
  ) {
    throw new Error('OUT OF CHART RANGE')
  }

  for (let i = 0; i < grid.length - 1; i++) {
    const lower = grid[i]
    const upper = grid[i + 1]

    if (
      height >= lower.obstacleHeightFt &&
      height <= upper.obstacleHeightFt
    ) {
      const lowerWeight = interpolateDistance(
        lower.points,
        distance
      )

      const upperWeight = interpolateDistance(
        upper.points,
        distance
      )

      return {
        aircraft: 'B737-800W',
        calculation: 'OBSTACLE_HEIGHT_DISTANCE',
        flaps: selectedFlaps,
        obstacleHeightFt: height,
        distanceFromBrakeReleaseM: distance,
        referenceWeightKg: Math.round(
          interpolate(
            height,
            lower.obstacleHeightFt,
            upper.obstacleHeightFt,
            lowerWeight,
            upperWeight
          )
        ),
        status: 'SIMULATED_TRAINING_DATA',
        operationalUsePermitted: false
      }
    }
  }

  throw new Error('OUT OF CHART RANGE')
}



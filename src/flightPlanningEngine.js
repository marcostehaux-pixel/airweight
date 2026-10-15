
/**
 * OPERDAT TRAINING
 * Simulated Flight Planning Engine
 *
 * NOT FOR OPERATIONAL USE
 */

// Preliminary training calculation.
// Negative wind = headwind.
// Positive wind = tailwind.

export function calculateAirDistance({
  groundDistance,
  averageWind,
  referenceTAS = 450
}) {
  const distance = Number(groundDistance);
  const wind = Number(averageWind);
  const tas = Number(referenceTAS);

  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(wind) ||
    !Number.isFinite(tas) ||
    distance <= 0 ||
    tas <= 0 ||
    tas + wind <= 0
  ) {
    return null;
  }

  const groundSpeed = tas + wind;

  const estimatedTime = distance / groundSpeed;

  const airDistance = estimatedTime * tas;

  return {
    groundDistance: distance,
    averageWind: wind,
    referenceTAS: tas,
    estimatedGroundSpeed: groundSpeed,
    estimatedTimeHours: estimatedTime,
    airDistance: Math.round(airDistance)
  };
}

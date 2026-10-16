import {
  B737_LRC_REFERENCE,
  B737_FUEL_ADJUSTMENTS,
  B737_HOLDING_REFERENCE
} from './b737TrainingPerformance.js';
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
/**
 * OPERDAT TRAINING
 * Preliminary simulated trip fuel calculation.
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateTripFuel({
  estimatedTimeHours,
  referenceFuelFlow = 2500
}) {
  const time = Number(estimatedTimeHours);
  const fuelFlow = Number(referenceFuelFlow);

  if (
    !Number.isFinite(time) ||
    !Number.isFinite(fuelFlow) ||
    time <= 0 ||
    fuelFlow <= 0
  ) {
    return null;
  }

  const tripFuel = time * fuelFlow;

  return {
    estimatedTimeHours: time,
    referenceFuelFlow: fuelFlow,
    tripFuel: Math.round(tripFuel)
  };
}
/**
 * OPERDAT TRAINING
 * B737-800 Long Range Cruise
 * Fuel & Time interpolation
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateLRCTrip({
  airDistance,
  cruiseLevel
}) {
  const distance = Number(airDistance);
  const level = Number(cruiseLevel);

  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(level) ||
    distance < 200 ||
    distance > 5000 ||
    level < 290 ||
    level > 370
  ) {
    return null;
  }

  const distances = Object.keys(B737_LRC_REFERENCE)
    .map(Number)
    .sort((a, b) => a - b);

  const levels = [290, 310, 330, 350, 370];

  const findBounds = (value, values) => {
    const lower = [...values]
      .reverse()
      .find(v => v <= value);

    const upper = values.find(v => v >= value);

    return [lower, upper];
  };

  const interpolate = (x, x1, x2, y1, y2) => {
    if (x1 === x2) return y1;

    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
  };

  const [d1, d2] = findBounds(distance, distances);
  const [l1, l2] = findBounds(level, levels);

  const getValues = (d, l) =>
    B737_LRC_REFERENCE[d][l];

  const [fuel11, time11] = getValues(d1, l1);
  const [fuel12, time12] = getValues(d1, l2);
  const [fuel21, time21] = getValues(d2, l1);
  const [fuel22, time22] = getValues(d2, l2);

  const fuelAtD1 = interpolate(
    level, l1, l2, fuel11, fuel12
  );

  const fuelAtD2 = interpolate(
    level, l1, l2, fuel21, fuel22
  );

  const timeAtD1 = interpolate(
    level, l1, l2, time11, time12
  );

  const timeAtD2 = interpolate(
    level, l1, l2, time21, time22
  );

  return {
    referenceTripFuel: Math.round(
      interpolate(distance, d1, d2, fuelAtD1, fuelAtD2)
    ),

    referenceTripTimeMinutes: Math.round(
      interpolate(distance, d1, d2, timeAtD1, timeAtD2)
    ),

    airDistance: distance,
    cruiseLevel: level,
    model: 'B737-800 LRC TRAINING'
  };
}
/**
 * OPERDAT TRAINING
 * B737-800 Fuel Required Adjustments
 *
 * Bilinear interpolation.
 * NOT FOR OPERATIONAL USE
 */

export function calculateFuelAdjustment({
  referenceTripFuel,
  landingWeight
}) {
  const fuel = Number(referenceTripFuel);
  const weight = Number(landingWeight);

  if (
    !Number.isFinite(fuel) ||
    !Number.isFinite(weight) ||
    fuel < 2000 ||
    fuel > 32000 ||
    weight < 40000 ||
    weight > 70000
  ) {
    return null;
  }

  const fuelValues = Object.keys(B737_FUEL_ADJUSTMENTS)
    .map(Number)
    .sort((a, b) => a - b);

  const weightValues = [
    40000, 45000, 50000, 55000,
    60000, 65000, 70000
  ];

  const getBounds = (value, values) => {
    const lower = [...values].reverse()
      .find(v => v <= value);

    const upper = values.find(v => v >= value);

    return [lower, upper];
  };

  const interpolate = (x, x1, x2, y1, y2) => {
    if (x1 === x2) return y1;

    return y1 + (y2 - y1) *
      (x - x1) / (x2 - x1);
  };

  const [f1, f2] = getBounds(fuel, fuelValues);
  const [w1, w2] = getBounds(weight, weightValues);

  const adjustment = (f, w) =>
    B737_FUEL_ADJUSTMENTS[f][w / 1000];

  const adjustmentAtF1 = interpolate(
    weight, w1, w2,
    adjustment(f1, w1),
    adjustment(f1, w2)
  );

  const adjustmentAtF2 = interpolate(
    weight, w1, w2,
    adjustment(f2, w1),
    adjustment(f2, w2)
  );

  const fuelAdjustment = Math.round(
    interpolate(
      fuel, f1, f2,
      adjustmentAtF1,
      adjustmentAtF2
    )
  );

  return {
    referenceTripFuel: fuel,
    landingWeight: weight,
    fuelAdjustment,
    adjustedTripFuel: Math.round(fuel + fuelAdjustment),
    model: 'B737-800 LRC TRAINING'
  };
}
/**
 * OPERDAT TRAINING
 * Simulated Contingency Fuel
 *
 * Training criterion:
 * Greater of 5% Trip Fuel or 5 minutes holding.
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateContingencyFuel({
  tripFuel,
  contingencyPercent = 5,
  holdingFuelFlow
}) {
  const fuel = Number(tripFuel);
  const percent = Number(contingencyPercent);

  const hasHoldingFlow =
    holdingFuelFlow !== undefined &&
    holdingFuelFlow !== null &&
    holdingFuelFlow !== '';

  const flow = hasHoldingFlow
    ? Number(holdingFuelFlow)
    : null;

  if (
    !Number.isFinite(fuel) ||
    !Number.isFinite(percent) ||
    fuel < 0 ||
    percent < 0 ||
    percent > 100 ||
    (hasHoldingFlow &&
      (!Number.isFinite(flow) || flow <= 0))
  ) {
    return null;
  }

  const percentageFuel = Math.round(
    fuel * percent / 100
  );

  const fiveMinuteHoldingFuel = hasHoldingFlow
    ? Math.round(flow * 5 / 60)
    : null;

  const contingencyFuel = hasHoldingFlow
    ? Math.max(percentageFuel, fiveMinuteHoldingFuel)
    : percentageFuel;

  return {
    tripFuel: fuel,
    contingencyPercent: percent,
    percentageFuel,
    fiveMinuteHoldingFuel,
    contingencyFuel,
    criterion: hasHoldingFlow
      ? (fiveMinuteHoldingFuel > percentageFuel
          ? '5_MIN_HOLDING'
          : 'PERCENTAGE')
      : 'PERCENTAGE_ONLY_PRELIMINARY',
    model: 'B737-800 TRAINING'
  };
  
}
/**
 * OPERDAT TRAINING
 * B737-800 Simulated Holding Fuel
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateHoldingFuel({
  holdingMinutes,
  holdingFuelFlow
}) {
  const minutes = Number(holdingMinutes);
  const flow = Number(holdingFuelFlow);

  if (
    !Number.isFinite(minutes) ||
    !Number.isFinite(flow) ||
    minutes < 0 ||
    flow <= 0
  ) {
    return null;
  }

  return {
    holdingMinutes: minutes,
    holdingFuelFlow: flow,
    holdingFuel: Math.round(
      (minutes / 60) * flow
    ),
    model: 'B737-800 HOLDING TRAINING'
  };
}
/**
 * OPERDAT TRAINING
 * B737-800 Holding Fuel Flow
 *
 * Bilinear interpolation by aircraft weight
 * and pressure altitude.
 *
 * No extrapolation.
 * No interpolation through missing table cells.
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateHoldingFuelFlow({
  aircraftWeight,
  pressureAltitude
}) {
  const weight = Number(aircraftWeight) / 1000;
  const altitude = Number(pressureAltitude);

  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(altitude)
  ) {
    return null;
  }

  const table = B737_HOLDING_REFERENCE;

  const weights = Object.keys(table.data)
    .map(Number)
    .sort((a, b) => a - b);

  const altitudes = table.altitudes;

  function getBounds(values, target) {
    if (
      target < values[0] ||
      target > values[values.length - 1]
    ) {
      return null;
    }

    const lower = [...values]
      .reverse()
      .find(value => value <= target);

    const upper = values.find(
      value => value >= target
    );

    return [lower, upper];
  }

  const weightBounds = getBounds(weights, weight);
  const altitudeBounds = getBounds(
    altitudes,
    altitude
  );

  if (!weightBounds || !altitudeBounds) {
    return null;
  }

  const [w1, w2] = weightBounds;
  const [a1, a2] = altitudeBounds;

  function getFuelFlow(w, a) {
    const altitudeIndex = altitudes.indexOf(a);
    return table.data[w]?.[altitudeIndex];
  }

  const q11 = getFuelFlow(w1, a1);
  const q12 = getFuelFlow(w1, a2);
  const q21 = getFuelFlow(w2, a1);
  const q22 = getFuelFlow(w2, a2);

  if (
    [q11, q12, q21, q22].some(
      value => !Number.isFinite(value)
    )
  ) {
    return null;
  }

  function interpolate(x, x1, x2, y1, y2) {
    if (x1 === x2) return y1;

    return y1 +
      ((x - x1) / (x2 - x1)) *
      (y2 - y1);
  }

  const lowerFlow = interpolate(
    altitude, a1, a2, q11, q12
  );

  const upperFlow = interpolate(
    altitude, a1, a2, q21, q22
  );

  const holdingFuelFlow = Math.round(
    interpolate(
      weight, w1, w2, lowerFlow, upperFlow
    )
  );

  return {
    aircraftWeight: Number(aircraftWeight),
    pressureAltitude: altitude,
    holdingFuelFlow,
    fuelFlowUnit: 'KG_PER_HOUR',
    includesRacetrackAllowance: true,
    model: 'B737-800 HOLDING TRAINING'
  };
}
/**
 * OPERDAT TRAINING
 * Simulated Contingency Fuel Planning
 *
 * Greater of:
 * - 5% of Trip Fuel
 * - 5 minutes of holding fuel
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculatePlannedContingencyFuel({
  tripFuel,
  aircraftWeight,
  pressureAltitude = 1500
}) {
  const holdingReference = calculateHoldingFuelFlow({
    aircraftWeight,
    pressureAltitude
  });

  if (!holdingReference) {
    return null;
  }

  const contingency = calculateContingencyFuel({
    tripFuel,
    contingencyPercent: 5,
    holdingFuelFlow: holdingReference.holdingFuelFlow
  });

  if (!contingency) {
    return null;
  }

  return {
    ...contingency,
    aircraftWeight,
    pressureAltitude,
    holdingFuelFlow: holdingReference.holdingFuelFlow,
    model: 'B737-800 CONTINGENCY TRAINING'
  };
}
/**
 * OPERDAT TRAINING
 * Preliminary Alternate Fuel Estimate
 *
 * Simplified training model.
 * NOT FOR OPERATIONAL USE
 */

export function calculateAlternateFuel({
  alternateDistance,
  averageGroundSpeed,
  alternateFuelFlow
}) {
  const distance = Number(alternateDistance);
  const speed = Number(averageGroundSpeed);
  const flow = Number(alternateFuelFlow);

  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(speed) ||
    !Number.isFinite(flow) ||
    distance <= 0 ||
    speed <= 0 ||
    flow <= 0
  ) {
    return null;
  }

  const flightTimeHours = distance / speed;

  return {
    alternateDistance: distance,
    alternateTimeMinutes: Math.round(
      flightTimeHours * 60
    ),
    alternateFuel: Math.round(
      flightTimeHours * flow
    ),
    model: 'B737-800 ALTERNATE TRAINING — PRELIMINARY'
  };
}
/**
 * OPERDAT TRAINING
 * Estimated Holding Aircraft Weight
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateHoldingWeight({
  zeroFuelWeight,
  remainingFuel
}) {
  const zfw = Number(zeroFuelWeight);
  const fuel = Number(remainingFuel);

  if (
    zeroFuelWeight === '' ||
    zeroFuelWeight == null ||
    remainingFuel === '' ||
    remainingFuel == null ||
    !Number.isFinite(zfw) ||
    !Number.isFinite(fuel) ||
    zfw <= 0 ||
    fuel < 0
  ) {
    return null;
  }

  return {
    zeroFuelWeight: zfw,
    remainingFuel: fuel,
    holdingWeight: Math.round(zfw + fuel),
    model: 'B737-800 HOLDING WEIGHT TRAINING'
  };
}
/**
 * OPERDAT TRAINING
 * Preliminary Alternate Holding Fuel
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateAlternateHoldingFuel({
  zeroFuelWeight,
  remainingFuel,
  holdingMinutes,
  pressureAltitude
}) {
  const holdingWeightResult = calculateHoldingWeight({
    zeroFuelWeight,
    remainingFuel
  });

  if (!holdingWeightResult) {
    return null;
  }

  const holdingFlowResult = calculateHoldingFuelFlow({
    aircraftWeight: holdingWeightResult.holdingWeight,
    pressureAltitude
  });

  if (!holdingFlowResult) {
    return null;
  }

  const holdingFuelResult = calculateHoldingFuel({
    holdingMinutes,
    holdingFuelFlow: holdingFlowResult.holdingFuelFlow
  });

  if (!holdingFuelResult) {
    return null;
  }

  return {
    zeroFuelWeight: holdingWeightResult.zeroFuelWeight,
    remainingFuel: holdingWeightResult.remainingFuel,
    holdingWeight: holdingWeightResult.holdingWeight,
    pressureAltitude: Number(pressureAltitude),
    holdingMinutes: holdingFuelResult.holdingMinutes,
    holdingFuelFlow: holdingFlowResult.holdingFuelFlow,
    holdingFuel: holdingFuelResult.holdingFuel,
    model: 'B737-800 ALTERNATE HOLDING TRAINING',
    preliminary: true
  };
}
/**
 * OPERDAT TRAINING
 * Fuel Planning Distribution
 *
 * SIMULATED FLIGHT PLAN
 * NOT FOR OPERATIONAL USE
 */

export function calculateFuelDistribution({
  tripFuel,
  contingencyFuel,
  alternateFuel,
  holdingFuel,
  etopsFuel = 0,
  ballastFuel = 0,
  policyFuel = 0,
  storedFuel = 0,
  taxiFuel = 0,
  extraFuel = 0
}) {
  const values = [
    tripFuel,
    contingencyFuel,
    alternateFuel,
    holdingFuel,
    etopsFuel,
    ballastFuel,
    policyFuel,
    storedFuel,
    taxiFuel,
    extraFuel
  ];

  if (
    values.some(
      (value) =>
        value === '' ||
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
    )
  ) {
    return null;
  }

  const [
    trip,
    contingency,
    alternate,
    holding,
    etops,
    ballast,
    policy,
    stored,
    taxi,
    extra
  ] = values.map(Number);

  const requiredFuel =
    trip +
    contingency +
    alternate +
    holding +
    etops +
    ballast +
    policy +
    stored;

  const totalFuel = requiredFuel + taxi + extra;

  // Fuel available at takeoff, after taxi consumption.
  const takeoffFuel = totalFuel - taxi;

  // Planned fuel remaining at destination.
  const destinationRemainingFuel = takeoffFuel - trip;

  // Planned fuel remaining at alternate, before holding.
  const alternateRemainingFuel =
    destinationRemainingFuel - alternate;

  // Planned fuel remaining after alternate holding.
  const afterHoldingFuel =
    alternateRemainingFuel - holding;

  return {
    requiredFuel,
    taxiFuel: taxi,
    extraFuel: extra,
    totalFuel,
    takeoffFuel,
    destinationRemainingFuel,
    alternateRemainingFuel,
    afterHoldingFuel,
    model: 'OPERDAT TRAINING FUEL DISTRIBUTION',
    simulated: true
  };
}
/**
 * OPERDAT TRAINING
 * Estimated Alternate Arrival Weight
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateAlternateArrivalWeight({
  zeroFuelWeight,
  alternateRemainingFuel
}) {
  const result = calculateHoldingWeight({
    zeroFuelWeight,
    remainingFuel: alternateRemainingFuel
  });

  if (!result) {
    return null;
  }

  return {
    zeroFuelWeight: result.zeroFuelWeight,
    alternateRemainingFuel: result.remainingFuel,
    alternateArrivalWeight: result.holdingWeight,
    model: 'B737-800 ALTERNATE ARRIVAL WEIGHT TRAINING',
    simulated: true
  };
}
/**
 * OPERDAT TRAINING
 * Average Aircraft Weight During Holding
 *
 * NOT FOR OPERATIONAL USE
 */

export function calculateAverageHoldingWeight({
  initialWeight,
  holdingFuel
}) {
  if (
    initialWeight === '' ||
    initialWeight == null ||
    holdingFuel === '' ||
    holdingFuel == null
  ) {
    return null;
  }

  const weight = Number(initialWeight);
  const fuel = Number(holdingFuel);

  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(fuel) ||
    weight <= 0 ||
    fuel < 0 ||
    fuel > weight
  ) {
    return null;
  }

  return {
    initialWeight: weight,
    holdingFuel: fuel,
    finalWeight: Math.round(weight - fuel),
    averageHoldingWeight: Math.round(weight - fuel / 2),
    model: 'B737-800 AVERAGE HOLDING WEIGHT TRAINING',
    simulated: true
  };
}
/**
 * OPERDAT TRAINING
 * Iterative Alternate Holding Fuel
 *
 * SIMULATED FLIGHT PLAN
 * NOT FOR OPERATIONAL USE
 */

export function calculateIterativeHoldingFuel({
  zeroFuelWeight,
  remainingReserveFuel = 0,
  holdingMinutes,
  pressureAltitude
}) {
  const zfw = Number(zeroFuelWeight);
  const reserve = Number(remainingReserveFuel);
  const minutes = Number(holdingMinutes);
  const altitude = Number(pressureAltitude);

  if (
    [zeroFuelWeight, remainingReserveFuel, holdingMinutes, pressureAltitude]
      .some(value => value === '' || value == null) ||
    ![zfw, reserve, minutes, altitude].every(Number.isFinite) ||
    zfw <= 0 ||
    reserve < 0 ||
    minutes <= 0 ||
    altitude < 0
  ) {
    return null;
  }

  let holdingFuel = 0;
  let iterations = 0;
  let converged = false;

  for (let i = 0; i < 20; i++) {
    const initialWeight = zfw + reserve + holdingFuel;

    const averageWeight =
      initialWeight - holdingFuel / 2;

    const flowResult = calculateHoldingFuelFlow({
      aircraftWeight: averageWeight,
      pressureAltitude: altitude
    });

    if (!flowResult) {
      return null;
    }

    const fuelResult = calculateHoldingFuel({
      holdingMinutes: minutes,
      holdingFuelFlow: flowResult.holdingFuelFlow
    });

    if (!fuelResult) {
      return null;
    }

    const newHoldingFuel = fuelResult.holdingFuel;

    iterations = i + 1;

    if (Math.abs(newHoldingFuel - holdingFuel) < 1) {
      holdingFuel = newHoldingFuel;
      converged = true;
      break;
    }

    holdingFuel = newHoldingFuel;
  }

  if (!converged) {
    return null;
  }

  const initialHoldingWeight =
    zfw + reserve + holdingFuel;

  const finalHoldingWeight =
    zfw + reserve;

  return {
    holdingFuel: Math.round(holdingFuel),
    initialHoldingWeight: Math.round(initialHoldingWeight),
    averageHoldingWeight: Math.round(
      (initialHoldingWeight + finalHoldingWeight) / 2
    ),
    finalHoldingWeight: Math.round(finalHoldingWeight),
    iterations,
    converged,
    model: 'B737-800 ITERATIVE HOLDING TRAINING',
    simulated: true
  };
}

/**
 * OPERDAT — FLIGHT PLANNING TRAINING
 * Boeing 787-9 — Generic Training Model
 *
 * Reference exercise:
 * SKBO → KMIA
 * Alternate: KFLL
 *
 * Fuel figures are educational estimates.
 * NOT FOR OPERATIONAL USE.
 */

export const B787_TRAINING_REFERENCE = {
  aircraftType: 'B787-9',
  departure: 'SKBO',
  destination: 'KMIA',
  alternate: 'KFLL',

  referenceAirDistanceNm: 1429,
  referenceTripFuelKg: 15000,
  referenceTripTimeMinutes: 224,

  contingencyPercent: 5,
  alternateFuelKg: 1800,
  finalReserveFuelKg: 2500,
  taxiFuelKg: 600
};

/**
 * Preliminary trip fuel calculation.
 *
 * This first version is calibrated exclusively
 * for the SKBO-KMIA training exercise.
 *
 * No extrapolation to other routes.
 */

/**
 * OPERDAT — B787-9 TRAINING
 * Variable Trip Fuel — SKBO to KMIA
 *
 * Simplified educational model.
 * NOT FOR OPERATIONAL USE.
 */
export function calculateB787TripFuel({
  departure,
  destination,
  averageWind = 0,
  zeroFuelWeight = 170000,
  cruiseLevel = 370
}) {
  const reference = B787_TRAINING_REFERENCE;

  if (
    String(departure || '').trim().toUpperCase() !==
      reference.departure ||
    String(destination || '').trim().toUpperCase() !==
      reference.destination
  ) {
    return null;
  }

  const wind = Number(averageWind);
  const ezfw = Number(zeroFuelWeight);
  const level = Number(cruiseLevel);

  if (
    ![wind, ezfw, level].every(Number.isFinite) ||
    wind < -150 ||
    wind > 150 ||
    ezfw < 120000 ||
    ezfw > 200000 ||
    level < 290 ||
    level > 430
  ) {
    return null;
  }

  // Reference assumptions for training.
  const referenceTAS = 480; // kt
  const referenceEZFW = 170000; // kg
  const referenceLevel = 370; // FL370

  // Positive wind = tailwind.
  // Negative wind = headwind.
  const groundSpeed = referenceTAS + wind;

  if (groundSpeed <= 0) return null;

 // OPERDAT TRAINING — B787-9
// SKBO-KMIA provisional ground route distance
const groundDistanceNm = 1330;

const referenceTimeHours =
  groundDistanceNm / referenceTAS;

const estimatedTimeHours =
  groundDistanceNm / groundSpeed;

// Fuel correction relative to zero-wind conditions
const windFactor =
  estimatedTimeHours / referenceTimeHours;

  // Educational weight sensitivity:
  // +2.5% fuel for each additional 10,000 kg EZFW.
  const weightFactor =
    1 + ((ezfw - referenceEZFW) / 10000) * 0.025;

  // Educational cruise-level efficiency:
  // minimum around FL370 for reference weight.
  // Other levels introduce a modest penalty.
  const levelDifference =
    Math.abs(level - referenceLevel);

  const levelFactor =
    1 + (levelDifference / 20) * 0.012;

  const tripFuel = Math.round(
    reference.referenceTripFuelKg *
    windFactor *
    weightFactor *
    levelFactor
  );

  const estimatedTripTimeMinutes = Math.round(
    estimatedTimeHours * 60
  );

  return {
   groundDistance: groundDistanceNm,

airDistance: Math.round(
  referenceTAS * estimatedTimeHours
),

    referenceTripFuel: tripFuel,
referenceTripTimeMinutes: estimatedTripTimeMinutes,
estimatedTripTimeMinutes,

    averageWind: wind,
    zeroFuelWeight: ezfw,
    cruiseLevel: level,

    windFactor,
    weightFactor,
    levelFactor,

    model: 'B787-9 VARIABLE TRAINING',
    simulated: true,
    operationalUse: false
  };
}

/**
 * OPERDAT — B787-9 TRAINING
 * Variable Fuel Planning — SKBO / KMIA / KFLL
 *
 * Educational estimates only.
 * NOT FOR OPERATIONAL USE.
 */
export function calculateB787FuelPlan({
  departure,
  destination,
  alternate,
  averageWind = 0,
  zeroFuelWeight = 170000,
  cruiseLevel = 370,
  taxiFuelKg = NaN,
holdingFuelKg = 0,
extraFuelKg = 0,
tankeringFuelKg = 0,
etopsFuelKg = 0,
ballastFuelKg = 0,
policyFuelKg = 0
}) {
  const reference = B787_TRAINING_REFERENCE;

  if (
    String(alternate || '').trim().toUpperCase() !==
    reference.alternate
  ) {
    return null;
  }

  const trip = calculateB787TripFuel({
    departure,
    destination,
    averageWind,
    zeroFuelWeight,
    cruiseLevel
  });

  if (!trip) return null;

  const tripFuel = trip.referenceTripFuel;

  const contingencyFuel = Math.round(
    tripFuel * reference.contingencyPercent / 100
  );

  // Provisional educational assumptions.
  const alternateFuel = reference.alternateFuelKg;
  const finalReserveFuel = reference.finalReserveFuelKg;
  const taxiFuel = Number(taxiFuelKg);
if (
  !Number.isFinite(taxiFuel) ||
  taxiFuel < 0
) {
  return null;
}
  // OPERDAT TRAINING — B787-9 FUEL DISTRIBUTION

const additionalFuelValues = [
  holdingFuelKg,
  extraFuelKg,
  tankeringFuelKg,
  etopsFuelKg,
  ballastFuelKg,
  policyFuelKg
].map(Number);

// Validate additional fuel inputs
if (
  additionalFuelValues.some(
    value => !Number.isFinite(value) || value < 0
  )
) {
  return null;
}

const [
  holdingFuel,
  extraFuel,
  tankeringFuel,
  etopsFuel,
  ballastFuel,
  policyFuel
] = additionalFuelValues;

// Minimum required fuel
const requiredFuel =
  tripFuel +
  contingencyFuel +
  alternateFuel +
  finalReserveFuel +
  holdingFuel;

// Total fuel including optional additions
const blockFuel =
  requiredFuel +
  taxiFuel +
  extraFuel +
  tankeringFuel +
  etopsFuel +
  ballastFuel +
  policyFuel;

// Takeoff fuel excludes TAXI / APU only
const takeoffFuel = blockFuel - taxiFuel;

  const destinationRemainingFuel =
    takeoffFuel - tripFuel;

  const alternateRemainingFuel =
    destinationRemainingFuel - alternateFuel;

  return {
    departure: reference.departure,
    destination: reference.destination,
    alternate: reference.alternate,

    averageWind: Number(averageWind),
    zeroFuelWeight: Number(zeroFuelWeight),
    cruiseLevel: Number(cruiseLevel),

    airDistance: trip.airDistance,
    estimatedTripTimeMinutes:
      trip.referenceTripTimeMinutes,

   tripFuel,
contingencyFuel,
alternateFuel,
alternateTimeMinutes: 15,
finalReserveFuel,
holdingFuel,
taxiFuel,
extraFuel,
tankeringFuel,
etopsFuel,
ballastFuel,
policyFuel,

    requiredFuel,
    blockFuel,
    totalFuel: blockFuel,
    takeoffFuel,

    destinationRemainingFuel,
    alternateRemainingFuel,

    estimatedTakeoffWeight:
      Number(zeroFuelWeight) + takeoffFuel,

    estimatedLandingWeight:
      Number(zeroFuelWeight) + destinationRemainingFuel,

    model: 'B787-9 VARIABLE FUEL PLANNING TRAINING',
    simulated: true,
    operationalUse: false
  };
}
// OPERDAT TRAINING — B787-9 HOLDING FUEL
// Provisional training model.
// NOT FOR OPERATIONAL USE.

export function calculateB787HoldingFuel({
  holdingTimeMinutes = 0
} = {}) {
  const holdingFuelFlowKgHour = 3850;
  const minutes = Number(holdingTimeMinutes);

  if (
    !Number.isFinite(minutes) ||
    minutes < 0 ||
    minutes > 180
  ) {
    return null;
  }

  return {
    holdingFuel: Math.round(
      (holdingFuelFlowKgHour / 60) * minutes
    ),
    holdingTimeMinutes: minutes,
    holdingFuelFlowKgHour,
    simulated: true,
    operationalUse: false
  };
}

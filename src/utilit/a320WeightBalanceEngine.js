
/**
 * OPERDAT Training
 * Airbus A320 - Weight & Balance Engine
 *
 * Generic training configuration.
 * NOT FOR OPERATIONAL USE.
 *
 * Geometric references:
 * Airbus A320 Weight and Balance Manual
 * Section 1.00.06
 */

export const A320_REFERENCE = {
  macMeters: 4.1935,
  lemacMeters: 17.8015,
  referenceArm25: 18.849875
};

/**
 * Convert longitudinal arm (meters)
 * to percent reference chord (%MAC).
 */
export function a320ArmToMac(armMeters) {
  if (!Number.isFinite(armMeters)) {
    throw new Error("Invalid A320 arm");
  }

  return (
    (armMeters - A320_REFERENCE.lemacMeters) /
    A320_REFERENCE.macMeters
  ) * 100;
}

/**
 * Convert %MAC to longitudinal arm (meters).
 */
export function a320MacToArm(macPercent) {
  if (!Number.isFinite(macPercent)) {
    throw new Error("Invalid A320 CG");
  }

  return (
    A320_REFERENCE.lemacMeters +
    (macPercent / 100) * A320_REFERENCE.macMeters
  );
}

/**
 * Calculate total weight, moment, CG arm and %MAC.
 *
 * Each item must contain:
 * { weightKg, armMeters }
 */
export function calculateA320Balance(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("A320 balance requires load items");
  }

  let totalWeightKg = 0;
  let totalMomentKgM = 0;

  for (const item of items) {
    const { weightKg, armMeters } = item;

    if (
      !Number.isFinite(weightKg) ||
      weightKg < 0 ||
      !Number.isFinite(armMeters)
    ) {
      throw new Error("Invalid A320 load item");
    }

    totalWeightKg += weightKg;
    totalMomentKgM += weightKg * armMeters;
  }

  if (totalWeightKg <= 0) {
    throw new Error("Total A320 weight must be positive");
  }

  const cgArmMeters = totalMomentKgM / totalWeightKg;
  const cgMacPercent = a320ArmToMac(cgArmMeters);

  return {
    totalWeightKg,
    totalMomentKgM,
    cgArmMeters,
    cgMacPercent
  };
}

/**
 * A320 Y168 - Passenger zones
 * OPERDAT Training
 *
 * Arms must be supplied by the aircraft configuration.
 * NOT FOR OPERATIONAL USE.
 */

export const A320_PASSENGER_ZONES = {
  FWD: { firstRow: 1, lastRow: 9, capacity: 54 },
  MID: { firstRow: 10, lastRow: 19, capacity: 60 },
  AFT: { firstRow: 20, lastRow: 28, capacity: 54 }
};

/**
 * Calculate passenger weights and moments by cabin zone.
 *
 * zones: {
 *   FWD: { weightKg, armMeters },
 *   MID: { weightKg, armMeters },
 *   AFT: { weightKg, armMeters }
 * }
 */
export function calculateA320PassengerBalance(zones) {
  const results = {};
  let totalWeightKg = 0;
  let totalMomentKgM = 0;

  for (const zoneName of ["FWD", "MID", "AFT"]) {
    const zone = zones[zoneName];

    if (
      !zone ||
      !Number.isFinite(zone.weightKg) ||
      zone.weightKg < 0 ||
      !Number.isFinite(zone.armMeters)
    ) {
      throw new Error(`Invalid A320 passenger zone: ${zoneName}`);
    }

    const momentKgM = zone.weightKg * zone.armMeters;

    results[zoneName] = {
      weightKg: zone.weightKg,
      armMeters: zone.armMeters,
      momentKgM
    };

    totalWeightKg += zone.weightKg;
    totalMomentKgM += momentKgM;
  }

  return {
    zones: results,
    totalWeightKg,
    totalMomentKgM
  };
}

/**
 * Calculate A320 Zero Fuel Weight and CG.
 *
 * Includes basic aircraft, passengers and cargo.
 * Cargo may be an empty array during initial tests.
 *
 * NOT FOR OPERATIONAL USE.
 */
export function calculateA320ZFW({
  basicWeightKg,
  basicCgMac,
  passengerZones,
  cargoItems = []
}) {
  if (
    !Number.isFinite(basicWeightKg) ||
    basicWeightKg <= 0 ||
    !Number.isFinite(basicCgMac)
  ) {
    throw new Error("Invalid A320 basic configuration");
  }

  const basicArmMeters = a320MacToArm(basicCgMac);

  const passengerBalance =
    calculateA320PassengerBalance(passengerZones);

  if (!Array.isArray(cargoItems)) {
    throw new Error("Invalid A320 cargo items");
  }

  const items = [
    {
      weightKg: basicWeightKg,
      armMeters: basicArmMeters
    },
    ...Object.values(passengerBalance.zones).map(zone => ({
      weightKg: zone.weightKg,
      armMeters: zone.armMeters
    })),
    ...cargoItems
  ];

  const balance = calculateA320Balance(items);

  return {
    zfwKg: balance.totalWeightKg,
    zfwMomentKgM: balance.totalMomentKgM,
    zfwCgArmMeters: balance.cgArmMeters,
    zfwCgMacPercent: balance.cgMacPercent,
    passengerWeightKg: passengerBalance.totalWeightKg,
    passengerMomentKgM: passengerBalance.totalMomentKgM
  };
}

/**
 * A320 - Cargo compartments
 * Generic training configuration
 * NOT FOR OPERATIONAL USE
 */

export const A320_CARGO_COMPARTMENTS = {
  FWD1: { maxWeightKg: 3402 },
  AFT3: { maxWeightKg: 2426 },
  AFT4: { maxWeightKg: 2110 },
  BULK5: { maxWeightKg: 1497 }
};

/**
 * Calculate cargo weight and moment.
 *
 * Each compartment must provide:
 * { weightKg, armMeters }
 */
export function calculateA320CargoBalance(compartments) {
  let totalWeightKg = 0;
  let totalMomentKgM = 0;

  const results = {};

  for (const [name, config] of Object.entries(
    A320_CARGO_COMPARTMENTS
  )) {
    const item = compartments[name];

    if (
      !item ||
      !Number.isFinite(item.weightKg) ||
      item.weightKg < 0 ||
      item.weightKg > config.maxWeightKg ||
      !Number.isFinite(item.armMeters)
    ) {
      throw new Error(`Invalid A320 cargo: ${name}`);
    }

    const momentKgM = item.weightKg * item.armMeters;

    results[name] = {
      weightKg: item.weightKg,
      armMeters: item.armMeters,
      momentKgM
    };

    totalWeightKg += item.weightKg;
    totalMomentKgM += momentKgM;
  }

  return {
    compartments: results,
    totalWeightKg,
    totalMomentKgM
  };
}

/**
 * A320 - Fuel and flight weight balance
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 *
 * Fuel arms are supplied by the aircraft configuration.
 * This initial model uses a single equivalent fuel arm.
 */

export function calculateA320FlightBalance({
  zfwKg,
  zfwMomentKgM,
  takeoffFuelKg,
  tripFuelKg,
  fuelArmMeters
}) {
  const values = [
    zfwKg,
    zfwMomentKgM,
    takeoffFuelKg,
    tripFuelKg,
    fuelArmMeters
  ];

  if (
    values.some(value => !Number.isFinite(value)) ||
    zfwKg <= 0 ||
    takeoffFuelKg < 0 ||
    tripFuelKg < 0 ||
    tripFuelKg > takeoffFuelKg
  ) {
    throw new Error("Invalid A320 flight balance inputs");
  }

  const landingFuelKg = takeoffFuelKg - tripFuelKg;

  const tow = calculateA320Balance([
    {
      weightKg: zfwKg,
      armMeters: zfwMomentKgM / zfwKg
    },
    {
      weightKg: takeoffFuelKg,
      armMeters: fuelArmMeters
    }
  ]);

  const ldw = calculateA320Balance([
    {
      weightKg: zfwKg,
      armMeters: zfwMomentKgM / zfwKg
    },
    {
      weightKg: landingFuelKg,
      armMeters: fuelArmMeters
    }
  ]);

  return {
    towKg: tow.totalWeightKg,
    towCgMacPercent: tow.cgMacPercent,
    towMomentKgM: tow.totalMomentKgM,

    ldwKg: ldw.totalWeightKg,
    ldwCgMacPercent: ldw.cgMacPercent,
    ldwMomentKgM: ldw.totalMomentKgM,

    landingFuelKg
  };
}

/**
 * A320 - Structural weight limits
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */

export const A320_WEIGHT_LIMITS = {
  MZFW: 61000,
  MTOW: 77000,
  MLW: 64500,
  MRW: 77400
};

export function validateA320Weights({
  zfwKg,
  towKg,
  ldwKg,
  rampWeightKg
}) {
  const weights = {
    ZFW: { value: zfwKg, limit: A320_WEIGHT_LIMITS.MZFW },
    TOW: { value: towKg, limit: A320_WEIGHT_LIMITS.MTOW },
    LDW: { value: ldwKg, limit: A320_WEIGHT_LIMITS.MLW },
    RAMP: { value: rampWeightKg, limit: A320_WEIGHT_LIMITS.MRW }
  };

  const results = {};

  for (const [name, data] of Object.entries(weights)) {
    if (!Number.isFinite(data.value) || data.value < 0) {
      throw new Error(`Invalid A320 ${name} weight`);
    }

    results[name] = {
      weightKg: data.value,
      limitKg: data.limit,
      marginKg: data.limit - data.value,
      withinLimit: data.value <= data.limit
    };
  }

  return {
    weights: results,
    allWithinLimits: Object.values(results).every(
      result => result.withinLimit
    )
  };
}

/**
 * A320 - Longitudinal station configuration
 * OPERDAT Training
 *
 * Arms are expressed in meters using
 * the Airbus longitudinal reference system.
 *
 * NOT FOR OPERATIONAL USE
 */

export const A320_STATIONS = {
  
  passengers: {
    FWD: 12.1849,
    MID: 19.6154,
    AFT: 27.0920
  },


  
  cargo: {
    FWD1: 12.283,
    AFT3: 22.885,
    AFT4: 26.162,
    BULK5: 29.380
  },


  fuel: {
    LEFT_WING: null,
    RIGHT_WING: null,
    CENTER: null
  }
};

/**
 * Validate an A320 longitudinal station.
 * NOT FOR OPERATIONAL USE.
 */
export function getA320StationArm(armMeters, stationName) {
  if (
    typeof armMeters !== "number" ||
    !Number.isFinite(armMeters)
  ) {
    throw new Error(
      `A320 station not configured: ${stationName}`
    );
  }

  return armMeters;
}

/**
 * A320-232 Y168 - Passenger row arms
 * Source: Airbus WBM, section 1.40.04
 * Row 13: interpolated for OPERDAT Training.
 *
 * NOT FOR OPERATIONAL USE
 */
export const A320_PASSENGER_ROW_ARMS = {
  1: 8.939,
  2: 9.746,
  3: 10.559,
  4: 11.371,
  5: 12.184,
  6: 12.997,
  7: 13.810,
  8: 14.623,
  9: 15.435,
  10: 16.248,
  11: 17.195,
  12: 18.160,
  13: 18.563,
  14: 18.966,
  15: 19.779,
  16: 20.592,
  17: 21.404,
  18: 22.217,
  19: 23.030,
  20: 23.843,
  21: 24.656,
  22: 25.468,
  23: 26.281,
  24: 27.094,
  25: 27.907,
  26: 28.720,
  27: 29.532,
  28: 30.327
};

/**
 * A320 Y168 - Passenger zone capacity validation
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function validateA320PassengerCapacity(zones) {
  const results = {};

  for (const [name, config] of Object.entries(
    A320_PASSENGER_ZONES
  )) {
    const count = zones[name];

    if (
      !Number.isInteger(count) ||
      count < 0
    ) {
      throw new Error(
        `Invalid A320 passenger count: ${name}`
      );
    }

    results[name] = {
      passengers: count,
      capacity: config.capacity,
      availableSeats: config.capacity - count,
      withinCapacity: count <= config.capacity
    };
  }

  const totalPassengers = Object.values(results)
    .reduce((sum, zone) => sum + zone.passengers, 0);

  return {
    zones: results,
    totalPassengers,
    totalCapacity: 168,
    allWithinCapacity: Object.values(results)
      .every(zone => zone.withinCapacity)
  };
}

/**
 * A320 Y168 - Passenger composition
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */

export const A320_PASSENGER_WEIGHTS = {
  AD: 84,
  CH: 42,
  INF: 20
};

export function calculateA320PassengerComposition({
  AD,
  CH,
  INF
}) {
  for (const [type, count] of Object.entries({ AD, CH, INF })) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Invalid A320 passenger count: ${type}`);
    }
  }

  const occupiedSeats = AD + CH;
  const totalPassengers = AD + CH + INF;

  return {
    adults: AD,
    children: CH,
    infants: INF,
    occupiedSeats,
    totalPassengers,
    totalWeightKg:
      AD * A320_PASSENGER_WEIGHTS.AD +
      CH * A320_PASSENGER_WEIGHTS.CH +
      INF * A320_PASSENGER_WEIGHTS.INF
  };
}

/**
 * A320 Y168 - Passenger distribution by cabin zone
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320PassengerZones(zones) {
  const results = {};
  let totalWeightKg = 0;
  let totalMomentKgM = 0;
  let totalPassengers = 0;
  let totalOccupiedSeats = 0;

  for (const [name, config] of Object.entries(
    A320_PASSENGER_ZONES
  )) {
    const composition = calculateA320PassengerComposition(
      zones[name]
    );

    if (composition.occupiedSeats > config.capacity) {
      throw new Error(
        `A320 passenger capacity exceeded: ${name}`
      );
    }

    const armMeters = getA320StationArm(
      A320_STATIONS.passengers[name],
      name
    );

    const momentKgM =
      composition.totalWeightKg * armMeters;

    results[name] = {
      ...composition,
      armMeters,
      momentKgM,
      capacity: config.capacity
    };

    totalWeightKg += composition.totalWeightKg;
    totalMomentKgM += momentKgM;
    totalPassengers += composition.totalPassengers;
    totalOccupiedSeats += composition.occupiedSeats;
  }

  return {
    zones: results,
    totalWeightKg,
    totalMomentKgM,
    totalPassengers,
    totalOccupiedSeats
  };
}

/**
 * A320 Y168 - ZFW from passenger distribution
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320ZFWFromPassengers({
  basicWeightKg,
  basicCgMac,
  passengerZones,
  cargoItems = []
}) {
  const passengers = calculateA320PassengerZones(
    passengerZones
  );

  const zfw = calculateA320ZFW({
    basicWeightKg,
    basicCgMac,
    passengerZones: {
      FWD: {
        weightKg: passengers.zones.FWD.totalWeightKg,
        armMeters: passengers.zones.FWD.armMeters
      },
      MID: {
        weightKg: passengers.zones.MID.totalWeightKg,
        armMeters: passengers.zones.MID.armMeters
      },
      AFT: {
        weightKg: passengers.zones.AFT.totalWeightKg,
        armMeters: passengers.zones.AFT.armMeters
      }
    },
    cargoItems
  });

  return {
    ...zfw,
    totalPassengers: passengers.totalPassengers,
    occupiedSeats: passengers.totalOccupiedSeats,
    passengerZones: passengers.zones
  };
}

/**
 * A320 Y168 - Cargo balance from aircraft configuration
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320ConfiguredCargo(weights) {
  const compartments = {};

  for (const name of Object.keys(A320_CARGO_COMPARTMENTS)) {
    const weightKg = weights[name];

    if (!Number.isFinite(weightKg) || weightKg < 0) {
      throw new Error(`Invalid A320 cargo weight: ${name}`);
    }

    compartments[name] = {
      weightKg,
      armMeters: getA320StationArm(
        A320_STATIONS.cargo[name],
        name
      )
    };
  }

  return calculateA320CargoBalance(compartments);
}

/**
 * A320-232 Y168 - Complete Zero Fuel Weight
 * Passengers + Cargo
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320CompleteZFW({
  basicWeightKg,
  basicCgMac,
  passengerZones,
  cargoWeights
}) {
  const cargo = calculateA320ConfiguredCargo(cargoWeights);

  const cargoItems = Object.values(cargo.compartments).map(
    (compartment) => ({
      weightKg: compartment.weightKg,
      armMeters: compartment.armMeters
    })
  );

  const result = calculateA320ZFWFromPassengers({
    basicWeightKg,
    basicCgMac,
    passengerZones,
    cargoItems
  });

  return {
    ...result,
    cargoWeightKg: cargo.totalWeightKg,
    cargoMomentKgM: cargo.totalMomentKgM,
    cargoCompartments: cargo.compartments
  };
}

/**
 * A320-232 Y168 - Fuel tank capacities
 * Reference configuration: 3 tanks, no ACT
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export const A320_FUEL_TANKS = {
  LEFT_WING: {
    maxWeightKg: 6243.5,
    armMeters: null
  },
  RIGHT_WING: {
    maxWeightKg: 6243.5,
    armMeters: null
  },
  CENTER: {
    maxWeightKg: 6600,
    armMeters: null
  }
};

/**
 * A320-231 Y168 - Fuel Index Correction
 * Source: Balance & Trim Chart
 * Reference data for OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export const A320_FUEL_INDEX_TABLE = [
  [3500, 1],
  [4000, 1],
  [4500, 0],
  [5000, 0],
  [5500, -1],
  [6000, -1],
  [6500, -2],
  [7000, -2],
  [7500, -2],
  [8000, -3],
  [8500, -3],
  [9000, -3],
  [9500, -3],
  [10000, -3],
  [10500, -3],
  [11000, -3],
  [11500, -3],
  [12000, -2],
  [12500, -2],
  [13000, -2],
  [13500, -3],
  [14000, -3],
  [14500, -4],
  [15000, -5],
  [16000, -6],
  [16500, -7],
  [17000, -8],
  [17500, -9],
  [18000, -10],
  [18500, -10],
  [19000, -11]
];

/**
 * A320 Y168 - Fuel index correction
 * Linear interpolation between chart values
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320FuelIndex(fuelKg) {
  if (!Number.isFinite(fuelKg)) {
    throw new Error("Invalid A320 fuel weight");
  }
if (fuelKg === 0) return 0;
  const table = A320_FUEL_INDEX_TABLE;
  const minimum = table[0][0];
  const maximum = table[table.length - 1][0];
if (fuelKg > 0 && fuelKg < minimum) {
  return 0;
}
  if (fuelKg < minimum || fuelKg > maximum) {
    throw new Error(
      `A320 fuel index outside documented range: ${fuelKg} kg`
    );
  }

  for (let i = 0; i < table.length - 1; i++) {
    const [weight1, index1] = table[i];
    const [weight2, index2] = table[i + 1];

    if (fuelKg >= weight1 && fuelKg <= weight2) {
      const fraction =
        (fuelKg - weight1) / (weight2 - weight1);

      return index1 + fraction * (index2 - index1);
    }
  }

  return table[table.length - 1][1];
}

/**
 * A320 - Flight weight calculations
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320FlightWeights({
  zfwKg,
  rampFuelKg,
  taxiFuelKg,
  tripFuelKg
}) {
  const values = [
    zfwKg,
    rampFuelKg,
    taxiFuelKg,
    tripFuelKg
  ];

  if (values.some(v => !Number.isFinite(v) || v < 0)) {
    throw new Error("Invalid A320 flight weight input");
  }

  if (taxiFuelKg > rampFuelKg) {
    throw new Error("A320 taxi fuel exceeds ramp fuel");
  }

  const takeoffFuelKg = rampFuelKg - taxiFuelKg;

  if (tripFuelKg > takeoffFuelKg) {
    throw new Error("A320 trip fuel exceeds takeoff fuel");
  }

  const landingFuelKg = takeoffFuelKg - tripFuelKg;

  return {
    zfwKg,
    rampFuelKg,
    taxiFuelKg,
    takeoffFuelKg,
    tripFuelKg,
    landingFuelKg,
    rampWeightKg: zfwKg + rampFuelKg,
    towKg: zfwKg + takeoffFuelKg,
    ldwKg: zfwKg + landingFuelKg
  };
}

/**
 * A320 - Flight weights and structural limits
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320ValidatedFlightWeights(input) {
  const weights = calculateA320FlightWeights(input);

  const validation = validateA320Weights({
    zfwKg: weights.zfwKg,
    rampWeightKg: weights.rampWeightKg,
    towKg: weights.towKg,
    ldwKg: weights.ldwKg
  });

  return {
    ...weights,
    validation
  };
}

/**
 * A320 - Fuel index corrections by flight phase
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320FlightFuelIndices(input) {
  const weights = calculateA320ValidatedFlightWeights(input);

  return {
    ...weights,
    takeoffFuelIndex: calculateA320FuelIndex(
      weights.takeoffFuelKg
    ),
    landingFuelIndex: calculateA320FuelIndex(
      weights.landingFuelKg
    )
  };
}

/**
 * A320 - Fuel tank distribution validation
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function validateA320FuelDistribution(fuelTanks) {
  const tankNames = ["LEFT_WING", "RIGHT_WING", "CENTER"];

  const distribution = {};
  let totalFuelKg = 0;

  for (const name of tankNames) {
    const weightKg = fuelTanks[name];

    if (!Number.isFinite(weightKg) || weightKg < 0) {
      throw new Error(`Invalid A320 fuel quantity: ${name}`);
    }

    const maxWeightKg = A320_FUEL_TANKS[name].maxWeightKg;

    if (weightKg > maxWeightKg) {
      throw new Error(`A320 fuel tank capacity exceeded: ${name}`);
    }

    distribution[name] = {
      weightKg,
      maxWeightKg,
      remainingCapacityKg: maxWeightKg - weightKg
    };

    totalFuelKg += weightKg;
  }

  return {
    distribution,
    totalFuelKg,
    totalCapacityKg: 19087,
    withinCapacity: true
  };
}

/**
 * A320 - Fuel longitudinal moment
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320FuelMoment(fuelTanks) {
  const validated = validateA320FuelDistribution(fuelTanks);

  let totalMomentKgM = 0;

  for (const [name, tank] of Object.entries(validated.distribution)) {
    if (tank.weightKg === 0) continue;

    const armMeters = A320_FUEL_TANKS[name].armMeters;

    if (!Number.isFinite(armMeters)) {
      throw new Error(`A320 fuel arm not defined: ${name}`);
    }

    totalMomentKgM += tank.weightKg * armMeters;
  }

  return {
    totalFuelKg: validated.totalFuelKg,
    totalMomentKgM,
    fuelCgArmMeters:
      validated.totalFuelKg > 0
        ? totalMomentKgM / validated.totalFuelKg
        : null
  };
}

/**
 * A320 - Fuel H-arm reference table
 * Source: A320 W&B Manual, Fig. 1-20-02B
 * Quantities in liters; arms in meters
 * OPERDAT Training - NOT FOR OPERATIONAL USE
 */
export const A320_FUEL_HARM_TABLE = [
  { liters: 3800, armMeters: 19.402 },
  { liters: 4200, armMeters: 19.248 },
  { liters: 4600, armMeters: 19.122 },
  { liters: 5000, armMeters: 19.020 },
  { liters: 5400, armMeters: 18.916 },
  { liters: 5800, armMeters: 18.863 },
  { liters: 6200, armMeters: 18.802 },
  { liters: 6600, armMeters: 18.761 },
  { liters: 7000, armMeters: 18.706 },
  { liters: 7400, armMeters: 18.668 },
  { liters: 7800, armMeters: 18.636 },
  { liters: 8200, armMeters: 18.608 },
  { liters: 8600, armMeters: 18.584 },
  { liters: 9000, armMeters: 18.564 },
  { liters: 9400, armMeters: 18.545 },
  { liters: 9800, armMeters: 18.530 },
  { liters: 10200, armMeters: 18.517 },
  { liters: 10600, armMeters: 18.506 },
  { liters: 11000, armMeters: 18.498 },
  { liters: 11400, armMeters: 18.495 },
  { liters: 11800, armMeters: 18.498 },
  { liters: 12200, armMeters: 18.506 },
  { liters: 12600, armMeters: 18.519 },
  { liters: 13000, armMeters: 18.536 },
  { liters: 13400, armMeters: 18.557 },
  { liters: 13800, armMeters: 18.582 },
  { liters: 14200, armMeters: 18.609 },
  { liters: 14600, armMeters: 18.640 },
  { liters: 15000, armMeters: 18.673 },
  { liters: 15400, armMeters: 18.706 },
  { liters: 15610, armMeters: 18.730 },

  { liters: 15800, armMeters: 18.720 },
  { liters: 16200, armMeters: 18.698 },
  { liters: 16600, armMeters: 18.673 },
  { liters: 17000, armMeters: 18.648 },
  { liters: 17400, armMeters: 18.620 },
  { liters: 17800, armMeters: 18.592 },
  { liters: 18200, armMeters: 18.569 },
  { liters: 18600, armMeters: 18.537 },
  { liters: 19000, armMeters: 18.511 },
  { liters: 19400, armMeters: 18.486 },
  { liters: 19800, armMeters: 18.462 },
  { liters: 20200, armMeters: 18.439 },
  { liters: 20600, armMeters: 18.416 },
  { liters: 21000, armMeters: 18.395 },
  { liters: 21400, armMeters: 18.375 },
  { liters: 21800, armMeters: 18.356 },
  { liters: 22200, armMeters: 18.337 },
  { liters: 22600, armMeters: 18.317 },
  { liters: 23000, armMeters: 18.300 },
  { liters: 23400, armMeters: 18.283 },
  { liters: 23560, armMeters: 18.265 }

];

/**
 * A320 - Fuel H-arm interpolation
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 *
 * Input: fuel quantity in liters
 * Output: longitudinal H-arm in meters
 */
export function calculateA320FuelHArm(fuelLiters) {
  if (!Number.isFinite(fuelLiters)) {
    throw new Error("Invalid A320 fuel quantity");
  }

  const table = A320_FUEL_HARM_TABLE;

  if (
    fuelLiters < table[0].liters ||
    fuelLiters > table[table.length - 1].liters
  ) {
    throw new Error("A320 fuel quantity outside H-arm table");
  }

  for (let i = 0; i < table.length; i++) {
    const current = table[i];

    if (fuelLiters === current.liters) {
      return current.armMeters;
    }

    if (i === 0) continue;

    const previous = table[i - 1];

    if (fuelLiters < current.liters) {
      const fraction =
        (fuelLiters - previous.liters) /
        (current.liters - previous.liters);

      return previous.armMeters +
        fraction * (current.armMeters - previous.armMeters);
    }
  }

  throw new Error("A320 fuel H-arm interpolation failed");
}

/**
 * A320 - Fuel longitudinal moment
 * Based on refueling H-arm table
 * Reference fuel density: 0.785 kg/L
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320RefuelingFuelMoment(fuelLiters) {
  const FUEL_DENSITY_KG_PER_LITER = 0.785;

  const armMeters = calculateA320FuelHArm(fuelLiters);

  const fuelWeightKg =
    fuelLiters * FUEL_DENSITY_KG_PER_LITER;

  const fuelMomentKgM =
    fuelWeightKg * armMeters;

  return {
    fuelLiters,
    fuelWeightKg,
    armMeters,
    fuelMomentKgM
  };
}

/**
 * A320 - Preliminary takeoff CG calculation
 * Based on ZFW moment and refueling fuel moment
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320PreliminaryTOWCG({
  zfwKg,
  zfwMomentKgM,
  fuelLiters
}) {
  if (
    !Number.isFinite(zfwKg) ||
    zfwKg <= 0 ||
    !Number.isFinite(zfwMomentKgM)
  ) {
    throw new Error("Invalid A320 ZFW data");
  }

  const fuel = calculateA320RefuelingFuelMoment(fuelLiters);

  const towKg = zfwKg + fuel.fuelWeightKg;

  const towMomentKgM =
    zfwMomentKgM + fuel.fuelMomentKgM;

  const towCgArmMeters = towMomentKgM / towKg;

  const towCgMacPercent = a320ArmToMac(towCgArmMeters);

  return {
    towKg,
    towMomentKgM,
    towCgArmMeters,
    towCgMacPercent,
    fuel
  };
}

/**
 * A320-232 - Five-cell fuel configuration
 * Source: A320 W&B Manual, section 1.20.04
 *
 * Capacities in liters.
 * Full-cell weights and arms from manual.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export const A320_FUEL_CELLS = {
  OUTER_LEFT: {
    capacityLiters: 880,
    fullWeightKg: 691,
    fullArmMeters: 21.331
  },

  INNER_LEFT: {
    capacityLiters: 6925,
    fullWeightKg: 5436,
    fullArmMeters: 18.400
  },

  CENTER: {
    capacityLiters: 8250,
    fullWeightKg: 6476,
    fullArmMeters: 17.356
  },

  INNER_RIGHT: {
    capacityLiters: 6925,
    fullWeightKg: 5436,
    fullArmMeters: 18.400
  },

  OUTER_RIGHT: {
    capacityLiters: 880,
    fullWeightKg: 691,
    fullArmMeters: 21.331
  }
};

/**
 * A320-232 - Inner wing cell H-arm table
 * Source: W&B Manual, Figure 1-20-04A
 * Quantity in liters; longitudinal arm in meters
 *
 * Applies to INNER_LEFT and INNER_RIGHT.
 * OPERDAT Training - NOT FOR OPERATIONAL USE
 */
export const A320_INNER_CELL_HARM_TABLE = [
  { liters: 200, armMeters: 17.788 },
  { liters: 400, armMeters: 17.752 },
  { liters: 600, armMeters: 17.736 },
  { liters: 800, armMeters: 17.732 },
  { liters: 1000, armMeters: 17.735 },
  { liters: 1200, armMeters: 17.743 },
  { liters: 1400, armMeters: 17.752 },
  { liters: 1600, armMeters: 17.763 },
  { liters: 1800, armMeters: 17.774 },
  { liters: 2000, armMeters: 17.787 },
  { liters: 2200, armMeters: 17.799 },
  { liters: 2400, armMeters: 17.812 },
  { liters: 2600, armMeters: 17.824 },
  { liters: 2800, armMeters: 17.837 },
  { liters: 3000, armMeters: 17.850 },
  { liters: 3200, armMeters: 17.864 },
  { liters: 3400, armMeters: 17.877 },
  { liters: 3600, armMeters: 17.891 },
  { liters: 3800, armMeters: 17.904 },
  { liters: 4000, armMeters: 17.917 },
  { liters: 4200, armMeters: 17.931 },
  { liters: 4400, armMeters: 17.944 },
  { liters: 4600, armMeters: 17.959 },
  { liters: 4800, armMeters: 17.978 },
  { liters: 5000, armMeters: 18.002 },
  { liters: 5200, armMeters: 18.030 },
  { liters: 5400, armMeters: 18.063 },
  { liters: 5600, armMeters: 18.099 },
  { liters: 5800, armMeters: 18.138 },
  { liters: 6000, armMeters: 18.180 },
  { liters: 6200, armMeters: 18.225 },
  { liters: 6400, armMeters: 18.273 },
  { liters: 6600, armMeters: 18.321 },
  { liters: 6800, armMeters: 18.369 },
  { liters: 6925, armMeters: 18.400 }
];

/**
 * A320-232 - Outer wing cell H-arm table
 * Source: W&B Manual, Figure 1-20-04A
 *
 * Applies to OUTER_LEFT and OUTER_RIGHT.
 * OPERDAT Training - NOT FOR OPERATIONAL USE
 */
export const A320_OUTER_CELL_HARM_TABLE = [
  { liters: 200, armMeters: 21.010 },
  { liters: 400, armMeters: 21.074 },
  { liters: 600, armMeters: 21.144 },
  { liters: 800, armMeters: 21.280 },
  { liters: 880, armMeters: 21.331 }
];

/**
 * A320-232 - Center tank H-arm table
 * Source: W&B Manual, Figure 1-20-04B
 * Quantity in liters; longitudinal arm in meters
 *
 * OPERDAT Training - NOT FOR OPERATIONAL USE
 */
export const A320_CENTER_TANK_HARM_TABLE = [
  { liters: 200, armMeters: 17.918 },
  { liters: 400, armMeters: 17.818 },
  { liters: 600, armMeters: 17.781 },
  { liters: 800, armMeters: 17.748 },
  { liters: 1000, armMeters: 17.718 },
  { liters: 1200, armMeters: 17.691 },
  { liters: 1400, armMeters: 17.664 },
  { liters: 1600, armMeters: 17.634 },
  { liters: 1800, armMeters: 17.608 },
  { liters: 2000, armMeters: 17.583 },
  { liters: 2200, armMeters: 17.559 },
  { liters: 2400, armMeters: 17.537 },
  { liters: 2600, armMeters: 17.519 },
  { liters: 2800, armMeters: 17.503 },
  { liters: 3000, armMeters: 17.489 },
  { liters: 3200, armMeters: 17.477 },
  { liters: 3400, armMeters: 17.465 },
  { liters: 3600, armMeters: 17.457 },
  { liters: 3800, armMeters: 17.448 },
  { liters: 4000, armMeters: 17.441 },

  { liters: 4200, armMeters: 17.434 },
  { liters: 4400, armMeters: 17.428 },
  { liters: 4600, armMeters: 17.422 },
  { liters: 4800, armMeters: 17.417 },
  { liters: 5000, armMeters: 17.412 },
  { liters: 5200, armMeters: 17.408 },
  { liters: 5400, armMeters: 17.403 },
  { liters: 5600, armMeters: 17.400 },
  { liters: 5800, armMeters: 17.396 },
  { liters: 6000, armMeters: 17.393 },
  { liters: 6200, armMeters: 17.390 },
  { liters: 6400, armMeters: 17.387 },
  { liters: 6600, armMeters: 17.384 },
  { liters: 6800, armMeters: 17.382 },
  { liters: 7000, armMeters: 17.379 },
  { liters: 7200, armMeters: 17.377 },
  { liters: 7400, armMeters: 17.373 },
  { liters: 7600, armMeters: 17.371 },
  { liters: 7800, armMeters: 17.370 },
  { liters: 8000, armMeters: 17.365 },
  { liters: 8200, armMeters: 17.354 },
  { liters: 8250, armMeters: 17.356 }

];

/**
 * A320-232 - Fuel cell H-arm interpolation
 * Uses individual fuel cell reference tables.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320FuelCellHArm(
  cellName,
  fuelLiters
) {
  const tables = {
    OUTER_LEFT: A320_OUTER_CELL_HARM_TABLE,
    INNER_LEFT: A320_INNER_CELL_HARM_TABLE,
    CENTER: A320_CENTER_TANK_HARM_TABLE,
    INNER_RIGHT: A320_INNER_CELL_HARM_TABLE,
    OUTER_RIGHT: A320_OUTER_CELL_HARM_TABLE
  };

  const table = tables[cellName];
  const cell = A320_FUEL_CELLS[cellName];

  if (!table || !cell) {
    throw new Error("Invalid A320 fuel cell");
  }

  if (
    !Number.isFinite(fuelLiters) ||
    fuelLiters < 0 ||
    fuelLiters > cell.capacityLiters
  ) {
    throw new Error("Invalid A320 fuel cell quantity");
  }

  // An empty cell has zero fuel moment.
  if (fuelLiters === 0) {
    return null;
  }

  // Below the first tabulated quantity, do not
  // extrapolate an unsupported H-arm.
  if (fuelLiters < table[0].liters) {
    throw new Error(
      "A320 fuel cell quantity below H-arm table"
    );
  }

  for (let i = 0; i < table.length; i++) {
    const current = table[i];

    if (fuelLiters === current.liters) {
      return current.armMeters;
    }

    if (i === 0) continue;

    const previous = table[i - 1];

    if (fuelLiters < current.liters) {
      const fraction =
        (fuelLiters - previous.liters) /
        (current.liters - previous.liters);

      return previous.armMeters +
        fraction *
          (current.armMeters - previous.armMeters);
    }
  }

  throw new Error("A320 fuel cell interpolation failed");
}

/**
 * A320-232 - Five-cell fuel weight and moment
 * Fixed training density: 0.785 kg/L
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320FuelCellsMoment(fuelCells) {
  const FUEL_DENSITY = 0.785;

  const cells = {};
  let totalFuelLiters = 0;
  let totalFuelWeightKg = 0;
  let totalFuelMomentKgM = 0;

  for (const cellName of Object.keys(A320_FUEL_CELLS)) {
    const liters = fuelCells[cellName] ?? 0;

    const armMeters = calculateA320FuelCellHArm(
      cellName,
      liters
    );

    const weightKg = liters * FUEL_DENSITY;

    const momentKgM =
      armMeters === null ? 0 : weightKg * armMeters;

    cells[cellName] = {
      liters,
      weightKg,
      armMeters,
      momentKgM
    };

    totalFuelLiters += liters;
    totalFuelWeightKg += weightKg;
    totalFuelMomentKgM += momentKgM;
  }

  const fuelCgArmMeters =
    totalFuelWeightKg > 0
      ? totalFuelMomentKgM / totalFuelWeightKg
      : null;

  return {
    cells,
    totalFuelLiters,
    totalFuelWeightKg,
    totalFuelMomentKgM,
    fuelCgArmMeters
  };
}

/**
 * A320-232 - Aircraft CG with five-cell fuel model
 *
 * Combines ZFW moment with individual fuel cell moments.
 * Does not simulate taxi or in-flight fuel consumption.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320CGWithFuelCells({
  zfwKg,
  zfwMomentKgM,
  fuelCells
}) {
  if (
    !Number.isFinite(zfwKg) ||
    zfwKg <= 0 ||
    !Number.isFinite(zfwMomentKgM)
  ) {
    throw new Error("Invalid A320 ZFW data");
  }

  if (
    !fuelCells ||
    typeof fuelCells !== "object" ||
    Array.isArray(fuelCells)
  ) {
    throw new Error("Invalid A320 fuel cells data");
  }

  const fuel = calculateA320FuelCellsMoment(fuelCells);

  const totalWeightKg =
    zfwKg + fuel.totalFuelWeightKg;

  const totalMomentKgM =
    zfwMomentKgM + fuel.totalFuelMomentKgM;

  const cgArmMeters =
    totalMomentKgM / totalWeightKg;

  const cgMacPercent =
    a320ArmToMac(cgArmMeters);

  return {
    totalWeightKg,
    totalMomentKgM,
    cgArmMeters,
    cgMacPercent,
    fuel
  };
}

/**
 * A320-232 - Simplified fuel consumption
 * Training model, not actual Airbus fuel logic.
 *
 * Fuel consumption order:
 * 1. Center tank
 * 2. Inner wing cells, symmetrically
 * 3. Outer wing cells, symmetrically
 *
 * NOT FOR OPERATIONAL USE
 */
export function simulateA320FuelConsumption(
  initialCells,
  consumptionKg
) {
  const DENSITY = 0.785;
  const MIN_RESIDUAL_LITERS = 200;

  if (
    !initialCells ||
    typeof initialCells !== "object" ||
    Array.isArray(initialCells)
  ) {
    throw new Error("Invalid A320 initial fuel cells");
  }

  if (
    !Number.isFinite(consumptionKg) ||
    consumptionKg < 0
  ) {
    throw new Error("Invalid A320 fuel consumption");
  }

  const cells = {};

  for (const name of Object.keys(A320_FUEL_CELLS)) {
    const liters = initialCells[name] ?? 0;

    // Validate the initial cell quantities.
    calculateA320FuelCellHArm(name, liters);

    cells[name] = liters;
  }

  let remainingLiters = consumptionKg / DENSITY;

  function consumeCell(name) {
    const available = Math.max(
      0,
      cells[name] - MIN_RESIDUAL_LITERS
    );

    const consumed = Math.min(
      available,
      remainingLiters
    );

    cells[name] -= consumed;
    remainingLiters -= consumed;
  }

  function consumePair(left, right) {
    const leftAvailable = Math.max(
      0,
      cells[left] - MIN_RESIDUAL_LITERS
    );

    const rightAvailable = Math.max(
      0,
      cells[right] - MIN_RESIDUAL_LITERS
    );

    const balanced = Math.min(
      leftAvailable,
      rightAvailable,
      remainingLiters / 2
    );

    cells[left] -= balanced;
    cells[right] -= balanced;
    remainingLiters -= balanced * 2;

    // Allow asymmetric initial quantities.
    consumeCell(left);
    consumeCell(right);
  }

  consumeCell("CENTER");

  if (remainingLiters > 0) {
    consumePair("INNER_LEFT", "INNER_RIGHT");
  }

  if (remainingLiters > 0) {
    consumePair("OUTER_LEFT", "OUTER_RIGHT");
  }

  if (remainingLiters > 0.000001) {
    throw new Error(
      "Insufficient usable A320 fuel for consumption"
    );
  }

  return {
    fuelCells: cells,
    consumedKg: consumptionKg,
    remainingFuelKg:
      Object.values(cells).reduce(
        (sum, liters) => sum + liters * DENSITY,
        0
      )
  };
}

/**
 * A320-232 - Takeoff weight and CG after taxi
 *
 * Uses the simplified five-cell fuel consumption model.
 * Fuel density: 0.785 kg/L
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320TakeoffBalance({
  zfwKg,
  zfwMomentKgM,
  rampFuelCells,
  taxiFuelKg
}) {
  if (
    !Number.isFinite(taxiFuelKg) ||
    taxiFuelKg < 0
  ) {
    throw new Error("Invalid A320 taxi fuel");
  }

  const ramp = calculateA320CGWithFuelCells({
    zfwKg,
    zfwMomentKgM,
    fuelCells: rampFuelCells
  });

  const afterTaxi = simulateA320FuelConsumption(
    rampFuelCells,
    taxiFuelKg
  );

  const takeoff = calculateA320CGWithFuelCells({
    zfwKg,
    zfwMomentKgM,
    fuelCells: afterTaxi.fuelCells
  });

  return {
    rampWeightKg: ramp.totalWeightKg,
    rampCgMacPercent: ramp.cgMacPercent,

    taxiFuelKg,

    towKg: takeoff.totalWeightKg,
    towMomentKgM: takeoff.totalMomentKgM,
    towCgArmMeters: takeoff.cgArmMeters,
    towCgMacPercent: takeoff.cgMacPercent,

    takeoffFuelKg: takeoff.fuel.totalFuelWeightKg,
    takeoffFuelCells: afterTaxi.fuelCells
  };
}

/**
 * A320-232 - Landing Weight and CG
 *
 * Uses the existing simplified fuel consumption model.
 * Fuel density: 0.785 kg/L
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320LandingBalance({
  zfwKg,
  zfwMomentKgM,
  rampFuelCells,
  taxiFuelKg,
  tripFuelKg
}) {
  if (
    !Number.isFinite(tripFuelKg) ||
    tripFuelKg < 0
  ) {
    throw new Error("Invalid A320 trip fuel");
  }

  // Step 1: Calculate takeoff balance.
  const takeoff = calculateA320TakeoffBalance({
    zfwKg,
    zfwMomentKgM,
    rampFuelCells,
    taxiFuelKg
  });

  // Step 2: Consume trip fuel from takeoff quantities.
  const afterTrip = simulateA320FuelConsumption(
    takeoff.takeoffFuelCells,
    tripFuelKg
  );

  // Step 3: Calculate landing weight, moment and CG.
  const landing = calculateA320CGWithFuelCells({
    zfwKg,
    zfwMomentKgM,
    fuelCells: afterTrip.fuelCells
  });

  return {
    zfwKg,

    rampWeightKg: takeoff.rampWeightKg,
    rampCgMacPercent: takeoff.rampCgMacPercent,

    taxiFuelKg,
    towKg: takeoff.towKg,
    towCgMacPercent: takeoff.towCgMacPercent,

    tripFuelKg,

    landingWeightKg: landing.totalWeightKg,
    landingMomentKgM: landing.totalMomentKgM,
    landingCgArmMeters: landing.cgArmMeters,
    landingCgMacPercent: landing.cgMacPercent,

    landingFuelKg: landing.fuel.totalFuelWeightKg,
    landingFuelCells: afterTrip.fuelCells
  };
}

/**
 * A320-232 - Complete flight weight validation
 *
 * Validates ZFW, Ramp Weight, TOW and Landing Weight.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function validateA320CompleteFlightWeights({
  zfwKg,
  rampWeightKg,
  towKg,
  landingWeightKg
}) {
  const weights = {
    ZFW: {
      actualKg: zfwKg,
      limitKg: A320_WEIGHT_LIMITS.MZFW
    },
    RAMP: {
      actualKg: rampWeightKg,
      limitKg: A320_WEIGHT_LIMITS.MRW
    },
    TAKEOFF: {
      actualKg: towKg,
      limitKg: A320_WEIGHT_LIMITS.MTOW
    },
    LANDING: {
      actualKg: landingWeightKg,
      limitKg: A320_WEIGHT_LIMITS.MLW
    }
  };

  for (const [name, item] of Object.entries(weights)) {
    if (!Number.isFinite(item.actualKg) || item.actualKg < 0) {
      throw new Error(`Invalid A320 ${name} weight`);
    }

    item.marginKg = item.limitKg - item.actualKg;
    item.ok = item.marginKg >= 0;
    item.status = item.ok ? "OK" : "OVER LIMIT";
  }

  return {
    weights,
    allWeightsOk: Object.values(weights).every(
      item => item.ok
    )
  };
}

/**
 * A320 - CG envelope reference points
 * Source: A320 WBM, section 1.10.02
 *
 * Basic forward CG limits.
 * Values expressed as % reference chord.
 *
 * ZFW uses flight limits as a training convention.
 *
 * NOT FOR OPERATIONAL USE
 */
export const A320_CG_ENVELOPES = {
  ZFW: {
    forward: [
      [37230, 23],
      [77000, 23]
    ],
    aft: [
      [37230, 45],
      [69500, 45],
      [77000, 39.5]
    ]
  },

  TAKEOFF: {
    forward: [
      [37230, 25],
      [77000, 25]
    ],
    aft: [
      [37230, 37],
      [47500, 37],
      [61000, 42],
      [70717, 42],
      [77000, 37.5]
    ]
  },

  LANDING: {
    forward: [
      [37230, 25],
      [64500, 25]
    ],
    aft: [
      [37230, 43],
      [64500, 43]
    ]
  }
};

/**
 * A320 - CG envelope interpolation
 *
 * Linear interpolation between documented points.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function calculateA320CGLimits(phase, weightKg) {
  const envelope = A320_CG_ENVELOPES[phase];

  if (!envelope) {
    throw new Error(`Invalid A320 CG phase: ${phase}`);
  }

  if (!Number.isFinite(weightKg)) {
    throw new Error("Invalid A320 weight for CG limits");
  }

  function interpolate(points) {
    if (
      weightKg < points[0][0] ||
      weightKg > points[points.length - 1][0]
    ) {
      throw new Error(
        `A320 weight outside ${phase} CG envelope range`
      );
    }

    for (let i = 0; i < points.length - 1; i++) {
      const [w1, cg1] = points[i];
      const [w2, cg2] = points[i + 1];

      if (weightKg >= w1 && weightKg <= w2) {
        const fraction = (weightKg - w1) / (w2 - w1);

        return cg1 + fraction * (cg2 - cg1);
      }
    }

    throw new Error("A320 CG interpolation failed");
  }

  const forwardLimit = interpolate(envelope.forward);
  const aftLimit = interpolate(envelope.aft);

  return {
    phase,
    weightKg,
    forwardLimit,
    aftLimit
  };
}

/**
 * A320-232 - CG envelope validation
 *
 * Checks whether the calculated CG is within
 * the forward and aft limits for a given weight.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function validateA320CGEnvelope({
  phase,
  weightKg,
  cgMacPercent
}) {
  if (!Number.isFinite(cgMacPercent)) {
    throw new Error("Invalid A320 CG value");
  }

  const limits = calculateA320CGLimits(
    phase,
    weightKg
  );

  const forwardMargin =
    cgMacPercent - limits.forwardLimit;

  const aftMargin =
    limits.aftLimit - cgMacPercent;

  const ok =
    forwardMargin >= 0 &&
    aftMargin >= 0;

  return {
    phase,
    weightKg,
    cgMacPercent,

    forwardLimit: limits.forwardLimit,
    aftLimit: limits.aftLimit,

    forwardMargin,
    aftMargin,

    ok,
    status: ok ? "OK" : "OUT OF ENVELOPE"
  };
}

/**
 * A320-232 - Complete Weight & Balance validation
 *
 * Combines weight limits and CG envelope checks.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function validateA320CompleteBalance({
  zfwKg,
  zfwCgMacPercent,
  rampWeightKg,
  towKg,
  towCgMacPercent,
  landingWeightKg,
  landingCgMacPercent
}) {
  const weightValidation =
    validateA320CompleteFlightWeights({
      zfwKg,
      rampWeightKg,
      towKg,
      landingWeightKg
    });

 
  // Validate CG only when the weight is within
  // the envelope's supported range.
  function safeCGValidation(phase, weightKg, cgMacPercent) {
    try {
      return validateA320CGEnvelope({
        phase,
        weightKg,
        cgMacPercent
      });
    } catch (error) {
      if (
        error.message.includes("CG envelope range")
      ) {
        return {
          phase,
          weightKg,
          cgMacPercent,
          forwardLimit: null,
          aftLimit: null,
          forwardMargin: null,
          aftMargin: null,
          ok: false,
          status: "OUT OF ENVELOPE RANGE"
        };
      }

      throw error;
    }
  }

  const cgValidation = {
    ZFW: safeCGValidation(
      "ZFW",
      zfwKg,
      zfwCgMacPercent
    ),

    TAKEOFF: safeCGValidation(
      "TAKEOFF",
      towKg,
      towCgMacPercent
    ),

    LANDING: safeCGValidation(
      "LANDING",
      landingWeightKg,
      landingCgMacPercent
    )
  };

  const allCgOk = Object.values(cgValidation)
    .every(result => result.ok);

  const allWeightsOk = weightValidation.allWeightsOk;

  return {
    weights: weightValidation.weights,
    cg: cgValidation,

    allWeightsOk,
    allCgOk,

    overallOk: allWeightsOk && allCgOk,

    status:
      allWeightsOk && allCgOk
        ? "BALANCE OK"
        : "BALANCE NOT OK"
  };
}

/**
 * A320-232 - Weight & Balance status cards
 *
 * Converts validated results into UI-ready data.
 *
 * OPERDAT Training
 * NOT FOR OPERATIONAL USE
 */
export function buildA320StatusCards(validation) {
  if (
    !validation ||
    !validation.weights ||
    !validation.cg
  ) {
    throw new Error("Invalid A320 balance validation");
  }

  function weightCard(key) {
    const item = validation.weights[key];

    return {
      value: item.actualKg,
      limit: item.limitKg,
      margin: item.marginKg,
      status: item.status,
      ok: item.ok
    };
  }

  function cgCard(key) {
    const item = validation.cg[key];

    return {
      value: item.cgMacPercent,
      forwardLimit: item.forwardLimit,
      aftLimit: item.aftLimit,
      status: item.status,
      ok: item.ok
    };
  }

  return {
    zfw: weightCard("ZFW"),
    rampWeight: weightCard("RAMP"),
    tow: weightCard("TAKEOFF"),
    landingWeight: weightCard("LANDING"),

    zfwCg: cgCard("ZFW"),
    towCg: cgCard("TAKEOFF"),
    landingCg: cgCard("LANDING"),

    weightStatus: validation.allWeightsOk
      ? "OK"
      : "OVER LIMIT",

    cgStatus: validation.allCgOk
      ? "OK"
      : "OUT OF ENVELOPE",

    overallStatus: validation.status,
    overallOk: validation.overallOk
  };
}

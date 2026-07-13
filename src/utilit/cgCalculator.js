export function getPayloadIndex(
  passengerIndex,
  cargoIndex
) {

  return passengerIndex + cargoIndex

}


export function getZeroFuelIndex(
  basicIndex,
  loadIndex
) {

  return basicIndex + loadIndex

}


export function getTakeoffIndex(
  zeroFuelIndex,
  fuelIndex
) {

  return zeroFuelIndex + fuelIndex

}


export function getLandingIndex(
  takeoffIndex,
  tripFuelIndex
) {

  return takeoffIndex - tripFuelIndex

}


export function getCG(
  arm,
  lemac,
  mac
) {

  if (arm <= 0) return 0

  return (
    ((arm - lemac) / mac) * 100
  )

}


export function calculateBalanceCG({

  effectiveBasicIndex,

  passengerIndex,

  cargoIndex,

  fuelIndex,

  tripFuelIndex,

  totalMoment,

  totalWeight

}) {

  const payloadIndex = getPayloadIndex(
    passengerIndex,
    cargoIndex
  )

  const zeroFuelIndex = getZeroFuelIndex(
    effectiveBasicIndex,
    payloadIndex
  )

  const takeoffIndex = getTakeoffIndex(
    zeroFuelIndex,
    fuelIndex
  )

  const landingIndex = getLandingIndex(
    takeoffIndex,
    tripFuelIndex
  )

  return {

    payloadIndex,

    zeroFuelIndex,

    takeoffIndex,

    landingIndex,

    effectiveBasicIndex,

    passengerIndex,

    cargoIndex,

    fuelIndex,

    tripFuelIndex,

    totalMoment,

    totalWeight

  }

}
import {
  calculateCG,
  calculateTrim
} from './calculations'

export function getPayloadIndex(
  passengerIndex,
  cargoIndex
) {
  return passengerIndex + cargoIndex
}

export function getZeroFuelIndex(
    basicIndex,
    loadIndex
){
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
const cargoZfwIndex = getZeroFuelIndex(
  cargoEffectiveBasicIndex,
  totalCargoIndex
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
import { lowerDeckFactors, mainDeckTables } from './cargoIndexTables'

export function getLowerDeckIndex(selectedCargoAircraft, cargoWeights) {
    return (selectedCargoAircraft?.cargoConfig?.lowerDeck?.reduce(
        (total, position) => total + ((cargoWeights[position.id] || 0) * (lowerDeckFactors[position.id] || 0)), 0 ) || 0
  )

}export function getMainCargo(selectedCargoAircraft, cargoWeights) {

  return (selectedCargoAircraft?.cargoConfig?.mainDeck?.reduce(
      (total, position) => total + (cargoWeights[position.id] || 0), 0 ) || 0
  )

}export function getLowerCargo(selectedCargoAircraft, cargoWeights) {
  return (selectedCargoAircraft?.cargoConfig?.lowerDeck?.reduce(
      (total, position) => total + (cargoWeights[position.id] || 0), 0 ) || 0
  )

}export function getTotalCargo(mainCargo, lowerCargo) { return mainCargo + lowerCargo

}export function getCargoZfw(selectedCargoAircraft, totalCargo) {
  return (selectedCargoAircraft.basicWeight + totalCargo
  )

}export function getAvailablePayload(selectedCargoAircraft, cargoZfw) {
  return (selectedCargoAircraft.maxZFW - cargoZfw
  )
  }export function getMainDeckIndex(selectedCargoAircraft, cargoWeights) {

  function getMainIndex(position, weight) { if (!mainDeckTables[position]) return 0

    const row = mainDeckTables[position].find(
      v => Number(weight) <= v.kg ) 
      return row ? row.index : 0

  }

  return (selectedCargoAircraft?.cargoConfig?.mainDeck?.reduce(
      (total, position) => total +getMainIndex(position.id, cargoWeights[position.id] || 0 ), 0 ) || 0

  )

}
export function getTotalCargoIndex(mainIndex, lowerIndex) {

  return ( Number(mainIndex) + Number(lowerIndex))

}export function calculateCargoBalance(selectedCargoAircraft,cargoWeights) {

  const mainCargo = getMainCargo(selectedCargoAircraft,cargoWeights)

  const lowerCargo = getLowerCargo(selectedCargoAircraft,cargoWeights)

  const totalCargo = getTotalCargo(mainCargo,lowerCargo)

  const cargoZfw = getCargoZfw(selectedCargoAircraft,totalCargo)

  const availablePayload = getAvailablePayload(selectedCargoAircraft,cargoZfw)

  const mainDeckIndex = getMainDeckIndex(selectedCargoAircraft,cargoWeights)

  const lowerDeckIndex = getLowerDeckIndex(selectedCargoAircraft,cargoWeights)

  const totalCargoIndex = getTotalCargoIndex(mainDeckIndex,lowerDeckIndex)

  return {

    mainCargo,

    lowerCargo,

    totalCargo,

    cargoZfw,

    availablePayload,

    mainDeckIndex,

    lowerDeckIndex,

    totalCargoIndex

  }

}
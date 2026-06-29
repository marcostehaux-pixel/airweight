import { lowerDeckFactors, mainDeckTables } from './cargoIndexTables'

/* ===========================================================
   FUNCIONES PRIVADAS
=========================================================== */

function getMainIndex(position, weight) {

  if (!mainDeckTables[position]) return 0

  const value = Number(weight)

  if (!value || value <= 0) return 0

  const row = mainDeckTables[position].find(
    entry => value <= entry.kg
  )

  return row ? row.index : 0

}

/* ===========================================================
   CARGA MAIN DECK
=========================================================== */

export function getMainCargo(selectedCargoAircraft, cargoWeights) {

  return (
    selectedCargoAircraft?.cargoConfig?.mainDeck?.reduce(
      (total, position) =>
        total + (cargoWeights[position.id] || 0),
      0
    ) || 0
  )

}

/* ===========================================================
   CARGA LOWER DECK
=========================================================== */

export function getLowerCargo(selectedCargoAircraft, cargoWeights) {

  return (
    selectedCargoAircraft?.cargoConfig?.lowerDeck?.reduce(
      (total, position) =>
        total + (cargoWeights[position.id] || 0),
      0
    ) || 0
  )

}

/* ===========================================================
   CARGA TOTAL
=========================================================== */

export function getTotalCargo(mainCargo, lowerCargo) {

  return mainCargo + lowerCargo

}

/* ===========================================================
   ZERO FUEL WEIGHT
=========================================================== */

export function getCargoZfw(selectedCargoAircraft, totalCargo) {

  return (
    selectedCargoAircraft.basicWeight +
    totalCargo
  )

}

/* ===========================================================
   PAYLOAD DISPONIBLE
=========================================================== */

export function getAvailablePayload(selectedCargoAircraft, cargoZfw) {

  return (
    selectedCargoAircraft.maxZFW -
    cargoZfw
  )

}

/* ===========================================================
   MAIN DECK INDEX
=========================================================== */

export function getMainDeckIndex(selectedCargoAircraft, cargoWeights) {

  return (

  selectedCargoAircraft?.cargoConfig?.mainDeck?.reduce(

    (total, position) => {

      console.log(position.id, cargoWeights[position.id])

      return total +
        getMainIndex(
          position.id,
          cargoWeights[position.id] || 0
        )

    },

    0

  ) || 0

)

}

/* ===========================================================
   LOWER DECK INDEX
=========================================================== */

export function getLowerDeckIndex(selectedCargoAircraft, cargoWeights) {

  return (

    selectedCargoAircraft?.cargoConfig?.lowerDeck?.reduce(

      (total, position) =>

        total +

        ((cargoWeights[position.id] || 0) *

        (lowerDeckFactors[position.id] || 0)),

      0

    ) || 0

  )

}

/* ===========================================================
   TOTAL INDEX
=========================================================== */

export function getTotalCargoIndex(mainDeckIndex, lowerDeckIndex) {

  return (
    Number(mainDeckIndex) +
    Number(lowerDeckIndex)
  )

}

/* ===========================================================
   FUNCIÓN PRINCIPAL
=========================================================== */

export function calculateCargoBalance(
  selectedCargoAircraft,
  cargoWeights
) {

  const mainCargo = getMainCargo(
    selectedCargoAircraft,
    cargoWeights
  )

  const lowerCargo = getLowerCargo(
    selectedCargoAircraft,
    cargoWeights
  )

  const totalCargo = getTotalCargo(
    mainCargo,
    lowerCargo
  )

  const cargoZfw = getCargoZfw(
    selectedCargoAircraft,
    totalCargo
  )

  const availablePayload = getAvailablePayload(
    selectedCargoAircraft,
    cargoZfw
  )

  const mainDeckIndex = getMainDeckIndex(
    selectedCargoAircraft,
    cargoWeights
  )

  const lowerDeckIndex = getLowerDeckIndex(
    selectedCargoAircraft,
    cargoWeights
  )

  const totalCargoIndex = getTotalCargoIndex(
    mainDeckIndex,
    lowerDeckIndex
  )

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
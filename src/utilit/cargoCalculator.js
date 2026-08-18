import { lowerDeckFactors, mainDeckTables } from './cargoIndexTables'

/* ===========================================================
   FUNCIONES PRIVADAS
=========================================================== */

function getMainIndex(position, weight) {
  const table = mainDeckTables[position]

  if (!table) return 0

  const value = Number(weight)

  if (!value || value <= 0) return 0

  // Ordenamos por seguridad
  const rows = [...table].sort(
    (a, b) => a.kg - b.kg
  )

  // Si coincide exactamente con un valor de tabla
  const exact = rows.find(
    entry => value === Number(entry.kg)
  )

  if (exact) {
    return Number(exact.index)
  }

  // Por debajo del primer valor
  if (value < rows[0].kg) {
    return Number(rows[0].index)
  }

  // Por encima del último valor
  if (value > rows[rows.length - 1].kg) {
    return Number(
      rows[rows.length - 1].index
    )
  }

  // Buscamos los dos puntos que contienen el peso
  for (let i = 0; i < rows.length - 1; i++) {

    const lower = rows[i]
    const upper = rows[i + 1]

    if (
      value > lower.kg &&
      value < upper.kg
    ) {

      const ratio =
        (value - lower.kg) /
        (upper.kg - lower.kg)

      return (
        Number(lower.index) +
        ratio *
        (
          Number(upper.index) -
          Number(lower.index)
        )
      )
    }
  }

  return 0
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
export function getMainDeckMoment(
  selectedCargoAircraft,
  cargoWeights
) {

  return (

    selectedCargoAircraft?.cargoConfig?.mainDeck?.reduce(

      (total, position) =>

        total +

        ((cargoWeights[position.id] || 0) * position.arm),

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
export function getLowerDeckMoment(
  selectedCargoAircraft,
  cargoWeights
) {

  return (

    selectedCargoAircraft?.cargoConfig?.lowerDeck?.reduce(

      (total, position) =>

        total +

        ((cargoWeights[position.id] || 0) * position.arm),

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
export function getBasicMoment(selectedCargoAircraft) {

  const basicArm =

    (
      (
        (
          selectedCargoAircraft.basicIndex -
          selectedCargoAircraft.indexOffset
        ) *
        selectedCargoAircraft.indexConstant
      ) /
      selectedCargoAircraft.basicWeight
    ) +
    selectedCargoAircraft.indexReferenceArm

  return (

    selectedCargoAircraft.basicWeight *
    basicArm

  )

}

export function getZfwArm(
  zfwMoment,
  cargoZfw
) {

  if (cargoZfw <= 0) return 0

  return zfwMoment / cargoZfw

}
export function getTowArm(
  towMoment,
  takeoffWeight
) {

  if (takeoffWeight <= 0) return 0

  return towMoment / takeoffWeight

}
export function getFuelMoment(
  fuelWeight,
  fuelArm
) {

  return fuelWeight * fuelArm

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
  cargoWeights,
  takeoffFuel
)
 {

  const mainCargo = getMainCargo( selectedCargoAircraft, cargoWeights)

  const lowerCargo = getLowerCargo(selectedCargoAircraft,cargoWeights)

  const totalCargo = getTotalCargo(mainCargo, lowerCargo)

  const cargoZfw = getCargoZfw(selectedCargoAircraft,totalCargo)

  const availablePayload = getAvailablePayload(selectedCargoAircraft,cargoZfw)

  const mainDeckIndex = getMainDeckIndex(selectedCargoAircraft,cargoWeights)

  const lowerDeckIndex = getLowerDeckIndex(selectedCargoAircraft,cargoWeights)

  const totalCargoIndex = getTotalCargoIndex(mainDeckIndex,lowerDeckIndex)
  
  const mainDeckMoment = getMainDeckMoment(selectedCargoAircraft,cargoWeights)

  const lowerDeckMoment = getLowerDeckMoment(selectedCargoAircraft,cargoWeights)

  const totalCargoMoment = mainDeckMoment + lowerDeckMoment

  const basicMoment = getBasicMoment(selectedCargoAircraft)

  const zfwMoment = basicMoment + totalCargoMoment

  const zfwArm = getZfwArm(zfwMoment,cargoZfw)

  const fuelMoment = takeoffFuel * selectedCargoAircraft.fuelArm

  const towMoment = zfwMoment + fuelMoment

  const towArm = getTowArm(towMoment,cargoZfw + takeoffFuel)

  return {

    mainCargo,

    lowerCargo,

    totalCargo,

    cargoZfw,

    availablePayload,

    mainDeckIndex,

    lowerDeckIndex,

    totalCargoIndex,

    mainDeckMoment,

    lowerDeckMoment,

    totalCargoMoment,
    
    basicMoment,

    zfwMoment,

    zfwArm,

    fuelMoment,

    towArm,

    towMoment

  }

}
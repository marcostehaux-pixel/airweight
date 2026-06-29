export function getTakeoffFuel(fuel, taxiFuel) {
  return Math.max(fuel - taxiFuel, 0)
}

export function getRemainingFuel(fuel, taxiFuel, tripFuel) {
  return Math.max(
    fuel - taxiFuel - tripFuel,
    0
  )
}

export function calculateFuel(
  fuel,
  taxiFuel,
  tripFuel
) {

  const takeoffFuel =
    getTakeoffFuel(
      fuel,
      taxiFuel
    )

  const remainingFuel =
    getRemainingFuel(
      fuel,
      taxiFuel,
      tripFuel
    )

  return {

    fuel,

    taxiFuel,

    takeoffFuel,

    tripFuel,

    remainingFuel

  }

}

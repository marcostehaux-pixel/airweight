export function getTakeoffFuel(fuel, taxiFuel) {
  return Math.max(fuel - taxiFuel, 0)
}

export function getRemainingFuel(fuel, taxiFuel, tripFuel) {
  return Math.max(fuel - taxiFuel - tripFuel, 0)
}

export function getFuelIndex(fuel) {

  if (fuel <= 0) return 0

  const table = [

    [4000,1],
    [4900,2],
    [5500,3],
    [6000,4],
    [6500,5],
    [6800,6],
    [7200,7],
    [7500,8],
    [8300,9],
    [8700,10],
    [9200,11],
    [9700,12],
    [10800,14],
    [11400,15],
    [12800,16],
    [13600,17],
    [14200,18],
    [15000,19],
    [15700,20],
    [17250,22],
    [18000,23],
    [18600,24],
    [19250,25],
    [19900,26],
    [20400,28]

  ]

  for (const [limit, index] of table) {

    if (fuel <= limit) {
      return index
    }

  }

  return 28

}

export function calculateFuel(fuel, taxiFuel, tripFuel) {

  const takeoffFuel =
    getTakeoffFuel(fuel, taxiFuel)

  const remainingFuel =
    getRemainingFuel(fuel, taxiFuel, tripFuel)

  const fuelIndex =
    getFuelIndex(takeoffFuel)

  const tripFuelIndex =
    getFuelIndex(tripFuel)

  return {

    fuel,

    taxiFuel,

    takeoffFuel,

    tripFuel,

    remainingFuel,

    fuelIndex,

    tripFuelIndex

  }

}

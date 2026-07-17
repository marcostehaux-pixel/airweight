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
  [8750,8],
  [9200,7],
  [9700,6],
  [10200,5],
  [10800,4],
  [11400,3],
  [12000,2],
  [12800,1],
  [13600,0],
  [14250,-1],
  [15000,-2],
  [15750,-3],
  [16500,-4],
  [17250,-5],
  [18000,-6],
  [18600,-7],
  [19250,-8],
  [19900,-9],
  [20400,-10],
  [20800,-11]

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

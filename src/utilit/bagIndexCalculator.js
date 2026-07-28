const forwardBagTable = [
  { max: 100, index: -1 },
  { max: 300, index: -3 },
  { max: 500, index: -4 },
  { max: 600, index: -5 },
  { max: 800, index: -7 },
  { max: 900, index: -8 },
  { max: 1100, index: -9 },
  { max: 1200, index: -10 },
  { max: 1300, index: -11 },
  { max: 1400, index: -12 },
  { max: 1500, index: -13 },
  { max: 1600, index: -14 },
  { max: 1800, index: -15 },
  { max: 1900, index: -16 },
  { max: 2000, index: -17 },
  { max: 2100, index: -18 },
  { max: 2200, index: -19 },
  { max: 2400, index: -20 },
  { max: 2700, index: -23 },
  { max: 3000, index: -26 },
  { max: 3300, index: -28 },
  { max: 3558, index: -30 }
]

const aftBagTable = [
  { max: 200, index: 1 },
  { max: 400, index: 3 },
  { max: 600, index: 4 },
  { max: 800, index: 6 },
  { max: 1000, index: 7 },
  { max: 1200, index: 8 },
  { max: 1400, index: 10 },
  { max: 1600, index: 11 },
  { max: 1800, index: 13 },
  { max: 2000, index: 14 },
  { max: 2200, index: 15 },
  { max: 2400, index: 17 },
  { max: 2600, index: 18 },
  { max: 2800, index: 20 },
  { max: 3000, index: 21 },
  { max: 3200, index: 22 },
  { max: 3400, index: 24 },
  { max: 3600, index: 25 },
  { max: 3800, index: 27 },
  { max: 4000, index: 28 },
  { max: 4200, index: 29 },
  { max: 4444, index: 31 }
]
function interpolate(weight, table) {

  if (weight <= 0) return 0

  let previousWeight = 0
  let previousIndex = 0

  for (const point of table) {

    if (weight <= point.max) {

      const fraction =
        (weight - previousWeight) /
        (point.max - previousWeight)

      return (
        previousIndex +
        fraction * (point.index - previousIndex)
      )

    }

    previousWeight = point.max
    previousIndex = point.index

  }

  return table[table.length - 1].index

}
export function getForwardBagIndex(weight) {

  return interpolate(
    weight,
    forwardBagTable
  )

}

export function getAftBagIndex(weight) {

  return interpolate(
    weight,
    aftBagTable
  )

}
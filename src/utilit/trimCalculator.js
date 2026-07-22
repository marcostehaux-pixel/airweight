export const passengerTrimTable = {

  80: {
    16: 7.00,
    21: 6.06,
    23: 5.75,
    26: 5.25,
    30: 4.50,
    32: 4.25
  },

  75: {
    16: 6.75,
    21: 5.81,
    23: 5.50,
    26: 5.00,
    30: 4.38,
    32: 4.00
  },

  70: {
    16: 6.50,
    21: 5.56,
    23: 5.25,
    26: 4.75,
    30: 4.25,
    32: 3.75
  },

  65: {
    16: 6.13,
    21: 5.28,
    23: 5.00,
    26: 4.50,
    30: 4.00,
    32: 3.50
  },

  60: {
    16: 5.75,
    21: 5.00,
    23: 4.75,
    26: 4.25,
    30: 3.75,
    32: 3.25
  },

  55: {
    16: 5.50,
    21: 4.75,
    23: 4.50,
    26: 4.00,
    30: 3.50,
    32: 3.13
  },

  50: {
    16: 5.25,
    21: 4.50,
    23: 4.25,
    26: 3.75,
    30: 3.25,
    32: 3.00
  },

  40: {
    16: 4.75,
    21: 4.19,
    23: 4.00,
    26: 3.25,
    30: 3.00,
    32: 2.75
  }

}
export function calculatePassengerTrim(
  towKg,
  cgMac
) {

  const tow = towKg / 1000

  const weightRows =
    Object.keys(passengerTrimTable)
      .map(Number)
      .sort((a,b)=>a-b)

  const cgColumns =
    Object.keys(passengerTrimTable[80])
      .map(Number)
      .sort((a,b)=>a-b)

  let lowerWeight = weightRows[0]
  let upperWeight = weightRows[weightRows.length - 1]

  for (let i = 0; i < weightRows.length - 1; i++) {

    if (
      tow >= weightRows[i] &&
      tow <= weightRows[i + 1]
    ) {

      lowerWeight = weightRows[i]
      upperWeight = weightRows[i + 1]

      break
    }
  }

  let lowerCg = cgColumns[0]
  let upperCg = cgColumns[cgColumns.length - 1]

  for (let i = 0; i < cgColumns.length - 1; i++) {

    if (
      cgMac >= cgColumns[i] &&
      cgMac <= cgColumns[i + 1]
    ) {

      lowerCg = cgColumns[i]
      upperCg = cgColumns[i + 1]

      break
    }
  }

  const q11 =
    passengerTrimTable[lowerWeight][lowerCg]

  const q12 =
    passengerTrimTable[lowerWeight][upperCg]

  const q21 =
    passengerTrimTable[upperWeight][lowerCg]

  const q22 =
    passengerTrimTable[upperWeight][upperCg]

  const weightRatio =
    (tow - lowerWeight) /
    (upperWeight - lowerWeight || 1)

  const cgRatio =
    (cgMac - lowerCg) /
    (upperCg - lowerCg || 1)

  const trim =
    q11 * (1 - weightRatio) * (1 - cgRatio) +
    q21 * weightRatio * (1 - cgRatio) +
    q12 * (1 - weightRatio) * cgRatio +
    q22 * weightRatio * cgRatio

  return Number(trim.toFixed(2))
}
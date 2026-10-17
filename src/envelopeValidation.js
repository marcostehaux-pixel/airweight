export const isInsidePolygon = (x, y, polygon) => {
  let inside = false

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const xi = polygon[i][0]
    const yi = polygon[i][1]

    const xj = polygon[j][0]
    const yj = polygon[j][1]

    const intersect =
      (yi > y) !== (yj > y) &&
      x <
        ((xj - xi) * (y - yi)) /
          (yj - yi) +
          xi

    if (intersect) {
      inside = !inside
    }
  }

  return inside
}
export const passengerEnvelope = [
  [60, 50],
  [130, 160],
  [210, 310],
  [230, 310],
  [750, 70],
  [400, 50],
  [395, 50],
]

export const passengerZfwEnvelope = [
  [140, 170],
  [140, 180],
  [215, 310],
  [320, 310],
  [600, 170],
  [530, 170],
]

export const passengerMapIndex = (index) => {
  const min = 35
  const max = 90
  const left = 90
  const right = 750

  return (
    left +
    ((Number(index) - min) / (max - min)) *
    (right - left)
  )
}

export const passengerMapWeight = (weight) => {
  const minWeight = 40000
  const maxWeight = 85000
  const top = 60
  const bottom = 310

  return (
    bottom -
    ((Number(weight) - minWeight) /
      (maxWeight - minWeight)) *
      (bottom - top)
  )
}
export const validatePassengerEnvelope = ({
  zfi,
  toi,
  zfw,
  tow
}) => {
  const zfwX = passengerMapIndex(zfi)
  const towX = passengerMapIndex(toi)

  const zfwY = passengerMapWeight(zfw)
  const towY = passengerMapWeight(tow)

  const validInputs = [zfi, toi, zfw, tow].every(
    value => value !== null &&
      value !== undefined &&
      value !== '' &&
      Number.isFinite(Number(value))
  )

  if (!validInputs) {
    return {
      zfwInside: false,
      towInside: false
    }
  }

  return {
    zfwInside: isInsidePolygon(
      zfwX - 15,
      zfwY,
      passengerZfwEnvelope
    ),

    towInside: isInsidePolygon(
      towX,
      towY,
      passengerEnvelope
    )
  }
}
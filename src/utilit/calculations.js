export function calculateMoment(weight,arm) {return weight * arm}

export function calculateCG(totalMoment,totalWeight) {return totalMoment / totalWeight}

export function calculateMAC(arm,lemac,mac) {return (((arm - lemac) / mac) * 100)}

export function calculateIndex(moment) {return moment / 1000}

export function calculateTrim(arm) {return (18 - ((arm - 15) * 0.45))}

export function indexToArm(
  index,
  weight,
  referenceArm,
  indexConstant,
  indexOffset
) {
  return (
    ((index - indexOffset) * indexConstant) /
      weight +
    referenceArm
  )
}

export function armToIndex(
  arm,
  weight,
  referenceArm,
  indexConstant,
  indexOffset
) {
  return (
    indexOffset +
    (
      weight *
      (arm - referenceArm)
    ) /
    indexConstant
  )
}

export function getTotalMoment(momentList) {

  return momentList.reduce(
    (total, moment) => total + moment,
    0
  )

}

export function getArm(
  totalMoment,
  totalWeight
) {

  if (totalWeight <= 0) return 0

  return totalMoment / totalWeight

}
export function getMoment(
  weight,
  arm
) {

  return weight * arm

}
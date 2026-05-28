export function calculateMoment(

  weight,
  arm

) {

  return weight * arm

}

export function calculateCG(

  totalMoment,
  totalWeight

) {

  return totalMoment / totalWeight

}

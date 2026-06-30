export function getTakeoffWeight(cargoZfw, takeoffFuel) {

  return cargoZfw + takeoffFuel

}

export function getLandingWeight(cargoZfw, remainingFuel) {

  return cargoZfw + remainingFuel

}
export function getRampWeight(
  cargoZfw,
  fuel
) {

  return (
    cargoZfw +
    fuel
  )

}
export function calculateWeight(
  cargoZfw,
  takeoffFuel,
  remainingFuel
) 

{

  const takeoffWeight =
    getTakeoffWeight(
      cargoZfw,
      takeoffFuel
    )

  const landingWeight =
    getLandingWeight(
      cargoZfw,
      remainingFuel
    )

  return {

    takeoffWeight,

    landingWeight

  }

}
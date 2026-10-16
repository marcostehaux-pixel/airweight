// OPERDAT Training
// Training routes database
// FOR TRAINING PURPOSES ONLY

export const trainingRoutes = [
  {
    id: "SAAR-SBGL-01",
    from: "SAAR",
    to: "SBGL",
    aircraft: "B738",
    
waypoints: [
  "ROS",
  "ANRAL",
  "DALAB",
  "SUGRA",
  "ENSAS",
  "LOLIL",
  "ILSIM",
  "NELOX",
  "AKNUB",
  "SBGL"
],
 distanceNM: 1195,
complete: false,
navigationVerified: false,
testEnabled: true,
referenceCruiseLevel: 370,
referenceStepClimbLevel: 390,
routeText: "SAAR R02 DCT ROS UM534 NELOX UN857 AKNUB EPGIP3A SBGL",
source: "GOL G37617 OFP - 17NOV2018 - SAAR/SBGL",
    trainingOnly: true
  }, 
{
  id: "SBGL-SBKP-01",
  from: "SBGL",
  to: "SBKP",
  aircraft: "B738",
  waypoints: [
    "UMBAD",
    "KEVUN",
    "LODOG",
    "NIBRU",
    "PAGOG",
    "SBKP"
  ],
  distanceNM: 319,
  complete: true,
  navigationVerified: true,
  routeText: "SBGL DCT UMBAD UZ44 PAGOG DCT SBKP",
  source: "GOL G37617 OFP - 17NOV2018 - SBGL/SBKP",
  trainingOnly: true
}

];
export function findTrainingRoute(from, to, aircraft) {
  return trainingRoutes.find(
    (route) =>
      route.from === from &&
      route.to === to &&
      route.aircraft === aircraft
  ) ?? null;
}

export function getAvailableDestinations(from, aircraft) {
  return [
    ...new Set(
      trainingRoutes
        .filter(
          (route) =>
            route.from === from &&
            route.aircraft === aircraft &&

(
  (route.complete === true &&
    route.navigationVerified === true) ||
  route.testEnabled === true
) &&

            Number.isFinite(route.distanceNM) &&
            route.distanceNM > 0 &&
            route.waypoints.length > 0
        )
        .map((route) => route.to)
    )
  ];
}
// OPERDAT TRAINING
// Available departure airports

export function getAvailableOrigins(aircraft = "B738") {
  return [
    ...new Set(
      trainingRoutes
        .filter(
          (route) =>
            route.aircraft === aircraft &&
            (
              (route.complete === true &&
                route.navigationVerified === true) ||
              route.testEnabled === true
            ) &&
            Number.isFinite(route.distanceNM) &&
            route.distanceNM > 0 &&
            Array.isArray(route.waypoints) &&
            route.waypoints.length > 0
        )
        .map((route) => route.from)
    )
  ].sort();
}
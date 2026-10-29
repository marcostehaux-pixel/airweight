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
},
{
  id: "SBGL-SAAR-01",
  from: "SBGL",
  to: "SAAR",
  aircraft: "B738",

  waypoints: [
    "IHIA",
    "BITAK",
    "NELOX",
    "ROS",
    "SAAR"
  ],

  distanceNM: 1162,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 360,

  routeText:
    "SBGL R10 IHIA BITAK UN857 NELOX UM534 ROS DCT SAAR R20",

  source:
    "GOL G37616 OFP - 01MAR2018 / 11NOV2018 - SBGL/SAAR",

  trainingOnly: true
},
{
  id: "SAAR-SBPA-01",
  from: "SAAR",
  to: "SBPA",
  aircraft: "B738",

  waypoints: [
    "ROS",
    "ESBAV",
    "SBPA"
  ],

  distanceNM: 584,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 370,

  routeText:
    "SAAR DCT ROS UM534 ESBAV DCT SBPA",

  source:
    "GOL G37616 OFP - 01MAR2018 / 11NOV2018 - SAAR/SBPA alternate",

  trainingOnly: true
},
{
  id: "SAAR-SUMU-01",
  from: "SAAR",
  to: "SUMU",
  aircraft: "B738",

  waypoints: [
    "MULTA",
    "SNT",
    "EZE",
    "DORVO",
    "TOKAM",
    "SUMU"
  ],

  distanceNM: 321,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 330,

  routeText:
    "SAAR DCT MULTA UW24 SNT DCT EZE UM424 DORVO DCT TOKAM DCT SUMU",

  source:
    "GOL G37616 OFP - 11NOV2018 - SAAR/SUMU alternate",

  trainingOnly: true
},
{
  id: "SAAR-SBGR-01",
  from: "SAAR",
  to: "SBGR",
  aircraft: "B738",

  waypoints: ["SAAR", "SBGR"],

  distanceNM: 1000,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 370,
  referenceStepClimbLevel: 390,

  routeText:
    "SAAR → SBGR — SIMULATED TRAINING ROUTE",

  source:
    "GOL GLO7469 OFP - 02FEB2015 - SAAR/SBGR",

  trainingOnly: true
},
{
  id: "SBGR-SBGL-01",
  from: "SBGR",
  to: "SBGL",
  aircraft: "B738",

  waypoints: [
    "VULET",
    "ESORU",
    "SBGL"
  ],

  distanceNM: 210,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 290,

  routeText:
    "SBGR VULE1A VULET UZ42 ESORU EPGI1A SBGL",

  source:
    "GOL GLO7469 OFP - 02FEB2015 - SBGR/SBGL alternate",

  trainingOnly: true
},
{
  id: "SBGR-SBKP-01",
  from: "SBGR",
  to: "SBKP",
  aircraft: "B738",

  waypoints: [
    "BCO",
    "SOVLO",
    "UMRIX",
    "OBDIK",
    "DADGO",
    "SBKP"
  ],

  distanceNM: 89,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 150,

  routeText:
    "SBGR DCT BCO DCT SOVLO DCT UMRIX DCT OBDIK DCT DADGO DCT SBKP",

  source:
    "GOL GLO7469 OFP - 02FEB2015 - SBGR/SBKP alternate",

  trainingOnly: true
},
{
  id: "SBGL-SBFL-01",
  from: "SBGL",
  to: "SBFL",
  aircraft: "B738",

  waypoints: [
    "SBGL",
    "SBFL"
  ],

  distanceNM: 420,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 340,

  routeText:
    "SBGL DCT SBFL — SIMULATED TRAINING ROUTE",

  source:
    "OPERDAT Training - Provisional simulated route",

  trainingOnly: true
},
{
  id: "SAZM-SCEL-01",
  from: "SAZM",
  to: "SCEL",
  aircraft: "B738",

  waypoints: [
    "MDP",
    "DIL",
    "ARATA",
    "LYE",
    "DOZ",
    "UMKAL",
    "SCEL"
  ],

  distanceNM: 759,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 350,

  routeText:
    "SAZM MDP DIL UW15 ARATA LYE UA306 DOZ UMKAL SCEL",

  source:
    "Historical Jeppesen OFP - 24OCT2002 - SAZM/SCEL - B737-200 route adapted for B738 training",

  trainingOnly: true
},
{
  id: "SCEL-SAME-01",
  from: "SCEL",
  to: "SAME",
  aircraft: "B738",

  waypoints: [
    "SAME"
  ],

  distanceNM: 106,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 150,

  routeText:
    "SCEL DCT SAME — SIMULATED TRAINING ROUTE",

  source:
    "Historical Jeppesen OFP - 24OCT2002 - SCEL/SAME alternate",

  trainingOnly: true
},
{
  id: "SACO-SBSV-01",
  from: "SACO",
  to: "SBSV",
  aircraft: "B738",

  waypoints: [
    "TRAVOL",
    "TREJO",
    "FOZ",
    "BRU",
    "NEBAS",
    "LUTVA",
    "SBSV"
  ],

  distanceNM: 1900,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 390,
  referenceStepClimbLevel: 410,

  routeText:
    "SACO TRAVOL TREJO UL531 FOZ UZ65 BRU UM654 NEBAS UZ19 LUTVA ASUG1A SBSV",

  source:
    "GOL GLO9243 OFP - 30JUL2017 - SACO/SBSV",

  trainingOnly: true
},
{
  id: "SBSV-SBSG-01",
  from: "SBSV",
  to: "SBSG",
  aircraft: "B738",

  waypoints: [
    "SBSV",
    "SBSG"
  ],

  distanceNM: 479,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 330,

  routeText:
    "SBSV DCT SBSG — SIMULATED TRAINING ROUTE",

  source:
    "GOL GLO9243 OFP - 30JUL2017 - SBSV/SBSG alternate",

  trainingOnly: true
},
{
  id: "SBSV-SBRF-01",
  from: "SBSV",
  to: "SBRF",
  aircraft: "B738",

  waypoints: [
    "SBSV",
    "SBRF"
  ],

  distanceNM: 367,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 290,

  routeText:
    "SBSV DCT SBRF — SIMULATED TRAINING ROUTE",

  source:
    "GOL GLO9243 OFP - 30JUL2017 - SBSV/SBRF alternate",

  trainingOnly: true
},
{
  id: "SAAR-SACO-01",
  from: "SAAR",
  to: "SACO",
  aircraft: "B738",

  waypoints: [
    "ROS",
    "CBA",
    "SACO"
  ],

  distanceNM: 220,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 340,

  routeText:
    "SAAR DCT ROS UW5 CBA DCT SACO",

  source:
    "GOL GLO7612 OFP - 15MAY2017 - SAAR/SACO",

  trainingOnly: true
},
{
  id: "SACO-SAAR-01",
  from: "SACO",
  to: "SAAR",
  aircraft: "B738",

  waypoints: [
    "CBA",
    "ROS",
    "SAAR"
  ],

  distanceNM: 217,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 190,

  routeText:
    "SACO DCT CBA DCT ROS DCT SAAR — SIMULATED TRAINING ROUTE",

  source:
    "GOL GLO7612 OFP - 15MAY2017 - SACO/SAAR alternate",

  trainingOnly: true
},
{
  id: "SACO-SBPA-01",
  from: "SACO",
  to: "SBPA",
  aircraft: "B738",

  waypoints: [
    "SACO",
    "SBPA"
  ],

  distanceNM: 680,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 350,

  routeText:
    "SACO DCT SBPA — SIMULATED TRAINING ROUTE",

  source:
    "GOL GLO7612 OFP - 15MAY2017 - SACO/SBPA alternate",

  trainingOnly: true
},
{
  id: "SBGR-SPIM-01",
  from: "SBGR",
  to: "SPIM",
  aircraft: "B738",

  waypoints: [
    "SCB",
    "VIR",
    "PAZ",
    "ILO",
    "LIM",
    "SPIM"
  ],

  distanceNM: 2000,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 350,
  referenceStepClimbLevel: 380,

  routeText:
    "SBGR CGO3 SCB UM415 VIR UA304 PAZ UA573 ILO UV1 LIM DCT SPIM",

  source:
    "GOL GLO1111 OFP - 31DEC2009 - SBGR/SPIM",

  trainingOnly: true
},
{
  id: "SPIM-SPRU-01",
  from: "SPIM",
  to: "SPRU",
  aircraft: "B738",

  waypoints: [
    "SPIM",
    "SPRU"
  ],

  distanceNM: 285,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 250,

  routeText:
    "SPIM DCT SPRU — SIMULATED TRAINING ROUTE",

  source:
    "GOL GLO1111 OFP - 31DEC2009 - SPIM/SPRU alternate",

  trainingOnly: true
},
{
  id: "SPIM-SPSO-01",
  from: "SPIM",
  to: "SPSO",
  aircraft: "B738",

  waypoints: [
    "SPIM",
    "SPSO"
  ],

  distanceNM: 135,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 150,

  routeText:
    "SPIM DCT SPSO — SIMULATED TRAINING ROUTE",

  source:
    "GOL GLO1111 OFP - 31DEC2009 - SPIM/SPSO alternate",

  trainingOnly: true
},
{
  id: "SCEL-SCFA-01",
  from: "SCEL",
  to: "SCFA",
  aircraft: "B738",

  waypoints: [
    "DONTI",
    "TENUT",
    "ITAVA",
    "KUGAP",
    "EDRON",
    "TITKI",
    "ANDAK",
    "KILIN",
    "VUGUS",
    "PUNAP",
    "ILSOT",
    "DOVKA",
    "PUNSO",
    "DOVRI",
    "LOMUN",
    "SCFA"
  ],

  distanceNM: 605,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 350,

  routeText:
    "SCEL DONTI6A DONTI Q802 DOVRI DOVRI6C LOMUN ILS RWY01 SCFA",

  source:
    "AIP Chile - SCEL SID DONTI 6A / Q802 / SCFA STAR DOVRI 6C / ILS RWY 01 - Simulated training distance",

  trainingOnly: true
},
{
  id: "SCFA-SCDA-01",
  from: "SCFA",
  to: "SCDA",
  aircraft: "B738",

  waypoints: [
    "ARPOM",
    "GAXIR",
    "SIREX",
    "KETUM",
    "DA357",
    "DA025",
    "BOKIK",
    "SCDA"
  ],

  distanceNM: 225,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 190,

  routeText:
    "SCFA ARPOM3B ARPOM Q802 GAXIR GAXIR6B BOKIK ILS Z RWY19 SCDA",

  source:
    "AIP Chile - SCFA SID ARPOM 3B / Q802 / SCDA STAR GAXIR 6B / ILS Z RWY 19 - Simulated training distance",

  trainingOnly: true
},
{
  id: "SCEL-SCIE-01",
  from: "SCEL",
  to: "SCIE",
  aircraft: "B738",

  waypoints: [
    "GELUS",
    "DALAX",
    "ETAGA",
    "ARUNI",
    "IE461",
    "IE344",
    "MASLI",
    "DAPSO",
    "SCIE"
  ],

  distanceNM: 275,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 250,

  routeText:
    "SCEL GELUS6A GELUS Q809 ARUNI ARUNI1D DAPSO ILS W RWY02 SCIE",

  source:
    "AIP Chile - SCEL SID GELUS 6A / Q809 / SCIE STAR ARUNI 1D / ILS W RWY 02 - Simulated training distance",

  trainingOnly: true
},
{
  id: "SCIE-SCQP-01",
  from: "SCIE",
  to: "SCQP",
  aircraft: "B738",

  waypoints: [
    "MUBUG",
    "DAGEN",
    "PANEX",
    "ILNUT",
    "NEKOR",
    "KOLTI",
    "PULMO",
    "DORGA",
    "QP026",
    "SCQP"
  ],

  distanceNM: 215,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 190,

  routeText:
    "SCIE PANEX3M PANEX Q809 NEKOR NEKOR4B KOLTI RNP RWY19 SCQP",

  source:
    "AIP Chile - SCIE SID PANEX 3M / Q809 / SCQP STAR NEKOR 4B / RNP RWY 19 - Simulated training distance",

  trainingOnly: true
},
{
  id: "LEBL-LEMD-01",
  from: "LEBL",
  to: "LEMD",
  aircraft: "B738",

  waypoints: [
    "GAVMA",
    "BL829",
    "BL806",
    "BL836",
    "SENIA",
    "DORMI",
    "CRETA",
    "NEXAS",
    "CMA",
    "EDIMU",
    "TERSA",
    "MD540",
    "MD535",
    "NOSKO",
    "MD530",
    "RUDBI",
    "MD519",
    "MD516",
    "MD11L",
    "LEMD"
  ],

  distanceNM: 290,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 290,

  routeText:
    "LEBL SENIA4P SENIA Z596 TERSA TERSA4Z RUDBI ILS W RWY32L LEMD",

  source:
    "AIP España / ENAIRE INSIGNIA - AIRAC OCT2026 - Training scenario",

  
  trainingOnly: true
},
{
  id: "LEMD-LEVD-01",
  from: "LEMD",
  to: "LEVD",
  aircraft: "B738",

  waypoints: [
    "LEMD",
    "NVS",
    "AVILA",
    "NUB",
    "LEVD"
  ],

  distanceNM: 150,

  complete: false,
  navigationVerified: false,
  testEnabled: true,

  referenceCruiseLevel: 150,

  routeText:
    "LEMD DCT NVS DCT AVILA DCT NUB ILS RWY23 LEVD - SIMULATED TRAINING ROUTE",

  source:
    "OPERDAT Training - Provisional alternate route. LEVD IAC 2 ILS RWY23",

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
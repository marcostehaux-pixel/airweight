import Login from './Login'
import { getCargoFuelIndex } from './utilit/cargoFuelIndex'
import aircraftCargoDatabase from './data/aircraftCargoDatabase'
import {getLowerDeckIndex} from './utilit/cargoCalculator'
import {getMainDeckIndex} from './utilit/cargoCalculator'
import {getMainCargo} from './utilit/cargoCalculator'
import {getTotalCargoIndex} from './utilit/cargoCalculator'
import {getLowerCargo} from './utilit/cargoCalculator'
import {getCargoZfw} from './utilit/cargoCalculator'
import {getAvailablePayload} from './utilit/cargoCalculator'
import {getTotalCargo} from './utilit/cargoCalculator'
import {calculateCargoBalance} from './utilit/cargoCalculator'
import {getZeroFuelIndex,getTakeoffIndex,getLandingIndex,getCG} from './utilit/cgCalculator'
import { getCgFromIndex } from './utilit/indexToCG'
import { calculateWeight } from './utilit/weightCalculator'
import {getTotalMoment, getArm} from './utilit/passengerMomentCalculator.js'
import { useState, useEffect } from 'react'
import { calculateFuel,getFuelIndex} from './utilit/fuelCalculator'
import './App.css'
import StatusCard from './components/StatusCard'
import a320Perfil from './assets/A320 perfil.png'
import b737cfPerfil from './assets/b737cfPerfil.png'
import b737Perfil from './assets/b737 perfil.png'
import EnvelopeChart from './components/EnvelopeChart'
import { generateFreighterLoadsheet } from './utilit/generateFreighterLoadsheet'
import { generateWeatherPdf } from './utilit/generateWeatherPdf'
import {lowerDeckFactors,mainDeckTables} from './utilit/cargoIndexTables'
import FreighterEnvelope from './components/FreighterEnvelope'
import { generateCargoLoadOrder } from './utilit/generateCargoLoadOrder'
import {
  getForwardBagIndex,
  getAftBagIndex
} from './utilit/bagIndexCalculator'
import { calculatePassengerTrim } from './utilit/trimCalculator'
function getMainIndex(position,weight){
if(!mainDeckTables[position])
return 0

const row= mainDeckTables[position].find(v=> Number(weight)<=v.kg)

return row
?row.index:0
}

import { getMetar } from "./api/metar"
async function getTaf(icao){

try{

const response =
await fetch(

`/api/taf?icao=${icao}`

)

const data =
await response.json()

return data.taf

}

catch{

return null

}

}
import aircraftDatabase from './data/aircraftDatabase'
import {
  calculateMoment,
  calculateCG,
  calculateMAC,
  calculateIndex,
  calculateTrim,
  indexToArm,
  armToIndex
} from './utilit/calculations'
import SeatMap from './components/SeatMap'

import CargoPanel from './components/CargoPanel'
import generateLoadsheet from './utils/generateLoadsheet'

import logo from './assets/logo.png'
import aircraftImage from './assets/a320.png'
function App() {
const [logged,setLogged]=useState(false)
const [userRole, setUserRole] = useState(null)
const [tripFuel, setTripFuel] = useState(0)
const [taxiFuel,setTaxiFuel ]= useState(0)
const [fuel, setFuel] = useState(0)
const [selectedAircraft,setSelectedAircraft] = useState(aircraftDatabase[0])
const [selectedCargoAircraft,setSelectedCargoAircraft] = useState(aircraftCargoDatabase[0]
)
function clearCargo(){setCargoWeights(
{}
)
}
const [flightFrom, setFlightFrom] = useState('')
const [flightTo, setFlightTo] = useState('')
const [cargoWeights, setCargoWeights]=useState({})
const [metar, setMetar] = useState(null)
useEffect(() => {

async function loadMetar(){

if(
flightFrom
.trim()
.length !== 4
){

setMetar(null)
console.log(
  'selectedAircraft',
  selectedAircraft?.registration
)

console.log(
  'selectedCargoAircraft',
  selectedCargoAircraft?.registration
)
return

}

const result =
await getMetar(
flightFrom
.toUpperCase()
)

setMetar(result)

}

loadMetar()

}, [flightFrom])
async function searchAirportWeather(){

const airports =
weatherAirport

.split(",")

.map(

a => a.trim()

.toUpperCase()

)

.filter(

a => a.length === 4

)

if(

airports.length===0

){

setSearchMetar(null)

setSearchTaf(null)

return

}

let metarResult=[]

let tafResult=[]

for(

const icao of airports

){

const metar =
await getMetar(
icao
)

metarResult.push(

`${icao}

${metar || "METAR unavailable"}`

)

try{

const response =
await fetch(

`/api/taf?icao=${icao}`

)

const data =
await response.json()

tafResult.push(

`${icao}

${data.taf || "TAF unavailable"}`

)

}

catch{

tafResult.push(

`${icao}

TAF unavailable`

)

}

}

setSearchMetar(

metarResult.join(

"\n\n"

)

)

setSearchTaf(

tafResult.join(

"\n\n"

)

)

}
const [metarTo, setMetarTo] = useState(null)
useEffect(() => {

async function loadMetarTo(){

if(
flightTo
.trim()
.length !== 4
){

setMetarTo(null)

return

}

const result =
await getMetar(
flightTo
.toUpperCase()
)

setMetarTo(result)

}

loadMetarTo()

}, [flightTo])
const [

flightNumber,

setFlightNumber

]=

useState(

''

)
function closeFreighterFlight(id) {

  setCargoFlightRecords(
    previous =>
      previous.map(flight =>

        flight.id === id
          ? {
              ...flight,

              status: 'CLOSED',

              closedAt:
                new Date().toISOString()
            }

          : flight
      )
  )

  if (
    id === activeFreighterFlightId
  ) {

    setActiveFreighterFlightId(null)

  }
}
function openFreighterFlight(id) {

  const flight =
    cargoFlightRecords.find(
      item => item.id === id
    )

  if (!flight) {
    console.log(
      'Flight not found:',
      id
    )
    return
  }

  if (flight.status !== 'OPEN') {
    return
  }

  console.log(
    'OPENING FLIGHT:',
    flight.id,
    flight.flightNumber
  )

  // Este pasa a ser el vuelo activo
  setActiveFreighterFlightId(
    flight.id
  )

  // Flight data
  setCargoFlightNumber(
    flight.flightNumber || ''
  )

  setCargoFlightFrom(
    flight.from || ''
  )

  setCargoFlightTo(
    flight.to || ''
  )
setPerformanceMaxTow(
  flight.performanceMaxTow ?? ''
)
  // Cargo distribution
  setCargoWeights({
    ...(flight.cargoWeights || {})
  })

  // Fuel
  setFuel(
  Number(
    flight.rampFuel ??
    flight.blockFuel
  ) || 0
)
  setTaxiFuel(
    Number(flight.taxiFuel) || 0
  )

  setTripFuel(
    Number(flight.tripFuel) || 0
  )

  // Go to Freighter
  setActiveMenu(
    'FreighterLoadsheet'
  )
}
function printClosedFreighterFlight(flight) {

  if (flight.status !== 'CLOSED') {
    return
  }

  generateFreighterLoadsheet({

    registration:
      flight.registration,

    cargoFlightFrom:
      flight.from,

    cargoFlightTo:
      flight.to,

    cargoFlightNumber:
      flight.flightNumber,

    cargoMetarFrom:
      flight.cargoMetarFrom || '',

    cargoMetarTo:
      flight.cargoMetarTo || '',

    basicWeight:
      flight.basicWeight,

    basicIndex:
      flight.basicIndex,

    maxZFW:
      flight.maxZFW,

    maxTOW:
      flight.maxTOW,

    maxLW:
      flight.maxLW,

    mainCargo:
      flight.mainCargo,

    lowerCargo:
      flight.lowerCargo,

    totalCargo:
      flight.totalCargo,

    cargoZfw:
      flight.zfw,

    rampWeight:
      flight.rampWeight,

    takeoffWeight:
      flight.tow,

    landingWeight:
      flight.lw,

    cargoZfwIndex:
      flight.zfwIndex,

    cargoTowIndex:
      flight.towIndex,

    cargoLandingIndex:
      flight.lwIndex,

    cargoZfwCg:
      flight.zfwCg,

    cargoTowCg:
      flight.towCg,

    cargoLandingCg:
      flight.lwCg,

    blockFuel:
      flight.rampFuel ??
      flight.blockFuel ??
      0,

    taxiFuel:
      flight.taxiFuel,

    takeoffFuel:
      flight.takeoffFuel,

    tripFuel:
      flight.tripFuel,

    cargoWeights:
      flight.cargoWeights || {}
  })
}
function printClosedLoadOrder(flight) {

  if (flight.status !== 'CLOSED') {
    return
  }

  generateCargoLoadOrder({

    registration:
      flight.registration,

    cargoFlightFrom:
      flight.from,

    cargoFlightTo:
      flight.to,

    cargoFlightNumber:
      flight.flightNumber,

    cargoWeights:
      flight.cargoWeights || {},

    mainCargo:
      flight.mainCargo || 0,

    lowerCargo:
      flight.lowerCargo || 0,

    totalCargo:
      flight.totalCargo || 0
  })
}
function newFreighterFlight() {

  setActiveFreighterFlightId(null)

  setCargoFlightNumber('')
  setCargoFlightFrom('')
  setCargoFlightTo('')

  setCargoWeights({})

setFuel(0)
setTaxiFuel(0)
setTripFuel(0)
setPerformanceMaxTow('')
  setActiveMenu('FreighterLoadsheet')
}

  const [forwardCargo, setForwardCargo] =
  useState(0)

const [aftCargo, setAftCargo] =
  useState(0)
  const [selectedSeats, setSelectedSeats] =
  useState([])
  const [fwdCabinPax, setFwdCabinPax] =
useState(0)

const [midCabinPax, setMidCabinPax] =
useState(0)

const [aftCabinPax, setAftCabinPax] =
useState(0)
// FWD CABIN
const [fwdAdults, setFwdAdults] = useState(0)
const [fwdChildren, setFwdChildren] = useState(0)
const [fwdInfants, setFwdInfants] = useState(0)

// MID CABIN
const [midAdults, setMidAdults] = useState(0)
const [midChildren, setMidChildren] = useState(0)
const [midInfants, setMidInfants] = useState(0)

// AFT CABIN
const [aftAdults, setAftAdults] = useState(0)
const [aftChildren, setAftChildren] = useState(0)
const [aftInfants, setAftInfants] = useState(0)
const [activeMenu, setActiveMenu] =
  useState(userRole === 'freighter' ? 'FreighterLoadsheet' : 'Dashboard')
  console.log('ACTIVE MENU:', activeMenu)
 const passengerWeight =

(fwdAdults + midAdults + aftAdults) * 80 +

(fwdChildren + midChildren + aftChildren) * 40 +

(fwdInfants + midInfants + aftInfants) * 20
  const forwardSeats =

selectedSeats.filter(

seat => seat <= 59

).length

const midSeats =

selectedSeats.filter(

seat =>

seat > 59 &&

seat <= 129

).length

const aftSeats = selectedSeats.filter(
  seat => seat > 129 && seat <= 180

).length
const paxMoment =

  calculateMoment(

    passengerWeight,

    selectedAircraft.seatArmMid

  )
  const calculatedFwdCabinPax = fwdAdults + fwdChildren
const calculatedMidCabinPax = midAdults + midChildren
const calculatedAftCabinPax = aftAdults + aftChildren
  const payload = passengerWeight + forwardCargo + aftCargo
const zfw = selectedAircraft.basicWeight + passengerWeight + forwardCargo + aftCargo 

const rw = zfw + fuel
const fuelData = calculateFuel(fuel,taxiFuel,tripFuel)
const [
  performanceMaxTow,
  setPerformanceMaxTow
] = useState('')
const {
  mainCargo,
  lowerCargo,
  totalCargo,
  cargoZfw,
  availablePayload,
  mainDeckIndex,
  lowerDeckIndex,
  totalCargoIndex,
  mainDeckMoment,
  lowerDeckMoment,
  totalCargoMoment,
  zfwArm,
towArm
} = calculateCargoBalance(
  selectedCargoAircraft,
  cargoWeights,
  fuelData.takeoffFuel
)
const effectiveMaxTow =
  performanceMaxTow &&
  Number(performanceMaxTow) > 0
    ? Math.min(
        selectedCargoAircraft.maxTOW,
        Number(performanceMaxTow)
      )
    : selectedCargoAircraft.maxTOW
const payloadCapacity =
  totalCargo + availablePayload

const loadedPercent =
  payloadCapacity > 0
    ? (totalCargo / payloadCapacity) * 100
    : 0
const weightData = calculateWeight(
  cargoZfw,
  fuel,
  fuelData.takeoffFuel,
  fuelData.remainingFuel
)


const rampWeight = cargoZfw + fuel
const basicArm = selectedAircraft.lemac + (selectedAircraft.mac *22) /100

const basicMoment =(selectedAircraft.basicWeight || 0) * basicArm

const passengerMoment = selectedSeats.reduce((total,seat)=>{

const row = Math.ceil(seat /6)

let rowArm = selectedAircraft.seatArmMid 
if (row <= 8) {rowArm = selectedAircraft.seatArmFwd}
else if (row <= 18) {rowArm =selectedAircraft.seatArmMid}
else {rowArm = selectedAircraft.seatArmAft}
return (total + calculateMoment(84,rowArm))}, 0)
const fwdPax = selectedSeats.filter(seat => {

  const row = Math.ceil((seat + 1) / 6)

  return row >= 1 && row <= 10

}).length

const midPax = selectedSeats.filter(seat => {

  const row = Math.ceil((seat + 1) / 6)

  return row >= 11 && row <= 22

}).length

const aftPax = selectedSeats.filter(seat => {

  const row = Math.ceil((seat + 1) / 6)

  return row >= 23 && row <= 30

}).length
selectedSeats.forEach(seat => {

  const row = Math.ceil((seat + 1) / 6)

  console.log({

    seat,

    row

  })

})
const paxIndex = (fwdPax * -0.7) + (aftPax * 0.7)
console.log({
  fwdPax,
  midPax,
  aftPax,
  paxIndex
})
const FuelMoment = calculateMoment(fuel,selectedAircraft.FuelArm)
const forwardCargoMoment = forwardCargo * selectedAircraft.forwardCargoArm
const aftCargoMoment = aftCargo * selectedAircraft.aftCargoArm
const totalMoment = basicMoment + passengerMoment + FuelMoment + forwardCargoMoment + aftCargoMoment
const tow = rw - taxiFuel

const ldw = tow - tripFuel

const lw = ldw
const arm = tow > 0? (totalMoment / tow) : 0
const cg = arm > 0 ? (( arm - selectedAircraft.lemac) / selectedAircraft.mac) * 100 : 0
const [extraCrew,setExtraCrew] = useState(0)
const [ catering,setCatering] = useState( 0 )
const dow = selectedAircraft.basicWeight
const cateringWeight = catering ? 250 :0
const effectiveBasicWeight = dow + (extraCrew *85) + cateringWeight
const crewConfiguration = extraCrew > 0 ? `2/${4 + extraCrew}` : selectedAircraft.basicConfig
const basicWeightDelta = effectiveBasicWeight - selectedAircraft.basicWeight
const effectiveBasicMoment = (extraCrew * 85 * 360) + (catering ? 250 * 420 : 0)
const doi = selectedAircraft.basicIndex + (extraCrew * 0.1)

const cargoDow = selectedCargoAircraft.basicWeight

const cargoDoi =
  selectedCargoAircraft.basicIndex + (extraCrew * 0.1)

const cargoEffectiveBasicIndex =
  cargoDoi +
  (extraCrew * 0.1) +
  (catering ? 0.2 : 0)

const cargoZfwIndex = getZeroFuelIndex(
  cargoEffectiveBasicIndex,
  totalCargoIndex
)
const cargoFuelIndex = getCargoFuelIndex(
  fuelData.takeoffFuel
)

const cargoTripFuelIndex = getCargoFuelIndex(
  fuelData.tripFuel
)

const cargoTowIndex = getTakeoffIndex(
  cargoZfwIndex,
  cargoFuelIndex
)

const cargoLandingIndex = getLandingIndex(
  cargoTowIndex,
  cargoTripFuelIndex
)


const cargoZfwArm = indexToArm(
  cargoZfwIndex,
  cargoZfw,
  selectedCargoAircraft.indexReferenceArm,
  selectedCargoAircraft.indexConstant,
  selectedCargoAircraft.indexOffset
)

const cargoTowArm = indexToArm(
  cargoTowIndex,
  weightData.takeoffWeight,
  selectedCargoAircraft.indexReferenceArm,
  selectedCargoAircraft.indexConstant,
  selectedCargoAircraft.indexOffset
)

const cargoLandingArm = indexToArm(
  cargoLandingIndex,
  weightData.landingWeight,
  selectedCargoAircraft.indexReferenceArm,
  selectedCargoAircraft.indexConstant,
  selectedCargoAircraft.indexOffset
)

const cargoZfwCg = getCgFromIndex(
  cargoZfwIndex,
  cargoZfw
)
console.log(
  'ZFW CG DEBUG:',
  {
    cargoZfwIndex,
    cargoZfwArm,
    cargoZfwCg
  }
)
const cargoTowCg = getCgFromIndex(
  cargoTowIndex,
  weightData.takeoffWeight
)

const cargoLandingCg = getCgFromIndex(
  cargoLandingIndex,
  weightData.landingWeight
)
console.log('CARGO CG TABLE DEBUG', {
  zfw: {
    weight: cargoZfw,
    index: cargoZfwIndex,
    cg: cargoZfwCg
  },
  tow: {
    weight: weightData.takeoffWeight,
    index: cargoTowIndex,
    cg: cargoTowCg
  },
  lw: {
    weight: weightData.landingWeight,
    index: cargoLandingIndex,
    cg: cargoLandingCg
  }
})
function isInsideFreighterEnvelope(
  index,
  weight
) {

  const polygon = [
    { index: 29.5, weight: 36200 },
    { index: 28.5, weight: 40000 },
    { index: 28.5, weight: 78000 },
    { index: 48.0, weight: 79000 },
    { index: 74.0, weight: 78200 },
    { index: 82.0, weight: 73500 },
    { index: 47.5, weight: 36200 }
  ]

  let inside = false

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {

    const xi = polygon[i].index
    const yi = polygon[i].weight

    const xj = polygon[j].index
    const yj = polygon[j].weight

    const intersect =
      ((yi > weight) !== (yj > weight)) &&
      (
        index <
        ((xj - xi) * (weight - yi)) /
        (yj - yi) +
        xi
      )

    if (intersect) {
      inside = !inside
    }
  }

  return inside
}
const cargoZfwInsideEnvelope =
  isInsideFreighterEnvelope(
    cargoZfwIndex,
    cargoZfw
  )

const cargoTowInsideEnvelope =
  isInsideFreighterEnvelope(
    cargoTowIndex,
    weightData.takeoffWeight
  )

const cargoLwInsideEnvelope =
  isInsideFreighterEnvelope(
    cargoLandingIndex,
    weightData.landingWeight
  )
  const cargoPositionOverLimit = [

  ...selectedCargoAircraft.cargoConfig.mainDeck,

  ...selectedCargoAircraft.cargoConfig.lowerDeck

].find(position => {

  const loaded =
    Number(
      cargoWeights[position.id] || 0
    )

  return loaded > position.max
})

const freighterPrintValid =
  !cargoPositionOverLimit &&
  cargoZfw <= selectedCargoAircraft.maxZFW &&
  weightData.takeoffWeight <=
    effectiveMaxTow &&
  weightData.landingWeight <=
    selectedCargoAircraft.maxLW &&
  cargoZfwInsideEnvelope &&
  cargoTowInsideEnvelope &&
  cargoLwInsideEnvelope
const [cargoFlightFrom, setCargoFlightFrom] =
useState('')

const [cargoFlightTo, setCargoFlightTo] =
useState('')

const [cargoFlightNumber, setCargoFlightNumber] =
useState('')
const [cargoFlightRecords, setCargoFlightRecords] =
  useState(() => {

    const saved =
  localStorage.getItem(
    'operdatFreighterFlights'
  )

    return saved
      ? JSON.parse(saved)
      : []
  })
  useEffect(() => {

  localStorage.setItem(
    'operdatFreighterFlights',
    JSON.stringify(cargoFlightRecords)
  )

}, [cargoFlightRecords])
const [activeFreighterFlightId, setActiveFreighterFlightId] =
  useState(null)
const [cargoMetarFrom, setCargoMetarFrom] = useState(null)
const [cargoMetarTo, setCargoMetarTo] = useState(null)

useEffect(() => {

  async function loadCargoMetarFrom() {

    if (
      cargoFlightFrom.trim().length !== 4
    ) {
      setCargoMetarFrom(null)
      return
    }

    const result = await getMetar(
      cargoFlightFrom.toUpperCase()
    )

    setCargoMetarFrom(result)
  }

  loadCargoMetarFrom()

}, [cargoFlightFrom])


useEffect(() => {

  async function loadCargoMetarTo() {

    if (
      cargoFlightTo.trim().length !== 4
    ) {
      setCargoMetarTo(null)
      return
    }

    const result = await getMetar(
      cargoFlightTo.toUpperCase()
    )

    setCargoMetarTo(result)
  }

  loadCargoMetarTo()

}, [cargoFlightTo])
const index = Number.isFinite(totalMoment) ? calculateIndex(totalMoment) :0
const effectiveBasicIndex = doi + (extraCrew *0.1) + (catering? 0.2 : 0)
const cargoIndex =
  getForwardBagIndex(forwardCargo) +
  getAftBagIndex(aftCargo)

console.log({
  forwardCargo,
  aftCargo,
  forwardIndex: getForwardBagIndex(forwardCargo),
  aftIndex: getAftBagIndex(aftCargo),
  cargoIndex
})
const zfi = effectiveBasicIndex + paxIndex + cargoIndex
const zfiDebug = effectiveBasicIndex + cargoIndex
const FuelIndex = getFuelIndex(fuel)
const toi = zfi + FuelIndex

const tripFuelIndex = getFuelIndex(tripFuel)
const li = toi - tripFuelIndex
console.log({
  effectiveBasicIndex,
  paxIndex,
  cargoIndex,
  zfi,
  toi
})
function getNearestCg(index){
const minIndex=25
const maxIndex=90

const minCg=21
const maxCg=34 
return (18+(index-35)*0.235)
}
 function getCgFromEnvelope(index,weight){return Number(getNearestCg(index).toFixed(1))}
 const aircraftSummary =
  selectedCargoAircraft &&
  selectedCargoAircraft.registration ===
    selectedAircraft.registration
    ? selectedCargoAircraft
    : selectedAircraft;
const paxZfwArm = indexToArm(
  zfi,
  zfw,
  selectedAircraft.indexReferenceArm,
  selectedAircraft.indexConstant,
  selectedAircraft.indexOffset
)

const paxTakeoffArm = indexToArm(
  toi,
  tow,
  selectedAircraft.indexReferenceArm,
  selectedAircraft.indexConstant,
  selectedAircraft.indexOffset
)

const paxLandingArm = indexToArm(
  li,
  ldw,
  selectedAircraft.indexReferenceArm,
  selectedAircraft.indexConstant,
  selectedAircraft.indexOffset
)

const zfCg = getCG(
  paxZfwArm,
  selectedAircraft.lemac,
  selectedAircraft.mac
)

const toCg = getCG(
  paxTakeoffArm,
  selectedAircraft.lemac,
  selectedAircraft.mac
)
const trim = calculatePassengerTrim(
  tow,
  toCg
)
const lwCg = getCG(
  paxLandingArm,
  selectedAircraft.lemac,
  selectedAircraft.mac
)

const toWithinEnvelope = toCg >= 18 && toCg <= 32 && tow <= selectedAircraft.maxTOW
function isInsideEnvelope(x, y){
const polygon=[

[100,50],

[150,160],

[210,310],

[230,310],

[830,70],

[400,50],

[395,50]

]

let inside=false 
for( let i=0, j=polygon.length-1; i<polygon.length; j=i++){

const xi=polygon[i][0]

const yi=polygon[i][1]

const xj=polygon[j][0]

const yj=polygon[j][1]

const intersect=

(( yi>y ) !== ( yj>y )) && (x< (xj-xi) * (y-yi) / (yj-yi) + xi)

if(intersect) inside=!inside
}

return inside
}

const zfWithinEnvelope = zfw <= selectedAircraft.maxZFW && zfCg >= 18 && zfCg <= 34
const trimLabel = trim < 4 ? 'NOSE UP' : trim > 7 ? 'NOSE DOWN' : 'SET'
const loadStatus = 'READY FOR DISPATCH'
const cgStatus = true
const cgLabel = cg < 18 ? 'FORWARD' : cg > 32 ? 'AFT' : 'NORMAL'
const zfwStatus = zfw <= selectedAircraft.maxZFW
const towStatus = tow <= selectedAircraft.maxTOW
const [weatherAirport,setWeatherAirport]=useState("")
const [searchMetar,setSearchMetar]=useState(null)
const [searchTaf,setSearchTaf]=useState(null)
function toggleSeat(seat) {if (selectedSeats.includes(seat)) {setSelectedSeats(selectedSeats.filter(s => s !== seat))
  } else {setSelectedSeats( [...selectedSeats, seat])
}
}
function loadCabins(){
const seats=[]

for (let i = 0; i < Math.min(calculatedFwdCabinPax, 60); i++)

{

seats.push(

i

)

}

for (let i = 60; i < 60 + Math.min(calculatedMidCabinPax, 70); i++){

seats.push(

i

)

}

for (let i = 130; i < 130 + Math.min(calculatedAftCabinPax, 50); i++){

seats.push(

i

)

}

setSelectedSeats(

seats

)

}
console.log({
  fwdPax,
  midPax,
  aftPax,
  paxIndex
})
if(

!logged

){

return(

<Login
  onLogin={(role) => {
    setUserRole(role)

    if (role === 'freighter') {
      setActiveMenu('FreighterLoadsheet')
    }

    setLogged(true)
  }}
/>

)

}
function saveCurrentFreighterFlight() {

  const now =
    new Date().toISOString()

  const flightData = {

    status: 'OPEN',

    updatedAt: now,

    flightNumber:
      cargoFlightNumber || '----',

    from:
      cargoFlightFrom || '----',

    to:
      cargoFlightTo || '----',

    registration:
      selectedCargoAircraft.registration,

    cargoWeights: {
      ...cargoWeights
    },

    rampFuel:
      fuel,

    taxiFuel:
      fuelData.taxiFuel,

    takeoffFuel:
      fuelData.takeoffFuel,

    tripFuel:
      fuelData.tripFuel,

    zfw:
      cargoZfw,

    tow:
      weightData.takeoffWeight,

    lw:
      weightData.landingWeight,

    zfwIndex:
      cargoZfwIndex,

    towIndex:
      cargoTowIndex,

    lwIndex:
      cargoLandingIndex,

    zfwCg:
      cargoZfwCg,

    towCg:
      cargoTowCg,

    lwCg:
      cargoLandingCg,
      cargoMetarFrom:
  cargoMetarFrom || '',

cargoMetarTo:
  cargoMetarTo || '',

basicWeight:
  selectedCargoAircraft.basicWeight,

basicIndex:
  selectedCargoAircraft.basicIndex,

maxZFW:
  selectedCargoAircraft.maxZFW,

maxTOW:
  selectedCargoAircraft.maxTOW,

maxLW:
  selectedCargoAircraft.maxLW,

mainCargo,

lowerCargo,

totalCargo,
performanceMaxTow:
  performanceMaxTow
    ? Number(performanceMaxTow)
    : null,

effectiveMaxTow:
  effectiveMaxTow,
rampWeight:
  weightData.rampWeight,
  }

  if (activeFreighterFlightId) {

    setCargoFlightRecords(
      previous =>
        previous.map(flight =>

          flight.id === activeFreighterFlightId &&
          flight.status === 'OPEN'

            ? {
                ...flight,
                ...flightData
              }

            : flight
        )
    )

    alert('Flight updated')

    return
  }

  const newFlight = {

    id: Date.now(),

    createdAt: now,

    ...flightData
  }

  setCargoFlightRecords(
    previous => {

      const updated = [
        newFlight,
        ...previous
      ]

      return updated.slice(0, 10)
    }
  )

  setActiveFreighterFlightId(
    newFlight.id
  )

  alert('Flight saved as OPEN')
}
return (

  <div

    style={{
  minHeight: '100vh',
  display: 'flex',

  background: `
    radial-gradient(
      circle at 78% 12%,
      rgba(21,101,255,0.13) 0%,
      rgba(21,101,255,0.05) 22%,
      transparent 42%
    ),
    radial-gradient(
      circle at 45% 85%,
      rgba(35,78,125,0.10) 0%,
      transparent 38%
    ),
    linear-gradient(
      135deg,
      #061426 0%,
      #08182c 48%,
      #050f1d 100%
    )
  `,

  backgroundAttachment: 'fixed',
}}

  >
{/* SIDEBAR */}

<div
  style={{
    width: '250px',
    minHeight: '100vh',
    background: 'rgba(5, 16, 33, 0.94)',
    boxShadow: '8px 0 35px rgba(0,0,0,0.28)',
    backdropFilter: 'blur(16px)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    padding: '28px 22px',
    display: 'flex',
    flexDirection: 'column'
  }}
>

  {/* LOGO */}

  <div
    style={{
      marginBottom: '38px',
      textAlign: 'center'
    }}
  >
   <img
  src={logo}
  alt="OPERDAT Logo"
  style={{
    width: '220px',
    maxWidth: '100%',
    marginBottom: '10px'
  }}
/>

    <div
      style={{
        marginTop: '8px',
        fontSize: '9px',
        letterSpacing: '2px',
        color: '#7f91aa',
        fontWeight: '600'
      }}
    >
      FLIGHT OPERATIONS PLATFORM
    </div>
  </div>


  {/* PASSENGER */}

  {userRole !== 'freighter' && (
    <div
      onClick={() => setActiveMenu('Dashboard')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Dashboard'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Dashboard'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Dashboard'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight: activeMenu === 'Dashboard' ? '700' : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow:
          activeMenu === 'Dashboard'
            ? '0 0 20px rgba(21,101,255,0.12)'
            : 'none'
      }}
    >
      Passenger
    </div>
  )}


  {/* FLIGHT RECORDS */}

  {(userRole === 'freighter' || userRole === 'admin') && (
    <div
      onClick={() => setActiveMenu('Flight Records')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Flight Records'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Flight Records'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Flight Records'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Flight Records'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Flight Records
    </div>
  )}


  {/* FREIGHTER LOADSHEET */}

  {userRole !== 'student' && (
    <div
      onClick={() =>
        setActiveMenu('FreighterLoadsheet')
      }
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'FreighterLoadsheet'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'FreighterLoadsheet'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'FreighterLoadsheet'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'FreighterLoadsheet'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Freighter Loadsheet
    </div>
  )}


  {/* PASSENGER LOADSHEET */}

  {userRole !== 'freighter' && (
    <div
      onClick={() => setActiveMenu('Loadsheet')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Loadsheet'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Loadsheet'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Loadsheet'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Loadsheet'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Passenger Loadsheet
    </div>
  )}


  {/* FUEL */}

  <div
    onClick={() => setActiveMenu('Fuel')}
    style={{
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background:
        activeMenu === 'Fuel'
          ? 'rgba(21,101,255,0.16)'
          : 'transparent',
      border:
        activeMenu === 'Fuel'
          ? '1px solid rgba(21,101,255,0.40)'
          : '1px solid transparent',
      color:
        activeMenu === 'Fuel'
          ? '#ffffff'
          : '#b9c4d3',
      fontWeight:
        activeMenu === 'Fuel'
          ? '700'
          : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Fuel Load
  </div>


  {/* AIRCRAFT */}

  {userRole !== 'freighter' && (
    <div
      onClick={() => setActiveMenu('Aircraft')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Aircraft'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Aircraft'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Aircraft'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Aircraft'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Aircraft Data
    </div>
  )}


  {/* SEAT MAP */}

  {userRole !== 'freighter' && (
    <div
      onClick={() => setActiveMenu('Seat Map')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Seat Map'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Seat Map'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Seat Map'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Seat Map'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Seat Map
    </div>
  )}


  {/* WEATHER */}

  <div
    onClick={() => setActiveMenu('Settings')}
    style={{
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background:
        activeMenu === 'Settings'
          ? 'rgba(21,101,255,0.16)'
          : 'transparent',
      border:
        activeMenu === 'Settings'
          ? '1px solid rgba(21,101,255,0.40)'
          : '1px solid transparent',
      color:
        activeMenu === 'Settings'
          ? '#ffffff'
          : '#b9c4d3',
      fontWeight:
        activeMenu === 'Settings'
          ? '700'
          : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Weather Center
  </div>


  {/* SIGN OUT */}

  <div
    onClick={() => {
      localStorage.removeItem('user')
      window.location.reload()
    }}
    style={{
      marginTop: 'auto',
      padding: '12px 15px',
      borderRadius: '9px',
      background: 'rgba(255,255,255,0.035)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#8f9bad',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Sign Out
  </div>

</div>
{/* MAIN CONTENT */}
{
activeMenu === 'FreighterLoadsheet'
&& (

<div
style={{

padding:'40px',

borderRadius:'20px',

background:
'linear-gradient(145deg, rgba(8,24,44,0.96), rgba(5,16,31,0.96))',

border:
'1px solid rgba(255,255,255,0.08)',

boxShadow:
'0 12px 35px rgba(0,0,0,0.20)',

textAlign:'center'

}}

>

{/* HEADER */}

<div
style={{
marginBottom:'28px'
}}
>

<div
style={{
fontSize:'12px',
letterSpacing:'2.5px',
fontWeight:'700',
color:'#4f8cff',
marginBottom:'8px'
}}
>
OPERDAT · CARGO OPERATIONS
</div>

<h1
style={{
color:'#f4f7fb',
margin:'0 0 8px 0',
fontSize:'38px',
fontWeight:'700',
letterSpacing:'-0.5px'
}}
>
B737-800 CF
</h1>

<div
style={{
fontSize:'14px',
color:'#8fa0b7',
letterSpacing:'0.5px'
}}
>
Cargo Weight & Balance Module
</div>

</div>


{/* AIRCRAFT SELECTOR + CLEAR */}

<div
style={{
display:'flex',
justifyContent:'center',
alignItems:'center',
gap:'12px',
marginBottom:'28px',
flexWrap:'wrap'
}}
>

<select

value={
selectedCargoAircraft.registration
}

onChange={(e)=>{

setSelectedCargoAircraft(

aircraftCargoDatabase.find(

a=>

a.registration===

e.target.value

)

)

}}

style={{

padding:'11px 16px',

borderRadius:'9px',

background:'#08182c',

color:'#f4f7fb',

border:
'1px solid rgba(21,101,255,0.30)',

fontSize:'13px',

fontWeight:'600',

cursor:'pointer',

outline:'none'

}}

>

{

aircraftCargoDatabase

.map(

a=>(

<option

key={a.registration}

value={a.registration}

>

{a.registration}

</option>

)

)

}

</select>


<button

onClick={
clearCargo
}

style={{

padding:'10px 18px',

borderRadius:'9px',

border:
'1px solid rgba(255,90,90,0.28)',

background:
'rgba(255,70,70,0.06)',

color:'#ff7a7a',

cursor:'pointer',

fontWeight:'700',

fontSize:'11px',

letterSpacing:'0.8px'

}}

>

CLEAR ALL

</button>

</div>


{/* FLIGHT INFORMATION */}

<div
style={{

display:'flex',

justifyContent:'center',

gap:'26px',

marginBottom:'22px',

fontSize:'13px',

color:'#8fa0b7',

flexWrap:'wrap',

alignItems:'flex-start'

}}

>

{/* FROM */}

<div>

<div
style={{
fontSize:'10px',
letterSpacing:'1.3px',
marginBottom:'6px',
fontWeight:'700',
color:'#7f8da0'
}}
>
FROM
</div>

<input

value={cargoFlightFrom}

onChange={(e)=>

setCargoFlightFrom(

e.target.value.toUpperCase()

)

}

style={{

width:'82px',

textAlign:'center',

padding:'8px',

borderRadius:'7px',

background:
'rgba(255,255,255,0.04)',

border:
'1px solid rgba(255,255,255,0.10)',

color:'#f4f7fb',

fontWeight:'700',

outline:'none'

}}

/>

</div>


{/* TO */}

<div>

<div
style={{
fontSize:'10px',
letterSpacing:'1.3px',
marginBottom:'6px',
fontWeight:'700',
color:'#7f8da0'
}}
>
TO
</div>

<input

value={cargoFlightTo}

onChange={(e)=>

setCargoFlightTo(

e.target.value.toUpperCase()

)

}

style={{

width:'82px',

textAlign:'center',

padding:'8px',

borderRadius:'7px',

background:
'rgba(255,255,255,0.04)',

border:
'1px solid rgba(255,255,255,0.10)',

color:'#f4f7fb',

fontWeight:'700',

outline:'none'

}}

/>

</div>


{/* FLIGHT */}

<div>

<div
style={{
fontSize:'10px',
letterSpacing:'1.3px',
marginBottom:'6px',
fontWeight:'700',
color:'#7f8da0'
}}
>
FLIGHT
</div>

<input

value={cargoFlightNumber}

onChange={(e)=>

setCargoFlightNumber(

e.target.value.toUpperCase()

)

}

style={{

width:'105px',

textAlign:'center',

padding:'8px',

borderRadius:'7px',

background:
'rgba(255,255,255,0.04)',

border:
'1px solid rgba(255,255,255,0.10)',

color:'#f4f7fb',

fontWeight:'700',

outline:'none'

}}

/>

</div>


{/* WEATHER */}

<div

style={{

minWidth:'320px',

maxWidth:'440px',

textAlign:'left',

padding:'10px 14px',

borderRadius:'10px',

background:
'rgba(255,255,255,0.025)',

border:
'1px solid rgba(255,255,255,0.06)',

fontSize:'12px',

lineHeight:'1.45'

}}

>

<div>

<span
style={{
color:'#4f8cff',
fontWeight:'700'
}}
>
DEP {cargoFlightFrom || '----'}:
</span>{' '}

<span
style={{
color:'#aeb9c8'
}}
>
{cargoMetarFrom || '---'}
</span>

</div>


<div
style={{
marginTop:'5px'
}}
>

<span
style={{
color:'#4f8cff',
fontWeight:'700'
}}
>
ARR {cargoFlightTo || '----'}:
</span>{' '}

<span
style={{
color:'#aeb9c8'
}}
>
{cargoMetarTo || '---'}
</span>

</div>

</div>

</div>


{/* ACTIONS */}

<div
style={{
display:'flex',
justifyContent:'center',
gap:'10px',
marginBottom:'18px',
flexWrap:'wrap'
}}
>

<button

onClick={saveCurrentFreighterFlight}

style={{

padding:'10px 22px',

borderRadius:'9px',

border:
'1px solid rgba(21,101,255,0.42)',

background:
'rgba(21,101,255,0.15)',

color:'#75a5ff',

fontWeight:'700',

cursor:'pointer',

letterSpacing:'0.7px',

fontSize:'11px'

}}

>

{activeFreighterFlightId
? 'UPDATE FLIGHT'
: 'SAVE FLIGHT'}

</button>


<button

onClick={newFreighterFlight}

style={{

padding:'10px 22px',

borderRadius:'9px',

border:
'1px solid rgba(255,255,255,0.12)',

background:
'rgba(255,255,255,0.04)',

color:'#aeb9c8',

fontWeight:'700',

cursor:'pointer',

letterSpacing:'0.7px',

fontSize:'11px'

}}

>

NEW FLIGHT

</button>

</div>


{/* UTC */}

<div
style={{
marginBottom:'28px',
fontSize:'11px',
letterSpacing:'1.2px',
color:'#7f8da0'
}}
>

<span
style={{
fontWeight:'700',
color:'#aeb9c8'
}}
>
UTC
</span>

&nbsp;·&nbsp;

{
new Date().toLocaleTimeString(

'en-GB',

{

timeZone:'UTC',

hour:'2-digit',

minute:'2-digit'

}

) + 'Z'
}

</div>
<div
style={{

display:'grid',

gridTemplateColumns:

'repeat(5,1fr)',

gap:'12px'

}}

>

{

selectedCargoAircraft?.cargoConfig?.mainDeck?.map((position ) => (

<div key={position.id}

style={{

padding:'20px',

minHeight:'140px',

borderRadius:'12px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)',

display:'flex',

alignItems:'center',

justifyContent:'center'

}}

>

<div>

<div
style={{

fontWeight:'700',

fontSize:'22px',

marginBottom:'18px'

}}

>

{position.id}

</div>

<input

type="number"

value={

cargoWeights[

position.id

]

||

''

}

onChange={(e)=>

setCargoWeights({

...cargoWeights,

[position.id]:

Number(

e.target.value

)

||

0

})

}

placeholder="0"

style={{

width:'90px',

padding:'10px',

textAlign:'center',

background:

'rgba(255,255,255,0.06)',

border:

'1px solid rgba(255,255,255,0.08)',

borderRadius:'8px',

color:'#00ff88',

fontSize:'18px',

marginBottom:'12px'

}}

/>
<div

style={{

marginTop:'12px',

fontSize:'18px',

color:'#00ff88',

fontWeight:'700'

}}

>

{

cargoWeights[

position.id

]

||

0

}

kg

</div>
<div
style={{

fontSize:'12px',

opacity:0.55

}}

>

<div

style={{

fontSize:'12px',

marginTop:'10px',

color:

(

cargoWeights[

position.id

]

||

0

)

>

position.max

?

'#ff4444'

:

'#b8c0cc'

}}

>

MAX {

position.max

} kg
<div

style={{

fontSize:'11px',

opacity:0.5,

marginTop:'4px'

}}

>

ARM {

position.arm

}

</div>
</div>

{

(

cargoWeights[

position.id

]

||

0

)

>

position.max

&& (

<div

style={{

marginTop:'8px',

fontSize:'12px',

fontWeight:'700',

color:'#ff4444'

}}

>

LIMIT EXCEEDED

</div>

)

}

</div>

</div>

</div>

)

)

}
<div

style={{

marginTop:'40px'

}}

>

<div
  style={{
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:'15px'
  }}
>

  <h2
    style={{
      margin:0
    }}
  >
    LOWER DECK
  </h2>

  <button
    onClick={() =>
      generateCargoLoadOrder({

        registration:
          selectedCargoAircraft.registration,

        cargoFlightFrom,

        cargoFlightTo,

        cargoFlightNumber,

        cargoWeights,

        mainCargo,

        lowerCargo,

        totalCargo
      })
    }

    style={{
      padding:'8px 14px',

      borderRadius:'8px',

      border:
        '1px solid rgba(0,255,140,0.30)',

      background:
        'rgba(0,255,140,0.08)',

      color:'#00ff88',

      fontWeight:'700',

      cursor:'pointer'
    }}
  >
    GENERATE LOAD ORDER
  </button>

</div>

<div

style={{

display:'grid',

gridTemplateColumns:

'repeat(3,1fr)',

gap:'12px',

maxWidth:'360px',

margin:'0 auto'

}}

>

{

selectedCargoAircraft
?.cargoConfig
?.lowerDeck
?.map(

(position)=>(

<div
key={position.id}
>

<div
style={{
fontWeight:'700',
fontSize:'22px',
marginBottom:'18px'
}}
>

{position.id}

</div>
<input

type="number"

value={

cargoWeights[

position.id

]

||

''

}

onChange={(e)=>

setCargoWeights({

...cargoWeights,

[position.id]:

Number(

e.target.value

)

||

0

})

}

placeholder="0"

style={{

width:'90px',

width:'90px'

}}

/>

<div

style={{

marginTop:'10px',

fontSize:'12px',

opacity:0.7

}}

>

MAX

{

position.max

}

kg

</div>

<div

style={{

fontSize:'12px',

opacity:0.55

}}

>

<div

style={{

fontSize:'12px',

marginTop:'10px',

color:

(

cargoWeights[

position.id

]

||

0

)

>

position.max

?

'#ff4444'

:

'#b8c0cc'

}}

>

MAX {

position.max

} kg
<div

style={{

fontSize:'11px',

opacity:0.5,

marginTop:'4px'

}}

>

ARM {

position.arm

}

</div>
</div>

{

(

cargoWeights[

position.id

]

||

0

)

>

position.max

&& (

<div

style={{

marginTop:'8px',

fontSize:'12px',

fontWeight:'700',

color:'#ff4444'

}}

>

LIMIT EXCEEDED

</div>

)

}

</div>

</div>
)

)

}

</div>

</div>
</div>
<div

style={{

marginTop:'40px',

padding:'24px',

borderRadius:'16px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)'

}}

>
<div

style={{

marginTop:'40px',

padding:'24px',

borderRadius:'16px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)',

marginBottom:'20px'

}}

>

<h2>

AIRCRAFT DATA

</h2>

<div

style={{

display:'flex',

gap:'15px',

flexDirection:'column',

alignItems:'center'

}}

>

<div style={{display:'flex'}}>

<span style={{width:'100px'}}>

BASIC

</span>

<strong>

{

selectedCargoAircraft.basicWeight

}

kg

</strong>

</div>

<div style={{display:'flex'}}>

<span style={{width:'100px'}}>

MAX ZFW

</span>

<strong>

{

selectedCargoAircraft.maxZFW

}

kg

</strong>

</div>
<div
  style={{
    display:'flex',
    alignItems:'center',
    marginBottom:'6px'
  }}
>

  <span style={{width:'100px'}}>
    MAX TOW
  </span>

  <strong
    style={{
      width:'100px'
    }}
  >
    {selectedCargoAircraft.maxTOW} kg
  </strong>


  <span
    style={{
      marginLeft:'25px',
      marginRight:'10px'
    }}
  >
    ALLOWED MAX TOW 
  </span>


  <input
    type="number"

    value={performanceMaxTow}

    onChange={(e) =>
      setPerformanceMaxTow(
        e.target.value
      )
    }

    placeholder="kg"

    style={{
      width:'90px',
      padding:'5px 8px',

      borderRadius:'6px',

      border:
        '1px solid rgba(255,255,255,0.15)',

      background:
        'rgba(255,255,255,0.05)',

      color:'#ffffff',

      textAlign:'center'
    }}
  />

  <span
    style={{
      marginLeft:'6px'
    }}
  >
    kg
  </span>

</div>

<div style={{display:'flex'}}>

<span style={{width:'100px'}}>



MAX LW

</span>

<strong>

{

selectedCargoAircraft.maxLW

}

kg

</strong>

</div>

</div>
<div
  style={{
    marginTop: '6px',
    fontSize: '15px',
    color: '#b8c0cc'
  }}
>
  TOW LIMIT APPLIED:{' '}
  <strong
    style={{
      color: '#00ff88'
    }}
  >
    {effectiveMaxTow} kg
  </strong>
</div>
</div>

<h2>

CARGO SUMMARY

</h2>

<div

style={{

display:'flex',

gap:'25px',

alignItems:'center',

marginBottom:'10px'

}}

>
  
<span>

BASIC WEIGHT

</span>

<strong>

{selectedCargoAircraft.basicWeight} kg

</strong>

</div>

<div

style={{ display:'flex', gap:'130px', alignItems:'center', marginBottom:'10px'}}

>
<span>

MAIN

</span>

<strong>

{mainCargo} kg

</strong>

</div>

<div

style={{ display:'flex', gap:'120px', alignItems:'center', marginBottom:'10px'}}
>
<span>
LOWER
</span>
<strong>
{lowerCargo} kg

</strong>

</div>

<div
style={{display:'flex', gap:'70px', alignItems:'center', marginBottom:'10px'}}
>

<span>
TRAFFIC LOAD
</span>

<strong>
{totalCargo} kg
</strong>
 
</div>
<div
style={{

display:'flex',

gap:'100px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

ZFW

</span>

<div
style={{

display:'flex',

gap:'50px',

alignItems:'center'

}}
>

<strong>

{cargoZfw} kg

</strong>

<strong
style={{

color:

cargoZfw >

selectedCargoAircraft.maxZFW

?

'#ff4444'

:

'#00ff88'

}}
>

{

cargoZfw >

selectedCargoAircraft.maxZFW

?

'🔴 LIMIT EXCEEDED'

:

'🟢 OK'

}

</strong>

</div>

</div>
<div
style={{

display:'flex',

gap:'80px',

alignItems:'center',

marginBottom:'10px'

}}
>
<span>
RAMP FUEL
</span>
<strong>
{fuel} kg
</strong>

</div>
<div
style={{

display:'flex',

gap:'30px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

RAMP WEIGHT

</span>

<strong>

{

rampWeight

}

kg

</strong>

</div>
<div
style={{

display:'flex',

gap:'100px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

TAXI FUEL

</span>

<strong>

{

taxiFuel

}

kg

</strong>

</div>
<div
  style={{
    display:'flex',
    gap:'100px',
    alignItems:'center',
    marginBottom:'10px'
  }}
>

  <span>
    TAKEOFF FUEL
  </span>

  <strong>
    {Number(
      fuelData.takeoffFuel || 0
    ).toFixed(0)}
    kg
  </strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'140px'
}}

>

TAKEOFF WEIGHT

</span>

<strong
style={{
  width:'110px'
}}
>

{weightData.takeoffWeight} kg

</strong>

<strong
style={{

color:
  weightData.takeoffWeight >
  effectiveMaxTow
    ? '#ff4444'
    : '#00ff88'

}}
>

{

weightData.takeoffWeight >
effectiveMaxTow
  ? '🔴 LIMIT EXCEEDED'
  : '🟢 OK'

}

</strong>

</div>
<div
style={{

display:'flex',

gap:'100px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

TRIP FUEL

</span>

<strong>

{tripFuel}

kg

</strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'140px'
}}
>

LANDING WEIGHT

</span>

<strong
style={{
  width:'110px'
}}
>

{weightData.landingWeight} kg

</strong>

<strong
style={{

color:

weightData.landingWeight >

selectedCargoAircraft.maxLW

?

'#ff4444'

:

'#00ff88'

}}
>

{

weightData.landingWeight >

selectedCargoAircraft.maxLW

?

'🔴 LIMIT EXCEEDED'

:

'🟢 OK'

}

</strong>

</div>

<div
style={{
  fontSize:'18px',
  fontWeight:'700',
  marginBottom:'15px',
  marginTop:'10px'
}}
>

LOAD INDEX

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'100px'
}}
>

BASIC INDEX

</span>

<strong>

{cargoEffectiveBasicIndex.toFixed(2)}

</strong>

</div>

<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'

}}

>

<span>

LOWER DECK INDEX

</span>

<strong>

{

lowerDeckIndex

}

</strong>

</div>
<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'

}}

>

<span>

MAIN DECK INDEX

</span>

<strong>

{

Number(

mainDeckIndex

)

.toFixed(

2

)

}

</strong>

</div>

<div
  style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'
  }}
>
  <span>TOTAL DECK INDEX</span>

  <strong>
    {totalCargoIndex.toFixed(2)}
  </strong>
</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'85px'
}}
>

ZFW INDEX

</span>

<strong>

{cargoZfwIndex.toFixed(2)}

</strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'120px'
}}
>

TAKEOFF INDEX

</span>

<strong>

{cargoTowIndex.toFixed(2)}

</strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'120px'
}}
>

LANDING INDEX

</span>

<strong>

{cargoLandingIndex.toFixed(2)}

</strong>

</div>
<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.08)'
  }}
>

  <div
    style={{
      minWidth: '110px',
      padding: '14px 18px',
      textAlign: 'center',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}
  >

    <div
      style={{
        fontSize: '12px',
        opacity: 0.6,
        marginBottom: '8px'
      }}
    >
      ZFW CG
    </div>

    <strong
      style={{
        fontSize: '20px'
      }}
    >
      {cargoZfwCg.toFixed(2)} %
    </strong>

  </div>


  <div
    style={{
      minWidth: '110px',
      padding: '14px 18px',
      textAlign: 'center',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}
  >

    <div
      style={{
        fontSize: '12px',
        opacity: 0.6,
        marginBottom: '8px'
      }}
    >
      TOW CG
    </div>

    <strong
      style={{
        fontSize: '20px'
      }}
    >
      {cargoTowCg.toFixed(2)} %
    </strong>

  </div>


  <div
    style={{
      minWidth: '110px',
      padding: '14px 18px',
      textAlign: 'center',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}
  >

    <div
      style={{
        fontSize: '12px',
        opacity: 0.6,
        marginBottom: '8px'
      }}
    >
      LW CG
    </div>

    <strong
      style={{
        fontSize: '20px'
      }}
    >
      {cargoLandingCg.toFixed(2)} %
    </strong>

  </div>

</div>
<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25px',
    marginBottom: '20px'
  }}
>

  <button
    onClick={() => {
if (!freighterPrintValid) {

  let message =
    'LOADSHEET CANNOT BE GENERATED\n\n'

  if (cargoPositionOverLimit) {

    message +=
      `${cargoPositionOverLimit.id} LOAD LIMIT EXCEEDED\n`

  }

  if (
    cargoZfw >
    selectedCargoAircraft.maxZFW
  ) {

    message +=
      'MAXIMUM ZFW EXCEEDED\n'
  }

 if (
  weightData.takeoffWeight >
  effectiveMaxTow
) {

  message +=
    `ALLOWED MAX TOW EXCEEDED - LIMIT ${effectiveMaxTow} kg\n`
}

  if (
    weightData.landingWeight >
    selectedCargoAircraft.maxLW
  ) {

    message +=
      'MAXIMUM LANDING WEIGHT EXCEEDED\n'
  }

  if (!cargoZfwInsideEnvelope) {

    message +=
      'ZFW CG OUT OF ENVELOPE\n'
  }

  if (!cargoTowInsideEnvelope) {

    message +=
      'TOW CG OUT OF ENVELOPE\n'
  }

  if (!cargoLwInsideEnvelope) {

    message +=
      'LW CG OUT OF ENVELOPE\n'
  }

  alert(message)

  return
}
  generateFreighterLoadsheet({

    registration:
      selectedCargoAircraft.registration,
      cargoFlightFrom,
cargoFlightTo,
cargoFlightNumber,
cargoMetarFrom,
  cargoMetarTo,
basicWeight:
  selectedCargoAircraft.basicWeight,


basicIndex:
  selectedCargoAircraft.basicIndex,

maxZFW:
  selectedCargoAircraft.maxZFW,

maxTOW:
  selectedCargoAircraft.maxTOW,

maxLW:
  selectedCargoAircraft.maxLW,
    mainCargo,

    lowerCargo,

    totalCargo,

    cargoZfw,

    rampWeight,

    takeoffWeight:
      weightData.takeoffWeight,

    landingWeight:
      weightData.landingWeight,

    mainDeckIndex,

    lowerDeckIndex,

    totalCargoIndex,

    cargoZfwIndex,

    cargoTowIndex,

    cargoLandingIndex,

    cargoZfwCg,

    cargoTowCg,

    cargoLandingCg,

    blockFuel: fuel,

    taxiFuel,

    takeoffFuel:
      fuelData.takeoffFuel,

    tripFuel,

    remainingFuel:
      fuelData.remainingFuel,

    cargoWeights

  })

}}

    style={{
      padding: '14px 28px',
      borderRadius: '10px',
      border: '1px solid rgba(0,255,140,0.25)',
      background: 'rgba(0,255,140,0.10)',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '1px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}

    onMouseEnter={(e) => {
      e.currentTarget.style.background =
        'rgba(0,255,140,0.18)'

      e.currentTarget.style.boxShadow =
        '0 0 20px rgba(0,255,140,0.15)'
    }}

    onMouseLeave={(e) => {
      e.currentTarget.style.background =
        'rgba(0,255,140,0.10)'

      e.currentTarget.style.boxShadow =
        'none'
    }}
  >

    GENERATE FREIGHTER LOADSHEET

  </button>

</div>

<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'

}}

>
  
<span>

Loaded

</span>

<strong>

{

loadedPercent.toFixed(1)

}

%

</strong>

</div>
<div

style={{

marginTop:'20px'

}}

>

<div

style={{

height:'12px',

borderRadius:'8px',

background:

'rgba(255,255,255,0.08)',

overflow:'hidden'

}}

>

<div

style={{

width:
`${Math.min(
  loadedPercent,
  100
)}%`,

height:'100%',

background:
  totalCargo
  >
  payloadCapacity
  ?
  '#ff4444'
  :
  '#00ff88'

}}

></div>

</div>
<span>

AVAILABLE PAYLOAD

</span>

<strong>

{

availablePayload

}

kg

</strong>

</div>
<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginTop:'16px',

fontSize:'18px',

color:

totalCargo

>

payloadCapacity

?

'#ff4444'

:

'#00ff88'

}}

>

<div

style={{

marginTop:'8px',

fontSize:'14px'

}}

>

{

loadedPercent.toFixed(1)

}

%

</div>
<FreighterEnvelope
  zfw={cargoZfw}
  zfwCg={cargoZfwCg}
  zfwIndex={cargoZfwIndex}

  tow={weightData.takeoffWeight}
  towCg={cargoTowCg}
  towIndex={cargoTowIndex}

  lw={weightData.landingWeight}
  lwCg={cargoLandingCg}
  lwIndex={cargoLandingIndex}
/>
</div>
</div>
</div>
)

}

{

activeMenu ===

'Seat Map'

&& (

<div

style={{

padding:'30px',

width:'100%',

display:'flex',

flexDirection:'column',

alignItems:'center'

}}

>

<h1

style={{

marginBottom:'25px'

}}

>

SEAT MAP

</h1>
<div

style={{

marginBottom:'25px',

padding:'15px',

borderRadius:'12px',

background:
'linear-gradient(145deg, rgba(8,24,44,0.94), rgba(5,16,31,0.94))',

display:'flex',

gap:'30px'

}}

>
  <div
style={{

fontSize:'14px',

fontWeight:'bold',

marginBottom:'10px'

}}

>

LOAD CABINS

</div>

<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    minWidth: '120px',
    padding: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.02)'
  }}
>
FWD CABIN

<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  AD
  <input
    type="number"
    value={fwdAdults === 0 ? '' : fwdAdults}
    onChange={(e) =>
      setFwdAdults(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  CH
  <input
    type="number"
    value={fwdChildren === 0 ? '' : fwdChildren}
    onChange={(e) =>
      setFwdChildren(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  INF
  <input
    type="number"
    value={fwdInfants === 0 ? '' : fwdInfants}
    onChange={(e) =>
      setFwdInfants(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

</div>
MID CABIN

<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  AD
  <input
    type="number"
    value={midAdults === 0 ? '' : midAdults}
    onChange={(e) =>
      setMidAdults(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  CH
  <input
    type="number"
    value={midChildren === 0 ? '' : midChildren}
    onChange={(e) =>
      setMidChildren(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  INF
  <input
    type="number"
    value={midInfants === 0 ? '' : midInfants}
    onChange={(e) =>
      setMidInfants(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

</div>
AFT CABIN

<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  AD
  <input
    type="number"
    value={aftAdults === 0 ? '' : aftAdults}
    onChange={(e) =>
      setAftAdults(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  CH
  <input
    type="number"
    value={aftChildren === 0 ? '' : aftChildren}
    onChange={(e) =>
      setAftChildren(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  INF
  <input
    type="number"
    value={aftInfants === 0 ? '' : aftInfants}
    onChange={(e) =>
      setAftInfants(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

</div>

</div>

<div

style={{

display:'flex',

flexDirection:'column',

gap:'8px'

}}

>

<button

onClick={

loadCabins

}

>

LOAD CABINS

</button>

<button

onClick={()=>

setSelectedSeats(

[]

)

}

>

CLEAR ALL

</button>

</div>

<div>

TOTAL PAX:
{' '}

{selectedSeats.length}

</div>


<div>

FWD:
{' '}

{forwardSeats}

</div>

<div>

MID:
{' '}

{midSeats}

</div>

<div>

AFT:
{' '}

{aftSeats}

</div>

</div>
<div

style={{

width:'100%',

maxWidth:'600px'

}}

>

<SeatMap

selectedSeats={

selectedSeats

}

toggleSeat={

toggleSeat

}

/>

</div>

</div>

)

}

{activeMenu === 'Aircraft' && (

<div

style={{

flex:1,

padding:'40px'

}}

>

<h1

style={{

fontSize:'42px',

marginBottom:'10px'

}}

>

AIRCRAFT DATA

</h1>

<p

style={{

color: '#4f8cff',

marginBottom:'30px'

}}

>

Aircraft Information

</p>


<div

style={{

background:'rgba(255,255,255,.04)',

border:'1px solid rgba(255,255,255,.08)',

borderRadius:'18px',

padding:'25px',

maxWidth:'620px'

}}

>

<h3>

AIRCRAFT SUMMARY

</h3>

<select

value={selectedAircraft.registration}

onChange={(e)=>{

const paxAircraft =
aircraftDatabase.find(
a=>a.registration===e.target.value
)

const cargoAircraft =
aircraftCargoDatabase.find(
a=>a.registration===e.target.value
)
const [
  performanceMaxTow,
  setPerformanceMaxTow
] = useState('')
console.log('PAX', paxAircraft)
console.log('CARGO', cargoAircraft)

if(paxAircraft)
setSelectedAircraft(paxAircraft)

if(cargoAircraft)
setSelectedCargoAircraft(cargoAircraft)

}}

style={{

padding:'12px',

marginBottom:'20px',

borderRadius:'10px',

background:'#1f2937',

color:'white',

border:'1px solid #374151',

outline:'none'

}}

>

{

[

...aircraftDatabase,

...aircraftCargoDatabase

].map(a=>(

<option

key={a.registration}

value={a.registration}

style={{

background:'#1f2937',

color:'white'

}}

>

{a.registration}

</option>

))

}

</select>
<div

style={{

display:'flex',

justifyContent:'center',

marginBottom:'25px'

}}

>

<img

src={
  aircraftSummary.type.includes('CF')
    ? b737cfPerfil
    : b737Perfil
}

style={{

width:'320px',

maxHeight:'240px',

objectFit:'contain',

display:'block',

margin:'0 auto'

}}

/>

</div>
<div

style={{

display:'grid',

gridTemplateColumns:'1fr 1fr',

gap:'20px'

}}

>

<div>

REG<br/>

<strong>

{aircraftSummary.registration}

</strong>

</div>



<div>

TYPE<br/>

<strong>

{aircraftSummary.type}

</strong>

</div>


<div>

BASIC WT<br/>

<strong>

{effectiveBasicWeight}

kg

</strong>

</div>


<div>

BASIC INDEX<br/>

<strong>

{effectiveBasicIndex?.toFixed(1)}

</strong>

</div>


<div>

CREW<br/>

<strong>

{crewConfiguration||'-'}

</strong>

</div>


<div>
MRW<br/>

<strong>

{

aircraftSummary.maxRW

}

kg

</strong>

</div>


<div>
MTOW<br/>

<strong>

{

aircraftSummary.maxTOW

}

kg

</strong>

</div>


<div>

MLW<br/>

<strong>

{

aircraftSummary.maxLW

}

kg

</strong>

</div>


<div>

MZFW<br/>

<strong>

{

aircraftSummary.maxZFW

}

kg

</strong>

</div>

</div>

</div>

</div>

)}
{activeMenu === 'Dashboard' && (

  <div

    style={{

      flex: 1,

      padding: '40px'

    }}

  >
<div

  style={{

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center'

  }}

>
      <div>

        <p

          style={{

            color: '#4f8cff',

            letterSpacing: '3px',

            fontSize: '13px',

            marginBottom: '8px'

          }}

        >

          OPERDAT · FLIGHT OPERATIONS

        </p>

        <h1

          style={{

            fontSize: '42px',

            margin: 0,

            fontWeight: '700'

          }}

        >

          {aircraftSummary.registration}

        </h1>

        <p

          style={{

            color: '#b8c0cc',

            marginTop: '10px'

          }}

        >

          {aircraftSummary.type}

        </p>
<div

style={{

marginTop:'20px',

display:'flex',

gap:'12px',

alignItems:'center',

flexWrap:'wrap'

}}

>

<input

placeholder="FROM-ICAO"

value={flightFrom}

onChange={(e)=>

setFlightFrom(

e.target.value

)

}

style={{

width:'90px'

}}

>

</input>

<input

placeholder="TO-ICAO"

value={flightTo}

onChange={(e)=>

setFlightTo(

e.target.value

)

}

style={{

width:'90px'

}}

>

</input>

<input

placeholder="FLIGHT NR"

value={flightNumber}

onChange={(e)=>

setFlightNumber(

e.target.value

)

}

style={{

width:'120px'

}}

>

</input>

</div>
      </div>
<img

  src={aircraftImage}

  alt="aircraft"

  style={{

    width: '340px',

    objectFit: 'contain',

    filter:
    'drop-shadow(0 0 22px rgba(21,101,255,0.20))'

  }}

/>
      <select

        value={aircraftSummary.registration}

        onChange={(e) => {

          const aircraft =
            aircraftDatabase.find(
              acft =>
                acft.registration === e.target.value
            )

          setSelectedAircraft(aircraft)

        }}
style={{

background:'#08182c',

color:'#ffffff',

border:'1px solid rgba(255,255,255,0.12)',

padding:'10px 14px',

borderRadius:'10px',

fontSize:'14px',

cursor:'pointer',
boxShadow:
'0 0 18px rgba(21,101,255,0.12)'
}}

>
      

        {
        aircraftDatabase.map((aircraft) => (

          <option

            key={aircraft.registration}

            value={aircraft.registration}

          >

            {aircraft.registration}

          </option>

        ))}

      </select>

    </div>

    <div

      style={{

        display: 'flex',

        gap: '20px',

        marginTop: '40px',

        flexWrap: 'wrap'

      }}

    >
     

<StatusCard

title="Basic WT"

value={effectiveBasicWeight}

unit="kg"

status={true}
subtitle={

`${crewConfiguration}

· Δ ${basicWeightDelta} kg`

}
/>

<StatusCard

title="BWI"

value={effectiveBasicIndex?.toFixed(2)}

unit="UI"

status={true}

/>
 <StatusCard
        title="ZFW"
        value={

zfw +

(extraCrew *85)+

(catering ? 250 : 0)

}
        unit="kg"
        status={zfwStatus}
        limit={selectedAircraft.maxZFW}
      />
<StatusCard

title="ZFI"

value={zfi.toFixed(1)}

unit="IU"status={true}

/>
 <StatusCard
title="ZF CG"

value={
zfCg?.toFixed?.(1)
}

unit="%"

status={true}
/>
<StatusCard

title="BLOCK FUEL"

value={fuel}

unit="kg"

status={true}

/>
<StatusCard

title="RW"

value={

rw +

(extraCrew * 85) +

(catering ? 250 : 0)

}

unit="kg"

status={

(

rw +

(extraCrew * 85) +

(catering ? 250 : 0)

)

<=

selectedAircraft.maxRW

}

limit={

selectedAircraft.maxRW

}

/>
  <StatusCard

title="TOW"

value={

tow +

(extraCrew *85)+

(catering ? 250 : 0)

}

unit="kg"

status={

(

tow +

(extraCrew *85)+

(catering ? 250 : 0)

)

<=

selectedAircraft.maxTOW

}

limit={

selectedAircraft.maxTOW

}

/>
      <StatusCard

title="TOI"

value={toi.toFixed(1)}

unit="IU"status={true}

/>
      
     
      
{/*
<StatusCard

title="TRIP FI"

value={

tripFuelIndex

}

unit="IU"

status={true}

/>


<StatusCard

title="FUEL INDEX"

value={

FuelIndex

}

unit="IU"

status={true}

/>


<StatusCard

  title="INDEX"

  value={cg.toFixed(1)}

  status={true}
  unit="IU"

/>
<StatusCard

title="PAX INDEX"

value={

paxIndex.toFixed(

1

)

}

unit="IU"

status={true}

/>
*/}


<StatusCard
title="TO CG"

value={
toCg?.toFixed?.(1)
}

unit="%"

status={true}
/>

<StatusCard

  title={`TRIM · ${trimLabel}`}

  value={trim.toFixed(1)}

  unit="U"

  status={true}

/>

<div

  style={{

    marginTop: '25px',

    padding: '18px',

    borderRadius: '14px',

    textAlign: 'center',

    background:

      loadStatus ===
      'READY FOR DISPATCH'

        ? 'rgba(0,255,120,0.10)'

        : loadStatus ===
          'REVIEW LOAD'

          ? 'rgba(255,180,0,0.10)'

          : 'rgba(255,60,60,0.10)',

    border:

      '1px solid rgba(255,255,255,0.08)'

  }}

>

 

</div>

    </div>

   <EnvelopeChart

cg={cg}

zfCg={zfCg}

toCg={toCg}
zfStatus={zfWithinEnvelope}
toStatus={toWithinEnvelope}
lwCg={lwCg}

zfi={zfi}

toi={toi}

li={li}

zfw={zfw}

tow={tow}

ldw={ldw}

status={cgStatus}

mtow={
selectedAircraft.maxTOW
}

mlw={
selectedAircraft.maxLW
}

mzfw={
selectedAircraft.maxZFW
}

/>


    <CargoPanel
      forwardCargo={forwardCargo}
      aftCargo={aftCargo}
    />
  </div>

)}
{

activeMenu !==

'Aircraft'

&&

activeMenu !==

'Seat Map'

&&
activeMenu !==

'Passenger'

&&
activeMenu !== 'Freighter'
&& (

<div

  style={{

    marginTop: '20px',

    padding: '18px',

    borderRadius: '14px',

    background:
      'rgba(255,255,255,0.04)',

    border:
      '1px solid rgba(255,255,255,0.08)'

  }}

>
{activeMenu === 'Dashboard' && (

<div>
  <h3>

    FUEL PREDICTION

  </h3>

  <div>

    TOW:
    {tow.toFixed(0)}
    KG

  </div>

  <div>

    TRIP:
    -
    {tripFuel.toFixed(0)}
    KG

  </div>

  <div

    style={{

      marginTop:
        '10px',

      fontWeight:
        '700'

    }}

  >

    EST LDW:
    {ldw.toFixed(0)}
    KG

  </div>
<div

  style={{

    marginTop: '20px',

    padding: '18px',

    borderRadius: '14px',

    background:
      'rgba(255,255,255,0.04)',

    border:
      '1px solid rgba(255,255,255,0.08)'

  }}

>

  <h3>

    LOAD SUMMARY

  </h3>

  <div>

    PAX:
    {selectedSeats.length}

  </div>

  <div>

    CARGO:

    {(
      forwardCargo +

      aftCargo

    ).toFixed(0)}

    KG

  </div>


  <div

    style={{

      marginTop:
        '12px',

      fontWeight:
        '700'

    }}

  >

    PAYLOAD:

    {(
      passengerWeight +

      forwardCargo +

      aftCargo

    ).toFixed(0)}

    KG

  </div>

</div>
<div

style={{

marginTop:'20px',

padding:'1px',

borderRadius:'14px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)',

width:'100%'

}}

>

<h3

style={{

marginBottom:'10px',

fontSize:'14px'

}}

>

TIME UTC

</h3>

<div

style={{

fontSize:'22px',

fontWeight:'700'

}}

>

{

new Date()

.toLocaleTimeString(

'en-GB',

{

timeZone:'UTC',

hour:'2-digit',

minute:'2-digit'

}

)

}Z

</div>
<div className="metar-card">

<div className="metar-title">

METAR 

</div>

<div className="metar-container">

<div className="metar-card">

<div className="metar-title">

FROM · {flightFrom}

</div>

<div className="metar-text">

{metar || "Loading METAR..."}

</div>

</div>

<div className="metar-card">

<div className="metar-title">

TO · {flightTo}

</div>

<div className="metar-text">

{metarTo || "Loading METAR..."}

</div>

</div>

</div>

</div>

</div>

</div>

)
}
</div>

)}
{activeMenu === 'Settings' && (

<div

style={{

flex:1,

padding:'40px'

}}

>

<h1>

WEATHER CENTER

</h1>

<div className="weather-search">

<input

placeholder="SEARCH ICAO"

value={weatherAirport}

onChange={(e)=>

setWeatherAirport(
e.target.value.toUpperCase()
)

}

/>

<button

onClick={
searchAirportWeather
}

>

SEARCH

</button>

</div>
<button
  onClick={() => {

  generateWeatherPdf({

    icao: weatherAirport,

    metar: searchMetar,

    taf: searchTaf

  })

}}
>
  GENERATE WEATHER PDF
</button>
<div className="metar-card">

<div className="metar-title">

METAR

</div>

<div className="metar-text">

{

searchMetar ||

"ENTER ICAO"

}

</div>

</div>

<div className="metar-card">

<div className="metar-title">

TAF

</div>

<div className="metar-text">

{

searchTaf ||

"COMING SOON"

}

</div>

</div>

</div>

)}
{activeMenu === 'Loadsheet' && (

  <div

    style={{flex: 1, padding: '40px'}}

  >

    <div

  style={{

    display: 'flex',

    gap: '20px',

    alignItems: 'center',

    marginBottom: '20px'

  }}

>

  <h1

    style={{

      fontSize: '42px',

      margin: 0

    }}

  >

    LOADSHEET CENTER

  </h1>

  <img

    src={aircraftImage}

    alt="aircraft"

    style={{

      width: '180px',

      objectFit: 'contain',

      filter:
        'drop-shadow(0 0 22px rgba(21,101,255,0.20))'

    }}

  />

</div>

    <p
  style={{
    color: '#4f8cff',
    marginBottom: '30px'
  }}
>
  Generate operational loadsheet PDF.
</p>

    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '12px'

      }}

    >

      Aircraft:
      <strong>
        {' '}
        {selectedAircraft.registration}
      </strong>

    </div>

    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '12px'

      }}

    >

      Passengers:
      <strong>
        {' '}
        {selectedSeats.length}
      </strong>

    </div>
<div

style={{

marginBottom:'20px'

}}

>

<h3>

EXTRA CREW

</h3>

<div

style={{

display:'flex',

alignItems:'center',

gap:'12px'

}}

>

<button

onClick={()=>

setExtraCrew(

Math.max(

0,

extraCrew-1

)

)

}

>

−

</button>

<span>

{

extraCrew

}

</span>

<button

onClick={()=>

setExtraCrew(

Math.min(

4,

extraCrew+1

)

)

}

>

+

</button>

</div>
<div

style={{

marginTop:'15px'

}}

>

<label>

<input

type="checkbox"

checked={catering}

onChange={(e)=>

setCatering(

e.target.checked

?

1

:

0

)

}

/>

CATERING

</label>

</div>
</div>
    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '12px'

      }}

    >

      fuel:
      <strong>
        {' '}
        {fuel} KG
      </strong>

    </div>

    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '25px'

      }}

    >

   {
    
activeMenu !== 'Loadsheet' && (

<div>

CG Status:

<strong

style={{

color:

cgStatus

?

'#00ff88'

:

'#ff4444',

marginLeft:'8px'

}}

>

{

loadStatus

}

</strong>

</div>

)

}

    </div>
<div style={{ marginBottom: '20px' }}>



</div>
<div style={{ marginBottom: '25px' }}>

  <label>Forward Cargo (kg)</label>

  <input

    type="number"

    value={forwardCargo === 0 ? '' : forwardCargo}

    onChange={(e)=>{

const value=

parseInt(

e.target.value

)||0

setForwardCargo(

Math.min(

value,

3000

)

)

}}

    style={{

      width: '100%',

      padding: '12px',

      marginTop: '8px',

      borderRadius: '10px',

      border:
        '1px solid rgba(255,255,255,0.08)',

      background:
        'rgba(255,255,255,0.05)',

      color: 'white'

    }}

  />

</div>

<div style={{ marginBottom: '30px' }}>

  <label>Aft Cargo (kg)</label>

  <input

    type="number"

    value={aftCargo === 0 ? '' : aftCargo}

    onChange={(e)=>{

const value=

parseInt(

e.target.value

)||0

setAftCargo(

Math.min(

value,

5000

)

)

}}

    style={{

      width: '100%',

      padding: '12px',

      marginTop: '8px',

      borderRadius: '10px',

      border:
        '1px solid rgba(255,255,255,0.08)',

      background:
        'rgba(255,255,255,0.05)',

      color: 'white'

    }}

  />

</div>
    <button
 onMouseEnter={(e) => {

    e.target.style.transform =
      'translateY(-3px)'

    e.target.style.boxShadow =
      '0 0 35px rgba(0,255,140,0.35)'

  }}

  onMouseLeave={(e) => {

    e.target.style.transform =
      'translateY(0px)'

    e.target.style.boxShadow =
      '0 0 25px rgba(0,255,140,0.20)'
      

  }}
      onClick={() =>
        

        generateLoadsheet({

          selectedAircraft,
metarFrom: metar,
metarTo,
          selectedSeats,

          forwardCargo,

          aftCargo,

          fuel,
          taxiFuel,
          tripFuel,
          ldw,
payload,

          zfw,
rw,
          tow,
          cg,
crewConfiguration,

catering,
          cgStatus,
          zfCg,

toCg,
          flightFrom,

flightTo,

flightNumber,
trim,
effectiveBasicWeight,

effectiveBasicIndex,
forwardSeats,
midSeats,

aftSeats,
fwdAdults,
fwdChildren,
fwdInfants,

midAdults,
midChildren,
midInfants,

aftAdults,
aftChildren,
aftInfants
        })

      }

      style={{

        padding: '16px 32px',

        background:
          '#00aa66',

        color: 'white',

        border:
          '1px solid rgba(255,255,255,0.08)',

        borderRadius: '12px',

        fontSize: '16px',

        cursor: 'pointer',

        boxShadow:
        
          '0 0 25px rgba(0,255,140,0.20)'
          

      }}

    >

      Generate Loadsheet PDF

    </button>

  </div>



)}
{(userRole === 'freighter' || userRole === 'admin') &&
 activeMenu === 'Flight Records' && (

  <div
    style={{
      flex: 1,
      padding: '40px'
    }}
  >

    {/* HEADER */}

    <div
      style={{
        marginBottom: '32px'
      }}
    >

      <div
        style={{
          color: '#4f8cff',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          marginBottom: '8px'
        }}
      >
        OPERDAT · OPERATIONS
      </div>

      <h1
        style={{
          fontSize: '38px',
          margin: 0,
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}
      >
        FLIGHT RECORDS
      </h1>

      <p
        style={{
          color: '#8fa0b7',
          marginTop: '8px',
          marginBottom: 0,
          fontSize: '14px'
        }}
      >
        Recent freighter operational records
      </p>

    </div>


    {/* EMPTY STATE */}

    {cargoFlightRecords.length === 0 && (

      <div
        style={{
          padding: '50px 30px',
          borderRadius: '16px',

          background:
            'linear-gradient(145deg, rgba(10,28,50,0.92), rgba(5,17,32,0.92))',

          border:
            '1px solid rgba(255,255,255,0.08)',

          color: '#7f8da0',

          textAlign: 'center',

          boxShadow:
            '0 10px 30px rgba(0,0,0,0.18)'
        }}
      >

        <div
          style={{
            fontSize: '13px',
            letterSpacing: '1.5px',
            fontWeight: '600'
          }}
        >
          NO FLIGHT RECORDS AVAILABLE
        </div>

      </div>

    )}


    {/* FLIGHT RECORDS */}

    {cargoFlightRecords.map(
      flight => (

        <div
          key={flight.id}

          style={{
            marginBottom: '14px',

            padding: '20px 22px',

            borderRadius: '16px',

            background:
              'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',

            border:
              '1px solid rgba(255,255,255,0.08)',

            boxShadow:
              '0 8px 24px rgba(0,0,0,0.18)'
          }}
        >

          {/* FLIGHT HEADER */}

          <div
            style={{
              display: 'flex',

              justifyContent:
                'space-between',

              alignItems: 'center',

              gap: '20px'
            }}
          >

            <div>

              <strong
                style={{
                  fontSize: '20px',
                  color: '#f4f7fb',
                  letterSpacing: '0.5px'
                }}
              >
                {flight.flightNumber}
              </strong>


              <div
                style={{
                  color: '#8fa0b7',

                  marginTop: '5px',

                  fontSize: '13px'
                }}
              >

                {flight.from}

                <span
                  style={{
                    color: '#4f8cff',
                    margin: '0 8px'
                  }}
                >
                  →
                </span>

                {flight.to}

                <span
                  style={{
                    color: '#556579',
                    margin: '0 8px'
                  }}
                >
                  ·
                </span>

                {flight.registration}

              </div>

            </div>


            {/* STATUS */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',

                padding: '6px 10px',

                borderRadius: '20px',

                background:
                  flight.status === 'OPEN'
                    ? 'rgba(21,101,255,0.12)'
                    : 'rgba(255,255,255,0.05)',

                border:
                  flight.status === 'OPEN'
                    ? '1px solid rgba(21,101,255,0.28)'
                    : '1px solid rgba(255,255,255,0.08)'
              }}
            >

              <div
                style={{
                  width: '7px',

                  height: '7px',

                  borderRadius: '50%',

                  background:
                    flight.status === 'OPEN'
                      ? '#4f8cff'
                      : '#778395',

                  boxShadow:
                    flight.status === 'OPEN'
                      ? '0 0 8px rgba(79,140,255,0.60)'
                      : 'none'
                }}
              />

              <span
                style={{
                  color:
                    flight.status === 'OPEN'
                      ? '#6ea0ff'
                      : '#8d99aa',

                  fontSize: '10px',

                  fontWeight: '700',

                  letterSpacing: '1.3px'
                }}
              >
                {flight.status}
              </span>

            </div>

          </div>


          {/* WEIGHTS */}

          <div
            style={{
              display: 'grid',

              gridTemplateColumns:
                'repeat(3, minmax(120px, 1fr))',

              gap: '12px',

              marginTop: '20px'
            }}
          >

            {/* ZFW */}

            <div
              style={{
                padding: '12px 14px',

                borderRadius: '10px',

                background:
                  'rgba(255,255,255,0.025)',

                border:
                  '1px solid rgba(255,255,255,0.05)'
              }}
            >

              <div
                style={{
                  color: '#7f8da0',

                  fontSize: '10px',

                  letterSpacing: '1.4px',

                  marginBottom: '5px'
                }}
              >
                ZFW
              </div>

              <strong
                style={{
                  fontSize: '16px',
                  color: '#eaf0f7'
                }}
              >
                {Number(
                  flight.zfw
                ).toFixed(0)}
              </strong>

              <span
                style={{
                  marginLeft: '5px',

                  fontSize: '10px',

                  color: '#7f8da0'
                }}
              >
                KG
              </span>

            </div>


            {/* TOW */}

            <div
              style={{
                padding: '12px 14px',

                borderRadius: '10px',

                background:
                  'rgba(255,255,255,0.025)',

                border:
                  '1px solid rgba(255,255,255,0.05)'
              }}
            >

              <div
                style={{
                  color: '#7f8da0',

                  fontSize: '10px',

                  letterSpacing: '1.4px',

                  marginBottom: '5px'
                }}
              >
                TOW
              </div>

              <strong
                style={{
                  fontSize: '16px',
                  color: '#eaf0f7'
                }}
              >
                {Number(
                  flight.tow
                ).toFixed(0)}
              </strong>

              <span
                style={{
                  marginLeft: '5px',

                  fontSize: '10px',

                  color: '#7f8da0'
                }}
              >
                KG
              </span>

            </div>


            {/* LW */}

            <div
              style={{
                padding: '12px 14px',

                borderRadius: '10px',

                background:
                  'rgba(255,255,255,0.025)',

                border:
                  '1px solid rgba(255,255,255,0.05)'
              }}
            >

              <div
                style={{
                  color: '#7f8da0',

                  fontSize: '10px',

                  letterSpacing: '1.4px',

                  marginBottom: '5px'
                }}
              >
                LW
              </div>

              <strong
                style={{
                  fontSize: '16px',
                  color: '#eaf0f7'
                }}
              >
                {Number(
                  flight.lw
                ).toFixed(0)}
              </strong>

              <span
                style={{
                  marginLeft: '5px',

                  fontSize: '10px',

                  color: '#7f8da0'
                }}
              >
                KG
              </span>

            </div>

          </div>


          {/* OPEN FLIGHT ACTIONS */}

          {flight.status === 'OPEN' && (

            <div
              style={{
                display: 'flex',

                gap: '10px',

                marginTop: '18px',

                paddingTop: '16px',

                borderTop:
                  '1px solid rgba(255,255,255,0.06)'
              }}
            >

              <button
                onClick={() =>
                  openFreighterFlight(
                    flight.id
                  )
                }

                style={{
                  padding: '9px 16px',

                  borderRadius: '8px',

                  border:
                    '1px solid rgba(21,101,255,0.45)',

                  background:
                    'rgba(21,101,255,0.16)',

                  color: '#75a5ff',

                  fontSize: '11px',

                  letterSpacing: '0.8px',

                  fontWeight: '700',

                  cursor: 'pointer'
                }}
              >
                OPEN FLIGHT
              </button>


              <button
                onClick={() =>
                  closeFreighterFlight(
                    flight.id
                  )
                }

                style={{
                  padding: '9px 16px',

                  borderRadius: '8px',

                  border:
                    '1px solid rgba(255,255,255,0.12)',

                  background:
                    'rgba(255,255,255,0.04)',

                  color: '#aeb9c8',

                  fontSize: '11px',

                  letterSpacing: '0.8px',

                  fontWeight: '700',

                  cursor: 'pointer'
                }}
              >
                CLOSE FLIGHT
              </button>

            </div>

          )}


          {/* CLOSED FLIGHT */}

        {flight.status === 'CLOSED' && (

  <div
    style={{
      display: 'flex',
      gap: '10px',
      marginTop: '18px'
    }}
  >

    <button
      onClick={() =>
        printClosedFreighterFlight(
          flight
        )
      }

      style={{
        padding: '8px 14px',
        borderRadius: '8px',

        border:
          '1px solid rgba(0,255,140,0.35)',

        background:
          'rgba(0,255,140,0.10)',

        color: '#00ff88',

        fontWeight: '700',

        cursor: 'pointer'
      }}
    >
      LOADSHEET PDF
    </button>


    <button
      onClick={() =>
        printClosedLoadOrder(
          flight
        )
      }

      style={{
        padding: '8px 14px',
        borderRadius: '8px',

        border:
          '1px solid rgba(255,255,255,0.18)',

        background:
          'rgba(255,255,255,0.05)',

        color: '#b8c0cc',

        fontWeight: '700',

        cursor: 'pointer'
      }}
    >
      LOAD ORDER PDF
    </button>

  </div>

)}

        </div>

      )
    )}

  </div>

)}
{activeMenu === 'Fuel' && (

  <div

    style={{

      flex: 1,

      padding: '40px'

    }}

  >

    <h1

      style={{

        fontSize: '42px',

        margin: 0,

        marginBottom: '30px'

      }}

    >

      Fuel

    </h1>


    <div>

      <label>

        Ramp Fuel (kg)

      </label>

      <input

        type="number"

        value={fuel === 0 ? '' : fuel}

        onChange={(e) => {

          const value =
            parseInt(e.target.value) || 0

          setFuel(

            Math.min(
              value,
              20598
            )

          )

        }}

      />

    </div>


    <div

      style={{

        marginTop: '25px',

        marginBottom: '20px'

      }}

    >

      <label>

        Taxi Fuel (kg)

      </label>

      <input

        type="number"

        value={taxiFuel === 0 ? '' : taxiFuel}

        onChange={(e) => {

          setTaxiFuel(

            parseInt(e.target.value) || 0

          )

        }}

      />


      <div

        style={{

          marginTop: '20px',

          marginBottom: '20px'

        }}

      >

        <label>

          Takeoff Fuel (kg)

        </label>

        <input

          type="number"

          value={fuelData.takeoffFuel === 0 ? '' : fuelData.takeoffFuel}

          readOnly

        />

      </div>


      <label>

        Trip Fuel (kg)

      </label>

      <input

        type="number"

        value={tripFuel === 0 ? '' : tripFuel}

        onChange={(e) => {

          setTripFuel(

            parseInt(e.target.value) || 0

          )

        }}

      />

    </div>

  </div>

)}

</div>

)

}

export default App
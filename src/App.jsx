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
  useState(userRole === 'freighter' ? 'Freighter' : 'Dashboard')
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

const cargoZfwCg = getCG(
  cargoZfwArm,
  selectedCargoAircraft.lemac,
  selectedCargoAircraft.mac
)

const cargoTowCg = getCG(
  cargoTowArm,
  selectedCargoAircraft.lemac,
  selectedCargoAircraft.mac
)

const cargoLandingCg = getCG(
  cargoLandingArm,
  selectedCargoAircraft.lemac,
  selectedCargoAircraft.mac
)
const [cargoFlightFrom, setCargoFlightFrom] =
useState('')

const [cargoFlightTo, setCargoFlightTo] =
useState('')

const [cargoFlightNumber, setCargoFlightNumber] =
useState('')
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
return (

  <div

    style={{

      minHeight: '100vh',

      display: 'flex',
     background:
`
linear-gradient(
rgba(10,10,15,0.88),
rgba(20,20,30,0.92)
),
url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05')
`,

backgroundSize: 'cover',

backgroundPosition: 'center', 

    }}

  >

    {/* SIDEBAR */}

    <div
      style={{
        width: '250px',
        background:'rgba(255,255,255,0.04)',
boxShadow:
'0 0 40px rgba(0,0,0,0.35)',

backdropFilter:
'blur(14px)',

borderRight:
'1px solid rgba(255,255,255,0.08)',
        padding: '30px',
        borderRight: '1px solid #333'
      }}
    >

      <h1
        style={{
          fontSize: '28px',
          marginBottom: '40px'
        }}
      ><img
  src={logo}
  alt="AIRWEIGHT Logo"
  style={{
    width: '180px',
    marginBottom: '20px'
  }}
/>
        AIRWEIGHT
      </h1>

    {userRole !== 'freighter' && (
<div
  onClick={() =>
    setActiveMenu('Dashboard')
  }

  style={{

    marginBottom: '20px',

    padding: '12px 16px',

    borderRadius: '12px',

    background:
      activeMenu === 'Dashboard'
        ? 'rgba(0,255,140,0.12)'
        : 'rgba(255,255,255,0.03)',

    border:
      activeMenu === 'Dashboard'
        ? '1px solid rgba(0,255,140,0.25)'
        : '1px solid transparent',

    boxShadow:
      activeMenu === 'Dashboard'
        ? '0 0 25px rgba(0,255,140,0.15)'
        : 'none',

    transition:
      'all 0.3s ease',
transform:
  activeMenu === 'Dashboard'
    ? 'translateX(6px)'
    : 'translateX(0px)',
    cursor: 'pointer',

    transition:
     'all 0.3s ease',

    boxShadow:
    '0 0 25px rgba(0,255,140,0.20)',
  }}

>

  Passenger

</div>
)}
{userRole !== 'student' && (
<div
onClick={()=>
setActiveMenu('FreighterLoadsheet')
}

style={{
marginBottom:'20px',
padding:'12px 16px',
borderRadius:'12px',

background:
activeMenu==='FreighterLoadsheet'
? 'rgba(0,255,140,0.12)'
: 'rgba(255,255,255,0.03)',

border:
activeMenu==='FreighterLoadsheet'
? '1px solid rgba(0,255,140,0.25)'
: '1px solid transparent',

cursor:'pointer'
}}
>

Freighter Loadheet

</div>
)}
{userRole !== 'freighter' && (
<div

  onClick={() =>
    setActiveMenu('Loadsheet')
  }
onMouseEnter={(e) => {

  if (activeMenu !== 'Dashboard') {

    e.currentTarget.style.transform =
      'translateX(4px)'

    e.currentTarget.style.boxShadow =
      '0 0 18px rgba(255,255,255,0.08)'

  }

}}

onMouseLeave={(e) => {

  if (activeMenu !== 'Dashboard') {

    e.currentTarget.style.transform =
      'translateX(0px)'

    e.currentTarget.style.boxShadow =
      'none'

  }

}}
  style={{

    marginBottom: '20px',

    padding: '12px 16px',

    borderRadius: '12px',

    background:
      activeMenu === 'Loadsheet'
        ? 'rgba(0,255,140,0.12)'
        : 'rgba(255,255,255,0.03)',

    border:
      activeMenu === 'Loadsheet'
        ? '1px solid rgba(0,255,140,0.25)'
        : '1px solid transparent',

    boxShadow:
      activeMenu === 'Loadsheet'
        ? '0 0 25px rgba(0,255,140,0.15)'
        : 'none',

    transition:
      'all 0.3s ease',
transform:
  activeMenu === 'Dashboard'
    ? 'translateX(6px)'
    : 'translateX(0px)',
    cursor: 'pointer'

  }}

>

  Passenger Loadsheet

</div>
)}
<div

  onClick={() =>
    setActiveMenu('Fuel')
  }

  onMouseEnter={(e) => {

    if (activeMenu !== 'Fuel') {

      e.currentTarget.style.transform =
        'translateX(4px)'

      e.currentTarget.style.boxShadow =
        '0 0 18px rgba(255,255,255,0.08)'

    }

  }}

  onMouseLeave={(e) => {

    if (activeMenu !== 'Fuel') {

      e.currentTarget.style.transform =
        'translateX(0px)'

      e.currentTarget.style.boxShadow =
        'none'

    }

  }}

  style={{

    marginBottom: '20px',

    padding: '12px 16px',

    borderRadius: '12px',

    background:
      activeMenu === 'Fuel'
        ? 'rgba(0,255,140,0.12)'
        : 'rgba(255,255,255,0.03)',

    border:
      activeMenu === 'Fuel'
        ? '1px solid rgba(0,255,140,0.25)'
        : '1px solid transparent',

    boxShadow:
      activeMenu === 'Fuel'
        ? '0 0 25px rgba(0,255,140,0.15)'
        : 'none',

    transition:
      'all 0.3s ease',

    cursor: 'pointer'

  }}

>

  Fuel Load

</div>
{userRole !== 'freighter' && (
<div

  onClick={() =>
    setActiveMenu('Aircraft')
  }
onMouseEnter={(e) => {

  if (activeMenu !== 'Dashboard') {

    e.currentTarget.style.transform =
      'translateX(4px)'

    e.currentTarget.style.boxShadow =
      '0 0 18px rgba(255,255,255,0.08)'

  }

}}

onMouseLeave={(e) => {

  if (activeMenu !== 'Dashboard') {

    e.currentTarget.style.transform =
      'translateX(0px)'

    e.currentTarget.style.boxShadow =
      'none'

  }

}}
  style={{

    marginBottom: '20px',

    padding: '12px 16px',

    borderRadius: '12px',

    background:
      activeMenu === 'Aircraft'
        ? 'rgba(0,255,140,0.12)'
        : 'rgba(255,255,255,0.03)',

    border:
      activeMenu === 'Aircraft'
        ? '1px solid rgba(0,255,140,0.25)'
        : '1px solid transparent',

    boxShadow:
      activeMenu === 'Aircraft'
        ? '0 0 25px rgba(0,255,140,0.15)'
        : 'none',

    transition:
      'all 0.3s ease',

    cursor: 'pointer'

  }}

>

  Aircraft Data

</div>
)}
{userRole !== 'freighter' && (
<div

  onClick={() =>
    setActiveMenu('Seat Map')
  }
onMouseEnter={(e) => {

  if (activeMenu !== 'Dashboard') {

    e.currentTarget.style.transform =
      'translateX(4px)'

    e.currentTarget.style.boxShadow =
      '0 0 18px rgba(255,255,255,0.08)'

  }

}}

onMouseLeave={(e) => {

  if (activeMenu !== 'Dashboard') {

    e.currentTarget.style.transform =
      'translateX(0px)'

    e.currentTarget.style.boxShadow =
      'none'

  }

}}
  style={{

    marginBottom: '20px',

    padding: '12px 16px',

    borderRadius: '12px',

    background:
      activeMenu === 'Seat Map'
        ? 'rgba(0,255,140,0.12)'
        : 'rgba(255,255,255,0.03)',

    border:
      activeMenu === 'Seat Map'
        ? '1px solid rgba(0,255,140,0.25)'
        : '1px solid transparent',

    boxShadow:
      activeMenu === 'Seat Map'
        ? '0 0 25px rgba(0,255,140,0.15)'
        : 'none',

    transition:
      'all 0.3s ease',

    cursor: 'pointer'

  }}

>

  Seat Map

</div>
)}
<div

  onClick={() =>
    setActiveMenu('Settings')
    
  }
  
onMouseEnter={(e) => {

  if (activeMenu !== 'Dashboard') {

    e.currentTarget.style.transform =
      'translateX(4px)'

    e.currentTarget.style.boxShadow =
      '0 0 18px rgba(255,255,255,0.08)'

  }

}}

onMouseLeave={(e) => {

  if (activeMenu !== 'Aircraft') {

    e.currentTarget.style.transform =
      'translateX(0px)'

    e.currentTarget.style.boxShadow =
      'none'

  }

}}

  style={{

    marginBottom: '20px',

    padding: '12px 16px',

    borderRadius: '12px',

    background:
      activeMenu === 'Settings'
        ? 'rgba(0,255,140,0.12)'
        : 'rgba(255,255,255,0.03)',

    border:
      activeMenu === 'Settings'
        ? '1px solid rgba(0,255,140,0.25)'
        : '1px solid transparent',

    boxShadow:
      activeMenu === 'Settings'
        ? '0 0 25px rgba(0,255,140,0.15)'
        : 'none',

    transition:
      'all 0.3s ease',

    cursor: 'pointer'

  }}

>

  Wather Center

</div>
<div

onClick={()=>{

localStorage.removeItem(

'user'

)

window.location.reload()

}}

style={{

marginTop:'auto',

padding:'12px 16px',

borderRadius:'12px',

background:

'rgba(255,80,80,0.08)',

border:

'1px solid rgba(255,80,80,0.15)',

cursor:'pointer',

transition:'0.3s'

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
'rgba(255,255,255,0.03)',

border:
'1px solid rgba(255,255,255,0.08)',

textAlign:'center'

}}

>

<h1
style={{

color:'#00ff88',

marginBottom:'12px'

}}

>

B737-800 CF

</h1>
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

padding:'12px',

borderRadius:'12px',

marginBottom:'20px'

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

marginBottom:'30px',

padding:'10px 18px',

borderRadius:'10px',

border:

'1px solid rgba(95, 255, 80, 0.2)',

background:

'rgba(12, 169, 117, 0.08)',

color:'#ff6666',

cursor:'pointer',

fontWeight:'700'

}}

>

CLEAR ALL

</button>
<div
style={{

fontSize:'18px',

color:'#b8c0cc',

marginBottom:'30px'

}}

>

Cargo Weight & Balance Module

</div>
<div
style={{

display:'flex',

justifyContent:'center',

gap:'40px',

marginBottom:'25px',

fontSize:'15px',

color:'#b8c0cc',

flexWrap:'wrap'

}}

>

<div>

<b>FROM</b><br/>

<input

value={cargoFlightFrom}

onChange={(e)=>

setCargoFlightFrom(

e.target.value.toUpperCase()

)

}

style={{

width:'80px',

textAlign:'center',

padding:'6px',

borderRadius:'6px'

}}

 />

</div>

<div>

<b>TO</b><br/>

<input

value={cargoFlightTo}

onChange={(e)=>

setCargoFlightTo(

e.target.value.toUpperCase()

)

}

style={{

width:'80px',

textAlign:'center',

padding:'6px',

borderRadius:'6px'

}}

 />

</div>

<div>

<b>FLIGHT</b><br/>

<input

value={cargoFlightNumber}

onChange={(e)=>

setCargoFlightNumber(

e.target.value.toUpperCase()

)

}

style={{

width:'100px',

textAlign:'center',

padding:'6px',

borderRadius:'6px'

}}

 />

</div>
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: '300px',
    maxWidth: '420px',
    fontSize: '14px',
    lineHeight: '1.35'
  }}
>
  <div>
    <span
      style={{
        color: '#00ff88',
        fontWeight: '700'
      }}
    >
      DEP {cargoFlightFrom || '----'}:
    </span>{' '}
    <span style={{color:'#b8c0cc'}}>
      {cargoMetarFrom || '---'}
    </span>
  </div>

  <div style={{marginTop:'4px'}}>
    <span
      style={{
        color: '#00ff88',
        fontWeight: '700'
      }}
    >
      ARR {cargoFlightTo || '----'}:
    </span>{' '}
    <span style={{color:'#b8c0cc'}}>
      {cargoMetarTo || '---'}
    </span>
  </div>
</div>
<div>
<b>UTC</b><br/>
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

<h2

style={{

color:'#b8c0cc',

marginBottom:'20px'

}}

>

LOWER DECK

</h2>

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

<div style={{display:'flex'}}>

<span style={{width:'100px'}}>

MAX TOW

</span>

<strong>

{

selectedCargoAircraft.maxTOW

}

kg

</strong>

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
BLOCK FUEL
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

selectedCargoAircraft.maxTOW

?

'#ff4444'

:

'#00ff88'

}}
>

{

weightData.takeoffWeight >

selectedCargoAircraft.maxTOW

?

'🔴 LIMIT EXCEEDED'

:

'🟢 OK'

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
'rgba(255,255,255,0.04)',

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

color:'#ccc0b8',

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

            color: '#00ff99',

            letterSpacing: '3px',

            fontSize: '13px',

            marginBottom: '8px'

          }}

        >

          AIRWEIGHT FLIGHT OPERATIONS

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
      'drop-shadow(0 0 18px rgba(0,255,140,0.18))'

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

background:'#141414',

color:'#ffffff',

border:'1px solid rgba(255,255,255,0.12)',

padding:'10px 14px',

borderRadius:'10px',

fontSize:'14px',

cursor:'pointer',
boxShadow:
'0 0 18px rgba(0,255,140,0.10)'
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
        'drop-shadow(0 0 18px rgba(0,255,140,0.18))'

    }}

  />

</div>

    <p

      style={{

        color: '#b8c0cc',

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

        Block Fuel (kg)

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
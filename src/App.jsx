import Login from './Login'
import { useState } from 'react'
import StatusCard from './components/StatusCard'
import a320Perfil from './assets/A320 perfil.png'
import b737Perfil from './assets/b737 perfil.png'
import EnvelopeChart from './components/EnvelopeChart'
import aircraftDatabase from './data/aircraftDatabase'
import {

  calculateMoment,
  calculateCG,
  calculateIndex,
  calculateMAC,
  calculateTrim

} from './utilit/calculations.js'
import SeatMap from './components/SeatMap'
import CargoPanel from './components/CargoPanel'
import generateLoadsheet from './utils/generateLoadsheet'
import logo from './assets/logo.png'
import aircraftImage from './assets/a320.png'
function App() {
const [

logged,

setLogged

]=useState(

false

)
const [tripFuel, setTripFuel] = useState(0)
const [

taxiFuel,

setTaxiFuel

]=

useState(

0

)
  const [fuel, setFuel] = useState(0)
  const [

flightFrom,

setFlightFrom

]=

useState(

''

)

const [

flightTo,

setFlightTo

]=

useState(

''

)

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
  const [selectedAircraft, setSelectedAircraft] =
    useState(aircraftDatabase[0])
   const [activeMenu, setActiveMenu] =
  useState('Dashboard') 
 const passengerWeight =
  selectedSeats.length * 84
  const forwardSeats =

selectedSeats.filter(

seat => seat <= 59

).length

const midSeats =

selectedSeats.filter(

seat =>

seat > 60 &&

seat <= 120

).length

const aftSeats =

selectedSeats.filter(

seat => seat > 119

).length
const paxMoment =

  calculateMoment(

    passengerWeight,

    selectedAircraft.seatArmMid

  )
  const payload =

passengerWeight +

forwardCargo +

aftCargo
 const zfw =

  selectedAircraft.basicWeight +

  passengerWeight +

  forwardCargo +

  aftCargo 
const rw =

zfw +

fuel
const fuelWeight =
  fuel

const basicArm =

selectedAircraft.lemac +

(

selectedAircraft.mac *

22

)

/

100

const basicMoment =

(

selectedAircraft.basicWeight || 0

)

*

basicArm

const passengerMoment =

selectedSeats.reduce(

(

total,

seat

)=>{

const row =

Math.ceil(

seat /

6

)

console.log({

seat,

row,

selectedAircraft

})

let rowArm =

selectedAircraft.seatArmMid


if (

row <= 8

)

{

rowArm =

selectedAircraft.seatArmFwd

}

else if (

row <= 18

)

{

rowArm =

selectedAircraft.seatArmMid

}

else

{

rowArm =

selectedAircraft.seatArmAft

}


return (

total +

calculateMoment(

84,

rowArm

)

)

},

0

)
const fwdPax =

selectedSeats.filter(

seat =>

Math.ceil(

seat / 6

) <= 8

).length


const midPax =

selectedSeats.filter(

seat =>

Math.ceil(

seat / 6

) > 8 &&

Math.ceil(

seat / 6

) <= 18

).length


const aftPax =

selectedSeats.filter(

seat =>

Math.ceil(

seat / 6

) > 18

).length

const paxIndex =

(

fwdPax *

-0.15

)

+

(

aftPax *

0.15

)

 const fuelMoment =

  calculateMoment(

    fuel,

    selectedAircraft.fuelArm

  )


const forwardCargoMoment =
  forwardCargo * selectedAircraft.forwardCargoArm

const aftCargoMoment =
  aftCargo * selectedAircraft.aftCargoArm
  
const totalMoment =

  basicMoment +

  passengerMoment +

  fuelMoment +

  forwardCargoMoment +

  aftCargoMoment

  
 const tow =

rw -

taxiFuel
const ldw = tow - tripFuel
const arm =

tow > 0

?

(

totalMoment /

tow

)

:

0

const cg =

arm > 0

?

(

(

arm -

selectedAircraft.lemac

)

/

selectedAircraft.mac

)

*

100

:

0

const [

extraCrew,

setExtraCrew

]

=

useState(

0

)
const [

catering,

setCatering

]

=

useState(

0

)
const dow =

selectedAircraft.basicWeight
const cateringWeight =

catering

?

250

:

0


const effectiveBasicWeight =

dow +

(

extraCrew *

85

)

+

cateringWeight

const crewConfiguration =

extraCrew > 0

?

`2/${4 + extraCrew}`

:

selectedAircraft.basicConfig
const basicWeightDelta =

effectiveBasicWeight -

selectedAircraft.basicWeight
const effectiveBasicMoment =

(

extraCrew *

85 *

360

)

+

(

catering

?

250 * 420

:

0

)
const doi =

selectedAircraft.basicIndex +

(

extraCrew *

0.1

)
const index =

Number.isFinite(

totalMoment

)

?

calculateIndex(

totalMoment

)

:

0
const effectiveBasicIndex =

doi +

(

extraCrew *

0.1

)

+

(

catering

?

0.2

:

0

)
const cargoIndex =

(

forwardCargo /

1000

)

*

(

-9

)

+

(

aftCargo /

1000

)

*

(

7
)

const zfi =

effectiveBasicIndex +

paxIndex +

cargoIndex
const zfiDebug =

effectiveBasicIndex +

cargoIndex
const fuelIndex =

getFuelIndex(

fuel
)
const toi =

zfi +

fuelIndex
const tripFuelIndex =

getFuelIndex(

tripFuel

)


const li =

toi -

tripFuelIndex
const trim =

5.5 -

(

cg -

15

)

*

0.12
function getFuelIndex(

fuel

){
if (

fuel <= 0

)

return 0
const table = [

[4000,1],

[4900,2],

[5500,3],

[6000,4],

[6500,5],

[6800,6],

[7200,7],

[7500,8],

[8300,9],

[8700,10],

[9200,11],

[9700,12],

[10800,14],

[11400,15],

[12800,16],

[13600,17],

[14200,18],

[15000,19],

[15700,20],

[17250,22],

[18000,23],

[18600,24],

[19250,25],

[19900,26],

[20400,28]

]

for (

const [

limit,

index

]

of table

){

if (

fuel <= limit

){

return index

}

}

return 28

}

function getNearestCg(

index

){

const minIndex=25

const maxIndex=90

const minCg=21

const maxCg=34


return (

18+

(

index-35

)

*

0.235

)

}


function getCgFromEnvelope(

index,
weight

){

return Number(

getNearestCg(

index

).toFixed(

1

)

)

}

const zfCg =

getCgFromEnvelope(

zfi,
zfw

)


const toCg =

getCgFromEnvelope(

toi,
tow

)


const lwCg =

getCgFromEnvelope(

li,
ldw

)
const toWithinEnvelope =

toCg >= 18 &&

toCg <= 32 &&

tow <= selectedAircraft.maxTOW
function isInsideEnvelope(

x,

y

){

const polygon=[

[100,50],

[150,160],

[210,310],

[230,310],

[830,70],

[400,50],

[,50]

]

let inside=false

for(

let i=0,

j=polygon.length-1;

i<polygon.length;

j=i++

){

const xi=polygon[i][0]

const yi=polygon[i][1]

const xj=polygon[j][0]

const yj=polygon[j][1]

const intersect=

(

(

yi>y

)

!==

(

yj>y

)

)

&&

(

x<

(

xj-xi

)

*

(

y-yi

)

/

(

yj-yi

)

+

xi

)

if(

intersect

)

inside=!inside

}

return inside

}
const zfWithinEnvelope =

zfw >= 40000 &&

zfw <= selectedAircraft.maxZFW &&

zfCg >= (

18 +

(

(

zfw -

40000

)

/

22000

)

*

2

)

&&

zfCg <= 32


const trimLabel =

  trim < 4

    ? 'NOSE UP'

    : trim > 7

      ? 'NOSE DOWN'

      : 'SET'
      
      const loadStatus =

  tow > selectedAircraft.maxTOW

    ? 'OUT OF LIMITS'

    : trim < 4 || trim > 7

      ? 'REVIEW LOAD'

      : 'READY FOR DISPATCH'
const cgStatus =

zfi >= 20 &&

zfi <= 90
  
 const cgLabel =

  cg < 18

    ? 'FORWARD'

    : cg > 32

      ? 'AFT'

      : 'NORMAL'
      

  const zfwStatus =
    zfw <= selectedAircraft.maxZFW

  const towStatus =
    tow <= selectedAircraft.maxTOW
    
  function toggleSeat(seat) {

  if (selectedSeats.includes(seat)) {

    setSelectedSeats(
      selectedSeats.filter(
        s => s !== seat
      )
    )

  } else {

    setSelectedSeats(
      [...selectedSeats, seat]
    )

  }

}
function loadCabins(){

const seats=[]

for(

let i=0;

i<Math.min(

fwdCabinPax,

60

);

i++

){

seats.push(

i

)

}

for(

let i=60;

i<60+

Math.min(

midCabinPax,

60

);

i++

){

seats.push(

i

)

}

for(

let i=120;

i<120+

Math.min(

aftCabinPax,

60

);

i++

){

seats.push(

i

)

}

setSelectedSeats(

seats

)

}
if(

!logged

){

return(

<Login

onLogin={

()=>

setLogged(

true

)

}

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

  Dashboard

</div>
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

  Loadsheet

</div>
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

  Aircraft

</div>
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

  Settings

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

display:'flex',

justifyContent:'flex-end',

gap:'25px',

marginBottom:'15px',

alignItems:'flex-start'


}}

>
FWD CABIN


<input

type="number"

placeholder="FWD PAX"

value={fwdCabinPax}

onChange={(e)=>

setFwdCabinPax(

parseInt(

e.target.value

)||0

)

}

style={{

width:'70px'

}}

>

</input>
MID CABIN
<input

type="number"

placeholder="MID PAX"

value={midCabinPax}

onChange={(e)=>

setMidCabinPax(

parseInt(

e.target.value

)||0

)

}

style={{

width:'70px'

}}

>

</input>
AFT CABIN
<input

type="number"

placeholder="AFT PAX"

value={aftCabinPax}

onChange={(e)=>

setAftCabinPax(

parseInt(

e.target.value

)||0

)

}

style={{

width:'70px'

}}

>

</input>

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

AIRCRAFT

</h1>

<p

style={{

color:'#b8c0cc',

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
<div

style={{

display:'flex',

justifyContent:'center',

marginBottom:'25px'

}}

>

<img

src={

selectedAircraft.type.includes(
'A320'
)

?

a320Perfil

:

b737Perfil

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

{selectedAircraft.registration}

</strong>

</div>



<div>

TYPE<br/>

<strong>

{selectedAircraft.type}

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

selectedAircraft.maxRW

}

kg

</strong>

</div>


<div>
MTOW<br/>

<strong>

{

selectedAircraft.maxTOW

}

kg

</strong>

</div>


<div>

MLW<br/>

<strong>

{

selectedAircraft.maxLW

}

kg

</strong>

</div>


<div>

MZFW<br/>

<strong>

{

selectedAircraft.maxZFW

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

          {selectedAircraft.registration}

        </h1>

        <p

          style={{

            color: '#b8c0cc',

            marginTop: '10px'

          }}

        >

          {selectedAircraft.type}

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

placeholder="FROM"

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

placeholder="TO"

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

placeholder="FLIGHT"

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

        value={selectedAircraft.registration}

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
      

        {aircraftDatabase.map((aircraft) => (

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


{/*
<StatusCard

title="Basic Index"

...
/>
*/}

      
      <StatusCard

title="TOI"

value={

toi.toFixed(

1

)

}

unit="IU"

status={true}

/>
      
      <StatusCard
        title="ZFW"
        value={

zfw +

(

extraCrew *

85

)

+

(

catering

?

250

:

0

)

}
        unit="kg"
        status={zfwStatus}
        limit={selectedAircraft.maxZFW}
      />
      <StatusCard

title="RW"

value={

rw +

(

extraCrew *

85

)

+

(

catering

?

250

:

0

)

}

unit="kg"

status={

rw <=

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

(

extraCrew *

85

)
+

(

catering

?

250

:

0

)
}
        unit="kg"
        status={towStatus}
       limit={selectedAircraft.maxTOW} 
      />

    <StatusCard

title="ZFI"

value={

zfi.toFixed(

1

)

}

unit="IU"

status={true}

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

fuelIndex

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
title="ZF CG"

value={

zfWithinEnvelope

?

zfCg.toFixed(1)

:

'OUT OF ENVELOPE'

}
unit="%"
status={zfWithinEnvelope}
/>

<StatusCard
title="TO CG"
value={

toWithinEnvelope

?

toCg.toFixed(1)

:

'OUT OF ENVELOPE'

}

status={toWithinEnvelope}
unit="%"
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

  <h3>

    LOAD STATUS

  </h3>

  <h2>

    {loadStatus}

  </h2>

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

padding:'14px',

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

</div>
</div>

)
}
{activeMenu === 'Loadsheet' && (

  <div

    style={{

      flex: 1,

      padding: '40px'

    }}

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

      Fuel:
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

   CG Status:

<strong

  style={{

    color:
      cgStatus
        ? '#00ff88'
        : '#ff4444',

    marginLeft: '8px'

  }}

>

  {cgStatus
    ? 'VALID'
    : 'INVALID'}

</strong>

    </div>
<div style={{ marginBottom: '20px' }}>

<label>

Total Fuel (kg)

</label>

<input
  type="number"
  value={fuel}
  onChange={(e)=>{

const value=

parseInt(

e.target.value

)||0

setFuel(

Math.min(

value,

20598

)

)

}}

></input>

</div>

<div

style={{

marginTop:'25px',

marginBottom:'20px'

}}

>

<label>

Taxi Fuel (kg)

</label>

<input
  type="number"
  value={taxiFuel}
  onChange={(e)=>{

setTaxiFuel(

parseInt(

e.target.value

)||0

)

}}

></input>
<div

style={{

marginTop:'20px',

marginBottom:'20px'

}}

>

<label>

Trip Fuel (kg)

</label>

<input

type="number"

value={tripFuel}

onChange={(e)=>{

setTripFuel(

parseInt(

e.target.value

)||0

)

}}

></input>

</div>

</div>
<div style={{ marginBottom: '25px' }}>

  <label>Forward Cargo (kg)</label>

  <input

    type="number"

    value={forwardCargo}

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

    value={aftCargo}

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

aftSeats
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

</div>

)

}

export default App
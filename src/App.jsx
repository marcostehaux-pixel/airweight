import { useState } from 'react'
import StatusCard from './components/StatusCard'
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

const [tripFuel, setTripFuel] = useState(3000)

  const [fuel, setFuel] = useState(0)
  const [forwardCargo, setForwardCargo] =
  useState(0)

const [aftCargo, setAftCargo] =
  useState(0)
  const [selectedSeats, setSelectedSeats] =
  useState([])
  const [selectedAircraft, setSelectedAircraft] =
    useState(aircraftDatabase[0])
   const [activeMenu, setActiveMenu] =
  useState('Dashboard') 
 const passengerWeight =
  selectedSeats.length * 84
  const forwardSeats =

selectedSeats.filter(

seat => seat <= 24

).length

const midSeats =

selectedSeats.filter(

seat =>

seat > 24 &&

seat <= 36

).length

const aftSeats =

selectedSeats.filter(

seat => seat > 36

).length
const paxMoment =

  calculateMoment(

    passengerWeight,

    selectedAircraft.seatArmMid

  )
  
 const zfw =

  selectedAircraft.basicWeight +

  passengerWeight +

  forwardCargo +

  aftCargo 

const fuelWeight =
  fuel

const basicArm =

selectedAircraft.lemac +

(

selectedAircraft.mac *

(

selectedAircraft.basicIndex || 16

)

/

100

)

const basicMoment =

(

selectedAircraft.basicWeight || 0

)

*

basicArm

const passengerMoment =

selectedSeats.reduce(

(total, seat) => {

const row =

Math.floor(

seat / 6

)

+

1

const rowArm =

12 +

(row * 1.5)

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
    zfw + fuel
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
const dow =

selectedAircraft.basicWeight


const doi =

selectedAircraft.basicIndex
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
const trim =

5.5 -

(

cg -

15

)

*

0.12
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
  cg >= 15 && cg <= 25
  
 const cgLabel =

  cg < 16

    ? 'FORWARD'

    : cg > 22

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

<div>

PAX:
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

maxWidth:'900px'

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

      </div>
<img

  src={aircraftImage}

  alt="aircraft"

  style={{

    width: '120px',

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

title="DOW"

value={dow}

unit="kg"

status={true}

/>


<StatusCard

title="DOI"

value={doi.toFixed(1)}

unit="IU"

status={true}

/>
<StatusCard
        title="TOW"
        value={tow}
        unit="kg"
        status={towStatus}
       limit={selectedAircraft.maxTOW} 
      />
      
      <StatusCard
        title="ZFW"
        value={zfw}
        unit="kg"
        status={zfwStatus}
        limit={selectedAircraft.maxZFW}
      />

      

      <StatusCard
  title={`CG · %MAC  ${cgLabel}`}
  value={cg.toFixed(1)}
  unit="%"
  status={cgStatus}
/>

<StatusCard

  title="INDEX"

  value={cg.toFixed(1)}

  status={true}
  unit="IU"

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
      weight={tow}
      ldw={ldw}
      status={cgStatus}
    />

    <CargoPanel
      forwardCargo={forwardCargo}
      aftCargo={aftCargo}
    />
  </div>

)}
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
</div>
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

        marginBottom: '30px'

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

  <label>Fuel (kg)</label>

  <input

    type="number"

    value={fuel}

    onChange={(e) =>
      setFuel(parseInt(e.target.value) || 0)
    }

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
<div style={{ marginTop: '15px' }}>

  <label>Trip Fuel (KG)</label>

  <input

    type="number"

    value={tripFuel}

    onChange={(e) =>
      setTripFuel(parseInt(e.target.value) || 0)
    }

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
</div>

<div style={{ marginBottom: '20px' }}>

  <label>Forward Cargo (kg)</label>

  <input

    type="number"

    value={forwardCargo}

    onChange={(e) =>
      setForwardCargo(
        parseInt(e.target.value) || 0
      )
    }

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

    onChange={(e) =>
      setAftCargo(
        parseInt(e.target.value) || 0
      )
    }

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

          zfw,

          tow,

          cg,

          cgStatus

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
import { useState } from 'react'
import StatusCard from './components/StatusCard'
import EnvelopeChart from './components/EnvelopeChart'
import aircraftDatabase from './data/aircraftDatabase'
import SeatMap from './components/SeatMap'
import CargoPanel from './components/CargoPanel'
function App() {

  const [passengers, setPassengers] = useState(0)

  const [fuel, setFuel] = useState(0)
  const [forwardCargo, setForwardCargo] =
  useState(0)

const [aftCargo, setAftCargo] =
  useState(0)
  const [selectedSeats, setSelectedSeats] =
  useState([])
  const [selectedAircraft, setSelectedAircraft] =
    useState(aircraftDatabase[0])
 const passengerWeight =
  selectedSeats.length * 84

 const zfw =

  selectedAircraft.basicWeight +

  passengerWeight +

  forwardCargo +

  aftCargo 
 

const fuelWeight =
  fuel

const basicMoment =
  selectedAircraft.basicWeight * 15

const passengerMoment =

  selectedSeats.reduce((total, seat) => {

    let arm = 0

    if (seat < 10) {
      arm = selectedAircraft.seatArmFwd
    }

    else if (seat < 20) {
      arm = selectedAircraft.seatArmMid
    }

    else {
      arm = selectedAircraft.seatArmAft
    }

    return total + (84 * arm)

  }, 0)

 const fuelMoment =
  fuelWeight * selectedAircraft.fuelArm 


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

  const cg =
  (totalMoment / tow).toFixed(2)

  const cgStatus =
  cg >= 15 && cg <= 25
 

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
      display: 'flex',
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial'
    }}
  >

    {/* SIDEBAR */}

    <div
      style={{
        width: '250px',
        backgroundColor: '#1b1b1b',
        padding: '30px',
        borderRight: '1px solid #333'
      }}
    >

      <h1
        style={{
          fontSize: '28px',
          marginBottom: '40px'
        }}
      >
        AIRWEIGHT
      </h1>

      <div style={{ marginBottom: '20px' }}>
        Dashboard
      </div>

      <div style={{ marginBottom: '20px' }}>
        Loadsheet
      </div>

      <div style={{ marginBottom: '20px' }}>
        Aircraft
      </div>

      <div style={{ marginBottom: '20px' }}>
        Settings
      </div>

    </div>

    {/* MAIN CONTENT */}

    <div
      style={{
        flex: 1,
        padding: '40px'
      }}
    >

      {/* TOP BAR */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >

        <div>

          <h2>
            {selectedAircraft.registration}
          </h2>

          <p style={{ color: '#888' }}>
            {selectedAircraft.type}
          </p>

        </div>

        <select
          value={selectedAircraft.registration}

          onChange={(e) => {

            const aircraft =
              aircraftDatabase.find(
                acft => acft.registration === e.target.value
              )

            setSelectedAircraft(aircraft)

          }}

          style={{
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#2b2b2b',
            color: 'white',
            border: 'none'
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

      {/* INPUT PANEL */}

      <div
        style={{
          backgroundColor: '#1f1f1f',
          padding: '30px',
          borderRadius: '15px',
          marginTop: '40px',
          width: '350px'
        }}
      >

        <h3 style={{ marginBottom: '20px' }}>
          Flight Inputs
        </h3>

        <div style={{ marginBottom: '20px' }}>

          <label>Passengers</label>

          <input
            type="number"
            value={selectedSeats.length}
            onChange={(e) => setPassengers(parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2b2b2b',
              color: 'white'
            }}
          />

        </div>

        <div>

          <label>Fuel (kg)</label>

          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2b2b2b',
              color: 'white'
            }}
          />

        </div>
<div style={{ marginTop: '20px' }}>

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
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#2b2b2b',
      color: 'white'
    }}
  />

</div>

<div style={{ marginTop: '20px' }}>

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
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#2b2b2b',
      color: 'white'
    }}
  />

</div>
      </div>

      {/* STATUS CARDS */}

      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '40px',
          flexWrap: 'wrap'
        }}
      >

        <StatusCard
          title="ZFW"
          value={zfw}
          status={zfwStatus}
        />

        <StatusCard
          title="TOW"
          value={tow}
          status={towStatus}
        />

        <StatusCard
          title="CG"
          value={cg}
          status={cgStatus}
        />

      </div>

 <EnvelopeChart
  cg={cg}
  weight={tow}
  status={cgStatus}
/> 

<SeatMap
  selectedSeats={selectedSeats}
  toggleSeat={toggleSeat}
/>
  

   </div>
<CargoPanel
  forwardCargo={forwardCargo}
  aftCargo={aftCargo}
/>
  </div>

) 
}

export default App
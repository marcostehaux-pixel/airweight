
import React from 'react';
import { calculateAirDistance } from './flightPlanningengine.js';
export default function FlightPlanning({
  passengerAircraft = [],
  cargoAircraft = []
}) {
  const [selectedRegistration, setSelectedRegistration] =
    React.useState('');
const [flightNumber, setFlightNumber] = React.useState('');
const [departure, setDeparture] = React.useState('');
const [destination, setDestination] = React.useState('');
const [alternate, setAlternate] = React.useState('');
const [zfw, setZfw] = React.useState('');
const [cruiseLevel, setCruiseLevel] = React.useState('');
const [averageWind, setAverageWind] = React.useState('');
const [routeDistance, setRouteDistance] = React.useState('');
const airDistanceResult =
  routeDistance !== '' && averageWind !== ''
    ? calculateAirDistance({
        groundDistance: routeDistance,
        averageWind
      })
    : null;
  const aircraftOptions = [
    ...passengerAircraft.map(aircraft => ({
      ...aircraft,
      operationType: 'PASSENGER'
    })),
    ...cargoAircraft.map(aircraft => ({
      ...aircraft,
      operationType: 'FREIGHTER'
    }))
  ]
    .filter(aircraft =>
      /^B737-800/i.test(aircraft.type || '')
    )
    .filter((aircraft, index, array) =>
      array.findIndex(item =>
        item.registration === aircraft.registration
      ) === index
    );

  const selectedAircraft = aircraftOptions.find(
    aircraft =>
      aircraft.registration === selectedRegistration
  );

  return (
    <div
      style={{
        padding: '28px',
        color: '#ffffff',
        maxWidth: '1100px',
        margin: '0 auto'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            color: '#8ca9d8',
            fontSize: '12px',
            letterSpacing: '2px',
            fontWeight: '700'
          }}
        >
          OPERDAT TRAINING
        </div>

        <h1 style={{ marginBottom: '8px' }}>
          Flight Planning Simulator
        </h1>

        <p style={{ color: '#b9c4d3' }}>
          Boeing 737-800 — Flight Dispatch Training
        </p>
      </div>

      <div
        style={{
          padding: '18px',
          marginBottom: '26px',
          borderRadius: '10px',
          background: 'rgba(21,101,255,0.12)',
          border: '1px solid rgba(21,101,255,0.4)',
          textAlign: 'center'
        }}
      >
        <strong>SIMULATED FLIGHT PLAN</strong>

        <div
          style={{
            marginTop: '6px',
            color: '#b9c4d3',
            fontSize: '13px'
          }}
        >
          FOR TRAINING PURPOSES ONLY — NOT FOR OPERATIONAL USE
        </div>
      </div>

      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'rgba(15,23,42,0.75)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Flight Configuration
        </h2>

<div style={{ marginBottom: '20px' }}>
  <label
    htmlFor="training-aircraft"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Aircraft Registration
  </label>

  <select
    id="training-aircraft"
    value={selectedRegistration}
    onChange={e =>
      setSelectedRegistration(e.target.value)
    }
    style={{
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  >
    <option value="">Select aircraft</option>

    {aircraftOptions.map(aircraft => (
      <option
        key={aircraft.registration}
        value={aircraft.registration}
      >
        {aircraft.registration} — {aircraft.type}
        {' — '}{aircraft.operationType}
      </option>
    ))}
  </select>
</div>

{selectedAircraft && (
  <div
    style={{
      padding: '15px',
      borderRadius: '8px',
      background: 'rgba(21,101,255,0.10)',
      color: '#dbe7ff',
      marginBottom: '20px'
    }}
  >
    <strong>
      {selectedAircraft.registration}
      {' — '}
      {selectedAircraft.type}
    </strong>

    <p>
      Configuration: {selectedAircraft.operationType}
    </p>

    <p>
      Maximum Takeoff Weight:{' '}
      {selectedAircraft.maxTOW?.toLocaleString()} kg
    </p>

    <p>
      Performance Model: B737-800 Training
    </p>
  </div>
)}

{/* FLIGHT ROUTE CONFIGURATION */}

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  }}
>
  {[
    {
      label: 'Flight Number',
      value: flightNumber,
      setter: setFlightNumber,
      maxLength: 10
    },
    {
      label: 'Departure ICAO',
      value: departure,
      setter: setDeparture,
      maxLength: 4
    },
    {
      label: 'Destination ICAO',
      value: destination,
      setter: setDestination,
      maxLength: 4
    },
    {
      label: 'Alternate ICAO',
      value: alternate,
      setter: setAlternate,
      maxLength: 4
    }
  ].map(field => (
    <div key={field.label}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: '#b9c4d3'
        }}
      >
        {field.label}
      </label>

      <input
        type="text"
        value={field.value}
        maxLength={field.maxLength}
        onChange={e =>
          field.setter(
            e.target.value.toUpperCase()
          )
        }
        placeholder={
          field.maxLength === 4
            ? 'ICAO'
            : 'NG4521'
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px',
          borderRadius: '8px',
          background: '#17243a',
          color: '#ffffff',
          border: '1px solid #43536b'
        }}
      />
      
    </div>
  ))}
</div>

{/* FLIGHT PERFORMANCE CONFIGURATION */}

{/* PLANNED ROUTE DISTANCE */}

<div style={{ marginBottom: '24px' }}>
  <label
    htmlFor="training-route-distance"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Planned Route Distance (NM)
  </label>

  <input
    id="training-route-distance"
    type="number"
    min="1"
    step="1"
    value={routeDistance}
    onChange={e => setRouteDistance(e.target.value)}
    placeholder="Enter planned distance"
    style={{
      width: '100%',
      maxWidth: '260px',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  />
</div>

<h3 style={{ marginTop: '26px', marginBottom: '16px' }}>
  Flight Performance
</h3>

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  }}
>
  <div>
    <label
      htmlFor="training-zfw"
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      Estimated Zero Fuel Weight — EZFW (kg)
    </label>

    <input
      id="training-zfw"
      type="number"
      min="0"
      step="100"
      value={zfw}
      onChange={e => setZfw(e.target.value)}
      placeholder="56000"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    />
  </div>

  <div>
    <label
      htmlFor="training-flight-level"
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      Cruise Flight Level
    </label>

    <input
      id="training-flight-level"
      type="number"
      min="0"
      max="450"
      step="10"
      value={cruiseLevel}
      onChange={e => setCruiseLevel(e.target.value)}
      placeholder="350"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    />
  </div>

  <div>
    <label
      htmlFor="training-wind"
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      Average Wind Component (kt)
    </label>

    <input
      id="training-wind"
      type="number"
      min="-150"
      max="150"
      step="5"
      value={averageWind}
      onChange={e => setAverageWind(e.target.value)}
      placeholder="-30"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    />

    <div
      style={{
        fontSize: '12px',
        color: '#8ca9d8',
        marginTop: '6px'
      }}
    >
      Positive = Tailwind / Negative = Headwind
    </div>
    
{/* SIMULATED AIR DISTANCE */}

{airDistanceResult && (
  <div
    style={{
      marginTop: '12px',
      marginBottom: '24px',
      padding: '20px',
      borderRadius: '10px',
      background: 'rgba(21,101,255,0.10)',
      border: '1px solid rgba(21,101,255,0.35)'
    }}
  >
    <h3 style={{ marginTop: 0 }}>
      Preliminary Flight Estimates
    </h3>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px'
      }}
    >
      <div>
        <div style={{ color: '#b9c4d3' }}>
          Ground Distance
        </div>
        <strong>
          {airDistanceResult.groundDistance.toLocaleString()} NM
        </strong>
      </div>

      <div>
        <div style={{ color: '#b9c4d3' }}>
          Average Wind
        </div>
        <strong>
          {airDistanceResult.averageWind} kt
        </strong>
      </div>

      <div>
        <div style={{ color: '#b9c4d3' }}>
          Estimated Air Distance
        </div>
        <strong>
          {airDistanceResult.airDistance.toLocaleString()} NM
        </strong>
      </div>
    </div>

    <p
      style={{
        marginBottom: 0,
        marginTop: '16px',
        fontSize: '12px',
        color: '#8ca9d8'
      }}
    >
      Preliminary training estimate using a reference
      TAS of 450 kt. Not an operational calculation.
    </p>
  </div>
)}

  </div>
</div>


        <p style={{ color: '#b9c4d3' }}>
          Status: Simulator under development
        </p>

        <p style={{ color: '#8ca9d8' }}>
          Route selection, weather conditions,
          fuel planning and simulated flight plan
          generation will be added progressively.
        </p>
      </div>
    </div>
  );
}

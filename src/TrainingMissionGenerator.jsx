import React from 'react';
import { trainingRoutes } from './trainingRoutes';
export default function TrainingMissionGenerator({
  passengerAircraft = [],
  cargoAircraft = []
}) {
  const [missionType, setMissionType] = React.useState('PASSENGER');
const [generatedAircraft, setGeneratedAircraft] = React.useState(null);
const [generatedPassengers, setGeneratedPassengers] =
  React.useState(null);
  const [generatedCargo, setGeneratedCargo] = React.useState(0);
  const [generatedRoute, setGeneratedRoute] = React.useState(null);
  const [generatedWind, setGeneratedWind] = React.useState(null);
  const availableAircraft = (
    missionType === 'PASSENGER'
      ? passengerAircraft
      : cargoAircraft
  ).filter(aircraft =>
    /^B737-800/i.test(aircraft.type || '')
  );
const generateMission = () => {
  if (availableAircraft.length === 0) {
    setGeneratedAircraft(null);
    return;
  }

  const randomIndex = Math.floor(
    Math.random() * availableAircraft.length
  );

  setGeneratedAircraft(availableAircraft[randomIndex]);
  const availableRoutes = trainingRoutes.filter(
  route =>
    route.trainingOnly === true &&
    route.testEnabled !== false &&
    route.from &&
    route.to
);

const randomRoute = availableRoutes.length > 0
  ? availableRoutes[
      Math.floor(Math.random() * availableRoutes.length)
    ]
  : null;

setGeneratedRoute(randomRoute);
const randomWind = Math.floor(Math.random() * 81) - 40;
setGeneratedWind(randomWind);
  if (missionType === 'PASSENGER') {
  const adults = Math.floor(Math.random() * 41) + 120;
  const children = Math.floor(Math.random() * 11);
  const infants = Math.floor(Math.random() * 5);

  setGeneratedPassengers({
    adults,
    children,
    infants
  });
  const hasCargo = Math.random() < 0.4;

const cargoWeight = hasCargo
  ? (Math.floor(Math.random() * 19) + 2) * 100
  : 0;

setGeneratedCargo(cargoWeight);
} else {
  setGeneratedPassengers(null);

  const freighterCargo =
  (Math.floor(Math.random() * 55) + 16) * 500;

  setGeneratedCargo(freighterCargo);
}
};
  return (
    <div
      style={{
        background: '#17243a',
        border: '1px solid #43536b',
        borderRadius: '12px',
        padding: '20px',
        color: '#ffffff'
      }}
    >
      <h3>Generate Training Mission</h3>

      <p>Select the type of training mission.</p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
        
          type="button"
         onClick={() => {
  setMissionType('PASSENGER');
  setGeneratedAircraft(null);
  setGeneratedRoute(null);
  setGeneratedWind(null);
  setGeneratedCargo(0);
  setGeneratedPassengers(null);
}}
          style={{
            padding: '10px 16px',
            cursor: 'pointer'
          }}
        >
          Passenger Mission
        </button>

        <button
          type="button"
         onClick={() => {
  setMissionType('FREIGHTER');
  setGeneratedAircraft(null);
  setGeneratedWind(null);
  setGeneratedRoute(null);
  setGeneratedCargo(0);
  setGeneratedPassengers(null);
}}
          style={{
            padding: '10px 16px',
            cursor: 'pointer'
          }}
        >
          Freighter Mission
        </button>
      </div>

      <p>
        Available aircraft: {availableAircraft.length}
      </p>
      <button
  type="button"
  onClick={generateMission}
  disabled={availableAircraft.length === 0}
>
  Generate Mission
</button>

{generatedAircraft && (
  <div style={{ marginTop: '20px' }}>
    <h4>Training Mission — {missionType}</h4>

    <p>Registration: {generatedAircraft.registration}</p>
    <p>Aircraft: {generatedAircraft.type}</p>
    <p>
      DOW:{' '}
      {Number(generatedAircraft.basicWeight).toLocaleString('en-US')} kg
    </p>
    {missionType === 'FREIGHTER' && (
  <div style={{ marginTop: '15px' }}>
    <h4>Freighter Cargo Manifest</h4>

    <p>
      Total Cargo Weight:{' '}
      {generatedCargo.toLocaleString('en-US')} kg
    </p>

    <p style={{ fontWeight: 'bold', color: '#64a5ff' }}>
      Calculate the Estimated Zero Fuel Weight (EZFW)
    </p>
  </div>
)}
  </div>
)}
{generatedRoute && (
  <div style={{ marginTop: '15px' }}>
    <h4>Assigned Flight</h4>
    <p>Departure Airport: {generatedRoute.from}</p>
    <p>Destination Airport: {generatedRoute.to}</p>
    {generatedRoute.referenceCruiseLevel && (
  <p>
    {generatedWind !== null && (
  <p>
    Average Wind: {generatedWind > 0 ? '+' : ''}
    {generatedWind} kt
  </p>
)}
    Planned Cruise Level: FL
    {generatedRoute.referenceCruiseLevel}
  </p>
  
)}
  </div>
)}
{missionType === 'PASSENGER' && generatedPassengers && (
    
  <div style={{ marginTop: '15px' }}>
    <h4>Passenger Manifest</h4>

    <p>Adults (AD): {generatedPassengers.adults}</p>
    <p>Children (CH): {generatedPassengers.children}</p>
    <p>Infants (INF): {generatedPassengers.infants}</p>

    <p>
      Total PAX:{' '}
      {generatedPassengers.adults +
        generatedPassengers.children +
        generatedPassengers.infants}
    </p>
    <p>
  Passenger Weight:{' '}
  {(
    generatedPassengers.adults * 84 +
    generatedPassengers.children * 42 +
    generatedPassengers.infants * 20
  ).toLocaleString('en-US')} kg
</p>

<p>
  Baggage Weight:{' '}
  {(
    (generatedPassengers.adults +
      generatedPassengers.children) * 14
  ).toLocaleString('en-US')} kg
</p>
<p>
  Commercial Cargo:{' '}
  {generatedCargo.toLocaleString('en-US')} kg
</p>
<p
  style={{
    marginTop: '15px',
    fontWeight: 'bold',
    color: '#64a5ff'
  }}
>
  Calculate the Estimated Zero Fuel Weight (EZFW)
</p>
  </div>
)}
    </div>
  );
}

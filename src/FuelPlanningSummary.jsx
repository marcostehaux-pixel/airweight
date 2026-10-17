import React from 'react';

/**
 * OPERDAT TRAINING
 * Simulated Dispatch Fuel Summary
 *
 * NOT FOR OPERATIONAL USE
 */


export default function FuelPlanningSummary({
  tripFuel = null,
  tripTimeMinutes = null,
  contingencyFuel = null,
  alternateFuel = null,
  alternateTimeMinutes = null,
  holdingFuel = null,
  holdingTimeMinutes = null,
  taxiFuel = null,
  extraFuel = null,
  tankeringFuel = null,
  etopsFuel = 0,
  ballastFuel = 0,
  policyFuel = 0,
  requiredFuel = null,
  totalFuel = null,
  takeoffFuel = null
}) {

  const items = [
    'TRIP',
    'ENRTE RSV',
    'ALTN',
    'HOLD ALTN',
    'ETOPS',
    'BALLAST',
    'POLICY',
    'STORED',
    'REQUIRED',
    'TAXI / APU',
    'EXTRA / TANKERING',
'TOTAL FUEL',
'TAKEOFF FUEL'
  ];

  const formatTime = minutes => {
    if (!Number.isFinite(minutes)) return '—';

    const totalMinutes = Math.round(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${hours}:${String(remainingMinutes).padStart(2, '0')}`;
  };

  const getTime = item => {
  if (item === 'TRIP') {
    return formatTime(tripTimeMinutes);
  }

  if (item === 'ALTN') {
    return formatTime(alternateTimeMinutes);
  }

  if (item === 'HOLD ALTN') {
    return formatTime(holdingTimeMinutes);
  }

  return '—';
};
 const getFuel = item => {
  let fuel = null;

  if (item === 'TRIP') {
    fuel = tripFuel;
  } else if (item === 'ENRTE RSV') {
    fuel = contingencyFuel;
  } else if (item === 'ALTN') {
    fuel = alternateFuel;
 
} else if (item === 'HOLD ALTN') {
  fuel = holdingFuel;
} else if (item === 'ETOPS') {
  fuel = etopsFuel;
} else if (item === 'BALLAST') {
  fuel = ballastFuel;
} else if (item === 'POLICY') {
  fuel = policyFuel;
} else if (item === 'TAXI / APU') {
  fuel = taxiFuel;


} else if (item === 'EXTRA / TANKERING') {
  fuel =
    extraFuel === null && tankeringFuel === null
      ? null
      : (extraFuel ?? 0) + (tankeringFuel ?? 0);
} else if (item === 'REQUIRED') {
  fuel = requiredFuel;
} else if (item === 'TOTAL FUEL') {
  fuel = totalFuel;
} else if (item === 'TAKEOFF FUEL') {
  fuel = takeoffFuel;
}

  return Number.isFinite(fuel)
    ? `${fuel.toLocaleString()} *`
    : '—';
};

  return (
    <div
      style={{
        marginTop: '24px',
        padding: '20px',
        borderRadius: '10px',
        background: '#101b2e',
        border: '1px solid #30445f',
        color: '#ffffff'
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        Fuel Planning Summary
      </h3>

      <p
        style={{
          color: '#8ca9d8',
          fontSize: '12px'
        }}
      >
        SIMULATED FLIGHT PLAN — FOR TRAINING PURPOSES
        ONLY — NOT FOR OPERATIONAL USE
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #43536b'
              }}
            >
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left'
                }}
              >
                FUEL ITEM
              </th>

              <th
                style={{
                  padding: '12px',
                  textAlign: 'center'
                }}
              >
                TIME
              </th>

              <th
                style={{
                  padding: '12px',
                  textAlign: 'right'
                }}
              >
                FUEL (KG)
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => {
              const isTotal = [
                'REQUIRED',
                'TOTAL FUEL'
              ].includes(item);

              return (
                <tr
                  key={item}
                  style={{
                    borderBottom: '1px solid #263950',
                    fontWeight: isTotal
                      ? 'bold'
                      : 'normal'
                  }}
                >
                  <td
                    style={{
                      padding: '10px 12px'
                    }}
                  >
                    {item}
                  </td>

                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'center'
                    }}
                  >
                    {getTime(item)}
                  </td>

                  <td
                    style={{
                      padding: '10px 12px',
                      textAlign: 'right'
                    }}
                  >
                    {getFuel(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p
        style={{
          marginTop: '12px',
          marginBottom: 0,
          color: '#8ca9d8',
          fontSize: '12px',
          lineHeight: '1.6'
        }}
      >
        * Preliminary training values.
        TRIP uses LRC reference fuel without landing
        weight adjustment. ENRTE RSV currently shows
        5% of reference TRIP; comparison against
        5-minute holding fuel is pending.
        ALTN is a preliminary estimate based on
        manually entered average ground speed
        and fuel flow.
      </p>
    </div>
  );
}

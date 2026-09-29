function AircraftTechnicalConfiguration({
  aircraft,
  fullData,
  onClose
}) {
  if (!aircraft || !fullData) return null

  const { configuration } = fullData

  return (
    <div
      style={{
        marginTop: '24px',
        padding: '24px',
        borderRadius: '16px',
        background:
          'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
        border:
          '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 8px 24px rgba(0,0,0,0.18)'
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <div>
          <div
            style={{
              color: '#4f8cff',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              marginBottom: '7px'
            }}
          >
            TECHNICAL CONFIGURATION
          </div>

          <div
            style={{
              fontSize: '24px',
              fontWeight: '700'
            }}
          >
            {aircraft.registration}
          </div>

          <div
            style={{
              color: '#8fa0b7',
              fontSize: '13px',
              marginTop: '6px'
            }}
          >
            {aircraft.aircraft_type}
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title="Close configuration"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background:
                'rgba(255,255,255,0.04)',
              color: '#8fa0b7',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ▲
          </button>
        )}
      </div>

      {/* AIRCRAFT DATA + W&B */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '18px'
        }}
      >

        <TechnicalPanel
          title="AIRCRAFT DATA"
          rows={[
            ['DOW', fullData.aircraft.dow, 'kg'],
            ['MZFW', fullData.aircraft.mzfw, 'kg'],
            ['MTOW', fullData.aircraft.mtow, 'kg'],
            ['MRW', fullData.aircraft.mrw, 'kg'],
            ['MLW', fullData.aircraft.mlw, 'kg']
          ]}
        />

        <TechnicalPanel
          title="WEIGHT & BALANCE CONFIGURATION"
          rows={[
            ['Basic Weight', configuration.basic_weight],
            ['Basic Index', configuration.basic_index],
            ['Basic Configuration', configuration.basic_config],
            ['Basic Crew', configuration.basic_crew],
            ['MAC', configuration.mac],
            ['LEMAC', configuration.lemac],
            ['Datum', configuration.datum],
            ['Index Reference Arm', configuration.index_reference_arm],
            ['Index Constant', configuration.index_constant],
            ['Index Offset', configuration.index_offset],
            ['Seat Arm FWD', configuration.seat_arm_fwd],
            ['Seat Arm MID', configuration.seat_arm_mid],
            ['Seat Arm AFT', configuration.seat_arm_aft],
            ['Fuel Arm', configuration.fuel_arm],
            ['Forward Cargo Arm', configuration.foward_cargo_arm],
            ['Aft Cargo Arm', configuration.aft_cargo_arm]
          ]}
        />

      </div>
{/* OPERATIONAL ENVELOPES */}

<div
  style={{
    marginTop: '18px',
    padding: '20px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)'
  }}
>
  <div
    style={{
      color: '#4f8cff',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1.3px',
      marginBottom: '18px'
    }}
  >
    OPERATIONAL ENVELOPES
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '0.8fr 1fr 1fr 1fr 1fr',
      gap: '12px',
      paddingBottom: '10px',
      color: '#7f8da0',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.8px'
    }}
  >
    <div>PHASE</div>
    <div>INDEX MIN</div>
    <div>INDEX MAX</div>
    <div>CG MIN</div>
    <div>CG MAX</div>
  </div>

  {(fullData.envelopes || []).map((envelope) => (
    <div
      key={envelope.id}
      style={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 1fr 1fr 1fr 1fr',
        gap: '12px',
        padding: '11px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: '13px'
      }}
    >
      <div
        style={{
          fontWeight: '700',
          color: '#ffffff'
        }}
      >
        {envelope.phase}
      </div>

      <div>{envelope.index_min}</div>
      <div>{envelope.index_max}</div>
      <div>{envelope.cg_min} %</div>
      <div>{envelope.cg_max} %</div>
    </div>
  ))}
</div>


{/* CARGO POSITIONS */}

<div
  style={{
    marginTop: '18px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px'
  }}
>

  {/* MAIN DECK */}

  <CargoPositionsPanel
    title="MAIN DECK CARGO POSITIONS"
    positions={(fullData.cargoPositions || []).filter(
      position => position.deck === 'MAIN'
    )}
  />

  {/* LOWER DECK */}

  <CargoPositionsPanel
    title="LOWER DECK CARGO POSITIONS"
    positions={(fullData.cargoPositions || []).filter(
      position => position.deck === 'LOWER'
    )}
  />

</div>
    </div>
  )
}


function TechnicalPanel({ title, rows }) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)'
      }}
    >
      <div
        style={{
          color: '#4f8cff',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1.3px',
          marginBottom: '18px'
        }}
      >
        {title}
      </div>

      {rows.map(([label, value, unit]) => (
        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            padding: '9px 0',
            borderBottom:
              '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <span style={{ color: '#8fa0b7' }}>
            {label}
          </span>

          <span style={{ fontWeight: '600' }}>
            {value ?? '----'}
            {value != null && unit ? ` ${unit}` : ''}
          </span>
        </div>
      ))}
    </div>
  )
}
function CargoPositionsPanel({
  title,
  positions
}) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)'
      }}
    >
      <div
        style={{
          color: '#4f8cff',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1.3px',
          marginBottom: '18px'
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
          paddingBottom: '9px',
          color: '#7f8da0',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.7px'
        }}
      >
        <div>POSITION</div>
        <div>MAX WEIGHT</div>
        <div>ARM</div>
      </div>

      {positions.map((position) => (
        <div
          key={position.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            padding: '9px 0',
            borderTop:
              '1px solid rgba(255,255,255,0.05)',
            fontSize: '12px'
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontWeight: '700'
            }}
          >
            {position.position_code}
          </div>

          <div>
            {Number(
              position.max_weight
            ).toLocaleString()} kg
          </div>

          <div>
            {position.arm}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AircraftTechnicalConfiguration
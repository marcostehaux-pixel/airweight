
import React, { useState, useCallback } from 'react'
import { calculateTakeoffFieldLimit } from './performance/takeoffPerformanceEngine.js'
import { calculateClimbLimit } from './performance/climbLimitEngine.js'
import ObstacleLimitPanel from './ObstacleLimitPanel.jsx'
/**
 * OPERDAT TRAINING
 * B737-800W — TAKEOFF PERFORMANCE
 *
 * FIELD LIMIT + SECOND SEGMENT CLIMB LIMIT
 *
 * Generic simulated training calculations.
 * NOT CERTIFIED BOEING PERFORMANCE DATA.
 *
 * TRAINING ONLY — NOT FOR OPERATIONAL USE.
 */

export default function TakeoffPerformance() {
  const [registration, setRegistration] = useState('')
const [departure, setDeparture] = useState('')
const [obstacleWeight, setObstacleWeight] = useState(null)
const [obstacleInputs, setObstacleInputs] = useState(null)
const [savedResults, setSavedResults] = useState(() => {
  try {
    const stored = sessionStorage.getItem(
      'operdat_takeoff_performance_results'
    )
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
})

  const [data, setData] = useState({
    flaps: '5',
    runwayCondition: 'DRY',
    runwayLength: '2800',
    oat: '25',
    pressureAltitude: '0',
    wind: '0',
    slope: '0',
    packs: 'ON',
    antiIce: 'OFF'
  })

  const update = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const fieldStyle = {
    width: '100%',
    padding: '11px',
    background: '#0c1623',
    border: '1px solid #34495e',
    borderRadius: '7px',
    color: '#ffffff',
    boxSizing: 'border-box',
    fontSize: '14px'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '7px',
    color: '#b9c4d3',
    fontSize: '13px',
    fontWeight: 600
  }

  const field = (label, key, options = null) => (
    <div key={key}>
      <label style={labelStyle}>{label}</label>

      {options ? (
        <select
          value={data[key]}
          onChange={e => update(key, e.target.value)}
          style={fieldStyle}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          value={data[key]}
          onChange={e => update(key, e.target.value)}
          style={fieldStyle}
        />
      )}
    </div>
  )

  const formatKg = value =>
    new Intl.NumberFormat('es-AR').format(value)

  const numericFields = [
    'runwayLength',
    'oat',
    'pressureAltitude',
    'wind',
    'slope'
  ]

  const invalidField = numericFields.find(
    key =>
      data[key].trim() === '' ||
      !Number.isFinite(Number(data[key]))
  )

  const supportedFlaps = ['1', '5', '10', '15', '25']

  let fieldResult = null
  let climbResult = null

  let fieldError = ''
  let climbError = ''

  const commonInputs = {
    flaps: Number(data.flaps),
    oatC: Number(data.oat),
    pressureAltitudeFt: Number(data.pressureAltitude),
    packsOff: data.packs === 'OFF',
    engineAntiIce: data.antiIce !== 'OFF',
    wingAntiIce: data.antiIce === 'ENGINE + WING'
  }

  if (invalidField) {
    const message =
      'Complete all numeric fields with valid values.'

    fieldError = message

    // CLIMB LIMIT does not depend on TORA, wind or slope.
    if (
      data.oat.trim() === '' ||
      data.pressureAltitude.trim() === '' ||
      !Number.isFinite(Number(data.oat)) ||
      !Number.isFinite(Number(data.pressureAltitude))
    ) {
      climbError =
        'Complete OAT and Pressure Altitude with valid values.'
    }
  }

  if (!supportedFlaps.includes(data.flaps)) {
    const message =
      `FLAPS ${data.flaps} is not available.`

    fieldError = message
    climbError = message
  }

  // FIELD LIMIT: runway-dependent calculation.
if (!fieldError) {
  try {
    fieldResult = calculateTakeoffFieldLimit({
      ...commonInputs,
      runwayCondition: data.runwayCondition,
      toraM: Number(data.runwayLength),
      slopePercent: Number(data.slope),
      windComponentKt: Number(data.wind)
    })
  } catch (err) {
    fieldError = err.message
  }
}

  // CLIMB LIMIT: second-segment climb calculation.
  // No TORA, wind or runway slope inputs.
  if (!climbError) {
    try {
      climbResult = calculateClimbLimit(commonInputs)
    } catch (err) {
      climbError = err.message
    }
  }

  const panelStyle = {
    padding: '22px',
    background: '#192b3e',
    border: '1px solid #36516b',
    borderRadius: '10px'
  }

  const panelTitleStyle = {
    fontSize: '13px',
    color: '#a8bbcd',
    fontWeight: 700,
    letterSpacing: '1px'
  }

  const detailStyle = {
    marginTop: '14px',
    fontSize: '13px',
    lineHeight: 1.9,
    color: '#b9c9d9'
  }

  const errorStyle = {
    color: '#ffb36b',
    marginTop: '14px',
    fontSize: '13px'
  }

  const noteStyle = {
    color: '#8ea3b8',
    fontSize: '12px',
    marginTop: '14px',
    lineHeight: 1.6
  }

const savePerformance = () => {
  const aircraft = registration.trim().toUpperCase()
  const airport = departure.trim().toUpperCase()

  if (!aircraft || !/^[A-Z]{4}$/.test(airport)) {
    alert('Enter aircraft registration and a valid 4-letter ICAO aerodrome.')
    return
  }

  if (
    !fieldResult ||
    !climbResult ||
    !Number.isFinite(obstacleWeight)
  ) {
    alert('All three performance results must be valid before saving.')
    return
  }

  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: new Date().toLocaleString('es-AR'),
    registration: aircraft,
    departure: airport,
    inputs: { ...data },
    fieldLimitKg: fieldResult.fieldLimitWeightKg,
    climbLimitKg: climbResult.climbLimitWeightKg,
    obstacleLimitKg: obstacleWeight,
obstacleInputs: { ...obstacleInputs }
  }

  try {
    const updated = [record, ...savedResults]

    sessionStorage.setItem(
      'operdat_takeoff_performance_results',
      JSON.stringify(updated)
    )

    setSavedResults(updated)
  } catch {
    alert('Unable to save results in this browser session.')
  }
}
const handleObstacleResultChange = useCallback(
  (weight, inputs) => {
    setObstacleWeight(weight)
    setObstacleInputs(inputs)
  },
  []
)
  return (
    <div
      style={{
        padding: '25px',
        background: '#111c29',
        border: '1px solid #33485d',
        borderRadius: '12px',
        color: '#ffffff',
        maxWidth: '1150px',
        margin: '0 auto'
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        TAKEOFF PERFORMANCE — B737-800W
      </h2>

      <p style={{ color: '#9eafc1' }}>
        Aircraft configuration, runway and atmospheric
        conditions
      </p>

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginTop: '22px'
  }}
>
  <div>
    <label style={labelStyle}>
      Aircraft Registration
    </label>

    <input
      type="text"
      placeholder="LV-ABC"
      maxLength={12}
      value={registration}
      onChange={e =>
        setRegistration(e.target.value.toUpperCase())
      }
      style={fieldStyle}
    />
  </div>

  <div>
    <label style={labelStyle}>
      Departure Aerodrome (ICAO)
    </label>

    <input
      type="text"
      placeholder="LEBL"
      maxLength={4}
      value={departure}
      onChange={e =>
        setDeparture(e.target.value.toUpperCase())
      }
      style={fieldStyle}
    />
  </div>
</div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginTop: '25px'
        }}
      >
        {field(
          'Takeoff Flaps',
          'flaps',
          ['1', '5', '10', '15', '25']
        )}

        {field(
          'Runway Condition',
          'runwayCondition',
          ['DRY', 'WET']
        )}

        {field(
          'Runway Length / TORA (m)',
          'runwayLength'
        )}

        {field('OAT (°C)', 'oat')}

        {field(
          'Pressure Altitude (ft)',
          'pressureAltitude'
        )}

        {field('Wind Component (kt)', 'wind')}

        {field('Runway Slope (%)', 'slope')}

        {field(
          'Air Conditioning / Packs',
          'packs',
          ['ON', 'OFF']
        )}

        {field(
          'Anti-Ice',
          'antiIce',
          ['OFF', 'ENGINE', 'ENGINE + WING']
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px',
          marginTop: '28px'
        }}
      >
        {/* FIELD LIMIT */}
        <div style={panelStyle}>
          <div style={panelTitleStyle}>
            FIELD LIMIT WEIGHT — FLAPS {data.flaps}
            {' / '}
            {data.runwayCondition}
          </div>

          <div
            style={{
              fontSize: '34px',
              fontWeight: 800,
              marginTop: '10px',
              color: fieldError
                ? '#f0ad4e'
                : '#ffffff'
            }}
          >
            {fieldResult
  ? `${formatKg(
      fieldResult.fieldLimitWeightKg
    )} kg`
  : '— kg'}
          </div>

          {fieldResult && (
            <div style={detailStyle}>
              <div>
                Corrected Field Length:
                {' '}
                {fieldResult.correctedFieldLengthM.toFixed(1)}
                {' m'}
              </div>

              <div>
                Reference Field Limit:
                {' '}
                {formatKg(
                  fieldResult.referenceFieldLimitKg
                )}
                {' kg'}
              </div>

              <div>
                Configuration Correction:
                {' '}
                {fieldResult.fieldLimitCorrectionKg > 0
                  ? '+'
                  : ''}
                {formatKg(
                  fieldResult.fieldLimitCorrectionKg
                )}
                {' kg'}
              </div>
            </div>
          )}

          {fieldError && (
            <div role="alert" style={errorStyle}>
              {fieldError}
            </div>
          )}

          <div style={noteStyle}>
            Runway-dependent field-length limitation.
            FIELD LIMIT alone does not establish the
            maximum permissible takeoff weight.
          </div>
        </div>

        {/* CLIMB LIMIT */}
        <div style={panelStyle}>
          <div style={panelTitleStyle}>
            CLIMB LIMIT WEIGHT — FLAPS {data.flaps}
          </div>

          <div
            style={{
              fontSize: '34px',
              fontWeight: 800,
              marginTop: '10px',
              color: climbError
                ? '#f0ad4e'
                : '#ffffff'
            }}
          >
            {climbResult
              ? `${formatKg(
                  climbResult.climbLimitWeightKg
                )} kg`
              : '— kg'}
          </div>

          {climbResult && (
            <div style={detailStyle}>
              <div>
                Reference Climb Limit:
                {' '}
                {formatKg(
                  climbResult.referenceWeightKg
                )}
                {' kg'}
              </div>

              <div>
                Configuration Correction:
                {' '}
                {climbResult.correctionKg > 0
                  ? '+'
                  : ''}
                {formatKg(
                  climbResult.correctionKg
                )}
                {' kg'}
              </div>

              <div>
                Pressure Altitude:
                {' '}
                {formatKg(
                  climbResult.pressureAltitudeFt
                )}
                {' ft'}
              </div>

              <div>
                OAT:
                {' '}
                {climbResult.oatC}
                {' °C'}
              </div>
            </div>
          )}

          {climbError && (
            <div role="alert" style={errorStyle}>
              {climbError}
            </div>
          )}

          <div style={noteStyle}>
            Simulated second-segment climb limitation.
            Calculated from OAT, pressure altitude,
            FLAPS and aircraft configuration.
            Runway length, wind and slope are not
            applied to this calculation.
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#142333',
          border: '1px solid #36516b',
          borderRadius: '8px',
          color: '#a8bbcd',
          fontSize: '12px',
          lineHeight: 1.7
        }}
      >
        <strong>
          TRAINING ONLY — NOT FOR OPERATIONAL USE
        </strong>

        <div style={{ marginTop: '6px' }}>
          FIELD LIMIT and CLIMB LIMIT are simulated
          training estimates, not certified Boeing
          performance data. Other takeoff limitations
          are not included. The student must evaluate
          the available limitations independently.
        </div>
      </div>
     <ObstacleLimitPanel
  onResultChange={handleObstacleResultChange}
/>

<div style={{ marginTop: '25px' }}>
  <button
    type="button"
    onClick={savePerformance}
    style={{
      padding: '13px 24px',
      background: '#1769aa',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 700,
      cursor: 'pointer'
    }}
  >
    SAVE RESULTS
  </button>

  <h3 style={{ marginTop: '30px' }}>
    SAVED PERFORMANCE RESULTS
  </h3>

  {savedResults.length === 0 ? (
    <p style={{ color: '#9eafc1' }}>
      No saved results in this session.
    </p>
  ) : (
    savedResults.map(record => (
      <details
        key={record.id}
        style={{
          marginBottom: '12px',
          padding: '16px',
          background: '#192b3e',
          border: '1px solid #36516b',
          borderRadius: '8px'
        }}
      >
        <summary style={{ cursor: 'pointer' }}>
          <strong>
            {record.registration} — {record.departure}
          </strong>
          {' | '}
          {record.date}
        </summary>

        <div style={{ marginTop: '14px', lineHeight: 2 }}>
          <div>
            FIELD LIMIT: {formatKg(record.fieldLimitKg)} kg
          </div>
          <div>
            CLIMB LIMIT: {formatKg(record.climbLimitKg)} kg
          </div>
          <div>
            OBSTACLE LIMIT: {formatKg(record.obstacleLimitKg)} kg
          </div>
          
{record.obstacleInputs && (
  <div
    style={{
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #36516b'
    }}
  >
    <strong>TAKEOFF PERFORMANCE PARAMETERS</strong>

    <div>
      FLAPS: {record.obstacleInputs.flaps}
    </div>
    <div>
      OBSTACLE HEIGHT: {record.obstacleInputs.obstacleHeightFt} ft
    </div>
    <div>
      DISTANCE FROM BRAKE RELEASE:
      {' '}
      {record.obstacleInputs.distanceFromBrakeReleaseM} m
    </div>
    <div>
      OAT: {record.obstacleInputs.oatC} °C
    </div>
    <div>
      PRESSURE ALTITUDE:
      {' '}
      {record.obstacleInputs.pressureAltitudeFt} ft
    </div>
    <div>
      WIND COMPONENT:
      {' '}
      {record.obstacleInputs.windComponentKt} kt
    </div>
    <div>
      PACKS: {record.obstacleInputs.packs}
    </div>
    <div>
      ANTI-ICE: {record.obstacleInputs.antiIce}
    </div>
  </div>
)}

          <div>
            FLAPS: {record.inputs.flaps}
          </div>
          <div>
            RUNWAY CONDITION: {record.inputs.runwayCondition}
          </div>
          <div>
            TORA: {record.inputs.runwayLength} m
          </div>
          <div>
            OAT: {record.inputs.oat} °C
          </div>
          <div>
            PRESSURE ALTITUDE: {record.inputs.pressureAltitude} ft
          </div>
          <div>
            WIND: {record.inputs.wind} kt
          </div>
          <div>
            SLOPE: {record.inputs.slope} %
          </div>
          <div>
            PACKS: {record.inputs.packs}
          </div>
          <div>
            ANTI-ICE: {record.inputs.antiIce}
          </div>
        </div>
      </details>
    ))
  )}
</div>

    </div>
  )
}



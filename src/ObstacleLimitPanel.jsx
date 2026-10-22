
import React, { useState } from 'react'
import { calculateObstacleLimit } from './performance/obstacleLimitEngine.js'

/**
 * OPERDAT TRAINING
 * B737-800W — OBSTACLE LIMIT PANEL
 *
 * FLAPS 1 — SIMULATED TRAINING MODEL
 * NOT FOR OPERATIONAL USE.
 */

export default function ObstacleLimitPanel() {
  const [data, setData] = useState({
    flaps: '1',
    obstacleHeightFt: '450',
    distanceFromBrakeReleaseM: '5000',
    oatC: '40',
    pressureAltitudeFt: '5000',
    windComponentKt: '10',
    packs: 'ON',
    antiIce: 'OFF'
  })

  const update = (key, value) => {
    setData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const inputStyle = {
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

  const fields = [
    
  {
  key: 'flaps',
  label: 'Takeoff Flaps',
  options: ['1', '5', '10', '15', '25']
},
    {
      key: 'obstacleHeightFt',
      label: 'Obstacle Height (ft)'
    },
    {
      key: 'distanceFromBrakeReleaseM',
      label: 'Distance from Brake Release (m)'
    },
    {
      key: 'oatC',
      label: 'OAT (°C)'
    },
    {
      key: 'pressureAltitudeFt',
      label: 'Pressure Altitude (ft)'
    },
    {
      key: 'windComponentKt',
      label: 'Wind Component (kt) — Headwind + / Tailwind −'
    },
    {
      key: 'packs',
      label: 'Air Conditioning / Packs',
      options: ['ON', 'OFF']
    },
    {
      key: 'antiIce',
      label: 'Anti-Ice',
      options: ['OFF', 'ENGINE', 'ENGINE + WING']
    }
  ]

  const numericKeys = [
    'obstacleHeightFt',
    'distanceFromBrakeReleaseM',
    'oatC',
    'pressureAltitudeFt',
    'windComponentKt'
  ]

  const invalidNumeric = numericKeys.some(
    key =>
      data[key].trim() === '' ||
      !Number.isFinite(Number(data[key]))
  )

  let result = null
  let error = ''

  if (invalidNumeric) {
    error = 'Complete all numeric fields with valid values.'
  } else {
    try {
      result = calculateObstacleLimit({
        flaps: Number(data.flaps),
        obstacleHeightFt: Number(data.obstacleHeightFt),
        distanceFromBrakeReleaseM:
          Number(data.distanceFromBrakeReleaseM),
        oatC: Number(data.oatC),
        pressureAltitudeFt:
          Number(data.pressureAltitudeFt),
        windComponentKt:
          Number(data.windComponentKt),
        packsOff: data.packs === 'OFF',
        engineAntiIce: data.antiIce !== 'OFF',
        wingAntiIce: data.antiIce === 'ENGINE + WING'
      })
    } catch (err) {
      error = err.message
    }
  }

  const formatKg = value =>
    new Intl.NumberFormat('es-AR').format(value)

  const formatSignedKg = value =>
    `${value > 0 ? '+' : ''}${formatKg(value)} kg`

  return (
    <div
      style={{
        marginTop: '24px',
        padding: '22px',
        background: '#142333',
        border: '1px solid #36516b',
        borderRadius: '10px',
        color: '#ffffff'
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        OBSTACLE LIMIT — B737-800W
      </h3>

      <p
        style={{
          color: '#9eafc1',
          fontSize: '13px',
          lineHeight: 1.6
        }}
      >
        Independent obstacle clearance training calculation.
        Enter the obstacle height and distance measured
        from the brake release point.
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
        {fields.map(field => (
          <div key={field.key}>
            <label style={labelStyle}>
              {field.label}
            </label>

            {field.options ? (
              <select
                value={data[field.key]}
                onChange={e =>
                  update(field.key, e.target.value)
                }
                style={inputStyle}
              >
                {field.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={data[field.key]}
                onChange={e =>
                  update(field.key, e.target.value)
                }
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '25px',
          padding: '22px',
          background: '#192b3e',
          border: '1px solid #36516b',
          borderRadius: '10px'
        }}
      >
        <div
          style={{
            color: '#a8bbcd',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '1px'
          }}
        >
          OBSTACLE LIMIT WEIGHT — FLAPS {data.flaps}
        </div>

        <div
          style={{
            fontSize: '34px',
            fontWeight: 800,
            marginTop: '10px',
            color: error ? '#f0ad4e' : '#ffffff'
          }}
        >
          {result
            ? `${formatKg(result.obstacleLimitWeightKg)} kg`
            : '— kg'}
        </div>

        {result && (
          <div
            style={{
              marginTop: '15px',
              fontSize: '13px',
              color: '#b9c9d9',
              lineHeight: 2
            }}
          >
            <div>
              Height / Distance Reference:
              {' '}
              {formatKg(result.referenceWeightKg)} kg
            </div>

            <div>
              OAT Correction:
              {' '}
              {formatSignedKg(result.oatCorrectionKg)}
            </div>

            <div>
              Pressure Altitude Correction:
              {' '}
              {formatSignedKg(result.paCorrectionKg)}
            </div>

            <div>
              Wind Correction:
              {' '}
              {formatSignedKg(result.windCorrectionKg)}
            </div>

            <div>
              Configuration Correction:
              {' '}
              {formatSignedKg(
                result.configurationCorrectionKg
              )}
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              color: '#ffb36b',
              fontSize: '13px',
              marginTop: '14px'
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            marginTop: '17px',
            color: '#8ea3b8',
            fontSize: '12px',
            lineHeight: 1.7
          }}
        >
          TRAINING ONLY — NOT FOR OPERATIONAL USE.
          This is a simulated obstacle-limit model,
          not certified Boeing performance data.
          Obstacle clearance is not guaranteed.
          FLAPS 1 only.
        </div>
      </div>
    </div>
  )
}

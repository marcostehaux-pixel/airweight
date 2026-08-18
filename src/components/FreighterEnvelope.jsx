import React from 'react'

export default function FreighterEnvelope({
  zfw,
  zfwCg,
  zfwIndex,

  tow,
  towCg,
  towIndex,

  lw,
  lwCg,
  lwIndex
}) {

  // Envelope simplificado Freighter
  // X = Índice de momentos
  // Y = Peso (kg)

  const envelope = [
  // Forward limit
  { x: 5.0,  y: 41730 },
  { x: 5.0,  y: 62732 },
  { x: 8.3,  y: 65589 },
  { x: 8.3,  y: 66360 },
  { x: 12.0, y: 78500 },

  // Upper / aft limit
  { x: 16.8, y: 79242 },
  { x: 25.6, y: 79242 },
  { x: 31.0, y: 78471 },
  { x: 36.0, y: 70760 },

  // Aft limit downward
  { x: 36.0, y: 47627 },
  { x: 33.0, y: 41730 },

  // Close envelope
  { x: 5.0, y: 41730 }
]
 const minX = 10
const maxX = 90

const minY = 35000
const maxY = 80000

  const chartWidth = 760
  const chartHeight = 460

  const mapX = (value) =>
    ((value - minX) / (maxX - minX)) * chartWidth

  const mapY = (value) =>
    chartHeight -
    ((value - minY) / (maxY - minY)) * chartHeight
// ==========================================================
// ENVELOPE STATUS
// ==========================================================

const pointToSegmentDistance = (px, py, x1, y1, x2, y2) => {

  const dx = x2 - x1
  const dy = y2 - y1

  if (dx === 0 && dy === 0) {
    return Math.hypot(px - x1, py - y1)
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((px - x1) * dx + (py - y1) * dy) /
      (dx * dx + dy * dy)
    )
  )

  const closestX = x1 + t * dx
  const closestY = y1 + t * dy

  return Math.hypot(
    px - closestX,
    py - closestY
  )
}


const isPointInsideEnvelope = (x, y) => {

  let inside = false

  for (
    let i = 0, j = envelope.length - 1;
    i < envelope.length;
    j = i++
  ) {

    const xi = envelope[i].x
    const yi = envelope[i].y

    const xj = envelope[j].x
    const yj = envelope[j].y

    const intersect =
      yi > y !== yj > y &&
      x <
        ((xj - xi) * (y - yi)) /
        (yj - yi) +
        xi

    if (intersect) {
      inside = !inside
    }

  }

  return inside
}


const getEnvelopeStatus = (index, weight) => {

  if (
    !index ||
    !weight
  ) {
    return 'safe'
  }

  const px = mapX(index)
  const py = mapY(weight)

  const inside =
    isPointInsideEnvelope(
      index,
      weight
    )

  // Si está afuera, siempre ROJO
  if (!inside) {
    return 'outside'
  }

  // Distancia visual al borde del envelope
  let minDistance = Infinity

  for (
    let i = 0;
    i < envelope.length;
    i++
  ) {

    const next =
      (i + 1) %
      envelope.length

    const x1 =
      mapX(envelope[i].x)

    const y1 =
      mapY(envelope[i].y)

    const x2 =
      mapX(envelope[next].x)

    const y2 =
      mapY(envelope[next].y)

    const distance =
      pointToSegmentDistance(
        px,
        py,
        x1,
        y1,
        x2,
        y2
      )

    minDistance =
      Math.min(
        minDistance,
        distance
      )
  }

  // 18 px = zona visual de advertencia
  if (minDistance <= 18) {
    return 'near'
  }

  return 'safe'
}
 const zfwX = mapX(zfwIndex)
const zfwY = mapY(zfw)

const towX = mapX(towIndex)
const towY = mapY(tow)

const lwX = mapX(lwIndex)
const lwY = mapY(lw)
const zfwStatus =
  getEnvelopeStatus(
    zfwCg,
    zfw
  )

const towStatus =
  getEnvelopeStatus(
    towCg,
    tow
  )


const getStatusColor = (status) => {

  if (status === 'outside') {
    return '#ff4444'
  }

  if (status === 'near') {
    return '#ffd43b'
  }

  return '#00ff88'
}
const operationalEnvelope = [
  { index: 29.5, weight: 36200 },
  { index: 28.5, weight: 40000 },
  { index: 28.5, weight: 78000 },

  { index: 48.0, weight: 79000 },
  { index: 74.0, weight: 78200 },
  { index: 82.0, weight: 73500 },

  { index: 47.5, weight: 36200 }
]
const polygonPoints = operationalEnvelope
  .map(
    point =>
      `${mapX(point.index)},${mapY(point.weight)}`
  )
  .join(' ')
const zfwInside = isInsideEnvelope(
  zfwIndex,
  zfw,
  operationalEnvelope
)

const towInside = isInsideEnvelope(
  towIndex,
  tow,
  operationalEnvelope
)

const lwInside = isInsideEnvelope(
  lwIndex,
  lw,
  operationalEnvelope
)

console.log('FREIGHTER ENVELOPE DEBUG', {
  zfw: {
    index: zfwIndex,
    weight: zfw,
    inside: zfwInside
  },

  tow: {
    index: towIndex,
    weight: tow,
    inside: towInside
  },

  lw: {
    index: lwIndex,
    weight: lw,
    inside: lwInside
  }
})
const envelopeAlert =
  !zfwInside ||
  !towInside ||
  !lwInside
  {envelopeAlert && (

  <div
    style={{
      marginBottom: '18px',
      padding: '12px 16px',
      borderRadius: '10px',
      background: 'rgba(255,68,68,0.10)',
      border: '1px solid rgba(255,68,68,0.40)',
      color: '#ff5555',
      fontWeight: '700'
    }}
  >

    CG OUT OF ENVELOPE

  </div>

)}
function isInsideEnvelope(index, weight, polygon) {

  let inside = false

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {

    const xi = polygon[i].index
    const yi = polygon[i].weight

    const xj = polygon[j].index
    const yj = polygon[j].weight

    const intersect =
      ((yi > weight) !== (yj > weight)) &&
      (
        index <
        ((xj - xi) * (weight - yi)) /
        (yj - yi) +
        xi
      )

    if (intersect) {
      inside = !inside
    }
  }

  return inside
}

const zfwColor =
  getStatusColor(zfwStatus)

const towColor =
  getStatusColor(towStatus)
  
  return (
    <div
      style={{
        marginTop: '30px',
        padding: '25px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >

      <h2
        style={{
          margin: '0 0 5px',
          color: '#00ff88'
        }}
      >
        FREIGHTER ENVELOPE
      </h2>

      <p
        style={{
          marginTop: 0,
          color: '#b8c0cc'
        }}
      >
        Weight vs Moment Index
      </p>
{envelopeAlert && (
  <div
    style={{
      margin: '14px 0 18px',
      padding: '12px 14px',
      borderRadius: '10px',
      background: 'rgba(255,68,68,0.10)',
      border: '1px solid rgba(255,68,68,0.45)',
      color: '#ff5555',
      fontWeight: '700',
      fontSize: '13px',
      textAlign: 'center'
    }}
  >
    CG OUT OF ENVELOPE

    {!zfwInside && (
      <div
        style={{
          marginTop: '6px',
          fontSize: '11px'
        }}
      >
        ZFW CG OUT OF LIMITS
      </div>
    )}

    {!towInside && (
      <div
        style={{
          marginTop: '4px',
          fontSize: '11px'
        }}
      >
        TOW CG OUT OF LIMITS
      </div>
    )}

    {!lwInside && (
      <div
        style={{
          marginTop: '4px',
          fontSize: '11px'
        }}
      >
        LW CG OUT OF LIMITS
      </div>
    )}
  </div>
)}
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + 70}`}
        width="100%"
        style={{
          maxWidth: '900px',
          display: 'block',
          margin: 'auto'
        }}
        
      >

        {/* GRID */}

        {[35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000]
          .map(weight => (

            <line
              key={weight}
              x1="0"
              x2={chartWidth}
              y1={mapY(weight)}
              y2={mapY(weight)}
              stroke="rgba(255,255,255,0.10)"
            />

          ))}

        {[20, 30, 40, 50, 60, 70, 80]
          .map(index => (

            <line
              key={index}
              x1={mapX(index)}
              x2={mapX(index)}
              y1="0"
              y2={chartHeight}
              stroke="rgba(255,255,255,0.10)"
            />

          ))}

        {/* ENVELOPE */}

        <polygon
          points={polygonPoints}
          fill="rgba(0,255,136,0.10)"
          stroke="#00ff88"
          strokeWidth="3"
        />

        {/* ZFCG */}

        {zfwCg > 0 && zfw > 0 && (

          <>
            <line
              x1={zfwX}
              x2={zfwX}
              y1={zfwY}
              y2={chartHeight}
              stroke={zfwColor}
              strokeDasharray="6 6"
            />

            <line
              x1="0"
              x2={zfwX}
              y1={zfwY}
              y2={zfwY}
              stroke="#4da3ff"
              strokeDasharray="6 6"
            />

            <circle
              cx={zfwX}
              cy={zfwY}
              r="8"
               fill={
  zfwInside
    ? '#4da3ff'
    : '#ff4444'
}
            />

            <text
              x={zfwX + 12}
              y={zfwY - 10}
              fill={zfwColor}
              fontSize="16"
              fontWeight="700"
            >
              ZFCG
            </text>
          </>

        )}

        {/* TOWCG */}

        {towCg > 0 && tow > 0 && (

          <>
            <line
              x1={towX}
              x2={towX}
              y1={towY}
              y2={chartHeight}
              stroke={towColor}
              strokeDasharray="6 6"
            />

            <line
              x1="0"
              x2={towX}
              y1={towY}
              y2={towY}
              stroke={towColor}
              strokeDasharray="6 6"
            />

            <circle
              cx={towX}
              cy={towY}
              r="8"
              fill={
  towInside
    ? '#ff9d3d'
    : '#ff4444'
}
            />

            <text
              x={towX + 12}
              y={towY - 10}
              fill={towColor}
              fontSize="16"
              fontWeight="700"
            >
              TOWCG
            </text>
          </>

        )}

        {/* X AXIS */}

        <text
          x={chartWidth / 2}
          y={chartHeight + 45}
          textAnchor="middle"
          fill="#b8c0cc"
          fontSize="15"
        >
          MOMENT INDEX
        </text>

        {/* Y AXIS */}

        <text
          x="-25"
          y={chartHeight / 2}
          transform={`rotate(-90 -25 ${chartHeight / 2})`}
          textAnchor="middle"
          fill="#b8c0cc"
          fontSize="15"
        >
          WEIGHT (kg)
        </text>
{envelopeAlert && (
  <div
    style={{
      marginBottom: '18px',
      padding: '12px 16px',
      borderRadius: '10px',
      background: 'rgba(255,68,68,0.10)',
      border: '1px solid rgba(255,68,68,0.40)',
      color: '#ff5555',
      fontWeight: '700',
      textAlign: 'center'
    }}
  >
    CG OUT OF ENVELOPE
  </div>
)}
{!zfwInside && (
  <div style={{ color:'#ff5555' }}>
    ZFW CG FORWARD OUT OF LIMITS
  </div>
)}

{!towInside && (
  <div style={{ color:'#ff5555' }}>
    TOW CG FORWARD OUT OF LIMITS
  </div>
)}

{!lwInside && (
  <div style={{ color:'#ff5555' }}>
    LW CG FORWARD OUT OF LIMITS
  </div>
)}

      </svg>

    </div>
    
  )
}
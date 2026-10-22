import { FIELD_LIMIT_CONFIG } from './fieldLimitData.js'

export function interpolateLinear(x, x1, x2, y1, y2) {
  if (![x, x1, x2, y1, y2].every(Number.isFinite) || x1 === x2) throw new Error('Invalid interpolation data')
  if (x < Math.min(x1, x2) || x > Math.max(x1, x2)) throw new Error('Extrapolation is not permitted')
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)
}

function interpolateAxis(value, entries) {
  if (!Number.isFinite(value)) throw new Error('Invalid input')
  const sorted = [...entries].sort((a, b) => a.x - b.x)
  if (sorted.length === 0 || value < sorted[0].x || value > sorted.at(-1).x) throw new Error('Value outside available table range')
  const exact = sorted.find(e => e.x === value)
  if (exact) return exact.y
  const i = sorted.findIndex(e => e.x > value)
  return interpolateLinear(value, sorted[i-1].x, sorted[i].x, sorted[i-1].y, sorted[i].y)
}

export function interpolateTemperature(weightsKg, oatC) {
  return interpolateAxis(oatC, Object.entries(weightsKg).map(([x, y]) => ({ x: Number(x), y })))
}

// Trilinear interpolation: OAT -> corrected field length -> pressure altitude.
// No wind, slope, packs or anti-ice corrections are applied here.
export function calculateFieldLimitReference({
  correctedFieldLengthM,
  oatC,
  pressureAltitudeFt,
  referencePoints = FIELD_LIMIT_CONFIG.referencePoints
}) {
  const byAltitude = new Map()
  for (const row of referencePoints) {
    if (!byAltitude.has(row.pressureAltitudeFt)) byAltitude.set(row.pressureAltitudeFt, [])
    byAltitude.get(row.pressureAltitudeFt).push({
      x: row.correctedFieldLengthM,
      y: interpolateTemperature(row.weightsKg, oatC)
    })
  }
  return interpolateAxis(pressureAltitudeFt,
    [...byAltitude].map(([x, lengthRows]) => ({ x, y: interpolateAxis(correctedFieldLengthM, lengthRows) }))
  )
}

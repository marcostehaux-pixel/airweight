
import { FIELD_LIMIT_CONFIG } from './fieldLimitData.js'

// Interpolación lineal entre dos valores conocidos.
export function interpolateLinear(x, x1, x2, y1, y2) {
  if (![x, x1, x2, y1, y2].every(Number.isFinite)) {
    throw new Error('Invalid interpolation data')
  }

  if (x1 === x2) {
    throw new Error('Interpolation points must be different')
  }

  if (x < Math.min(x1, x2) || x > Math.max(x1, x2)) {
    throw new Error('Extrapolation is not permitted')
  }

  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)
}

// Obtiene el peso para una temperatura dada,
// dentro de una fila de longitud corregida.
export function interpolateTemperature(weightsKg, oatC) {
  const temperatures = Object.keys(weightsKg)
    .map(Number)
    .sort((a, b) => a - b)

  if (!Number.isFinite(oatC) || temperatures.length < 2) {
    throw new Error('Invalid temperature data')
  }

  if (oatC < temperatures[0] ||
      oatC > temperatures[temperatures.length - 1]) {
    throw new Error('OAT outside available table range')
  }

  if (Object.hasOwn(weightsKg, oatC)) {
    return weightsKg[oatC]
  }

  const upperIndex = temperatures.findIndex(t => t > oatC)
  const t1 = temperatures[upperIndex - 1]
  const t2 = temperatures[upperIndex]

  return interpolateLinear(
    oatC, t1, t2, weightsKg[t1], weightsKg[t2]
  )
}

// Interpola temperatura y longitud corregida.
// Por ahora admite únicamente PA = 0 ft.
export function calculateFieldLimitReference({
  correctedFieldLengthM,
  oatC,
  pressureAltitudeFt
}) {
  if (pressureAltitudeFt !== 0) {
    throw new Error('Only PA 0 ft is currently supported')
  }

  const rows = FIELD_LIMIT_CONFIG.referencePoints
    .filter(row => row.pressureAltitudeFt === 0)
    .sort(
      (a, b) =>
        a.correctedFieldLengthM - b.correctedFieldLengthM
    )

  if (rows.length < 2) {
    throw new Error('Insufficient field limit data')
  }

  if (!Number.isFinite(correctedFieldLengthM)) {
    throw new Error('Invalid corrected field length')
  }

  const exactRow = rows.find(
    row => row.correctedFieldLengthM === correctedFieldLengthM
  )

  if (exactRow) {
    return interpolateTemperature(exactRow.weightsKg, oatC)
  }

  const upperIndex = rows.findIndex(
    row => row.correctedFieldLengthM > correctedFieldLengthM
  )

  if (upperIndex <= 0) {
    throw new Error('Field length outside available table range')
  }

  const lower = rows[upperIndex - 1]
  const upper = rows[upperIndex]

  const lowerWeight = interpolateTemperature(
    lower.weightsKg, oatC
  )

  const upperWeight = interpolateTemperature(
    upper.weightsKg, oatC
  )

  return interpolateLinear(
    correctedFieldLengthM,
    lower.correctedFieldLengthM,
    upper.correctedFieldLengthM,
    lowerWeight,
    upperWeight
  )
}

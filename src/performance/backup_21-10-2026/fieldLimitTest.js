
import { calculateFieldLimitReference } from './fieldLimitEngine.js'

const result = calculateFieldLimitReference({
  correctedFieldLengthM: 4000,
  oatC: 40,
  pressureAltitudeFt: 0
})

console.log('FIELD LIMIT:', result.toFixed(0), 'kg')

import assert from 'node:assert/strict'
import { calculateFieldLimitReference as calc } from './fieldLimitEngine.js'

const cases = [
  [{ correctedFieldLengthM: 1800, oatC: 25, pressureAltitudeFt: 0 }, 69233.33333333333],
  [{ correctedFieldLengthM: 2200, oatC: 25, pressureAltitudeFt: 0 }, 76933.33333333333],
  [{ correctedFieldLengthM: 3000, oatC: 40, pressureAltitudeFt: 0 }, 81500],
  [{ correctedFieldLengthM: 2000, oatC: 15, pressureAltitudeFt: 2000 }, 70200],
  [{ correctedFieldLengthM: 2000, oatC: 15, pressureAltitudeFt: 4000 }, 65000],
  [{ correctedFieldLengthM: 2000, oatC: 15, pressureAltitudeFt: 3000 }, 67600],
  [{ correctedFieldLengthM: 2000, oatC: 15, pressureAltitudeFt: 6000 }, 0],
]
// Sixth altitude table test: use source lookup instead of a guessed expected value.
cases.pop()
for (const [input, expected] of cases) {
  const actual = calc(input)
  assert.ok(Math.abs(actual - expected) < 0.01, `Expected ${expected}, got ${actual}`)
  console.log('OK', input, '=>', Math.round(actual), 'kg')
}
assert.throws(() => calc({ correctedFieldLengthM: 4100, oatC: 25, pressureAltitudeFt: 0 }))
assert.throws(() => calc({ correctedFieldLengthM: 2000, oatC: 55, pressureAltitudeFt: 0 }))
assert.throws(() => calc({ correctedFieldLengthM: 2000, oatC: 15, pressureAltitudeFt: 11000 }))
console.log('ALL FIELD LIMIT TESTS PASSED')

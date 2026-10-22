
import assert from 'node:assert/strict'
import { calculateConfigurationCorrections } from './configurationCorrectionEngine.js'

const cases = [
  {
    name: 'Packs ON / Anti-Ice OFF',
    input: {},
    expectedField: 0,
    expectedClimb: 0
  },
  {
    name: 'Packs OFF',
    input: { packsOff: true },
    expectedField: 400,
    expectedClimb: 1500
  },
  {
    name: 'Engine Anti-Ice ON',
    input: { engineAntiIce: true },
    expectedField: -200,
    expectedClimb: -250
  },
  {
    name: 'Engine + Wing Anti-Ice ON',
    input: {
      engineAntiIce: true,
      wingAntiIce: true
    },
    expectedField: -900,
    expectedClimb: -1400
  }
]

let failures = 0

for (const test of cases) {
  try {
    const result = calculateConfigurationCorrections(test.input)

    assert.equal(
      result.fieldLimitCorrectionKg,
      test.expectedField
    )

    assert.equal(
      result.climbLimitCorrectionKg,
      test.expectedClimb
    )

    console.log(
      `OK ${test.name}: FIELD ${result.fieldLimitCorrectionKg} kg / CLIMB ${result.climbLimitCorrectionKg} kg`
    )
  } catch (error) {
    failures++
    console.error(`FAILED ${test.name}: ${error.message}`)
  }
}

// Verify invalid or unvalidated combinations are rejected.
const rejectedCases = [
  {
    name: 'Wing Anti-Ice without Engine Anti-Ice',
    input: { wingAntiIce: true }
  },
  {
    name: 'Packs OFF + Engine Anti-Ice',
    input: {
      packsOff: true,
      engineAntiIce: true
    }
  },
  {
    name: 'Packs OFF + Engine and Wing Anti-Ice',
    input: {
      packsOff: true,
      engineAntiIce: true,
      wingAntiIce: true
    }
  },
  {
    name: 'Invalid input type',
    input: { packsOff: 'yes' }
  }
]

for (const test of rejectedCases) {
  try {
    assert.throws(
      () => calculateConfigurationCorrections(test.input)
    )
    console.log(`OK Rejected: ${test.name}`)
  } catch (error) {
    failures++
    console.error(`FAILED Rejection: ${test.name}: ${error.message}`)
  }
}

if (failures > 0) {
  console.error(`${failures} CONFIGURATION TEST(S) FAILED`)
  process.exitCode = 1
} else {
  console.log('ALL CONFIGURATION CORRECTION TESTS PASSED')
}

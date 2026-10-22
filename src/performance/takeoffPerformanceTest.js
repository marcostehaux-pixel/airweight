
import assert from 'node:assert/strict'
import { calculateTakeoffFieldLimit } from './takeoffPerformanceEngine.js'

const cases = [
  {
    name: 'Sin correcciones',
    input: {
      toraM: 1800,
      slopePercent: 0,
      windComponentKt: 0,
      oatC: 25,
      pressureAltitudeFt: 0
    },
    expectedLengthM: 1800,
    expectedWeightKg: 69233
  },
  {
    name: 'Viento de frente',
    input: {
      toraM: 2800,
      slopePercent: 0,
      windComponentKt: 20,
      oatC: 40,
      pressureAltitudeFt: 0
    },
    expectedLengthM: 3020,
    expectedWeightKg: 81610
  },
  {
    name: 'Pendiente ascendente',
    input: {
      toraM: 2800,
      slopePercent: 1,
      windComponentKt: 0,
      oatC: 40,
      pressureAltitudeFt: 0
    },
    expectedLengthM: 2590,
    expectedWeightKg: 76958
  },
  {
    name: 'Interpolación de altitud',
    input: {
      toraM: 2000,
      slopePercent: 0,
      windComponentKt: 0,
      oatC: 15,
      pressureAltitudeFt: 3000
    },
    expectedLengthM: 2000,
    expectedWeightKg: 67600
  }
]

let failures = 0

for (const test of cases) {
  try {
    const result = calculateTakeoffFieldLimit(test.input)
if (test.name === 'Pendiente ascendente') {
  console.log('LONGITUD CORREGIDA:', result.correctedFieldLengthM, 'm')
  console.log('FIELD LIMIT CALCULADO:', result.fieldLimitWeightKg, 'kg')
  console.log('FIELD LIMIT ESPERADO:', test.expectedWeightKg, 'kg')
}
    assert.ok(
      Math.abs(result.correctedFieldLengthM - test.expectedLengthM) < 0.01,
      'Incorrect corrected field length'
    )

    assert.ok(
      Math.abs(result.fieldLimitWeightKg - test.expectedWeightKg) <= 1,
      'Incorrect field limit weight'
    )

    console.log(`OK ${test.name}: ${result.fieldLimitWeightKg} kg`)
  } catch (error) {
    failures++
    console.error(`FAILED ${test.name}: ${error.message}`)
  }
}

if (failures > 0) {
  process.exitCode = 1
} else {
  console.log('ALL INTEGRATED TAKEOFF TESTS PASSED')
}

console.log('\n--- CONFIGURATION INTEGRATION TESTS ---')

const configurationCases = [
  {
    name: 'Packs OFF',
    config: { packsOff: true },
    expectedWeightKg: 69633
  },
  {
    name: 'Engine Anti-Ice ON',
    config: { engineAntiIce: true },
    expectedWeightKg: 69033
  },
  {
    name: 'Engine + Wing Anti-Ice ON',
    config: {
      engineAntiIce: true,
      wingAntiIce: true
    },
    expectedWeightKg: 68333
  }
]

const baseInput = {
  toraM: 1800,
  slopePercent: 0,
  windComponentKt: 0,
  oatC: 25,
  pressureAltitudeFt: 0
}

for (const test of configurationCases) {
  try {
    const result = calculateTakeoffFieldLimit({
      ...baseInput,
      ...test.config
    })

    assert.equal(
      result.fieldLimitWeightKg,
      test.expectedWeightKg
    )

    console.log(
      `OK ${test.name}: ${result.fieldLimitWeightKg} kg`
    )
  } catch (error) {
    failures++
    console.error(`FAILED ${test.name}: ${error.message}`)
  }
}

if (failures > 0) {
  process.exitCode = 1
} else {
  console.log('ALL TAKEOFF PERFORMANCE TESTS PASSED')
}

console.log('\n--- CONFIGURATION SAFETY TESTS ---')

const invalidConfigurations = [
  {
    name: 'Wing Anti-Ice without Engine Anti-Ice',
    config: { wingAntiIce: true }
  },
  {
    name: 'Packs OFF + Engine Anti-Ice',
    config: {
      packsOff: true,
      engineAntiIce: true
    }
  },
  {
    name: 'Packs OFF + Engine and Wing Anti-Ice',
    config: {
      packsOff: true,
      engineAntiIce: true,
      wingAntiIce: true
    }
  }
]

for (const test of invalidConfigurations) {
  try {
    assert.throws(
      () => calculateTakeoffFieldLimit({
        ...baseInput,
        ...test.config
      })
    )

    console.log(`OK Rejected: ${test.name}`)
  } catch (error) {
    failures++
    console.error(`FAILED ${test.name}: ${error.message}`)
  }
}

if (failures > 0) {
  process.exitCode = 1
} else {
  console.log('ALL TAKEOFF CONFIGURATION SAFETY TESTS PASSED')
}

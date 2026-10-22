import assert from 'node:assert/strict';
import { calculateDryCorrectedFieldLength as calc } from './runwayCorrectionEngine.js';
const cases = [
  [{toraM:2800,slopePercent:0,windComponentKt:0},2800,2800],
  [{toraM:2800,slopePercent:1,windComponentKt:0},2590,2590],
  [{toraM:2800,slopePercent:0,windComponentKt:20},2800,3020],
  [{toraM:2000,slopePercent:0,windComponentKt:-10},2000,1710],
  [{toraM:2000,slopePercent:0,windComponentKt:10},2000,2090],
  [{toraM:2800,slopePercent:0.5,windComponentKt:0},2690,2690],
];
for (const [input,expectedSlope,expectedFinal] of cases) {
  const actual=calc(input);
  assert.ok(Math.abs(actual.slopeCorrectedM-expectedSlope)<1e-8);
  assert.ok(Math.abs(actual.correctedFieldLengthM-expectedFinal)<1e-8);
  console.log('OK',JSON.stringify(input),'->',actual.correctedFieldLengthM,'m');
}
for (const input of [{toraM:2800,slopePercent:3,windComponentKt:0},{toraM:2800,slopePercent:0,windComponentKt:45},{toraM:1000,slopePercent:0,windComponentKt:0}]) {
  assert.throws(()=>calc(input),RangeError);
}
console.log('ALL RUNWAY CORRECTION TESTS PASSED');

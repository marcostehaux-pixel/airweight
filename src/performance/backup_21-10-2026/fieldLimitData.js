
/*
 * OPERDAT TRAINING
 * Boeing 737-800W — Takeoff Field Limit
 *
  * Reference:
 * FCOM R49 — Performance Dispatch PD.250
 * Boeing 737-800WSFP2
 * CFM56-7B27B1
 * FAA Category L Brakes
 *
 * TRAINING ONLY
 * Generic educational performance model.
 * Not approved for operational use.
 */

export const FIELD_LIMIT_CONFIG = {
  aircraft: 'B737-800W',
  engine: 'CFM56-7B27B1',
  brakeCategory: 'FAA Category L',
  flaps: 5,
  runwayCondition: 'DRY',

  referenceConfiguration: {
    packs: 'ON',
    antiIce: 'OFF',
    windKt: 0,
    runwaySlopePercent: 0
  },

  configurationCorrectionsKg: {
  packsOff: 350,
  engineAntiIce: -250,
  engineAndWingAntiIce: -1000
},

  // FCOM PD.250.2 — FLAPS 5, DRY
  // Partial reference table.
  // Training only — not approved for operational use.
  

referencePoints: [
  {
    pressureAltitudeFt: 0,
    correctedFieldLengthM: 1200,
    weightsKg: {
      '-40': 60700,
      '-13': 58100,
      '-9': 57700,
      '-5': 57300,
      '-1': 57000,
      3: 56600,
      7: 56200,
      11: 55800,
      15: 55400,
      30: 53600,
      50: 46900
    }
  },
  
{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 1400,
  weightsKg: {
    '-40': 66900,
    '-13': 64000,
    '-9': 63600,
    '-5': 63100,
    '-1': 62700,
    3: 62300,
    7: 61900,
    11: 61400,
    15: 61000,
    30: 58900,
    50: 51600
  }
},

  {
    pressureAltitudeFt: 0,
    correctedFieldLengthM: 1600,
    weightsKg: {
      '-40': 72600,
      '-13': 69400,
      '-9': 69000,
      '-5': 68500,
      '-1': 68000,
      3: 67600,
      7: 67100,
      11: 66600,
      15: 66200,
      30: 63900,
      50: 55900
    }
  },
  
{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 1800,
  weightsKg: {
    '-40': 77700,
    '-13': 74300,
    '-9': 73800,
    '-5': 73300,
    '-1': 72800,
    3: 72300,
    7: 71800,
    11: 71400,
    15: 70900,
    30: 68400,
    50: 59800
  }
},

  {
    pressureAltitudeFt: 0,
    correctedFieldLengthM: 2000,
    weightsKg: {
      '-40': 82300,
      '-13': 78700,
      '-9': 78100,
      '-5': 77600,
      '-1': 77100,
      3: 76500,
      7: 76000,
      11: 75500,
      15: 75000,
      30: 72300,
      50: 63200
    }
  },
  
{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 2200,
  weightsKg: {
    '-40': 86100,
    '-13': 82700,
    '-9': 82100,
    '-5': 81500,
    '-1': 81000,
    3: 80400,
    7: 79900,
    11: 79300,
    15: 78800,
    30: 76000,
    50: 66300
  }
},

  {
    pressureAltitudeFt: 0,
    correctedFieldLengthM: 2400,
    weightsKg: {
      '-40': 86100,
      '-13': 86100,
      '-9': 85700,
      '-5': 85200,
      '-1': 84600,
      3: 84000,
      7: 83400,
      11: 82800,
      15: 82200,
      30: 79300,
      50: 69200
    }
  },
  
{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 2600,
  weightsKg: {
    '-40': 86100,
    '-13': 86100,
    '-9': 86100,
    '-5': 86100,
    '-1': 86100,
    3: 86100,
    7: 86100,
    11: 86000,
    15: 85400,
    30: 82400,
    50: 71800
  }
},

  {
    pressureAltitudeFt: 0,
    correctedFieldLengthM: 2800,
    weightsKg: {
      '-40': 86100,
      '-13': 86100,
      '-9': 86100,
      '-5': 86100,
      '-1': 86100,
      3: 86100,
      7: 86100,
      11: 86100,
      15: 86100,
      30: 85300,
      50: 74300
    }
  },
  
{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 3000,
  weightsKg: {
    '-40': 86100,
    '-13': 86100,
    '-9': 86100,
    '-5': 86100,
    '-1': 86100,
    3: 86100,
    7: 86100,
    11: 86100,
    15: 86100,
    30: 86100,
    50: 76900
  }
},

{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 3200,
  weightsKg: {
    '-40': 86100,
    '-13': 86100,
    '-9': 86100,
    '-5': 86100,
    '-1': 86100,
    3: 86100,
    7: 86100,
    11: 86100,
    15: 86100,
    30: 86100,
    50: 79100
  }
},

{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 3400,
  weightsKg: {
    '-40': 86100,
    '-13': 86100,
    '-9': 86100,
    '-5': 86100,
    '-1': 86100,
    3: 86100,
    7: 86100,
    11: 86100,
    15: 86100,
    30: 86100,
    50: 81100
  }
},

{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 3600,
  weightsKg: {
    '-40': 86100,
    '-13': 86100,
    '-9': 86100,
    '-5': 86100,
    '-1': 86100,
    3: 86100,
    7: 86100,
    11: 86100,
    15: 86100,
    30: 86100,
    50: 83100
  }
},

{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 3800,
  weightsKg: {
    '-40': 86100,
    '-13': 86100,
    '-9': 86100,
    '-5': 86100,
    '-1': 86100,
    3: 86100,
    7: 86100,
    11: 86100,
    15: 86100,
    30: 86100,
    50: 85000
  }
},

{
  pressureAltitudeFt: 0,
  correctedFieldLengthM: 4000,
  weightsKg: {
    '-40': 86100,
    '-13': 86100,
    '-9': 86100,
    '-5': 86100,
    '-1': 86100,
    3: 86100,
    7: 86100,
    11: 86100,
    15: 86100,
    30: 86100,
    50: 86100
  }
},

]


}

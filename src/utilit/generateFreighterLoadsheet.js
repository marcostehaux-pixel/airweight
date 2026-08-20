import jsPDF from 'jspdf'

export function generateFreighterLoadsheet(data) {

  const doc = new jsPDF()

  const {

    registration,
cargoFlightFrom,
cargoFlightTo,
cargoFlightNumber,
cargoMetarFrom,
cargoMetarTo,
basicWeight,

    mainCargo,

    lowerCargo,

    totalCargo,

    cargoZfw,

    rampWeight,

    takeoffWeight,

    landingWeight,

    cargoZfwIndex,

    cargoTowIndex,

    cargoLandingIndex,

    cargoZfwCg,

    cargoTowCg,

    cargoLandingCg,

    blockFuel,

    taxiFuel,
    takeoffFuel,
    tripFuel,
basicIndex,

maxZFW,

maxTOW,

maxLW,
    cargoWeights

  } = data


  /* ==========================================================
     HELPERS
  ========================================================== */

  function formatWeight(value) {

    return `${Number(value || 0).toFixed(0)} kg`

  }


  function sectionTitle(title, y) {

    doc.setFont('helvetica', 'bold')

    doc.setFontSize(9)

    doc.text(title, 15, y)

    doc.setDrawColor(180)

    doc.line(15, y + 2, 195, y + 2)

  }


  /* ==========================================================
     HEADER
  ========================================================== */

  doc.setFont('helvetica', 'bold')

  doc.setFontSize(18)

  doc.text(
    'AIRWEIGHT FREIGHTER LOADSHEET',
    15,
    16
  )
const currentDate = new Date()

const formattedDate =
currentDate.toLocaleDateString(
'en-GB',
{
timeZone:'UTC'
}
)

const formattedTime =
currentDate.toLocaleTimeString(
'en-GB',
{
timeZone:'UTC',
hour:'2-digit',
minute:'2-digit'
}
)

doc.setFontSize(8)

doc.text(
`DATE UTC: ${formattedDate}`,
150,
16
)

doc.text(
`TIME UTC: ${formattedTime}Z`,
150,
22
)

  doc.setFont('helvetica', 'normal')

  doc.setFontSize(8)

  doc.text(
    'Electronic Loadsheet System',
    15,
    22
  )
  doc.setFont('helvetica', 'normal')
doc.setFontSize(6)

doc.text(
  `DEP ${cargoFlightFrom || '----'}: ${cargoMetarFrom || '---'}`,
  140,
  28
)

doc.text(
  `ARR ${cargoFlightTo || '----'}: ${cargoMetarTo || '---'}`,
  140,
  33
)
doc.text('FROM',20,38)
doc.text(cargoFlightFrom || '',32,38)

doc.text('TO',45,38)
doc.text(cargoFlightTo || '',55,38)

doc.text('FLIGHT',70,38)
doc.text(cargoFlightNumber || '',85,38)



  /* ==========================================================
     AIRCRAFT INFORMATION
  ========================================================== */

  sectionTitle(
    'AIRCRAFT INFORMATION',
    32
  )


  doc.setFont('helvetica', 'normal')

  doc.setFontSize(8)


  doc.text(
    'REGISTRATION',
    20,
    44
  )


  doc.setFont('helvetica', 'bold')

  doc.text(
    registration,
    20,
    50
  )


  doc.setFont('helvetica', 'normal')

  doc.text(
    'AIRCRAFT TYPE',
    90,
    44
  )


  doc.setFont('helvetica', 'bold')

  doc.text(
    'B737-800CF',
    90,
    50
  )


  /* ==========================================================
     MAIN DECK
  ========================================================== */

  sectionTitle(
    'MAIN DECK DISTRIBUTION',
    60
  )


  const mainPositions = [

    'M1',
    'M2',
    'M3',
    'M4',
    'M5',
    'M6',
    'M7',
    'M8',
    'M9',
    'M10',
    'P12'

  ]


  const mainStartX = 18

  const mainSpacing = 16.2


  doc.setFontSize(7)


  mainPositions.forEach(
    (position, index) => {

      const x =
        mainStartX +
        (index * mainSpacing)


      doc.setFont(
        'helvetica',
        'bold'
      )


      doc.text(
        position,
        x,
        70,
        {
          align: 'center'
        }
      )


      doc.setFont(
        'helvetica',
        'normal'
      )


      doc.text(
        String(
          Number(
            cargoWeights[position] || 0
          ).toFixed(0)
        ),
        x,
        77,
        {
          align: 'center'
        }
      )

    }
  )


  /* ==========================================================
     LOWER DECK
  ========================================================== */

  sectionTitle(
    'LOWER DECK DISTRIBUTION',
    88
  )


  const lowerPositions = [

    'F1',
    'F2',
    'F3',
    'R4',
    'R5',
    'R6'

  ]


  const lowerStartX = 30

  const lowerSpacing = 30


  lowerPositions.forEach(
    (position, index) => {

      const x =
        lowerStartX +
        (index * lowerSpacing)


      doc.setFont(
        'helvetica',
        'bold'
      )


      doc.text(
        position,
        x,
        98,
        {
          align: 'center'
        }
      )


      doc.setFont(
        'helvetica',
        'normal'
      )


      doc.text(
        String(
          Number(
            cargoWeights[position] || 0
          ).toFixed(0)
        ),
        x,
        105,
        {
          align: 'center'
        }
      )

    }
  )


  /* ==========================================================
     CARGO SUMMARY
  ========================================================== */

  sectionTitle(
    'CARGO SUMMARY',
    116
  )


  const summaryData = [

    {
      label: 'MAIN DECK',
      value: mainCargo,
      x: 45
    },

    {
      label: 'LOWER DECK',
      value: lowerCargo,
      x: 105
    },

    {
      label: 'TOTAL CARGO',
      value: totalCargo,
      x: 165
    }

  ]


  summaryData.forEach((item) => {

    doc.setFont(
      'helvetica',
      'normal'
    )

    doc.setFontSize(7)

    doc.text(
      item.label,
      item.x,
      126,
      {
        align: 'center'
      }
    )


    doc.setFont(
      'helvetica',
      'bold'
    )

    doc.setFontSize(9)

    doc.text(
      formatWeight(item.value),
      item.x,
      133,
      {
        align: 'center'
      }
    )

  })


  /* ==========================================================
     BALANCE TABLE
  ========================================================== */

  sectionTitle(
    'BALANCE TABLE',
    145
  )


const balanceData = [

  {
    label: 'BASIC WT',
    value: basicWeight,
    x: 20,
    y: 157
  },

  {
    label: 'BASIC INDEX',
    value: basicIndex,
    x: 75,
    y: 157,
    isIndex: true
  },

  {
    label: 'PAYLOAD',
    value: totalCargo,
    x: 130,
    y: 157
  },

  {
    label: 'ZFW',
    value: cargoZfw,
    max: maxZFW,
    x: 20,
    y: 174
  },

  {
    label: 'RAMP FUEL',
    value: blockFuel,
    x: 75,
    y: 174
  },

  {
    label: 'RAMP WEIGHT',
    value: rampWeight,
    x: 130,
    y: 174
  },


  {
  label: 'TAXI FUEL',
  value: taxiFuel,
  x: 20,
  y: 191
},

{
  label: 'TAKEOFF FUEL',
  value: takeoffFuel,
  x: 75,
  y: 191
},

{
  label: 'TOW',
  value: takeoffWeight,
  max: maxTOW,
  x: 130,
  y: 191
},

{
  label: 'TRIP FUEL',
  value: tripFuel,
  x: 20,
  y: 208
},

{
  label: 'LANDING WT',
  value: landingWeight,
  max: maxLW,
  x: 75,
  y: 208
}

]

 balanceData.forEach((item) => {

  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.setFontSize(7)

  doc.text(
    item.label,
    item.x,
    item.y
  )


  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(9)


  const valueText =
    item.isIndex
      ? Number(item.value || 0).toFixed(2)
      : formatWeight(item.value)


  doc.text(
    valueText,
    item.x,
    item.y + 6
  )


  if (item.max) {

    doc.setFont(
      'helvetica',
      'normal'
    )

    doc.setFontSize(6)


    doc.text(
      `MAX ${formatWeight(item.max)}`,
      item.x + 24,
      item.y + 6
    )

  }

})


  /* ==========================================================
     LOAD CONDITION
  ========================================================== */

  sectionTitle(
    'LOAD CONDITION',
    225
  )


  doc.setFontSize(8)

  doc.setFont(
    'helvetica',
    'bold'
  )


  doc.text(
    'ZFW',
    80,
    224,
    {
      align: 'center'
    }
  )


  doc.text(
    'TOW',
    125,
    224,
    {
      align: 'center'
    }
  )


  doc.text(
    'LW',
    170,
    224,
    {
      align: 'center'
    }
  )


  doc.setFont(
    'helvetica',
    'normal'
  )


  doc.text(
    'INDEX',
    20,
    234
  )


  doc.text(
    cargoZfwIndex.toFixed(2),
    80,
    234,
    {
      align: 'center'
    }
  )


  doc.text(
    cargoTowIndex.toFixed(2),
    125,
    234,
    {
      align: 'center'
    }
  )


  doc.text(
    cargoLandingIndex.toFixed(2),
    170,
    234,
    {
      align: 'center'
    }
  )


  doc.text(
    'CG %MAC',
    20,
    244
  )


  doc.text(
    cargoZfwCg.toFixed(2),
    80,
    244,
    {
      align: 'center'
    }
  )


  doc.text(
    cargoTowCg.toFixed(2),
    125,
    244,
    {
      align: 'center'
    }
  )


  doc.text(
    cargoLandingCg.toFixed(2),
    170,
    244,
    {
      align: 'center'
    }
  )


  /* ==========================================================
     SIGNATURE
  ========================================================== */

  doc.setDrawColor(150)


  doc.line(
    20,
    266,
    85,
    266
  )


  doc.line(
    125,
    266,
    190,
    266
  )


  doc.setFontSize(7)

  doc.setFont(
    'helvetica',
    'normal'
  )


  doc.text(
    'Captain Signature',
    20,
    271
  )


  doc.text(
    'Dispatcher Signature',
    125,
    271
  )


  /* ==========================================================
     FOOTER
  ========================================================== */

  doc.setFontSize(7)

  doc.setTextColor(120)


  doc.text(
    'AIRWEIGHT Dispatch System v1.0', 
    105,
    287,
    {
      align: 'center'
    }
  )
/* ==========================================================
   PAGE 2 - FREIGHTER ENVELOPE
========================================================== */

doc.addPage()

/* HEADER */

doc.setTextColor(0)

doc.setFont('helvetica', 'bold')
doc.setFontSize(16)

doc.text(
  'FREIGHTER WEIGHT & BALANCE ENVELOPE',
  105,
  18,
  { align: 'center' }
)

doc.setFont('helvetica', 'normal')
doc.setFontSize(8)

doc.text(
  `REGISTRATION: ${registration || '----'}`,
  20,
  28
)

doc.text(
  `FLIGHT: ${cargoFlightNumber || '----'}`,
  80,
  28
)

doc.text(
  `${cargoFlightFrom || '----'} - ${cargoFlightTo || '----'}`,
  145,
  28
)


/* ==========================================================
   ENVELOPE CONFIGURATION
========================================================== */

const envelopePdf = [
  { index: 29.5, weight: 36200 },
  { index: 28.5, weight: 40000 },
  { index: 28.5, weight: 78000 },
  { index: 48.0, weight: 79000 },
  { index: 74.0, weight: 78200 },
  { index: 82.0, weight: 73500 },
  { index: 47.5, weight: 36200 }
]

const minIndexPdf = 10
const maxIndexPdf = 90

const minWeightPdf = 35000
const maxWeightPdf = 80000

const chartX = 25
const chartY = 42

const chartWidth = 160
const chartHeight = 145


/* ==========================================================
   MAP FUNCTIONS
========================================================== */

const mapPdfX = (index) =>
  chartX +
  (
    (index - minIndexPdf) /
    (maxIndexPdf - minIndexPdf)
  ) * chartWidth

const mapPdfY = (weight) =>
  chartY +
  chartHeight -
  (
    (weight - minWeightPdf) /
    (maxWeightPdf - minWeightPdf)
  ) * chartHeight


/* ==========================================================
   GRID
========================================================== */

doc.setDrawColor(220)
doc.setLineWidth(0.2)

for (
  let weight = 35000;
  weight <= 80000;
  weight += 5000
) {

  const y = mapPdfY(weight)

  doc.line(
    chartX,
    y,
    chartX + chartWidth,
    y
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6)
  doc.setTextColor(100)

  doc.text(
    String(weight),
    chartX - 3,
    y + 1.5,
    { align: 'right' }
  )
}


for (
  let index = 10;
  index <= 90;
  index += 10
) {

  const x = mapPdfX(index)

  doc.line(
    x,
    chartY,
    x,
    chartY + chartHeight
  )

  doc.setFontSize(6)

  doc.text(
    String(index),
    x,
    chartY + chartHeight + 5,
    { align: 'center' }
  )
}


/* ==========================================================
   ENVELOPE POLYGON
========================================================== */

doc.setDrawColor(30)
doc.setLineWidth(0.8)

for (
  let i = 0;
  i < envelopePdf.length;
  i++
) {

  const current = envelopePdf[i]

  const next =
    envelopePdf[
      (i + 1) %
      envelopePdf.length
    ]

  doc.line(
    mapPdfX(current.index),
    mapPdfY(current.weight),
    mapPdfX(next.index),
    mapPdfY(next.weight)
  )
}


/* ==========================================================
   AXIS TITLES
========================================================== */

doc.setTextColor(70)
doc.setFont('helvetica', 'bold')
doc.setFontSize(7)

doc.text(
  'MOMENT INDEX',
  chartX + chartWidth / 2,
  chartY + chartHeight + 12,
  { align: 'center' }
)

doc.text(
  'WEIGHT (kg)',
  10,
  chartY + chartHeight / 2,
  {
    angle: 90,
    align: 'center'
  }
)


/* ==========================================================
   POINT DRAWING FUNCTION
========================================================== */

function drawEnvelopePoint(
  index,
  weight,
  label
) {

  if (
    !Number.isFinite(Number(index)) ||
    !Number.isFinite(Number(weight))
  ) {
    return
  }

  const x = mapPdfX(Number(index))
  const y = mapPdfY(Number(weight))

  doc.setFillColor(220, 40, 40)

  doc.circle(
    x,
    y,
    2.2,
    'F'
  )

  doc.setTextColor(0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)

  doc.text(
    label,
    x + 3,
    y - 2
  )
}


/* ==========================================================
   ZFW / TOW / LW POINTS
========================================================== */

drawEnvelopePoint(
  cargoZfwIndex,
  cargoZfw,
  'ZFW'
)

drawEnvelopePoint(
  cargoTowIndex,
  takeoffWeight,
  'TOW'
)

drawEnvelopePoint(
  cargoLandingIndex,
  landingWeight,
  'LW'
)


/* ==========================================================
   CONDITION DATA
========================================================== */

const dataY = 218

doc.setTextColor(0)

doc.setFont(
  'helvetica',
  'bold'
)

doc.setFontSize(9)

doc.text(
  'LOAD CONDITION DATA',
  20,
  dataY
)

doc.setDrawColor(150)

doc.line(
  20,
  dataY + 2,
  190,
  dataY + 2
)


/* HEADERS */

doc.setFontSize(7)

doc.text('CONDITION', 25, dataY + 12)
doc.text('WEIGHT', 70, dataY + 12)
doc.text('INDEX', 115, dataY + 12)
doc.text('CG %MAC', 155, dataY + 12)


/* ZFW */

doc.setFont('helvetica', 'normal')

doc.text(
  'ZFW',
  25,
  dataY + 22
)

doc.text(
  formatWeight(cargoZfw),
  70,
  dataY + 22
)

doc.text(
  Number(cargoZfwIndex).toFixed(2),
  115,
  dataY + 22
)

doc.text(
  Number(cargoZfwCg).toFixed(2),
  155,
  dataY + 22
)


/* TOW */

doc.text(
  'TOW',
  25,
  dataY + 32
)

doc.text(
  formatWeight(takeoffWeight),
  70,
  dataY + 32
)

doc.text(
  Number(cargoTowIndex).toFixed(2),
  115,
  dataY + 32
)

doc.text(
  Number(cargoTowCg).toFixed(2),
  155,
  dataY + 32
)


/* LW */

doc.text(
  'LW',
  25,
  dataY + 42
)

doc.text(
  formatWeight(landingWeight),
  70,
  dataY + 42
)

doc.text(
  Number(cargoLandingIndex).toFixed(2),
  115,
  dataY + 42
)

doc.text(
  Number(cargoLandingCg).toFixed(2),
  155,
  dataY + 42
)


/* ==========================================================
   PAGE 2 FOOTER
========================================================== */

doc.setFontSize(7)
doc.setTextColor(120)

doc.text(
  'AIRWEIGHT Dispatch System v1.0',
  105,
  287,
  {
    align: 'center'
  }
)

  /* ==========================================================
     SAVE PDF
  ========================================================== */

  doc.save(
    `AirWeight_Freighter_${registration}.pdf`
  )

}
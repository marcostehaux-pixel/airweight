import jsPDF from 'jspdf'

export function generateFreighterLoadsheet(data) {

  const doc = new jsPDF()

  const {

    registration,
cargoFlightFrom,
cargoFlightTo,
cargoFlightNumber,
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
    label: 'BLOCK FUEL',
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
    label: 'TOW',
    value: takeoffWeight,
    max: maxTOW,
    x: 75,
    y: 191
  },

  {
    label: 'TRIP FUEL',
    value: tripFuel,
    x: 130,
    y: 191
  },


  {
    label: 'LANDING WT',
    value: landingWeight,
    max: maxLW,
    x: 20,
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
     SAVE PDF
  ========================================================== */

  doc.save(
    `AirWeight_Freighter_${registration}.pdf`
  )

}
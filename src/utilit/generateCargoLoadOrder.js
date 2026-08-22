import jsPDF from 'jspdf'

export function generateCargoLoadOrder(data) {

  const doc = new jsPDF()

  const {
    registration,
    cargoFlightFrom,
    cargoFlightTo,
    cargoFlightNumber,
    cargoWeights,
    mainCargo,
    lowerCargo,
    totalCargo
  } = data


  const currentDate = new Date()

  const formattedDate =
    currentDate.toLocaleDateString(
      'en-GB',
      {
        timeZone: 'UTC'
      }
    )

  const formattedTime =
    currentDate.toLocaleTimeString(
      'en-GB',
      {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit'
      }
    )


  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(18)

  doc.text(
    'AIRWEIGHT - CARGO LOAD ORDER',
    105,
    18,
    {
      align: 'center'
    }
  )


  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.setFontSize(8)

  doc.text(
    `DATE UTC: ${formattedDate}`,
    20,
    30
  )

  doc.text(
    `TIME UTC: ${formattedTime}Z`,
    150,
    30
  )


  doc.setFontSize(9)

  doc.text(
    `FLIGHT: ${cargoFlightNumber || '----'}`,
    20,
    42
  )

  doc.text(
    `FROM: ${cargoFlightFrom || '----'}`,
    75,
    42
  )

  doc.text(
    `TO: ${cargoFlightTo || '----'}`,
    120,
    42
  )

  doc.text(
    `REG: ${registration || '----'}`,
    160,
    42
  )


  /* MAIN DECK */

  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(11)

  doc.text(
    'MAIN DECK',
    20,
    58
  )

  doc.line(
    20,
    61,
    190,
    61
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


  const mainStartX = 20
  const mainSpacing = 16


  mainPositions.forEach(
    (position, index) => {

      const x =
        mainStartX +
        index * mainSpacing

      doc.setFont(
        'helvetica',
        'bold'
      )

      doc.setFontSize(8)

      doc.text(
        position,
        x,
        72,
        {
          align: 'center'
        }
      )

      doc.setFont(
        'helvetica',
        'normal'
      )

      doc.text(
        `${Number(
          cargoWeights?.[position] || 0
        ).toFixed(0)} kg`,
        x,
        81,
        {
          align: 'center'
        }
      )
    }
  )


  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.text(
    `MAIN DECK TOTAL: ${Number(
      mainCargo || 0
    ).toFixed(0)} kg`,
    20,
    95
  )


  /* LOWER DECK */

  doc.setFontSize(11)

  doc.text(
    'LOWER DECK',
    20,
    112
  )

  doc.line(
    20,
    115,
    190,
    115
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
        index * lowerSpacing

      doc.setFont(
        'helvetica',
        'bold'
      )

      doc.setFontSize(8)

      doc.text(
        position,
        x,
        128,
        {
          align: 'center'
        }
      )

      doc.setFont(
        'helvetica',
        'normal'
      )

      doc.text(
        `${Number(
          cargoWeights?.[position] || 0
        ).toFixed(0)} kg`,
        x,
        138,
        {
          align: 'center'
        }
      )
    }
  )


  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.text(
    `LOWER DECK TOTAL: ${Number(
      lowerCargo || 0
    ).toFixed(0)} kg`,
    20,
    152
  )


  /* TOTAL */

  doc.setFontSize(12)

  doc.text(
    `TOTAL CARGO: ${Number(
      totalCargo || 0
    ).toFixed(0)} kg`,
    20,
    175
  )


  /* SIGNATURE */

  doc.setDrawColor(140)

  doc.line(
    20,
    225,
    85,
    225
  )

  doc.line(
    125,
    225,
    190,
    225
  )

  doc.setFontSize(7)

  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.text(
    'Load Control / Dispatcher',
    20,
    231
  )

  doc.text(
    'Ramp Supervisor',
    125,
    231
  )


  doc.setTextColor(120)

  doc.text(
    'AIRWEIGHT Dispatch System',
    105,
    287,
    {
      align: 'center'
    }
  )


  doc.save(
    `AirWeight_Load_Order_${cargoFlightNumber || registration}.pdf`
  )
}
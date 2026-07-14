import jsPDF from 'jspdf'

export function generateWeatherPdf(data) {

  const doc = new jsPDF()

  const {

    icao,

    metar,

    taf

  } = data


  /* ==========================================================
     HEADER
  ========================================================== */

  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(18)

  doc.text(
    'AIRWEIGHT WEATHER REPORT',
    15,
    18
  )


  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.setFontSize(8)

  doc.text(
    'Aviation Weather Information',
    15,
    24
  )


  /* ==========================================================
     AIRPORT INFORMATION
  ========================================================== */

  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(9)

  doc.text(
    'AIRPORT INFORMATION',
    15,
    36
  )


  doc.setDrawColor(180)

  doc.line(
    15,
    38,
    195,
    38
  )


  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.setFontSize(8)

  doc.text(
    'ICAO',
    20,
    48
  )


  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(11)

  doc.text(
    icao || 'N/A',
    20,
    55
  )


  /* ==========================================================
     METAR
  ========================================================== */

  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(9)

  doc.text(
    'METAR',
    15,
    70
  )


  doc.line(
    15,
    72,
    195,
    72
  )


  doc.setFont(
    'courier',
    'normal'
  )

  doc.setFontSize(9)


  const metarLines =
    doc.splitTextToSize(
      metar || 'METAR UNAVAILABLE',
      170
    )


  doc.text(
    metarLines,
    20,
    83
  )


  /* ==========================================================
     TAF
  ========================================================== */

  const tafStartY =
    95 +
    (metarLines.length * 5)


  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(9)

  doc.text(
    'TAF',
    15,
    tafStartY
  )


  doc.line(
    15,
    tafStartY + 2,
    195,
    tafStartY + 2
  )


  doc.setFont(
    'courier',
    'normal'
  )

  doc.setFontSize(8)


  const tafLines =
    doc.splitTextToSize(
      taf || 'TAF UNAVAILABLE',
      170
    )


  doc.text(
    tafLines,
    20,
    tafStartY + 13
  )


  /* ==========================================================
     FOOTER
  ========================================================== */

  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.setFontSize(7)

  doc.setTextColor(120)


  doc.text(
    'AIRWEIGHT Aviation Weather Report',
    105,
    287,
    {
      align: 'center'
    }
  )


  /* ==========================================================
     SAVE
  ========================================================== */

  doc.save(
    `AirWeight_Weather_${icao || 'Report'}.pdf`
  )

}
import jsPDF from 'jspdf'

export function generateWeatherPdf(data) {

  const doc = new jsPDF()

  const {

    icao,

    metar,

    taf

  } = data


  /* ==========================================================
     CONFIGURATION
  ========================================================== */

  const marginLeft = 15

  const marginRight = 195

  const textWidth = 175

  const pageBottom = 278


  /* ==========================================================
     HELPERS
  ========================================================== */

  function addHeader() {

    doc.setTextColor(0)

    doc.setFont(
      'helvetica',
      'bold'
    )

    doc.setFontSize(15)

    doc.text(
      'AIRWEIGHT WEATHER REPORT',
      marginLeft,
      16
    )


    doc.setDrawColor(180)

    doc.line(
      marginLeft,
      20,
      marginRight,
      20
    )

  }


  function addFooter() {

    doc.setFont(
      'helvetica',
      'normal'
    )

    doc.setFontSize(6)

    doc.setTextColor(120)

    doc.text(
      'AIRWEIGHT Aviation Weather Report',
      105,
      288,
      {
        align: 'center'
      }
    )

    doc.setTextColor(0)

  }


  function addNewPage() {

    addFooter()

    doc.addPage()

    addHeader()

    return 30

  }


  function checkPageSpace(
    y,
    requiredSpace
  ) {

    if (
      y + requiredSpace >
      pageBottom
    ) {

      return addNewPage()

    }

    return y

  }


  function sectionTitle(
    title,
    y
  ) {

    doc.setFont(
      'helvetica',
      'bold'
    )

    doc.setFontSize(8)

    doc.text(
      title,
      marginLeft,
      y
    )


    doc.setDrawColor(180)

    doc.line(
      marginLeft,
      y + 2,
      marginRight,
      y + 2
    )

  }


  /* ==========================================================
     CLEAN METAR
  ========================================================== */

  function cleanMetarText(text) {

    if (!text) {

      return 'METAR UNAVAILABLE'

    }


    return text

      .split('\n')

      .map(line =>
        line.trim()
      )

      .filter(line => {

        if (!line) {

          return false

        }


        /*
        Elimina líneas que contienen
        solamente un código ICAO
        */

        if (
          /^[A-Z]{4}$/.test(line)
        ) {

          return false

        }


        return true

      })

      .join('\n')

  }


  /* ==========================================================
     CLEAN TAF
  ========================================================== */

  function cleanTafText(text) {

    if (!text) {

      return 'TAF UNAVAILABLE'

    }


    return text

      .split('\n')

      .map(line =>
        line.trim()
      )

      .filter(line => {

        if (!line) {

          return false

        }


        /*
        Elimina líneas que contienen
        solamente ICAO
        */

        if (
          /^[A-Z]{4}$/.test(line)
        ) {

          return false

        }


        /*
        Elimina fecha NOAA:

        2026/07/14 12:33
        */

        if (
          /^\d{4}\/\d{2}\/\d{2}/
          .test(line)
        ) {

          return false

        }


        return true

      })

      .join('\n')

  }


  /* ==========================================================
     HEADER
  ========================================================== */

  addHeader()


  let y = 30


  /* ==========================================================
     AIRPORT INFORMATION
  ========================================================== */

  sectionTitle(
    'AIRPORTS',
    y
  )


  y += 8


  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.setFontSize(8)


  const airportLines =
    doc.splitTextToSize(
      icao || 'N/A',
      textWidth
    )


  doc.text(
    airportLines,
    marginLeft,
    y
  )


  y +=
    airportLines.length * 4


  y += 7


  /* ==========================================================
     METAR
  ========================================================== */

  y = checkPageSpace(
    y,
    20
  )


  sectionTitle(
    'METAR',
    y
  )


  y += 8


  const cleanMetar =
    cleanMetarText(metar)


  doc.setFont(
    'courier',
    'normal'
  )

  doc.setFontSize(7.5)


  const metarLines =
    doc.splitTextToSize(
      cleanMetar,
      textWidth
    )


  metarLines.forEach(
    line => {

      y = checkPageSpace(
        y,
        5
      )


      doc.text(
        line,
        marginLeft,
        y
      )


      y += 4

    }
  )


  y += 7


  /* ==========================================================
     TAF
  ========================================================== */

  y = checkPageSpace(
    y,
    20
  )


  sectionTitle(
    'TAF',
    y
  )


  y += 8


  const cleanTaf =
    cleanTafText(taf)


  doc.setFont(
    'courier',
    'normal'
  )

  doc.setFontSize(7)


  const tafLines =
    doc.splitTextToSize(
      cleanTaf,
      textWidth
    )


  tafLines.forEach(
    line => {

      y = checkPageSpace(
        y,
        5
      )


      doc.text(
        line,
        marginLeft,
        y
      )


      y += 3.8

    }
  )


  /* ==========================================================
     FOOTER
  ========================================================== */

  addFooter()


  /* ==========================================================
     SAVE
  ========================================================== */

  doc.save(
    `AirWeight_Weather_${icao || 'Report'}.pdf`
  )

}
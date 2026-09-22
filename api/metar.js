export default async function handler(req, res) {
  try {
    const icao = (req.query.icao || '')
      .trim()
      .toUpperCase()

    if (icao.length !== 4) {
      return res.status(400).json({
        metar: null
      })
    }

    const response = await fetch(
      `https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icao}.TXT`
    )

    if (!response.ok) {
      return res.status(200).json({
        metar: null
      })
    }

    const text = await response.text()

    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    return res.status(200).json({
      metar: lines[1] || null
    })

  } catch (error) {
    console.error('METAR ERROR:', error)

    return res.status(500).json({
      metar: null
    })
  }
}
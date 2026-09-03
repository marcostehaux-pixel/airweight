import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================
// METAR API
// ============================

app.get('/api/metar', async (req, res) => {
  try {
    const icao = String(req.query.icao || '')
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
})

// ============================
// TAF API
// ============================

app.get('/api/taf', async (req, res) => {
  try {
    const icao = String(req.query.icao || '')
      .trim()
      .toUpperCase()

    if (icao.length !== 4) {
      return res.status(400).json({
        taf: null
      })
    }

    const response = await fetch(
      `https://tgftp.nws.noaa.gov/data/forecasts/taf/stations/${icao}.TXT`
    )

    if (!response.ok) {
      return res.status(200).json({
        taf: null
      })
    }

    const text = await response.text()

    return res.status(200).json({
      taf: text || null
    })
  } catch (error) {
    console.error('TAF ERROR:', error)

    return res.status(500).json({
      taf: null
    })
  }
})

// ============================
// VITE PRODUCTION BUILD
// ============================

app.use(express.static(path.join(__dirname, 'dist')))

// React fallback
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist', 'index.html')
  )
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`OPERDAT running on port ${PORT}`)
})
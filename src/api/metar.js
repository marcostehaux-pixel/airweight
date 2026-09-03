export async function getMetar(icao) {
  try {
    const code = String(icao || '')
      .trim()
      .toUpperCase()

    if (code.length !== 4) {
      return null
    }

    const response = await fetch(
      `/api/metar?icao=${encodeURIComponent(code)}`
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return data.metar || null

  } catch (error) {
    console.error('METAR ERROR:', error)
    return null
  }
}
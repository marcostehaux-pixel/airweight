export default async function handler(req, res) {

try {

const icao =
(req.query.icao || "")
.toUpperCase()

const response =
await fetch(
`https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icao}.TXT`
)

const text =
await response.text()

const lines =
text
.split("\n")
.filter(Boolean)

res.status(200).json({

metar:
lines[1] || null

})

}

catch {

res.status(500).json({

metar:null

})

}

}
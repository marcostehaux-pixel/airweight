export async function getMetar(icao){

try{

const local =
window.location.hostname
=== "localhost"

const url =
local
? `https://corsproxy.io/?https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icao}.TXT`
: `/api/metar?icao=${icao}`

const response =
await fetch(url)

if(!response.ok){

return null

}

if(local){

const text =
await response.text()

const lines =
text
.split("\n")
.filter(Boolean)

return lines[1] || null

}

const data =
await response.json()

return data.metar

}

catch{

return null

}

}
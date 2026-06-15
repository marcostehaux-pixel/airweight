export async function getMetar(icao){

try{

const response =
await fetch(

`https://corsproxy.io/?https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icao}.TXT`

)

if(!response.ok){

return null

}

const text =
await response.text()

const lines =
text
.split("\n")
.filter(Boolean)

return lines[1] || null

}

catch(err){

console.log("METAR ERROR:", err)

return null

}

}
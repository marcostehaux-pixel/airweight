export async function getMetar(icao){

try{

const response =
await fetch(
`/api/metar?icao=${icao}`
)

const data =
await response.json()

return data.metar

}

catch{

return null

}

}
export async function getMetar(icao){

try{

const response =
await fetch(
`/api/metar?icao=${icao}`
)

if(!response.ok){

return null

}

const data =
await response.json()

return data.metar

}

catch(err){

console.log(err)

return null

}

}
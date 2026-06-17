export default async function handler(req,res){

try{

const icao =
(req.query.icao || "")
.toUpperCase()

const response =
await fetch(

`https://tgftp.nws.noaa.gov/data/forecasts/taf/stations/${icao}.TXT`

)

if(!response.ok){

return res
.status(200)
.json({

taf:null

})

}

const text =
await response.text()

console.log(

"TAF RAW:",
text

)

res.status(200).json({

taf:
text

})

}

catch(err){

console.log(

"TAF ERROR",

err

)

res.status(200).json({

taf:null

})

}

}
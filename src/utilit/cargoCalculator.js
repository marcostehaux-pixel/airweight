import {

lowerDeckFactors,

mainDeckIndexes

}

from

'./cargoIndexTables'

export function getLowerIndex(

position,

weight

){

return (

weight

*

(

lowerDeckFactors[

position

]

||

0

)

)

.toFixed(

2

)

}
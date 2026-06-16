import jsPDF from 'jspdf'
import logo from '../assets/logo.png'
 export default function generateLoadsheet({

selectedAircraft,

selectedSeats,

forwardCargo,

aftCargo,

fuel,
tripFuel,
ldw,
zfw,
rw,
tow,
payload,
cg,
zfCg,
trim,
toCg,
cgStatus,
taxiFuel,
extraCrew,

catering,
metarFrom,
metarTo,
effectiveBasicWeight,

effectiveBasicIndex,
forwardSeats,

midSeats,

aftSeats,
flightFrom,
flightTo,

flightNumber,

crewConfiguration

}){

 const doc = new jsPDF()
 
const currentDate = new Date()

const formattedDate =

currentDate.toLocaleDateString(

'en-GB',

{

timeZone:'UTC'

}

)
function drawRow(

label,

value,

y,

highlight=false

){

doc.setFontSize(

10

)

doc.setTextColor(

120

)

doc.text(

label,

20,

y

)

doc.setFontSize(

10

)

if(

highlight

){

doc.setTextColor(

20,

20,

20

)

doc.setFont(

'helvetica',

'bold'

)

}else{

doc.setTextColor(

40

)

doc.setFont(

'helvetica',

'normal'

)

}

doc.text(

value,

95,

y

)

}
const formattedTime =

currentDate.toLocaleTimeString(

'en-GB',

{

timeZone:'UTC',

hour:'2-digit',

minute:'2-digit'

}

)
doc.setTextColor(255, 255, 255)

doc.setFontSize(20)

doc.text('AIRWEIGHT LOADSHEET', 5, 15)
doc.setFontSize(10)
doc.text(
 'Electronic Loadsheet System',
 5,
 27
)
// RESET COLOR

doc.setTextColor(0, 0, 0)

// AIRCRAFT SECTION

doc.setFontSize(14)

doc.text('Aircraft Information', 20, 20)

doc.setLineWidth(0.5)

doc.line(20, 25, 190, 25)

doc.setFontSize(10)

doc.text(
  `Registration: ${selectedAircraft.registration}`,
  20,
  30
)

doc.text(
  `Aircraft Type: ${selectedAircraft.type}`,
  20,
  35
)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'PAX DIST',

110,

30

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

`FWD ${forwardSeats}`,

110,

35

)

doc.text(

`MID ${midSeats}`,

135,

35
)

doc.text(

`AFT ${aftSeats}`,

160,

35

)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'TOTAL PAX',

175,

30

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

`${selectedSeats.length}`,

180,

35

)

doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'CARGO DIST',

110,

40

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

`FWD ${forwardCargo}`,

110,

45

)

doc.text(

`AFT ${aftCargo}`,

140,

45

)

doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'TOTAL',

175,

40

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

`${

forwardCargo +

aftCargo

} KG`,

175,

45

)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'CREW',

70,

30

)

doc.text(

'BUFFET',

80,

30

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

crewConfiguration ||

'-',

73,

35

)

doc.text(

catering

?

'YES'

:

'NO',

82,

35

)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(
'FROM',
20,
50
)

doc.text(
flightFrom ||

'',

20,

55

)

doc.text(
'TO',
35,
50
)

doc.text(
flightTo ||

'',

35,

55

)

doc.text(
'FLIGHT',
20,
40
)

doc.text(
flightNumber ||

'',

22,

45

)

doc.setFontSize(

11)

doc.setTextColor(

30

)

// LOAD DATA

doc.setFontSize(12)

drawRow(

'TOTAL FUEL',

`${fuel || 0} kg`,

90

)

drawRow(

'TRIP FUEL',

`${tripFuel || 0} kg`,

110

)
drawRow(

'LW',

`${

Number(

ldw ||

0

).toFixed(

0

)

} kg  MAX ${

selectedAircraft.maxLW

}`,

115,

true

)
drawRow(

'ARRIVAL FUEL',

`${

(

fuel||0

)-

(

tripFuel||0

)

} kg`,

120

)

doc.setTextColor(0, 0, 0)

doc.setFontSize(8)

doc.text(
  `Date UTC: ${formattedDate}`,
  160,
  15
)

doc.text(
  `Time UTC: ${formattedTime}`,
  160,
  20
)

doc.setTextColor(0, 0, 0)
doc.line(20, 60, 190, 60)
doc.text(

'LOADSHEET DATA',

20,

65

)
drawRow(

'BASIC WT',

`${

effectiveBasicWeight ||

0

} kg`,

70

)
drawRow(

'PAYLOAD',

`${

payload.toFixed(

0

)

} kg`,

80

)
drawRow(

'BASIC INDEX',

effectiveBasicIndex

?

effectiveBasicIndex.toFixed(

1

)

:

'-',

75

)

drawRow(

'ZFW',

`${

zfw.toFixed(

0

)

} kg  MAX ${

selectedAircraft.maxZFW

}`,

85,

true

)
drawRow(

'RW',

`${rw.toFixed(0)} kg`,

95

)
drawRow(

'TAXI FUEL',

`${

Number(

taxiFuel ||

0

)

} kg`,

100

)
drawRow(

'TOW',

`${

tow.toFixed(

0

)

} kg  MAX ${

selectedAircraft.maxTOW

}`,

105,

true

)

drawRow(

'ZFW CG',

`${

Number(

zfCg

).toFixed(

1

)

}%`,

154,

true

)

drawRow(

'TOW CG',

`${

Number(

toCg

).toFixed(

1

)

}%`,

159,

true

)
drawRow(

'TRIM',

`${

Number(

trim

).toFixed(

1

)

} UP`,

164,

true

)
doc.setFontSize(8)


doc.setTextColor(0, 0, 0)
// SIGNATURE

doc.line(120, 245, 190, 245)

doc.setFontSize(8)

doc.text(
  'Captain Signature',
  135,
  248
)
doc.text(
  'DISPATCH RELEASE',
  20,
  235
)

doc.line(20, 245, 90, 245)

doc.text(
  'Dispatcher Signature',
  25,
  248
)
// FOOTER

doc.setFontSize(10)

doc.text(
  'AIRWEIGHT Dispatch System v1.0',
  20,
  290
)
doc.setFontSize(8)

doc.setTextColor(70)

if (
typeof metarFrom !==
'undefined'
) {

doc.text(
'METAR DEP',
20,
262
)

doc.text(
String(
metarFrom || '-'
),
20,
268
)

}

if (
typeof metarTo !==
'undefined'
) {

doc.text(
'METAR ARR',
20,
278
)

doc.text(
String(
metarTo || '-'
),
20,
284
)

}
doc.save('AIRWEIGHT_LOADSHEET.pdf')


}
import jsPDF from 'jspdf'
import logo from '../assets/logo.png'
 export default function generateLoadsheet({

selectedAircraft,

selectedSeats,

forwardCargo,

aftCargo,

fuel,
tripFuel,

zfw,
rw,
tow,

cg,
zfCg,
trim,
toCg,
cgStatus,

extraCrew,

catering,

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

25,

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

doc.text('Aircraft Information', 20, 45)

doc.setLineWidth(0.5)

doc.line(20, 48, 190, 48)

doc.setFontSize(10)

doc.text(
  `Registration: ${selectedAircraft.registration}`,
  20,
  55
)

doc.text(
  `Aircraft Type: ${selectedAircraft.type}`,
  20,
  60
)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'PAX DIST',

120,

55

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

`FWD ${forwardSeats}`,

120,

60

)

doc.text(

`MID ${midSeats}`,

145,

60
)

doc.text(

`AFT ${aftSeats}`,

170,

60

)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'TOTAL PAX',

85,

55

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

`${selectedSeats.length}`,

90,

60

)

doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'CARGO DIST',

120,

85

)

doc.setFontSize(

8

)

doc.setTextColor(

30

)

doc.text(

`FWD ${forwardCargo}`,

120,

90

)

doc.text(

`AFT ${aftCargo}`,

160,

90

)

doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'TOTAL',

120,

100

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

160,

100

)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(

'CREW',

120,

70

)

doc.text(

'CAT',

170,

70

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

120,

75

)

doc.text(

catering

?

'YES'

:

'NO',

170,

75

)
doc.setFontSize(

8

)

doc.setTextColor(

20

)

doc.text(
'FROM',
55,
70
)

doc.text(
flightFrom ||

'',

55,

75

)

doc.text(
'TO',
67,
70
)

doc.text(
flightTo ||

'',

67,

75

)

doc.text(
'FLIGHT',
20,
70
)

doc.text(
flightNumber ||

'',

20,

75

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

127

)

drawRow(

'TRIP FUEL',

`${tripFuel || 0} kg`,

167

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

172

)

doc.setTextColor(0, 0, 0)

doc.setFontSize(8)

doc.text(
  `Date UTC: ${formattedDate}`,
  160,
  35
)

doc.text(
  `Time UTC: ${formattedTime}`,
  160,
  43
)
doc.setTextColor(0, 0, 0)

doc.text(

'LOADSHEET DATA',

20,

90

)
drawRow(

'BASIC WT',

`${

effectiveBasicWeight ||

0

} kg`,

95

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

100

)

110


drawRow(

'ZFW',

`${

zfw.toFixed(

0

)

} / ${

selectedAircraft.maxZFW

} kg`,

111,

true

)
drawRow(

'RW',

`${rw.toFixed(0)} kg`,

135

)
drawRow(

'TOW',

`${

tow.toFixed(

0

)

} / ${

selectedAircraft.maxTOW

} kg`,

151,

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

119,

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

178,

true

)
doc.setFontSize(8)


doc.setTextColor(0, 0, 0)
// SIGNATURE

doc.line(120, 240, 190, 240)

doc.setFontSize(11)

doc.text(
  'Captain Signature',
  135,
  248
)
doc.text(
  'DISPATCH RELEASE',
  20,
  240
)

doc.line(20, 245, 90, 245)

doc.text(
  'Dispatcher Signature',
  25,
  252
)
// FOOTER

doc.setFontSize(10)

doc.text(
  'AIRWEIGHT Dispatch System v1.0',
  20,
  285
)

doc.save('AIRWEIGHT_LOADSHEET.pdf')


}
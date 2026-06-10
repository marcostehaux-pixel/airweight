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
  currentDate.toLocaleDateString()
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
  currentDate.toLocaleTimeString()
// HEADER

doc.setFillColor(15, 15, 15)

doc.rect(0, 0, 210, 30, 'F')
doc.addImage(
  logo,
  'PNG',
  150,
  5,
  40,
  20
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
  65
)
doc.setFontSize(

8

)

doc.setTextColor(

120

)

doc.text(

'PAX DIST',

120,

55

)

doc.setFontSize(

11

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

120

)

doc.text(

'CREW',

120,

65

)

doc.text(

'CAT',

170,

65

)

doc.setFontSize(

11

)

doc.setTextColor(

30

)

doc.text(

crewConfiguration ||

'-',

120,

70

)

doc.text(

catering

?

'YES'

:

'NO',

170,

70

)
doc.setFontSize(

8

)

doc.setTextColor(

120

)

doc.text(
'FROM',
120,
75
)

doc.text(
flightFrom ||

'',

120,

80

)

doc.text(
'TO',
145,
75
)

doc.text(
flightTo ||

'',

145,

80

)

doc.text(
'FLIGHT',
170,
75
)

doc.text(
flightNumber ||

'',

170,

80

)

doc.setFontSize(

11)

doc.setTextColor(

30

)

// LOAD DATA

doc.setFontSize(12)

doc.text('Loadsheet Data', 20, 90)
doc.setFontSize(10)
doc.setFontSize(10)

doc.text('ITEM', 20, 95)

doc.text('VALUE', 90, 95)

drawRow(

'TOTAL FUEL',

`${fuel || 0} kg`,

100

)

drawRow(

'TRIP FUEL',

`${tripFuel || 0} kg`,

105

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

110

)

doc.setTextColor(0, 0, 0)

doc.setFontSize(9)

doc.text(
  `Date: ${formattedDate}`,
  160,
  35
)

doc.text(
  `Time: ${formattedTime}`,
  160,
  43
)
doc.setTextColor(0, 0, 0)
// WEIGHT SUMMARY

doc.setFontSize(12)

doc.text('Weight Summary', 20, 120)





doc.setFontSize(10)
doc.setFontSize(10)

doc.text('ITEM', 25, 125)

doc.text('VALUE', 90, 125)

,

drawRow(

'BASIC WT',

`${

effectiveBasicWeight ||

0

} kg`,

130

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

135

)

150


drawRow(

'ZFW',

`${

zfw.toFixed(

0

)

} / ${

selectedAircraft.maxZFW

} kg`,

140,

true

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

145,

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

150,

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

155,

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

160,

true

)
doc.setFontSize(15)


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
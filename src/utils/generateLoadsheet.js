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

cgStatus,

extraCrew,

catering,

effectiveBasicWeight,

effectiveBasicIndex,
forwardSeats,

midSeats,

aftSeats,

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

'TO',

145,

75

)

doc.text(

'FLIGHT',

170,

75

)

doc.setFontSize(

11)

doc.setTextColor(

30

)

doc.text(

'---',

120,

80

)

doc.text(

'---',

145,

80

)

doc.text(

'---',

170,

80

)
// LOAD DATA

doc.setFontSize(12)

doc.text('Loadsheet Data', 20, 85)
doc.setFontSize(10)
doc.setFontSize(10)

doc.text('ITEM', 20, 95)

doc.text('VALUE', 90, 95)

drawRow(

'TOTAL FUEL',

`${fuel || 0} kg`,

123

)

drawRow(

'TRIP FUEL',

`${tripFuel || 0} kg`,

130

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

137

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

doc.text('Weight Summary', 20, 148)





doc.setFontSize(10)
doc.setFontSize(10)

doc.text('ITEM', 25, 155)

doc.text('VALUE', 90, 155)

,

drawRow(

'BASIC WT',

`${

effectiveBasicWeight ||

0

} kg`,

175

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

186

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

195,

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

205,

true

)

drawRow(
  'CG',
  `${Number(
    cg.toFixed(1)
  )}%`,
  215
)

doc.roundedRect(
  115,
  145,
  70,
  40,
  3,
  3
)

doc.setFontSize(15)

doc.text(
  'LOAD STATUS',
  130,
  150
)

if (cgStatus) {

  doc.setTextColor(0, 140, 0)

} else {

  doc.setTextColor(220, 0, 0)

}

doc.setFontSize(13)

doc.text(
  cgStatus
    ? 'CG WITHIN LIMITS'
    : 'CG OUT OF LIMITS',
  130,
  170
)
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
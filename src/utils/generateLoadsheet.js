import jsPDF from 'jspdf'
import logo from '../assets/logo.png'
export default function generateLoadsheet({
  selectedAircraft,
  selectedSeats,
  forwardCargo,
  aftCargo,
  fuel,
  zfw,
  tow,
  cg,
  cgStatus
}) {

 const doc = new jsPDF()
const currentDate = new Date()

const formattedDate =
  currentDate.toLocaleDateString()
function drawRow(label, value, y) {

  doc.text(label, 25, y)

  doc.text(
    value,
    90,
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

doc.setFontSize(26)

doc.text('AIRWEIGHT LOADSHEET', 5, 15)
doc.setFontSize(12)
doc.text(
 'Electronic Loadsheet System',
 5,
 27
)
// RESET COLOR

doc.setTextColor(0, 0, 0)

// AIRCRAFT SECTION

doc.setFontSize(18)

doc.text('Aircraft Information', 20, 45)

doc.setLineWidth(0.5)

doc.line(20, 48, 190, 48)

doc.setFontSize(13)

doc.text(
  `Registration: ${selectedAircraft.registration}`,
  20,
  60
)

doc.text(
  `Aircraft Type: ${selectedAircraft.type}`,
  20,
  70
)

// LOAD DATA

doc.setFontSize(18)

doc.text('Loadsheet Data', 20, 85)
doc.rect(
  20,
  100,
  100,
  40
)
doc.line(20, 107, 120, 107)

doc.line(20, 113, 120, 113)

doc.line(20, 119, 120, 119)

doc.line(20, 125, 120, 125)
doc.line(20, 131, 120, 131)
doc.line(20, 90, 190, 90)

doc.setFontSize(13)
doc.setFontSize(12)

doc.text('ITEM', 25, 95)

doc.text('VALUE', 90, 95)

doc.line(20, 100, 120, 100)

drawRow(
  'Passengers',
  `${selectedSeats.length}`,
  105
)

drawRow(
  'Forward Cargo',
  `${forwardCargo} kg`,
  112
)

drawRow(
  'Aft Cargo',
  `${aftCargo} kg`,
  117
)

drawRow(
  'Fuel',
  `${fuel} kg`,
  123
)
doc.line(20, 125, 120, 125)
doc.setTextColor(0, 0, 0)

doc.setFontSize(11)

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

doc.setFontSize(18)

doc.text('Weight Summary', 20, 148)
doc.rect(
  20,
  150,
  90,
  40
)

doc.line(20, 156, 110, 156)

doc.line(20, 163, 110, 163)

doc.line(20, 170, 110, 170)

doc.line(75, 150, 75, 190)


doc.setFontSize(14)
doc.setFontSize(12)

doc.text('ITEM', 25, 155)

doc.text('VALUE', 90, 155)

doc.line(20, 178, 110, 178)
drawRow(
  'ZFW',
  `${zfw.toFixed(0)} kg`,
  162
)

drawRow(
  'TOW',
  `${tow.toFixed(0)} kg`,
  169
)

drawRow(
  'CG',
  `${cg}`,
  176
)
doc.line(20, 170, 110, 170)
doc.roundedRect(
  115,
  145,
  70,
  45,
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
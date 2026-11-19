function SeatMap(props) {

  const aircraftModel = String(props.aircraftModel || '').toUpperCase()
  const aircraftVariant = String(props.aircraftVariant || '').toUpperCase()

  const isA320 =
  aircraftModel.includes('A320') ||
  aircraftVariant.includes('A320')

const isB787 =
  aircraftModel.includes('787') ||
  aircraftVariant.includes('787')

const seatCount = isB787
  ? 300
  : isA320
    ? 168
    : 180

  const seats = Array.from(
    { length: seatCount },
    (_, index) => index
  )
const b787SeatRows = isB787
  ? [
      ...Array.from({ length: 8 }, (_, i) => ({
        row: i + 1,
       seats: i < 7
  ? ['A', 'D', 'G', 'K']
  : ['A', 'K'],
        cabin: 'BUSINESS'
      })),
      ...Array.from({ length: 30 }, (_, i) => ({
        row: i + 9,
        seats: ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'J', 'K'],
        cabin: 'ECONOMY'
      }))
    ]
  : []
  
const b787SeatLayout = b787SeatRows.map((row, rowIndex) => {
  const previousSeats = b787SeatRows
    .slice(0, rowIndex)
    .reduce((total, previousRow) => total + previousRow.seats.length, 0)

  return {
    ...row,
    seats: row.seats.map((letter, seatIndex) => ({
      id: previousSeats + seatIndex,
      label: `${row.row}${letter}`
    }))
  }
})

function getSeatZone(seat) {
if (isB787) {
  // Distribución genérica B787-9: 300 pasajeros
  // FWD: 30 | MID: 144 | AFT: 126

  if (seat < 30) return 'FWD'
  if (seat < 174) return 'MID'
  return 'AFT'
}
  if (isA320) {
    const row = Math.floor(seat / 6) + 1

    if (row <= 9) return 'FWD'
    if (row <= 19) return 'MID'
    return 'AFT'
  }

  // B737-800: mantener la distribución existente
  if (seat < 60) return 'FWD'
  if (seat < 130) return 'MID'
  return 'AFT'
}


  return (

    <div
      style={{
        background:
  'linear-gradient(145deg, rgba(8,24,44,0.94), rgba(5,16,31,0.94))',
        position: 'relative',
        padding: '20px',
        borderRadius: '15px',
        marginTop: '40px',
        width: '700px'
      }}
    >

      <h3>Seat Map</h3>
<div

style={{

textAlign:'center',

marginBottom:'20px',

opacity:0.5

}}

>


L1 ◀── ENTRY ──▶ R1

<div
  style={{
    textAlign: 'center',
    fontSize: '12px',
    opacity: 0.45,
    marginBottom: '15px'
  }}
>
  ◼ GALLEY FWD

  <div
    style={{
      textAlign: 'center',
      fontSize: '15px',
      opacity: 0.35,
      marginBottom: '20px'
    }}
  >
    LAV ◻ ◻
  </div>
</div>

</div>

{isB787 ? (
  <div
    style={{
      textAlign: 'center',
      marginBottom: '15px',
      color: 'rgba(255,255,255,0.55)',
      fontSize: '13px',
      letterSpacing: '2px'
    }}
  >
    B787-9 — BUSINESS 1-2-1 / ECONOMY 3-3-3
  </div>
) : (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '150px',
      marginBottom: '12px',
      color: 'rgba(255,255,255,0.35)',
      fontSize: '15px',
      letterSpacing: '6px'
    }}
  >
    <div>ABC</div>
    <div>AISLE</div>
    <div>DEF</div>
  </div>
)}

     
{isB787 ? (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      marginTop: '25px'
    }}
  >
    {b787SeatLayout.map((row) => (
      <div
        key={row.row}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ width: '32px', opacity: 0.5 }}>
          {row.row}
        </span>

        
{row.seats.map((seat, seatIndex) => {
  const occupied = props.selectedSeats.includes(seat.id)
  const zone = getSeatZone(seat.id)

  // Separación visual de pasillos del B787-9
  const aisleMargin =
    row.cabin === 'ECONOMY'
      ? (seatIndex === 3 || seatIndex === 6 ? '28px' : '0px')
      : (row.seats.length === 4
          ? (seatIndex === 1 || seatIndex === 3 ? '28px' : '0px')
          : seatIndex === 1 ? '60px' : '0px')

  return (
    <div
      key={seat.id}
      onClick={() => props.toggleSeat(seat.id)}
      style={{
        width: '42px',
        height: '42px',
        flexShrink: 0,
        marginLeft: aisleMargin,
        borderRadius: '7px',
        backgroundColor: occupied
          ? zone === 'FWD'
            ? '#0099ff'
            : zone === 'MID'
              ? '#00aa66'
              : '#ff8800'
          : '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
            {seat.label}
    </div>
  )
})}

      </div>
    ))}
  </div>
) : (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 78px)',
      justifyContent: 'center',
      gap: '18px',
      marginTop: '25px'
    }}
  >
    {seats.map((seat) => {
      const occupied = props.selectedSeats.includes(seat)

      return (
        <div
          key={seat}
          onClick={() => props.toggleSeat(seat)}
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: occupied
              ? getSeatZone(seat) === 'FWD'
                ? '#0099ff'
                : getSeatZone(seat) === 'MID'
                  ? '#00aa66'
                  : '#ff8800'
              : '#333',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: seat % 6 === 2 ? '30px' : '0px',
            marginBottom: seat === 29 || seat === 30 ? '48px' : '0px'
          }}
        >
          {Math.floor(seat / 6) + 1}
          {['A', 'B', 'C', 'D', 'E', 'F'][seat % 6]}
        </div>
      )
    })}
  </div>
)}

<div

style={{

textAlign:'center',

marginTop:'20px',

opacity:0.5

}}

>
  

{!isB787 && (
  <>
    <div
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '1113px',
        fontSize: '13px',
        opacity: '1',
        letterSpacing: '2px'
      }}
    >
      ← OVERWING EXIT →
    </div>

    <div
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '1178px',
        fontSize: '13px',
        opacity: '1',
        letterSpacing: '2px'
      }}
    >
      ← OVERWING EXIT →
    </div>
  </>
)}

<div

style={{

textAlign:'center',

fontSize:'15px',

opacity:0.45,

marginBottom:'15px',

marginTop:'20px'

}}

>

◼ GALLEY AFT
<div

style={{

textAlign:'center',

fontSize:'12px',

opacity:0.80,

marginBottom:'20px'

}}

>

◻ LAV LAV ◻

</div>
</div>
L2 ◀── AFT ENTRY ──▶ R2

</div>
    </div>

  )
}

export default SeatMap

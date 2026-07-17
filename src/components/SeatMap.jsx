function SeatMap(props) {

  const seats = Array.from(
    { length: 180 },
    (_, index) => index
  )

  function getSeatZone(seat) {

    if (seat < 72) {
      return 'FWD'
    }

    if (seat < 132) {
      return 'MID'
    }

    return 'AFT'

  }

  return (

    <div
      style={{
        backgroundColor: '#1f1f1f',
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

textAlign:'center',

fontSize:'12px',

opacity:0.45,

marginBottom:'15px'

}}

>

◼ GALLEY FWD
<div

style={{

textAlign:'center',

fontSize:'15px',

opacity:0.35,

marginBottom:'20px'

}}

>

LAV ◻ ◻

</div>
</div>
</div>
<div

style={{

display:'flex',

justifyContent:'center',

gap:'150px',

marginBottom:'12px',

color:'rgba(255,255,255,0.35)',

fontSize:'15px',

letterSpacing:'6px'

}}

>

<div>

ABC

</div>

<div>

AISLE

</div>

<div>

DEF

</div>

</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 78px)',
          justifyContent:

'center',
          gap: '18px',
          marginTop: '25px'
        }}
      >

        {seats.map((seat) => {

          const occupied =
            props.selectedSeats.includes(seat)

          return (

            <div
              key={seat}

              onClick={() =>
                props.toggleSeat(seat)
              }

              style={{
                width: '50px',
                height: '50px',
                backgroundColor:

              occupied

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
                marginRight:
                seat % 6 === 2
                
? '30px'

: '0px',
marginBottom:

seat === 23 ||

seat === 35

? 'px'
:

seat === 29 ||

seat === 30

? '48px'

: '0px'

              }}
            >

            {

Math.floor(

seat / 6

)

+

1

}

{

[

'A',

'B',

'C',

'D',

'E',

'F'

]

[

seat % 6

]

}

            </div>

          )

        })}

      </div>
<div

style={{

textAlign:'center',

marginTop:'20px',

opacity:0.5

}}

>
<div

style={{

position:'absolute',

left:'50%',

transform:'translateX(-50%)',

top:'1113px',

fontSize:'13px',

opacity:'1',

letterSpacing:'2px'

}}

>

← OVERWING EXIT →

</div>
<div

style={{

position:'absolute',

left:'50%',

transform:'translateX(-50%)',

top:'1178px',

fontSize:'13px',

opacity:'1',

letterSpacing:'2px'

}}

>

← OVERWING EXIT →

</div>
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

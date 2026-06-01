function SeatMap(props) {

  const seats =
    Array.from({ length: 60 }, (_, index) => index)
    function getSeatZone(seat) {

  if (seat < 10) {
    return 'FWD'
  }

  if (seat < 20) {
    return 'MID'
  }

  return 'AFT'

}

  return (

    <div
      style={{
        backgroundColor: '#1f1f1f',
        padding: '20px',
        borderRadius: '15px',
        marginTop: '40px',
        width: '500px'
      }}
    >

      <h3>Seat Map</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 55px)',
          justifyContent:

'center',
          gap: '25px',
          marginTop: '20px'
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

    </div>

  )
}

export default SeatMap

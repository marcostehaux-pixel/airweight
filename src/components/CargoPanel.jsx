function CargoPanel(props) {

  return (

    <div
      style={{
        backgroundColor: '#1f1f1f',
        padding: '25px',
        borderRadius: '15px',
        marginTop: '40px',
        width: '500px'
      }}
    >

      <h3>Cargo Distribution</h3>

      {/* FWD */}

      <div style={{ marginTop: '25px' }}>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >

          <span>FWD BIN</span>

          <span>{props.forwardCargo} kg</span>

        </div>

        <div
          style={{
            backgroundColor: '#333',
            height: '25px',
            borderRadius: '10px',
            marginTop: '8px',
            overflow: 'hidden'
          }}
        >

          <div
            style={{
              width: `${props.forwardCargo / 20}%`,
              height: '100%',
              backgroundColor: '#0099ff',
              transition: '0.3s'
            }}
          />

        </div>

      </div>

      {/* AFT */}

      <div style={{ marginTop: '30px' }}>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >

          <span>AFT BIN</span>

          <span>{props.aftCargo} kg</span>

        </div>

        <div
          style={{
            backgroundColor: '#333',
            height: '25px',
            borderRadius: '10px',
            marginTop: '8px',
            overflow: 'hidden'
          }}
        >

          <div
            style={{
              width: `${props.aftCargo / 20}%`,
              height: '100%',
              backgroundColor: '#ff8800',
              transition: '0.3s'
            }}
          />

        </div>

      </div>

    </div>

  )
}

export default CargoPanel
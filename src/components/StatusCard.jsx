function StatusCard(props) {

  return (

    <div
      style={{
        backgroundColor: props.status ? '#1f4d2e' : '#7a1f1f',
        padding: '20px',
        borderRadius: '10px',
        width: '220px'
      }}
    >

      <h3>{props.title}</h3>

      <h2>{props.value} kg</h2>

      <p>
        {props.status ? 'OK' : 'OVERLIMIT'}
      </p>

    </div>

  )
}

export default StatusCard
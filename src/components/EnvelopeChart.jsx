function EnvelopeChart(props) {

  const cgX =
    (props.cg - 10) * 25
  const weightY =
    200 - ((props.weight - 40000) / 300)  
    return (

    <div
      style={{
        backgroundColor: '#1f1f1f',
        padding: '25px',
        borderRadius: '15px',
        marginTop: '40px',
        width: '600px'
      }}
    >

      <h3
        style={{
          marginBottom: '20px'
        }}
      >
        CG Envelope
      </h3>

      <svg
        width="500"
        height="250"
        style={{
          backgroundColor: '#2b2b2b',
          borderRadius: '10px'
        }}
      >

        {/* GRID */}

        <line
          x1="50"
          y1="200"
          x2="450"
          y2="200"
          stroke="#666"
        />

        <line
          x1="50"
          y1="30"
          x2="50"
          y2="200"
          stroke="#666"
        />

        {/* SAFE ENVELOPE */}

        <polygon
          points="
            120,180
            320,180
            360,80
            160,80
          "
          fill="#1f4d2e"
          stroke="#00ff88"
          strokeWidth="3"
        />

        {/* CG POINT */}

        <circle
          cx={120 + cgX}
          cy={weightY}
          r="10"
          fill={
            props.status
              ? '#00ff88'
              : '#ff4444'
          }
        />

        {/* LABELS */}

        <text
          x="20"
          y="210"
          fill="white"
          fontSize="12"
        >
          Weight
        </text>

        <text
          x="440"
          y="220"
          fill="white"
          fontSize="12"
        >
          CG
        </text>

      </svg>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '20px'
        }}
      >

        <div>
          Current CG:
          <strong> {props.cg}</strong>
        </div>

        <div>
          Status:
          <strong>
            {props.status ? ' VALID' : ' INVALID'}
          </strong>
        </div>

      </div>

    </div>

  )
}

export default EnvelopeChart
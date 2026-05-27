function EnvelopeChart(props) {

 const cgX =
  (props.cg - 10) * 25

const weightY =
  180 - (
    (props.weight - 40000) / 350
  )

return (

  <div

    style={{

      background:
        'rgba(255,255,255,0.06)',

      backdropFilter:
        'blur(18px)',

      border:
        '1px solid rgba(255,255,255,0.08)',

      boxShadow:
        '0 0 45px rgba(0,0,0,0.25)',

      padding: '25px',

      borderRadius: '22px',

      marginTop: '40px',

      width: '600px'

    }}

  >

    <h3

      style={{

        fontSize: '22px',

        letterSpacing: '1px',

        marginBottom: '20px',

        color: '#f5f5f5'

      }}

    >

      CG Envelope

    </h3>  
      <svg

      width="500"

      height="250"

      style={{

        background:
          'rgba(0,0,0,0.18)',

        borderRadius:
          '18px'

      }}

>
  {/* GRID */}
<text
  x="10"
  y="195"
  fill="#b8c0cc"
  fontSize="11"
>
  40T
</text>

<text
  x="10"
  y="150"
  fill="#b8c0cc"
  fontSize="11"
>
  55T
</text>

<text
  x="10"
  y="100"
  fill="#b8c0cc"
  fontSize="11"
>
  70T
</text>

<text
  x="10"
  y="50"
  fill="#b8c0cc"
  fontSize="11"
>
  85T
</text>
  <line
  x1="50"
  y1="150"
  x2="450"
  y2="150"
  stroke="rgba(255,255,255,0.08)"
/>

<line
  x1="50"
  y1="100"
  x2="450"
  y2="100"
  stroke="rgba(255,255,255,0.08)"
/>

<line
  x1="50"
  y1="50"
  x2="450"
  y2="50"
  stroke="rgba(255,255,255,0.08)"
/>
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

    fill="#163524"

    stroke="#00ff88"

    strokeWidth="3"

    filter=
      "drop-shadow(0 0 10px #00ff88)"

  />

  {/* CG POINT */}

  <circle

    cx={120 + cgX}

    cy={weightY}

    r="12"
style={{

  transition:
    'all 0.5s ease'

}}
    fill={
      props.status
        ? '#00ff88'
        : '#ff4444'
    }

    filter=
      "drop-shadow(0 0 10px currentColor)"

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
    <text
  x="100"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  15
</text>

<text
  x="200"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  20
</text>

<text
  x="300"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  25
</text>

<text
  x="400"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  30
</text>
</text>
</svg>
</div>
  )
}

export default EnvelopeChart
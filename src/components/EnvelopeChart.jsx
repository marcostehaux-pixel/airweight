function EnvelopeChart(props) {

const cgX =

80 +

(

(

props.cg -

627.1

)

/

155.8

)

*

400

const mapWeight =

(weight) =>

200 -

(

(weight - 35000)

/

250

)

const zfwY =

mapWeight(

props.zfw

)

const towY =

mapWeight(

props.weight

)

const ldwY =

mapWeight(

props.ldw

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
{/* %MAC LINES */}

{[15,18,20,22,24,26,28,30].map((value, index) => (

  <line

    key={index}

    x1={80 + index * 60}

    y1={40}

    x2={120 + index * 40}

    y2={320}

    stroke="rgba(255,255,255,0.25)"

    strokeWidth="1"

  />

))}
{/* %MAC LABELS */}

{[15,18,20,22,24,26,28,30].map((value, index) => (

  <text

    key={`label-${index}`}

    x={70 + index * 60}

    y={30}

    fill="rgba(255,255,255,0.75)"

    fontSize="12"

  >

    {value}%

  </text>

))}
{/* MTOW LINE */}

<line

  x1="60"

  y1="120"

  x2="760"

  y2="120"

  stroke="#00c8ff"

  strokeWidth="2"

  strokeDasharray="6 4"

/>

<text

  x="210"

  y="114"

  fill="#00c8ff"

  fontSize="12"

  fontWeight="700"

>

  MTOW

</text>

{/* MLW LINE */}

<line

  x1="60"

  y1="170"

  x2="760"

  y2="170"

  stroke="#00ff88"

  strokeWidth="2"

  strokeDasharray="6 4"

/>

<text

  x="250"

  y="164"

  fill="#00ff88"

  fontSize="12"

  fontWeight="700"

>

  MLW

</text>

{/* MZFW LINE */}

<line

  x1="60"

  y1="210"

  x2="760"

  y2="210"

  stroke="#ffff00"

  strokeWidth="2"

  strokeDasharray="6 4"

/>

<text

  x="320"

  y="204"

  fill="#ffff00"

  fontSize="12"

  fontWeight="700"

>

  MZFW

</text>
 <path

d="

M 140 200

L 100 60

Q 200 60 420 60

Q 490 60 400 180

L 200 200

Q 140 200 140 200

Z


"

  fill="transparent"

  stroke="#00ff88"

  strokeWidth="2"

  style={{

    filter:
      'drop-shadow(0 0 8px rgba(0,255,140,0.25))'

  }}

/>
<circle

   cx={cgX}

    cy={towY}

    r="6"
    stroke="white"

strokeWidth="2"
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
  <text

  x={cgX + 12}

  y={towY + 4}

  fill="#00ff88"

  fontSize="11"

  fontWeight="700"

>

  TOW

</text>
  <circle

  cx={cgX}

  cy={zfwY}

  r="6"

  fill="#00c8ff"

  style={{

    transition:
      'all 0.5s ease'

  }}

/>
<text

  x={cgX + 12}

  y={ldwY + 4}

  fill="#ff9900"

  fontSize="11"

  fontWeight="700"

>

  LDW

</text>
<circle

  cx={cgX}

  cy={ldwY}

  r="6"

  fill="#ff9900"

  style={{

    transition:
      'all 0.5s ease'

  }}

/>
<text

  x={cgX + 12}

  y={zfwY + 4}

  fill="#00c8ff"

  fontSize="11"

  fontWeight="700"

>

  ZFW

</text>
  {/* CG POINT */}

  

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
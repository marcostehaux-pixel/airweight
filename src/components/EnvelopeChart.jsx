function EnvelopeChart(props) {

const cgX =

80 +

(

(

props.cg -

15

)

/

17

)

*

320


const zfwX =

props.zfCg

?

80 +

(

(

props.zfCg -

15

)

/

17

)

*

320

:

cgX


const towX =

props.toCg

?

80 +

(

(

props.toCg -

15

)

/

17

)

*

320

:

cgX


const ldwX =

props.lwCg

?

80 +

(

(

props.lwCg -

15

)

/

17

)

*

320

:

cgX
const mapWeight = (

weight

)=>{

const minWeight = 40000

const maxWeight = 85000

const top = 40

const bottom = 200


return (

bottom -

(

(

weight -

minWeight

)

/

(

maxWeight -

minWeight

)

)

*

(

bottom -

top

)

)

}

const zfwY =

mapWeight(

props.zfw

)

const towY =

mapWeight(

props.tow

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

{

[

40000,

45000,

50000,

55000,

60000,

65000,

70000,

75000,

80000,

85000

]

.map(

(

weight

)=>(

<g key={weight}>

<line

x1="50"

y1={mapWeight(weight)}

x2="450"

y2={mapWeight(weight)}

stroke="rgba(255,255,255,0.08)"

/>

<text

x="8"

y={mapWeight(weight)+4}

fill="#b8c0cc"

fontSize="10"

>

{weight}

</text>

</g>

)

)

}

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
{/* MTOW */}

<line

x1="150"

y1={mapWeight(props.mtow || 79015)}

x2="350"

y2={mapWeight(props.mtow || 79015)}

stroke="#00c8ff"

strokeWidth="2"

/>

<text

x="370"

y={mapWeight(props.mtow || 79015)+4}

fill="#00c8ff"

fontSize="11"

>

MTOW

</text>


{/* MLW */}

<line

x1="150"

y1={mapWeight(props.mlw || 65317)}

x2="380"

y2={mapWeight(props.mlw || 65317)}

stroke="#00ff88"

strokeWidth="2"

/>

<text

x="395"

y={mapWeight(props.mlw || 65317)+4}

fill="#00ff88"

fontSize="11"

>

MLW

</text>


{/* MZFW */}

<line

x1="150"

y1={mapWeight(props.mzfw || 61688)}

x2="380"

y2={mapWeight(props.mzfw || 61688)}

stroke="#ffff00"

strokeWidth="2"

/>

<text

x="390"

y={mapWeight(props.mzfw || 61688)+4}

fill="#ffff00"

fontSize="11"

>

MZFW

</text>

<polygon

points="

140,200

150,55

340,55

390,85

370,150

210,200

"

fill="transparent"

stroke="#00ff88"

strokeWidth="2"

style={{

filter:

'drop-shadow(0 0 6px rgba(0,255,140,.25))'

}}

/>

<circle

cx={towX}

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

?

'#00ff88'

:

'#ff4444'

}

filter=

"drop-shadow(0 0 10px currentColor)"

/>
  <text

  x={towX + 12}

  y={towY + 4}

  fill="#00ff88"

  fontSize="11"

  fontWeight="700"

>

  TOW

</text>
  <circle

  cx={zfwX}

  cy={zfwY}

  r="6"

  fill="#00c8ff"

  style={{

    transition:
      'all 0.5s ease'

  }}

/>
<text

  x={ldwX + 12}

  y={ldwY + 4}

  fill="#ff9900"

  fontSize="11"

  fontWeight="700"

>

  LDW

</text>
<circle

  cx={ldwX}

  cy={ldwY}

  r="6"

  fill="#ff9900"

  style={{

    transition:
      'all 0.5s ease'

  }}

/>
<text

  x={zfwX + 12}

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
    INDEX
    <text
  x="100"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  35
</text>

<text
  x="200"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  45
</text>

<text
  x="300"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  55
</text>

<text
  x="400"
  y="225"
  fill="#b8c0cc"
  fontSize="11"
>
  65
</text>
</text>
</svg>
</div>
  )
}

export default EnvelopeChart
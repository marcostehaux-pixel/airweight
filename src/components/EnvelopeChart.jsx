function EnvelopeChart(props) {

const mapIndex=(index)=>{

const min=35

const max=90

const left=110

const right=620


return (

left+

(

(

index-

min

)

/

(

max-

min

)

)

*

(

right-

left

)

)

}

const mapWeight=(weight)=>{

const minWeight=40000

const maxWeight=85000

const top=60

const bottom=310


return (

bottom-

(

(

Number(

weight

)-

minWeight

)

/

(

maxWeight-

minWeight

)

)

*

(

bottom-

top

)

)

}

const zfwX=

mapIndex(

props.zfi||

50

)


const towX=

mapIndex(

props.toi||

50

)


const ldwX = towX

const weightToY=(weight)=>{

const min=33000

const max=85000

const y40000 = mapWeight(40000)

const y85000 = mapWeight(85000)


return (

y40000-

(

(

Number(

weight

)-

min

)

/

(

max-

min

)

)

*

(

y40000-y85000

)

)

}
const zfwY = weightToY(

props.zfw || 42675

)

const towY = weightToY(

props.tow || 42675

)

const ldwY = towY
const cgLines = [
18,19,20,21,22,23,24,
25,26,27,28,29,30,
31,32
]

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

      width="740"

      height="340"

      style={{

        background:
          'rgba(0,0,0,0.18)',

        borderRadius:
          '18px',
overflow:'visible'
      }}
      >
<g transform="translate(10,0)">


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

x2="930"

y2={mapWeight(weight)}

stroke="rgba(255,255,255,0.08)"

/>
{/* INDEX SCALE */}

{

[35,40,45,50,55,60,65,70,75,80,85,90]

.map(

(

idx,

i

)=>(

<g key={idx}>

<line

x1={

90 +

(

i * 60

)

}

y1="310"

x2={

90 +

(

i * 60

)

}

y2="320"

stroke="#7b8794"

/>

<text

x={

84 +

(

i * 60

)

}

y="335"

fill="#b8c0cc"

fontSize="10"

>

{idx}

</text>

</g>

)

)

}
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

y1={mapWeight(40000)}

x2="930"

y2={mapWeight(40000)}

stroke="#666"

/>

  <line
    x1="50"
    y1="30"
    x2="50"
    y2="310"
    stroke="#666"
  />

  {/* SAFE ENVELOPE */}
  
{/* %MAC LINES */}

{[18,19,20,21,22,23,24,25,26,27,28,29,30,31,32].map((value, index) => (

  <line

    key={index}

    x1={90 + index * 58}

    y1={40}

    x2={170 + index * 30}
    y2={320}

    stroke="rgba(255,255,255,0.25)"

    strokeWidth="1"

  />

))}
{/* %MAC LABELS */}

{[18,19,20,21,22,23,24,25,26,27,28,29,30,31,32].map((value, index) => (

  <text

    key={`label-${index}`}

    x={70 + index * 60}

    y={20}

    fill="rgba(255,255,255,0.75)"

    fontSize="12"

  >

    {value}%

  </text>

))}
{/* MTOW */}

<line

x1="120"

y1={mapWeight(props.mtow || 79015)}

x2="770"

y2={mapWeight(props.mtow || 79015)}

stroke="#00c8ff"

strokeWidth="2"

/>

<text

x="360"

y={mapWeight(props.mtow || 79015)+12}

fill="#00c8ff"

fontSize="11"

>

MTOW

</text>


{/* MLW */}

<line

x1="155"

y1={mapWeight(props.mlw || 65317)}

x2="580"

y2={mapWeight(props.mlw || 65317)}

stroke="#00ff88"

strokeWidth="2"

/>

<text

x="395"

y={mapWeight(props.mlw || 65317)+11}

fill="#00ff88"

fontSize="11"

>

MLW

</text>


{/* MZFW */}

<line

x1="165"

y1={mapWeight(props.mzfw || 61688)}

x2="535"

y2={mapWeight(props.mzfw || 61688)}

stroke="#ffff00"

strokeWidth="2"

/>

<text

x="390"

y={mapWeight(props.mzfw || 61688)+11}

fill="#ffff00"

fontSize="11"

>

MZFW

</text>

<polygon

points="

100,50
150,160
210,310
230,310
830,70
400,50
395,50

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

r={

props.status

?

6

:

10

}

stroke="white"

strokeWidth="2"

style={{

transition:

'all .4s ease',

transform:

props.status

?

'scale(1)'

:

'scale(1.15)'

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

  x={towX + 10}

  y={towY - 10}

  fill="#00ff88"

  fontSize="11"

  fontWeight="700"

>

  TOW

</text>
  <circle

  cx={zfwX}

  cy={zfwY}

  r={

props.status

?

6

:

10

}

  fill="#00c8ff"

  style={{

transition:

'all .4s ease',

transform:

props.status

?

'scale(1)'

:

'scale(1.15)'

}}

/>
<text

  x={ldwX + 10}

  y={ldwY + 10}

  fill="#ff9900"

  fontSize="11"

  fontWeight="700"

>

  LDW

</text>
<circle

  cx={ldwX}

  cy={ldwY}

  r={

props.status

?

6

:

10

}

  fill="#ff9900"

 style={{

transition:

'all .4s ease',

transform:

props.status

?

'scale(1)'

:

'scale(1.15)'

}}

/>
<text

  x={zfwX + 10}

  y={zfwY - 2}

  fill="#00c8ff"

  fontSize="11"

  fontWeight="700"

>

  ZFW

</text>
  {/* CG POINT */}

  

  {/* LABELS */}

  <text
    x="10"
    y="25"
    fill="white"
    fontSize="13"
  >
    Weight
  </text>

  <text
    x="260"
    y="350"
    fill="white"
    fontSize="15"
  >
    INDEX
    <text
  x="120"
  y="240"
  fill="#b8c0cc"
  fontSize="11"
>
  35
</text>

<text
  x="200"
  y="240"
  fill="#b8c0cc"
  fontSize="11"
>
  45
</text>

<text
  x="300"
  y="240"
  fill="#b8c0cc"
  fontSize="11"
>
  55
</text>

<text
  x="400"
  y="240"
  fill="#b8c0cc"
  fontSize="11"
>
  65
</text>
</text>
</g>

</svg>

</div>

)

}

export default EnvelopeChart
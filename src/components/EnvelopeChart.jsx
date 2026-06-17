function EnvelopeChart(props) {

const mapIndex=(index)=>{

const min=35

const max=90

const left=140

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

const envelope = [
  [60, 50],
  [130, 160],
  [210, 310],
  [230, 310],
  [750, 70],
  [400, 50],
  [395, 50],
]
const zfwEnvelope = [

[140,170],

[140,180],

[215,310],

[320,310],

[600,170],

[530,170]

]
const isInsidePolygon = (x, y, polygon) => {
  let inside = false

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const xi = polygon[i][0]
    const yi = polygon[i][1]

    const xj = polygon[j][0]
    const yj = polygon[j][1]

    const intersect =
      (yi > y) !== (yj > y) &&
      x <
        ((xj - xi) * (y - yi)) /
          (yj - yi) +
          xi

    if (intersect)
      inside = !inside
  }

  return inside
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

const min=42675

const max=85000

const y40000 = mapWeight(42675)

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
const zfwY =
mapWeight(
props.zfw || 42675
)

const towY = weightToY(

props.tow || 42675

)
const zfwInside =
  isInsidePolygon(
    zfwX - 15,
    zfwY,
    zfwEnvelope
  )

const towInside =
  isInsidePolygon(
    towX,
    towY,
    envelope
  )
  console.log(
'ENVELOPE',
{
zfwInside,
towInside
}
)
  if (
props.onEnvelopeChange
) {

props.onEnvelopeChange({

zfwInside,

towInside

})

}
const cgStatus =

props.zfStatus &&

props.toStatus
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

      padding: '45px',

      borderRadius: '20px',

      marginTop: '30px',

      width: '920px'

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

      width="950"

      height="380"

      style={{

        background:
          'rgba(0,0,0,0.18)',

        borderRadius:
          '18px',
overflow:'visible'
      }}
      >
<g transform="translate(-5)">


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

    x1={60 + index * 50}

    y1={40}

    x2={170 + index * 30}
    y2={310}

    stroke="rgba(255,255,255,0.25)"

    strokeWidth="1"

  />

))}
{/* %MAC LABELS */}

{[18,19,20,21,22,23,24,25,26,27,28,29,30,31,32].map((value, index) => (

  <text

    key={`label-${index}`}

    x={50 + index * 50}

    y={25}

    fill="rgba(255,255,255,0.75)"

    fontSize="13"

  >

    {value}%

  </text>

))}

{/* MTOW */}
{false && (

<>

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

y={mapWeight(props.mtow || 79015)+14}

fill="#00c8ff"

fontSize="11"

>

MTOW

</text>

</>

)}

{/* MLW */}
{false && (

<>
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

y={mapWeight(props.mlw || 65317)+14}

fill="#00ff88"

fontSize="11"

>

MLW

</text>
</>
)}

{/* MZFW */}
{false && (

<>
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

y={mapWeight(props.mzfw || 61688)+14}

fill="#ffff00"

fontSize="11"

>

MZFW

</text>
</>
)}
<polygon
  points={
    envelope
      .map(
        p =>
          `${p[0]},${p[1]}`
      )
      .join(' ')
  }
  fill="transparent"
  stroke="#00ff88"
  strokeWidth="2"
/>
<polygon

points={
zfwEnvelope
.map(
p =>
`${p[0]},${p[1]}`
)
.join(' ')
}

fill="transparent"

stroke="#0099ff"

strokeWidth="2"

strokeDasharray="6 4"

/>
<circle

cx={towX}

cy={towY}

r={

props.toStatus

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

props.toStatus

?

'scale(1)'

:

'scale(1.15)'

}}

fill={
towInside
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

y={towY + 25}

fill="#ffffff"

fontSize="15"

>
{
!towInside && (

<text

x="640"

y="35"

fill="#daa555"

fontSize="15"

fontWeight="600"

>

⚠ CG envelope exceeded

</text>

)
}
{
!towInside && (

<g>

<rect

x="620"

y="15"

width="180"

height="28"

rx="10"

fill="rgba(255,120,0,.18)"

stroke="#ff9900"

/>

<text

x="635"

y="33"

fill="#ffcc66"

fontSize="15"

fontWeight="700"

>

CG OUT OF ENVELOPE

</text>

</g>

)
}
</text>
  <text

  x={towX + 10}

  y={towY - 10}

  fill="#00ff88"

  fontSize="11"

  fontWeight="700"

>

  TOW

</text>
{
!zfwInside && (

<text

x="620"

y="40"

fill="#00c8ff"

fontSize="12"

fontWeight="700"

>

⚠ ZFW CG OUT

</text>

)
}

{
!towInside && (

<text

x="620"

y="58"

fill="#ff9900"

fontSize="12"

fontWeight="700"

>

⚠ TOW CG OUT

</text>

)
}
  {

props.tow !== props.zfw && (

<circle

cx={zfwX}

cy={zfwY}

r="6"

fill={

zfwInside

?

'#00c8ff'

:

'#ff4444'

}

style={{

transition:
'fill .25s ease'

}}

>
</circle>

)

}

{/*
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
*/}
<text

  x={zfwX + 12}

  y={zfwY - 1}

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
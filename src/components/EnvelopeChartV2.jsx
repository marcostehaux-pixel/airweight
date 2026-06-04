function EnvelopeChartV2(props){

const mapIndex=(index)=>{

return (

50 +

(

(

index-35

)

/55

)

*

400

)

}


const mapWeight=(weight)=>{

return (

220 -

(

(

weight-40000

)

/45000

)

*

180

)

}


const zfwX=

mapIndex(

props.zfi||35

)

const towX=

mapIndex(

props.toi||35

)

const ldwX=

mapIndex(

props.li||35

)


const zfwY=

mapWeight(

props.zfw

)

const towY=

mapWeight(

props.tow

)

const ldwY=

mapWeight(

props.ldw

)


return(

<div

style={{

padding:'20px'

}}

>

<h3>

CG Envelope

</h3>

<svg

width="520"

height="260"

>

{/* AXIS */}

<line
x1="50"
y1="220"
x2="470"
y2="220"
stroke="#666"
/>

<line
x1="50"
y1="20"
x2="50"
y2="220"
stroke="#666"
/>


{/* INDEX */}

{

[35,40,45,50,55,60,65,70,75,80,85,90]

.map(

v=>

<text

key={v}

x={mapIndex(v)-8}

y="240"

fill="white"

>

{v}

</text>

)

}


{/* WEIGHT */}

{

[40000,50000,60000,70000,80000,85000]

.map(

v=>

<text

key={v}

x="5"

y={

mapWeight(v)

}

fill="white"

>

{v}

</text>

)

}


{/* CG LINES */}

{

[18,20,22,24,26,28,30,32]

.map(

(

cg,

i

)=>

<line

key={cg}

x1={

80+i*50

}

y1="20"

x2={

150+i*30

}

y2="220"

stroke="rgba(255,255,255,.25)"

/>

)

}


{/* ENVELOPE */}

<polygon

points="

90,40

420,40

450,80

360,140

180,220

130,220

"

fill="transparent"

stroke="#00ff88"

strokeWidth="2"

/>


{/* POINTS */}

<circle
cx={zfwX}
cy={zfwY}
r="6"
fill="#00c8ff"
/>

<circle
cx={towX}
cy={towY}
r="6"
fill="#00ff88"
/>

<circle
cx={ldwX}
cy={ldwY}
r="6"
fill="#ff9900"
/>


<text
x={zfwX+10}
y={zfwY}
fill="#00c8ff"
>
ZFW
</text>

<text
x={towX+10}
y={towY}
fill="#00ff88"
>
TOW
</text>

<text
x={ldwX+10}
y={ldwY}
fill="#ff9900"
>
LW
</text>

</svg>

</div>

)

}

export default EnvelopeChartV2
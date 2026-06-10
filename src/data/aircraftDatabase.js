const aircraftDatabase = [

{
registration:'LV-KGN',

type:'B737-800',

datum:0,

mac:155.8,

lemac:627.1,

basicWeight:42675,

basicIndex:50,
basicConfig:'2/4',
basicCrew:'STD CREW',
maxZFW:61688,
maxTOW:79015,
maxRW:79300,
maxLW:65317,
envelope: {

zf:{

indexMin:42,

indexMax:58,

cgMin:18,

cgMax:32

},

tow:{

indexMin:12,

indexMax:92,

cgMin:19,

cgMax:31

},

lw:{

indexMin:11,

indexMax:91,

cgMin:18,

cgMax:31

}

},
seatArmFwd:360,
seatArmMid:620,
seatArmAft:930,

fuelArm:650,

forwardCargoArm:320,
aftCargoArm:900

},

{

registration:'LV-FQZ',

type:'B737-700',

datum:0,

mac:155.8,

lemac:627.1,

basicWeight:38500,

basicIndex:46,

basicConfig:'2/4',
basicCrew:'STD CREW',

maxZFW:56000,
maxTOW:70000,
maxRW:70300,
maxLW:59000,
envelope: {

zf:{

indexMin:10,

indexMax:90,

cgMin:18,

cgMax:32

},

tow:{

indexMin:12,

indexMax:92,

cgMin:19,

cgMax:31

},

lw:{

indexMin:11,

indexMax:91,

cgMin:18,

cgMax:31

}

},
seatArmFwd:360,
seatArmMid:620,
seatArmAft:930,

fuelArm:650,

forwardCargoArm:320,
aftCargoArm:900

},

{

registration:'LV-GOO',

type:'A320',

datum:0,

mac:134.5,

lemac:625,

basicWeight:42000,

basicIndex:52,
basicConfig:'2/4',
basicCrew:'STD CREW',
maxZFW:62500,
maxTOW:77000,
maxRW:77300,
maxLW:66000,
envelope: {

zf:{

indexMin:10,

indexMax:90,

cgMin:18,

cgMax:32

},

tow:{

indexMin:12,

indexMax:92,

cgMin:19,

cgMax:31

},

lw:{

indexMin:11,

indexMax:91,

cgMin:18,

cgMax:31

}

},
seatArmFwd:380,
seatArmMid:640,
seatArmAft:910,

fuelArm:660,

forwardCargoArm:350,
aftCargoArm:920

}

]

export default aircraftDatabase
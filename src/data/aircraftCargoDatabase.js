const aircraftCargoDatabase = [
    {
registration:'LV-NGR',

type:'B737-800CF',

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

envelope:{

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

aftCargoArm:900,

cargoConfig:{

mainDeck:[

{id:'M1',max:6804,arm:420},
{id:'M2',max:6804,arm:500},
{id:'M3',max:6804,arm:580},
{id:'M4',max:6804,arm:660},
{id:'M5',max:6804,arm:740},

{id:'M6',max:6804,arm:820},
{id:'M7',max:6804,arm:900},
{id:'M8',max:6804,arm:980},
{id:'M9',max:6804,arm:1060},
{id:'M10',max:6804,arm:1140},

{id:'P12',max:2494,arm:1220}

],

lowerDeck:[

{id:'F1',max:1600,arm:350},
{id:'F2',max:1600,arm:470},
{id:'F3',max:1600,arm:590},

{id:'R4',max:1600,arm:870},
{id:'R5',max:1600,arm:980},
{id:'R6',max:1600,arm:1090}

]

}

},
{
registration:'LV-NPW',

type:'B737-800CF',

datum:0,

mac:155.8,

lemac:627.1,

basicWeight:42528,

basicIndex:51,

basicConfig:'2/4',

basicCrew:'STD CREW',

maxZFW:61688,

maxTOW:79015,

maxRW:79300,

maxLW:65317,

envelope:{

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

aftCargoArm:900,

cargoConfig:{

mainDeck:[

{id:'M1',max:6804,arm:420},
{id:'M2',max:6804,arm:500},
{id:'M3',max:6804,arm:580},
{id:'M4',max:6804,arm:660},
{id:'M5',max:6804,arm:740},

{id:'M6',max:6804,arm:820},
{id:'M7',max:6804,arm:900},
{id:'M8',max:6804,arm:980},
{id:'M9',max:6804,arm:1060},
{id:'M10',max:6804,arm:1140},

{id:'P12',max:2494,arm:1220}

],

lowerDeck:[

{id:'F1',max:1600,arm:350},
{id:'F2',max:1600,arm:470},
{id:'F3',max:1600,arm:590},

{id:'R4',max:1600,arm:870},
{id:'R5',max:1600,arm:980},
{id:'R6',max:1600,arm:1090}

]

}

}
]

export default aircraftCargoDatabase
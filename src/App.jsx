import Login from './Login'
import { getCargoFuelIndex } from './utilit/cargoFuelIndex'
import aircraftCargoDatabase from './data/aircraftCargoDatabase'
import {getLowerDeckIndex} from './utilit/cargoCalculator'
import {getMainDeckIndex} from './utilit/cargoCalculator'
import {getMainCargo} from './utilit/cargoCalculator'
import {getTotalCargoIndex} from './utilit/cargoCalculator'
import {getLowerCargo} from './utilit/cargoCalculator'
import {getCargoZfw} from './utilit/cargoCalculator'
import {getAvailablePayload} from './utilit/cargoCalculator'
import {getTotalCargo} from './utilit/cargoCalculator'
import {calculateCargoBalance} from './utilit/cargoCalculator'
import {getZeroFuelIndex,getTakeoffIndex,getLandingIndex,getCG} from './utilit/cgCalculator'
import { getCgFromIndex } from './utilit/indexToCG'
import { calculateWeight } from './utilit/weightCalculator'
import {getTotalMoment, getArm} from './utilit/passengerMomentCalculator.js'
import {
  Fragment,
  useEffect,
  useRef,
  useState
} from 'react'
import { calculateFuel,getFuelIndex} from './utilit/fuelCalculator'
import './App.css'
import StatusCard from './components/StatusCard'
import a320Perfil from './assets/A320 perfil.png'
import b737cfPerfil from './assets/b737cfPerfil.png'
import b737Perfil from './assets/b737 perfil.png'
import EnvelopeChart from './components/EnvelopeChart'
import { generateFreighterLoadsheet } from './utilit/generateFreighterLoadsheet'
import { generateWeatherPdf } from './utilit/generateWeatherPdf'
import {lowerDeckFactors,mainDeckTables} from './utilit/cargoIndexTables'
import FreighterEnvelope from './components/FreighterEnvelope'
import { generateCargoLoadOrder } from './utilit/generateCargoLoadOrder'
import {
  getForwardBagIndex,
  getAftBagIndex
} from './utilit/bagIndexCalculator'
import { supabase } from './lib/supabase'
import AircraftTechnicalConfiguration
  from './components/AircraftTechnicalConfiguration'
import { calculatePassengerTrim } from './utilit/trimCalculator'
function getMainIndex(position,weight){
if(!mainDeckTables[position])
return 0

const row= mainDeckTables[position].find(v=> Number(weight)<=v.kg)

return row
?row.index:0
}

import { getMetar } from "./api/metar"
async function getTaf(icao){

try{

const response =
await fetch(

`/api/taf?icao=${icao}`

)

const data =
await response.json()

return data.taf

}

catch{

return null

}

}
import aircraftDatabase from './data/aircraftDatabase'
import {
  calculateMoment,
  calculateCG,
  calculateMAC,
  calculateIndex,
  calculateTrim,
  indexToArm,
  armToIndex
} from './utilit/calculations'
import SeatMap from './components/SeatMap'

import CargoPanel from './components/CargoPanel'
import generateLoadsheet from './utils/generateLoadsheet'

import logo from './assets/logo.png'
import {
  getAircraft,
  getCargoAircraftFleet,
  getAircraftFullData,
  getAircraftConfigurationStatus,
  updateAircraft,
   createAircraft,
   createAircraftConfiguration,
   createAircraftEnvelopes,
   createCargoPositions,
   getAircraftTechnicalRevisions,
createAircraftTechnicalRevision,
createWeightBalanceRevision,
createAircraftDataRevision,
createEnvelopesRevision,
createCargoPositionsRevision,
  adaptSupabaseAircraft
} from './services/aircraftService'
import {
  getFreighterFlights,
  createFreighterFlight,
  updateFreighterFlight,
  closeFreighterFlightInSupabase,
  adaptFreighterFlightToSupabase,
  adaptSupabaseFlightToOperdat,
  saveFreighterCargoLoads
} from './services/flightService'
import {
  getOrganizations,
  createOrganization,
  updateOrganization
} from './services/organizationService'
import {
  createPlatformUser,
  getPlatformUsers,
  updatePlatformUserStatus
} from './services/userService'
import aircraftImage from './assets/a320.png'

console.log('APP FILE LOADED - SUPABASE TEST')
function CargoPositionEditorRow({
  position,
  onChange,
  onRemove
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 90px',
        gap: '12px',
        alignItems: 'center',
        padding: '7px 0'
      }}
    >
      <input
        type="text"
        value={position.positionCode}
        onChange={(e) =>
          onChange(
            'positionCode',
            e.target.value.toUpperCase()
          )
        }
        placeholder="A1"
        style={cargoEditorInputStyle}
      />

      <input
        type="number"
        step="any"
        value={position.maxWeight}
        onChange={(e) =>
          onChange('maxWeight', e.target.value)
        }
        placeholder="kg"
        style={cargoEditorInputStyle}
      />

      <input
        type="number"
        step="any"
        value={position.arm}
        onChange={(e) =>
          onChange('arm', e.target.value)
        }
        placeholder="Arm"
        style={cargoEditorInputStyle}
      />

      <button
        type="button"
        onClick={onRemove}
        style={{
          padding: '9px 8px',
          borderRadius: '7px',
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        REMOVE
      </button>
    </div>
  )
}

const cargoEditorInputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px',
  borderRadius: '7px',
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'rgba(0,0,0,0.20)',
  color: '#ffffff',
  outline: 'none'
}
function App() {
  
const [logged,setLogged]=useState(false)
const [userRole, setUserRole] = useState(null)
const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false)
const passwordRecoveryRef = useRef(false)
const [adminAircraft, setAdminAircraft] =
  useState([])
  const [platformOrganizations, setPlatformOrganizations] = useState([])
  const [
  showNewOrganizationForm,
  setShowNewOrganizationForm
] = useState(false)

const [
  newOrganizationName,
  setNewOrganizationName
] = useState('')

const [
  newOrganizationCode,
  setNewOrganizationCode
] = useState('')
// ============================
// PLATFORM USER MANAGEMENT
// ============================
const [
  platformUsers,
  setPlatformUsers
] = useState([])

const [
  loadingPlatformUsers,
  setLoadingPlatformUsers
] = useState(false)
const [
  updatingUserId,
  setUpdatingUserId
] = useState(null)
const [
  showNewUserForm,
  setShowNewUserForm
] = useState(false)

const [
  newUserFullName,
  setNewUserFullName
] = useState('')
const [
  newUserUsername,
  setNewUserUsername
] = useState('')
const [
  newUserEmail,
  setNewUserEmail
] = useState('')

const [
  newUserPassword,
  setNewUserPassword
] = useState('')

const [
  newUserRole,
  setNewUserRole
] = useState('freighter')

const [
  newUserOrganizationId,
  setNewUserOrganizationId
] = useState('')

const [
  creatingUser,
  setCreatingUser
] = useState(false)

const [
  userCreationMessage,
  setUserCreationMessage
] = useState('')
const [
  creatingOrganization,
  setCreatingOrganization
] = useState(false)
const [
  editingOrganizationId,
  setEditingOrganizationId
] = useState(null)

const [
  editingOrganizationName,
  setEditingOrganizationName
] = useState('')

const [
  editingOrganizationCode,
  setEditingOrganizationCode
] = useState('')

const [
  updatingOrganization,
  setUpdatingOrganization
] = useState(false)
  const [
  selectedPlatformOrganization,
  setSelectedPlatformOrganization
] = useState(null)

const [
  platformOrganizationAircraft,
  setPlatformOrganizationAircraft
] = useState([])
  const [
  selectedAdminAircraft,
  setSelectedAdminAircraft
] = useState(null)
const [
  selectedPlatformAircraft,
  setSelectedPlatformAircraft
] = useState(null)

const [
  selectedPlatformAircraftFullData,
  setSelectedPlatformAircraftFullData
] = useState(null)
const [
  selectedAircraftTechnicalRevisions,
  setSelectedAircraftTechnicalRevisions
] = useState([])

const [
  showTechnicalRevisionHistory,
  setShowTechnicalRevisionHistory
] = useState(false)
const [
  selectedAdminAircraftFullData,
  setSelectedAdminAircraftFullData
] = useState(null)
const [currentUser, setCurrentUser] = useState(null)
useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event) => {
      if (event === 'PASSWORD_RECOVERY') {
  passwordRecoveryRef.current = true
  setPasswordRecoveryMode(true)

  // Recovery sessions must never open
  // the operational application
  setLogged(false)
  setUserRole(null)
  setCurrentUser(null)
}
    }
  )

  return () => {
    subscription.unsubscribe()
  }
}, [])
useEffect(() => {
  if (!logged || !currentUser) return

  async function loadFreighterFlights() {
    try {
      const flights =
        await getFreighterFlights()

      const adaptedFlights =
        flights.map(
          adaptSupabaseFlightToOperdat
        )

      console.log(
        'OPERDAT ADAPTED FLIGHTS:',
        adaptedFlights
      )
     setCargoFlightRecords(
  adaptedFlights
)
    } catch (error) {
      console.error(
        'OPERDAT FLIGHTS TEST ERROR:',
        error
      )
    }
  }

  loadFreighterFlights()
}, [logged, currentUser])
useEffect(() => {
  if (!logged || userRole !== 'super_admin') return

  async function loadPlatformOrganizations() {
    try {
      const organizations = await getOrganizations()

      console.log(
        'PLATFORM ORGANIZATIONS:',
        organizations
      )

      setPlatformOrganizations(organizations)

    } catch (error) {
      console.error(
        'PLATFORM ORGANIZATIONS ERROR:',
        error
      )
    }
  }

  loadPlatformOrganizations()
}, [logged, userRole])
useEffect(() => {
  async function restoreSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return
    }
    if (passwordRecoveryRef.current) {
  setPasswordRecoveryMode(true)
  setLogged(false)
  return
}
const hashParams =
  new URLSearchParams(
    window.location.hash.substring(1)
  )

const queryParams =
  new URLSearchParams(
    window.location.search
  )

const isPasswordRecovery =
  hashParams.get('type') === 'recovery' ||
  queryParams.get('type') === 'recovery'

if (isPasswordRecovery) {
  setPasswordRecoveryMode(true)
  setLogged(false)
  return
}
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, status, organization_id, full_name')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('SESSION PROFILE ERROR:', error)
      return
    }

    if (profile.status !== 'active') {
      await supabase.auth.signOut()
      return
    }

    setUserRole(profile.role)
setCurrentUser({
  id: session.user.id,
  email: session.user.email,
  fullName: profile.full_name,
  role: profile.role,
  organizationId: profile.organization_id
})
    if (profile.role === 'freighter') {
      setActiveMenu('FreighterLoadsheet')
    }
    if (
  profile.role === 'passenger' ||
  profile.role === 'student' ||
  profile.role === 'admin'
) {
  setActiveMenu('Loadsheet')
}
if (profile.role === 'super_admin') {
  setActiveMenu('Flight History')
}

if (passwordRecoveryRef.current) {
  setLogged(false)
  setUserRole(null)
  setCurrentUser(null)
  return
}

setLogged(true)
    setCurrentUser({
  id: session.user.id,
  email: session.user.email,
  fullName: profile.full_name,
  role: profile.role,
  organizationId: profile.organization_id
})
  }
restoreSession()
}, [])
useEffect(() => {
  if (
    !logged ||
    !currentUser ||
    userRole !== 'super_admin'
  ) {
    return
  }

  refreshPlatformUsers()
}, [
  logged,
  currentUser?.id,
  userRole
])
useEffect(() => {
  if (!logged || userRole !== 'admin') return

  async function loadAdminAircraft() {
    try {
      const aircraft =
        await getAircraft()

      setAdminAircraft(
        aircraft || []
      )
console.log(
  'ADMIN AIRCRAFT:',
  aircraft
)
    } catch (error) {
      console.error(
        'AIRCRAFT MANAGEMENT LOAD ERROR:',
        error
      )
    }
  }

  loadAdminAircraft()

}, [logged, userRole])
const refreshPlatformUsers = async () => {
  if (userRole !== 'super_admin') {
    setPlatformUsers([])
    return
  }

  try {
    setLoadingPlatformUsers(true)

    const users =
      await getPlatformUsers()

    setPlatformUsers(users)

  } catch (error) {
    console.error(
      'LOAD PLATFORM USERS ERROR:',
      error
    )

    setPlatformUsers([])

  } finally {
    setLoadingPlatformUsers(false)
  }
}
const [
  newAircraftEnvelopes,
  setNewAircraftEnvelopes
] = useState({
  zfw: {
    indexMin: '',
    indexMax: '',
    cgMin: '',
    cgMax: ''
  },
  tow: {
    indexMin: '',
    indexMax: '',
    cgMin: '',
    cgMax: ''
  },
  ldw: {
    indexMin: '',
    indexMax: '',
    cgMin: '',
    cgMax: ''
  }
})
const [
  creatingAircraftEnvelopes,
  setCreatingAircraftEnvelopes
] = useState(false)
const [
  showAircraftEnvelopesForm,
  setShowAircraftEnvelopesForm
] = useState(false)
const [
  newCargoPositions,
  setNewCargoPositions
] = useState({
  mainDeck: [],
  lowerDeck: []
})

const [
  showCargoPositionsForm,
  setShowCargoPositionsForm
] = useState(false)

const [
  creatingCargoPositions,
  setCreatingCargoPositions
] = useState(false)
const [tripFuel, setTripFuel] = useState(0)
const [taxiFuel,setTaxiFuel ]= useState(0)
const [fuel, setFuel] = useState(0)
const [selectedAircraft,setSelectedAircraft] = useState(aircraftDatabase[0])
const [selectedCargoAircraft,setSelectedCargoAircraft] = useState(aircraftCargoDatabase[0]
)
function clearCargo(){setCargoWeights(
{}
)
}
const [cargoAircraftFleet, setCargoAircraftFleet] =
  useState(aircraftCargoDatabase)

async function refreshCargoFleet() {
  try {
    const fleet = await getCargoAircraftFleet()

    setCargoAircraftFleet(fleet || [])

    setSelectedCargoAircraft((current) => {
  if (!fleet || fleet.length === 0) {
    return current || aircraftCargoDatabase[0]
  }

  const currentStillAvailable =
    fleet.find(
      aircraft =>
        aircraft.id === current?.id
    )

  return currentStillAvailable || fleet[0]
})

  } catch (error) {
    console.error(
      'CARGO FLEET SUPABASE ERROR - USING LOCAL FALLBACK:',
      error
    )

    setCargoAircraftFleet(
  aircraftCargoDatabase
)

setSelectedCargoAircraft((current) =>
  current || aircraftCargoDatabase[0]
)
  }
}

useEffect(() => {
  if (!logged || !currentUser) return

  refreshCargoFleet()
}, [logged, currentUser?.id])

const [
  showNewAircraftForm,
  setShowNewAircraftForm
] = useState(false)
const [
  editingAircraftId,
  setEditingAircraftId
] = useState(null)

const [
  editingAircraft,
  setEditingAircraft
] = useState(null)

const [
  updatingAircraft,
  setUpdatingAircraft
] = useState(false)
const [
  editingWeightBalance,
  setEditingWeightBalance
] = useState(null)
const [
  editingAircraftData,
  setEditingAircraftData
] = useState(null)

const [
  savingAircraftDataRevision,
  setSavingAircraftDataRevision
] = useState(false)

const [
  aircraftDataRevisionMeta,
  setAircraftDataRevisionMeta
] = useState({
  changeReason: '',
  sourceDocument: '',
  sourceRevision: '',
  effectiveDate:
    new Date().toISOString().slice(0, 10)
})
const [
  editingEnvelopes,
  setEditingEnvelopes
] = useState(null)

const [
  savingEnvelopesRevision,
  setSavingEnvelopesRevision
] = useState(false)

const [
  envelopesRevisionMeta,
  setEnvelopesRevisionMeta
] = useState({
    changeReason: '',
    sourceDocument: '',
    sourceRevision: '',
    effectiveDate:
      new Date().toISOString().slice(0, 10)
})
const [
  editingCargoPositions,
  setEditingCargoPositions
] = useState(null)

const [
  savingCargoPositionsRevision,
  setSavingCargoPositionsRevision
] = useState(false)

const [
  cargoPositionsRevisionMeta,
  setCargoPositionsRevisionMeta
] = useState({
  changeReason: '',
  sourceDocument: '',
  sourceRevision: '',
  effectiveDate:
    new Date().toISOString().slice(0, 10)
})
const [
  savingWeightBalanceRevision,
  setSavingWeightBalanceRevision
] = useState(false)
const [
  weightBalanceRevisionMeta,
  setWeightBalanceRevisionMeta
] = useState({
    changeReason: '',
    sourceDocument: '',
    sourceRevision: '',
    effectiveDate:
      new Date().toISOString().slice(0, 10)
  })
const [
  newAircraft,
  setNewAircraft
] = useState({
    registration: '',
    manufacturer: '',
    model: '',
    variant: '',
    aircraftType: '',
    dow: '',
    mzfw: '',
    mtow: '',
    mlw: '',
    mrw: ''
  })
const [
  newAircraftConfiguration,
  setNewAircraftConfiguration
] = useState({
  datum: '',
  mac: '',
  lemac: '',
  basicWeight: '',
  basicIndex: '',
  indexReferenceArm: '',
  indexConstant: '',
  indexOffset: '',
  basicConfig: '',
  basicCrew: '',
  seatArmFwd: '',
  seatArmMid: '',
  seatArmAft: '',
  fuelArm: '',
  forwardCargoArm: '',
  aftCargoArm: ''
})

const [
  creatingAircraftConfiguration,
  setCreatingAircraftConfiguration
] = useState(false)
const [
  showAircraftConfigurationForm,
  setShowAircraftConfigurationForm
] = useState(false)

const [
  creatingAircraft,
  setCreatingAircraft
] = useState(false)

const [flightFrom, setFlightFrom] = useState('')
const [flightTo, setFlightTo] = useState('')
const [cargoWeights, setCargoWeights]=useState({})
const [metar, setMetar] = useState(null)
useEffect(() => {

async function loadMetar(){

if(
flightFrom
.trim()
.length !== 4
){

setMetar(null)
console.log(
  'selectedAircraft',
  selectedAircraft?.registration
)

console.log(
  'selectedCargoAircraft',
  selectedCargoAircraft?.registration
)
return

}

const result =
await getMetar(
flightFrom
.toUpperCase()
)

setMetar(result)

}

loadMetar()

}, [flightFrom])
async function searchAirportWeather(){

const airports =
weatherAirport

.split(",")

.map(

a => a.trim()

.toUpperCase()

)

.filter(

a => a.length === 4

)

if(

airports.length===0

){

setSearchMetar(null)

setSearchTaf(null)

return

}

let metarResult=[]

let tafResult=[]

for(

const icao of airports

){

const metar =
await getMetar(
icao
)

metarResult.push(

`${icao}

${metar || "METAR unavailable"}`

)

try{

const response =
await fetch(

`/api/taf?icao=${icao}`

)

const data =
await response.json()

tafResult.push(

`${icao}

${data.taf || "TAF unavailable"}`

)

}

catch{

tafResult.push(

`${icao}

TAF unavailable`

)

}

}

setSearchMetar(

metarResult.join(

"\n\n"

)

)

setSearchTaf(

tafResult.join(

"\n\n"

)

)

}
const [metarTo, setMetarTo] = useState(null)
useEffect(() => {

async function loadMetarTo(){

if(
flightTo
.trim()
.length !== 4
){

setMetarTo(null)

return

}

const result =
await getMetar(
flightTo
.toUpperCase()
)

setMetarTo(result)

}

loadMetarTo()

}, [flightTo])
const [

flightNumber,

setFlightNumber

]=

useState(

''

)
async function closeFreighterFlight(id) {

  const flight = cargoFlightRecords.find(
    item => item.id === id
  )

  if (!flight) {
    console.log('Flight not found:', id)
    return
  }

  const canModifyFlight =
    userRole === 'admin' ||
    flight.createdBy === currentUser?.id

  if (!canModifyFlight) {
    console.warn(
      'ACCESS DENIED - FLIGHT OWNER:',
      flight.createdBy,
      'CURRENT USER:',
      currentUser?.id
    )

    alert(
      'You can only close flights created by your user.'
    )

    return
  }

  try {

    const closedFlight =
      await closeFreighterFlightInSupabase(id)

    const adaptedClosedFlight =
      adaptSupabaseFlightToOperdat(
        closedFlight
      )

    setCargoFlightRecords(
      previous =>
        previous.map(flight =>
          flight.id === id
            ? adaptedClosedFlight
            : flight
        )
    )

    if (id === activeFreighterFlightId) {
      setActiveFreighterFlightId(null)
    }

    console.log(
      'OPERDAT FLIGHT CLOSED:',
      adaptedClosedFlight
    )

    alert('Flight closed')

  } catch (error) {

    console.error(
      'FLIGHT CLOSE FAILED:',
      error
    )

    alert(
      'The flight could not be closed in the database.'
    )
  }
}
function openFreighterFlight(id) {

  const flight =
    cargoFlightRecords.find(
      item => item.id === id
    )

  if (!flight) {
    console.log(
      'Flight not found:',
      id
    )
    return
  }
const canModifyFlight =
  userRole === 'admin' ||
  flight.createdBy === currentUser?.id

if (!canModifyFlight) {

  console.warn(
    'ACCESS DENIED - FLIGHT OWNER:',
    flight.createdBy,
    'CURRENT USER:',
    currentUser?.id
  )

  alert(
    'You can only modify flights created by your user.'
  )

  return
}
  if (flight.status !== 'OPEN') {
    return
  }

  console.log(
    'OPENING FLIGHT:',
    flight.id,
    flight.flightNumber
  )

  // Este pasa a ser el vuelo activo
  setActiveFreighterFlightId(
    flight.id
  )

  // Flight data
  setCargoFlightNumber(
    flight.flightNumber || ''
  )

  setCargoFlightFrom(
    flight.from || ''
  )

  setCargoFlightTo(
    flight.to || ''
  )
setPerformanceMaxTow(
  flight.performanceMaxTow ?? ''
)
  // Cargo distribution
  setCargoWeights({
    ...(flight.cargoWeights || {})
  })

  // Fuel
  setFuel(
  Number(
    flight.rampFuel ??
    flight.blockFuel
  ) || 0
)
  setTaxiFuel(
    Number(flight.taxiFuel) || 0
  )

  setTripFuel(
    Number(flight.tripFuel) || 0
  )

  // Go to Freighter
  setActiveMenu(
    'FreighterLoadsheet'
  )
}
function printClosedFreighterFlight(flight) {

  if (flight.status !== 'CLOSED') {
    return
  }

  generateFreighterLoadsheet({

    registration:
      flight.registration,

    cargoFlightFrom:
      flight.from,

    cargoFlightTo:
      flight.to,

    cargoFlightNumber:
      flight.flightNumber,

    cargoMetarFrom:
      flight.cargoMetarFrom || '',

    cargoMetarTo:
      flight.cargoMetarTo || '',

    basicWeight:
      flight.basicWeight,

    basicIndex:
      flight.basicIndex,

    maxZFW:
      flight.maxZFW,

    maxTOW:
      flight.maxTOW,

    maxLW:
      flight.maxLW,

    mainCargo:
      flight.mainCargo,

    lowerCargo:
      flight.lowerCargo,

    totalCargo:
      flight.totalCargo,

    cargoZfw:
      flight.zfw,

    rampWeight:
      flight.rampWeight,

    takeoffWeight:
      flight.tow,

    landingWeight:
      flight.lw,

    cargoZfwIndex:
      flight.zfwIndex,

    cargoTowIndex:
      flight.towIndex,

    cargoLandingIndex:
      flight.lwIndex,

    cargoZfwCg:
      flight.zfwCg,

    cargoTowCg:
      flight.towCg,

    cargoLandingCg:
      flight.lwCg,

    blockFuel:
      flight.rampFuel ??
      flight.blockFuel ??
      0,

    taxiFuel:
      flight.taxiFuel,

    takeoffFuel:
      flight.takeoffFuel,

    tripFuel:
      flight.tripFuel,

    cargoWeights:
      flight.cargoWeights || {}
  })
}
function printClosedLoadOrder(flight) {

  if (flight.status !== 'CLOSED') {
    return
  }

  generateCargoLoadOrder({

    registration:
      flight.registration,

    cargoFlightFrom:
      flight.from,

    cargoFlightTo:
      flight.to,

    cargoFlightNumber:
      flight.flightNumber,

    cargoWeights:
      flight.cargoWeights || {},

    mainCargo:
      flight.mainCargo || 0,

    lowerCargo:
      flight.lowerCargo || 0,

    totalCargo:
      flight.totalCargo || 0
  })
}
function newFreighterFlight() {

  setActiveFreighterFlightId(null)

  setCargoFlightNumber('')
  setCargoFlightFrom('')
  setCargoFlightTo('')

  setCargoWeights({})

setFuel(0)
setTaxiFuel(0)
setTripFuel(0)
setPerformanceMaxTow('')
  setActiveMenu('FreighterLoadsheet')
}

  const [forwardCargo, setForwardCargo] =
  useState(0)

const [aftCargo, setAftCargo] =
  useState(0)
  const [selectedSeats, setSelectedSeats] =
  useState([])
  const [fwdCabinPax, setFwdCabinPax] =
useState(0)

const [midCabinPax, setMidCabinPax] =
useState(0)

const [aftCabinPax, setAftCabinPax] =
useState(0)
// FWD CABIN
const [fwdAdults, setFwdAdults] = useState(0)
const [fwdChildren, setFwdChildren] = useState(0)
const [fwdInfants, setFwdInfants] = useState(0)

// MID CABIN
const [midAdults, setMidAdults] = useState(0)
const [midChildren, setMidChildren] = useState(0)
const [midInfants, setMidInfants] = useState(0)

// AFT CABIN
const [aftAdults, setAftAdults] = useState(0)
const [aftChildren, setAftChildren] = useState(0)
const [aftInfants, setAftInfants] = useState(0)
const [activeMenu, setActiveMenu] =
  useState(userRole === 'freighter' ? 'FreighterLoadsheet' : 'Dashboard')
  console.log('ACTIVE MENU:', activeMenu)
 const passengerWeight =

(fwdAdults + midAdults + aftAdults) * 80 +

(fwdChildren + midChildren + aftChildren) * 40 +

(fwdInfants + midInfants + aftInfants) * 20
  const forwardSeats =

selectedSeats.filter(

seat => seat <= 59

).length

const midSeats =

selectedSeats.filter(

seat =>

seat > 59 &&

seat <= 129

).length

const aftSeats = selectedSeats.filter(
  seat => seat > 129 && seat <= 180

).length
const paxMoment =

  calculateMoment(

    passengerWeight,

    selectedAircraft.seatArmMid

  )
  const calculatedFwdCabinPax = fwdAdults + fwdChildren
const calculatedMidCabinPax = midAdults + midChildren
const calculatedAftCabinPax = aftAdults + aftChildren
  const payload = passengerWeight + forwardCargo + aftCargo
const zfw = selectedAircraft.basicWeight + passengerWeight + forwardCargo + aftCargo 

const rw = zfw + fuel
const fuelData = calculateFuel(fuel,taxiFuel,tripFuel)
const [
  performanceMaxTow,
  setPerformanceMaxTow
] = useState('')
const {
  mainCargo,
  lowerCargo,
  totalCargo,
  cargoZfw,
  availablePayload,
  mainDeckIndex,
  lowerDeckIndex,
  totalCargoIndex,
  mainDeckMoment,
  lowerDeckMoment,
  totalCargoMoment,
  zfwArm,
towArm
} = calculateCargoBalance(
  selectedCargoAircraft,
  cargoWeights,
  fuelData.takeoffFuel
)
const effectiveMaxTow =
  performanceMaxTow &&
  Number(performanceMaxTow) > 0
    ? Math.min(
        selectedCargoAircraft.maxTOW,
        Number(performanceMaxTow)
      )
    : selectedCargoAircraft.maxTOW
const payloadCapacity =
  totalCargo + availablePayload

const loadedPercent =
  payloadCapacity > 0
    ? (totalCargo / payloadCapacity) * 100
    : 0
const weightData = calculateWeight(
  cargoZfw,
  fuel,
  fuelData.takeoffFuel,
  fuelData.remainingFuel
)


const rampWeight = cargoZfw + fuel
const basicArm = selectedAircraft.lemac + (selectedAircraft.mac *22) /100

const basicMoment =(selectedAircraft.basicWeight || 0) * basicArm

const passengerMoment = selectedSeats.reduce((total,seat)=>{

const row = Math.ceil(seat /6)

let rowArm = selectedAircraft.seatArmMid 
if (row <= 8) {rowArm = selectedAircraft.seatArmFwd}
else if (row <= 18) {rowArm =selectedAircraft.seatArmMid}
else {rowArm = selectedAircraft.seatArmAft}
return (total + calculateMoment(84,rowArm))}, 0)
const fwdPax = selectedSeats.filter(seat => {

  const row = Math.ceil((seat + 1) / 6)

  return row >= 1 && row <= 10

}).length

const midPax = selectedSeats.filter(seat => {

  const row = Math.ceil((seat + 1) / 6)

  return row >= 11 && row <= 22

}).length

const aftPax = selectedSeats.filter(seat => {

  const row = Math.ceil((seat + 1) / 6)

  return row >= 23 && row <= 30

}).length
selectedSeats.forEach(seat => {

  const row = Math.ceil((seat + 1) / 6)

  console.log({

    seat,

    row

  })

})
const paxIndex = (fwdPax * -0.7) + (aftPax * 0.7)
console.log({
  fwdPax,
  midPax,
  aftPax,
  paxIndex
})
const FuelMoment = calculateMoment(fuel,selectedAircraft.FuelArm)
const forwardCargoMoment = forwardCargo * selectedAircraft.forwardCargoArm
const aftCargoMoment = aftCargo * selectedAircraft.aftCargoArm
const totalMoment = basicMoment + passengerMoment + FuelMoment + forwardCargoMoment + aftCargoMoment
const tow = rw - taxiFuel

const ldw = tow - tripFuel

const lw = ldw
const arm = tow > 0? (totalMoment / tow) : 0
const cg = arm > 0 ? (( arm - selectedAircraft.lemac) / selectedAircraft.mac) * 100 : 0
const [extraCrew,setExtraCrew] = useState(0)
const [ catering,setCatering] = useState( 0 )
const dow = selectedAircraft.basicWeight
const cateringWeight = catering ? 250 :0
const effectiveBasicWeight = dow + (extraCrew *85) + cateringWeight
const crewConfiguration = extraCrew > 0 ? `2/${4 + extraCrew}` : selectedAircraft.basicConfig
const basicWeightDelta = effectiveBasicWeight - selectedAircraft.basicWeight
const effectiveBasicMoment = (extraCrew * 85 * 360) + (catering ? 250 * 420 : 0)
const doi = selectedAircraft.basicIndex + (extraCrew * 0.1)

const cargoDow = selectedCargoAircraft.basicWeight

const cargoDoi =
  selectedCargoAircraft.basicIndex + (extraCrew * 0.1)

const cargoEffectiveBasicIndex =
  cargoDoi +
  (extraCrew * 0.1) +
  (catering ? 0.2 : 0)

const cargoZfwIndex = getZeroFuelIndex(
  cargoEffectiveBasicIndex,
  totalCargoIndex
)
const cargoFuelIndex = getCargoFuelIndex(
  fuelData.takeoffFuel
)

const cargoTripFuelIndex = getCargoFuelIndex(
  fuelData.tripFuel
)

const cargoTowIndex = getTakeoffIndex(
  cargoZfwIndex,
  cargoFuelIndex
)

const cargoLandingIndex = getLandingIndex(
  cargoTowIndex,
  cargoTripFuelIndex
)


const cargoZfwArm = indexToArm(
  cargoZfwIndex,
  cargoZfw,
  selectedCargoAircraft.indexReferenceArm,
  selectedCargoAircraft.indexConstant,
  selectedCargoAircraft.indexOffset
)

const cargoTowArm = indexToArm(
  cargoTowIndex,
  weightData.takeoffWeight,
  selectedCargoAircraft.indexReferenceArm,
  selectedCargoAircraft.indexConstant,
  selectedCargoAircraft.indexOffset
)

const cargoLandingArm = indexToArm(
  cargoLandingIndex,
  weightData.landingWeight,
  selectedCargoAircraft.indexReferenceArm,
  selectedCargoAircraft.indexConstant,
  selectedCargoAircraft.indexOffset
)

const cargoZfwCg = getCgFromIndex(
  cargoZfwIndex,
  cargoZfw
)
console.log(
  'ZFW CG DEBUG:',
  {
    cargoZfwIndex,
    cargoZfwArm,
    cargoZfwCg
  }
)
const cargoTowCg = getCgFromIndex(
  cargoTowIndex,
  weightData.takeoffWeight
)

const cargoLandingCg = getCgFromIndex(
  cargoLandingIndex,
  weightData.landingWeight
)
console.log('CARGO CG TABLE DEBUG', {
  zfw: {
    weight: cargoZfw,
    index: cargoZfwIndex,
    cg: cargoZfwCg
  },
  tow: {
    weight: weightData.takeoffWeight,
    index: cargoTowIndex,
    cg: cargoTowCg
  },
  lw: {
    weight: weightData.landingWeight,
    index: cargoLandingIndex,
    cg: cargoLandingCg
  }
})
function isInsideFreighterEnvelope(
  index,
  weight
) {

  const polygon = [
    { index: 29.5, weight: 36200 },
    { index: 28.5, weight: 40000 },
    { index: 28.5, weight: 78000 },
    { index: 48.0, weight: 79000 },
    { index: 74.0, weight: 78200 },
    { index: 82.0, weight: 73500 },
    { index: 47.5, weight: 36200 }
  ]

  let inside = false

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {

    const xi = polygon[i].index
    const yi = polygon[i].weight

    const xj = polygon[j].index
    const yj = polygon[j].weight

    const intersect =
      ((yi > weight) !== (yj > weight)) &&
      (
        index <
        ((xj - xi) * (weight - yi)) /
        (yj - yi) +
        xi
      )

    if (intersect) {
      inside = !inside
    }
  }

  return inside
}
const cargoZfwInsideEnvelope =
  isInsideFreighterEnvelope(
    cargoZfwIndex,
    cargoZfw
  )

const cargoTowInsideEnvelope =
  isInsideFreighterEnvelope(
    cargoTowIndex,
    weightData.takeoffWeight
  )

const cargoLwInsideEnvelope =
  isInsideFreighterEnvelope(
    cargoLandingIndex,
    weightData.landingWeight
  )
  const cargoPositionOverLimit = [

  ...selectedCargoAircraft.cargoConfig.mainDeck,

  ...selectedCargoAircraft.cargoConfig.lowerDeck

].find(position => {

  const loaded =
    Number(
      cargoWeights[position.id] || 0
    )

  return loaded > position.max
})

const freighterPrintValid =
  !cargoPositionOverLimit &&
  cargoZfw <= selectedCargoAircraft.maxZFW &&
  weightData.takeoffWeight <=
    effectiveMaxTow &&
  weightData.landingWeight <=
    selectedCargoAircraft.maxLW &&
  cargoZfwInsideEnvelope &&
  cargoTowInsideEnvelope &&
  cargoLwInsideEnvelope
const [cargoFlightFrom, setCargoFlightFrom] =
useState('')

const [cargoFlightTo, setCargoFlightTo] =
useState('')

const [cargoFlightNumber, setCargoFlightNumber] =
useState('')
const [cargoFlightRecords, setCargoFlightRecords] =
  useState([])

const [activeFreighterFlightId, setActiveFreighterFlightId] =
  useState(null)
  const [historySearch, setHistorySearch] =
  useState('')

const [historyStatus, setHistoryStatus] =
  useState('ALL')

const [historyDate, setHistoryDate] =
  useState('')
  const [historyUser, setHistoryUser] =
  useState('ALL')
const [cargoMetarFrom, setCargoMetarFrom] = useState(null)
const [cargoMetarTo, setCargoMetarTo] = useState(null)

useEffect(() => {

  async function loadCargoMetarFrom() {

    if (
      cargoFlightFrom.trim().length !== 4
    ) {
      setCargoMetarFrom(null)
      return
    }

    const result = await getMetar(
      cargoFlightFrom.toUpperCase()
    )

    setCargoMetarFrom(result)
  }

  loadCargoMetarFrom()

}, [cargoFlightFrom])


useEffect(() => {

  async function loadCargoMetarTo() {

    if (
      cargoFlightTo.trim().length !== 4
    ) {
      setCargoMetarTo(null)
      return
    }

    const result = await getMetar(
      cargoFlightTo.toUpperCase()
    )

    setCargoMetarTo(result)
  }

  loadCargoMetarTo()

}, [cargoFlightTo])
const index = Number.isFinite(totalMoment) ? calculateIndex(totalMoment) :0
const effectiveBasicIndex = doi + (extraCrew *0.1) + (catering? 0.2 : 0)
const cargoIndex =
  getForwardBagIndex(forwardCargo) +
  getAftBagIndex(aftCargo)

console.log({
  forwardCargo,
  aftCargo,
  forwardIndex: getForwardBagIndex(forwardCargo),
  aftIndex: getAftBagIndex(aftCargo),
  cargoIndex
})
const zfi = effectiveBasicIndex + paxIndex + cargoIndex
const zfiDebug = effectiveBasicIndex + cargoIndex
const FuelIndex = getFuelIndex(fuel)
const toi = zfi + FuelIndex

const tripFuelIndex = getFuelIndex(tripFuel)
const li = toi - tripFuelIndex
console.log({
  effectiveBasicIndex,
  paxIndex,
  cargoIndex,
  zfi,
  toi
})
function getNearestCg(index){
const minIndex=25
const maxIndex=90

const minCg=21
const maxCg=34 
return (18+(index-35)*0.235)
}
 function getCgFromEnvelope(index,weight){return Number(getNearestCg(index).toFixed(1))}
 const aircraftSummary =
  selectedCargoAircraft &&
  selectedCargoAircraft.registration ===
    selectedAircraft.registration
    ? selectedCargoAircraft
    : selectedAircraft;
const paxZfwArm = indexToArm(
  zfi,
  zfw,
  selectedAircraft.indexReferenceArm,
  selectedAircraft.indexConstant,
  selectedAircraft.indexOffset
)

const paxTakeoffArm = indexToArm(
  toi,
  tow,
  selectedAircraft.indexReferenceArm,
  selectedAircraft.indexConstant,
  selectedAircraft.indexOffset
)

const paxLandingArm = indexToArm(
  li,
  ldw,
  selectedAircraft.indexReferenceArm,
  selectedAircraft.indexConstant,
  selectedAircraft.indexOffset
)

const zfCg = getCG(
  paxZfwArm,
  selectedAircraft.lemac,
  selectedAircraft.mac
)

const toCg = getCG(
  paxTakeoffArm,
  selectedAircraft.lemac,
  selectedAircraft.mac
)
const trim = calculatePassengerTrim(
  tow,
  toCg
)
const lwCg = getCG(
  paxLandingArm,
  selectedAircraft.lemac,
  selectedAircraft.mac
)

const toWithinEnvelope = toCg >= 18 && toCg <= 32 && tow <= selectedAircraft.maxTOW
function isInsideEnvelope(x, y){
const polygon=[

[100,50],

[150,160],

[210,310],

[230,310],

[830,70],

[400,50],

[395,50]

]

let inside=false 
for( let i=0, j=polygon.length-1; i<polygon.length; j=i++){

const xi=polygon[i][0]

const yi=polygon[i][1]

const xj=polygon[j][0]

const yj=polygon[j][1]

const intersect=

(( yi>y ) !== ( yj>y )) && (x< (xj-xi) * (y-yi) / (yj-yi) + xi)

if(intersect) inside=!inside
}

return inside
}

const zfWithinEnvelope = zfw <= selectedAircraft.maxZFW && zfCg >= 18 && zfCg <= 34
const trimLabel = trim < 4 ? 'NOSE UP' : trim > 7 ? 'NOSE DOWN' : 'SET'
const loadStatus = 'READY FOR DISPATCH'
const cgStatus = true
const cgLabel = cg < 18 ? 'FORWARD' : cg > 32 ? 'AFT' : 'NORMAL'
const zfwStatus = zfw <= selectedAircraft.maxZFW
const towStatus = tow <= selectedAircraft.maxTOW
const [weatherAirport,setWeatherAirport]=useState("")
const [searchMetar,setSearchMetar]=useState(null)
const [searchTaf,setSearchTaf]=useState(null)
function toggleSeat(seat) {if (selectedSeats.includes(seat)) {setSelectedSeats(selectedSeats.filter(s => s !== seat))
  } else {setSelectedSeats( [...selectedSeats, seat])
}
}
function loadCabins(){
const seats=[]

for (let i = 0; i < Math.min(calculatedFwdCabinPax, 60); i++)

{

seats.push(

i

)

}

for (let i = 60; i < 60 + Math.min(calculatedMidCabinPax, 70); i++){

seats.push(

i

)

}

for (let i = 130; i < 130 + Math.min(calculatedAftCabinPax, 50); i++){

seats.push(

i

)

}

setSelectedSeats(

seats

)

}
console.log({
  fwdPax,
  midPax,
  aftPax,
  paxIndex
})
if(

!logged

){

return(

<Login
  passwordRecoveryMode={passwordRecoveryMode}
  onLogin={(role, userData) => {
    setUserRole(role)
    setCurrentUser(userData)

   if (role === 'freighter') {
  setActiveMenu('FreighterLoadsheet')
}

if (
  role === 'passenger' ||
  role === 'student' ||
  role === 'admin'
) {
  setActiveMenu('Loadsheet')
}

    setLogged(true)
  }}
/>

)

}
async function saveCurrentFreighterFlight() {

  const now =
    new Date().toISOString()
console.log(
  'SELECTED CARGO AIRCRAFT:',
  selectedCargoAircraft
)
  const flightData = {

    status: 'OPEN',

    updatedAt: now,

    flightNumber:
      cargoFlightNumber || '----',

    from:
      cargoFlightFrom || '----',

    to:
      cargoFlightTo || '----',

    registration:
      selectedCargoAircraft.registration,

    cargoWeights: {
      ...cargoWeights
    },

    rampFuel:
      fuel,

    taxiFuel:
      fuelData.taxiFuel,

    takeoffFuel:
      fuelData.takeoffFuel,

    tripFuel:
      fuelData.tripFuel,

    zfw:
      cargoZfw,

    tow:
      weightData.takeoffWeight,

    lw:
      weightData.landingWeight,

    zfwIndex:
      cargoZfwIndex,

    towIndex:
      cargoTowIndex,

    lwIndex:
      cargoLandingIndex,

    zfwCg:
      cargoZfwCg,

    towCg:
      cargoTowCg,

    lwCg:
      cargoLandingCg,
      cargoMetarFrom:
  cargoMetarFrom || '',

cargoMetarTo:
  cargoMetarTo || '',

basicWeight:
  selectedCargoAircraft.basicWeight,

basicIndex:
  selectedCargoAircraft.basicIndex,

maxZFW:
  selectedCargoAircraft.maxZFW,

maxTOW:
  selectedCargoAircraft.maxTOW,

maxLW:
  selectedCargoAircraft.maxLW,

mainCargo,

lowerCargo,

totalCargo,
performanceMaxTow:
  performanceMaxTow
    ? Number(performanceMaxTow)
    : null,

effectiveMaxTow:
  effectiveMaxTow,
rampWeight:
  weightData.rampWeight,
  }

const supabaseFlight =
  adaptFreighterFlightToSupabase({
    flightData,
    currentUser,
    aircraftId: selectedCargoAircraft?.id
  })

// ======================================================
// UPDATE EXISTING FLIGHT
// ======================================================

if (activeFreighterFlightId) {

  try {

    const updatedFlight =
      await updateFreighterFlight(
        activeFreighterFlightId,
        supabaseFlight
      )

    console.log(
      'FLIGHT UPDATED IN SUPABASE:',
      updatedFlight
    )

    const adaptedUpdatedFlight =
      adaptSupabaseFlightToOperdat(
        updatedFlight
      )

    setCargoFlightRecords(
      previous =>
        previous.map(flight =>
          flight.id === activeFreighterFlightId
            ? adaptedUpdatedFlight
            : flight
        )
    )

    alert('Flight updated')

  } catch (error) {

    console.error(
      'FLIGHT UPDATE FAILED:',
      error
    )

    alert(
      'The flight could not be updated in the database.'
    )
  }

  return
}
console.log(
  'FLIGHT INSERT DEBUG:',
  {
    currentUser,
    organizationId:
      currentUser?.organizationId,
    userId:
      currentUser?.id,
    supabaseFlight
  }
)

// ======================================================
// CREATE NEW FLIGHT
// ======================================================

let savedFlight

try {

  savedFlight =
    await createFreighterFlight(
      supabaseFlight
    )

  console.log(
    'FLIGHT SAVED IN SUPABASE:',
    savedFlight
  )

} catch (error) {

  console.error(
    'FLIGHT SAVE FAILED:',
    error
  )

  alert(
    'The flight could not be saved in the database.'
  )

  return
}
await saveFreighterCargoLoads({
  flightId: savedFlight.id,

  aircraftId:
    selectedCargoAircraft?.id,

  cargoWeights,

  mainDeck:
    selectedCargoAircraft
      ?.cargoConfig
      ?.mainDeck || [],

  lowerDeck:
    selectedCargoAircraft
      ?.cargoConfig
      ?.lowerDeck || []
})

console.log(
  'FLIGHT CARGO LOADS SAVED:',
  savedFlight.id
)
 const newFlight =
  adaptSupabaseFlightToOperdat(
    savedFlight
  )

  setCargoFlightRecords(
    previous => {

      const updated = [
        newFlight,
        ...previous
      ]

      return updated.slice(0, 10)
    }
  )

  setActiveFreighterFlightId(
    newFlight.id
  )

  alert('Flight saved as OPEN')
}
console.log(
  'FLIGHT HISTORY USER:',
  userRole,
  currentUser
)

console.log(
  'FLIGHT HISTORY RECORDS:',
  cargoFlightRecords.length
)
const filteredHistoryFlights =
  cargoFlightRecords.filter(flight => {

    const userMatch =
  userRole === 'super_admin' ||
  userRole === 'admin' ||
  flight.createdBy === currentUser?.id

    const search =
      historySearch.trim().toLowerCase()

    const searchMatch =
      !search ||
      (flight.flightNumber || '')
        .toLowerCase()
        .includes(search) ||
      (flight.registration || '')
        .toLowerCase()
        .includes(search) ||
      (flight.from || '')
        .toLowerCase()
        .includes(search) ||
      (flight.to || '')
        .toLowerCase()
        .includes(search)

    const statusMatch =
      historyStatus === 'ALL' ||
      flight.status === historyStatus

    const userHistoryMatch =
  (userRole !== 'admin' &&
   userRole !== 'super_admin') ||
  historyUser === 'ALL' ||
  flight.createdByName === historyUser

    const flightDate =
      flight.createdAt
        ? new Date(flight.createdAt)
            .toISOString()
            .slice(0, 10)
        : ''

    const dateMatch =
      !historyDate ||
      flightDate === historyDate

    return (
      userMatch &&
      searchMatch &&
      statusMatch &&
      userHistoryMatch &&
      dateMatch
    )
  
  })
return (

  <div

    style={{
  minHeight: '100vh',
  display: 'flex',

  background: `
    radial-gradient(
      circle at 78% 12%,
      rgba(21,101,255,0.13) 0%,
      rgba(21,101,255,0.05) 22%,
      transparent 42%
    ),
    radial-gradient(
      circle at 45% 85%,
      rgba(35,78,125,0.10) 0%,
      transparent 38%
    ),
    linear-gradient(
      135deg,
      #061426 0%,
      #08182c 48%,
      #050f1d 100%
    )
  `,

  backgroundAttachment: 'fixed',
}}

  >
{/* SIDEBAR */}

<div
  style={{
    width: '250px',
    minHeight: '100vh',
    background: 'rgba(5, 16, 33, 0.94)',
    boxShadow: '8px 0 35px rgba(0,0,0,0.28)',
    backdropFilter: 'blur(16px)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    padding: '28px 22px',
    display: 'flex',
    flexDirection: 'column'
  }}
>

  {/* LOGO */}

  <div
    style={{
      marginBottom: '38px',
      textAlign: 'center'
    }}
  >
   <img
  src={logo}
  alt="OPERDAT Logo"
  style={{
    width: '220px',
    maxWidth: '100%',
    marginBottom: '10px'
  }}
/>

    <div
      style={{
        marginTop: '8px',
        fontSize: '9px',
        letterSpacing: '2px',
        color: '#7f91aa',
        fontWeight: '600'
      }}
    >
      FLIGHT OPERATIONS PLATFORM
    </div>
  </div>



{/* PASSENGER */}

{userRole !== 'freighter' && (
    <div
      onClick={() => setActiveMenu('Dashboard')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Dashboard'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Dashboard'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Dashboard'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight: activeMenu === 'Dashboard' ? '700' : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow:
          activeMenu === 'Dashboard'
            ? '0 0 20px rgba(21,101,255,0.12)'
            : 'none'
      }}
    >
      Passenger
    </div>
  )}


 {/* FLIGHT RECORDS */}

{(
  userRole === 'freighter' ||
  userRole === 'admin' ||
  userRole === 'super_admin'
) && (
    <div
      onClick={() => setActiveMenu('Flight Records')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Flight Records'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Flight Records'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Flight Records'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Flight Records'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Flight Records
    </div>
  )}
{/* FLIGHT HISTORY */}

{(
  userRole === 'freighter' ||
  userRole === 'admin' ||
  userRole === 'super_admin'
) && (
  <div
    onClick={() => setActiveMenu('Flight History')}
    style={{
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background:
        activeMenu === 'Flight History'
          ? 'rgba(21,101,255,0.16)'
          : 'transparent',
      border:
        activeMenu === 'Flight History'
          ? '1px solid rgba(21,101,255,0.40)'
          : '1px solid transparent',
      color:
        activeMenu === 'Flight History'
          ? '#ffffff'
          : '#b9c4d3',
      fontWeight:
        activeMenu === 'Flight History'
          ? '700'
          : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    
  >
    Flight History
  </div>
)}
 {userRole === 'super_admin' && (
  <div
    onClick={() => setActiveMenu('Platform Management')}
    style={{
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background:
        activeMenu === 'Platform Management'
          ? 'rgba(21,101,255,0.16)'
          : 'transparent',
      border:
        activeMenu === 'Platform Management'
          ? '1px solid rgba(21,101,255,0.40)'
          : '1px solid transparent',
      color:
        activeMenu === 'Platform Management'
          ? '#ffffff'
          : '#b9c4d3',
      fontWeight:
        activeMenu === 'Platform Management'
          ? '700'
          : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Platform Management
  </div>
)}
{/* AIRCRAFT MANAGEMENT */}

{userRole === 'admin' && (
  <div
    onClick={() =>
      setActiveMenu('Aircraft Management')
    }
    style={{
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background:
        activeMenu === 'Aircraft Management'
          ? 'rgba(21,101,255,0.16)'
          : 'transparent',
      border:
        activeMenu === 'Aircraft Management'
          ? '1px solid rgba(21,101,255,0.40)'
          : '1px solid transparent',
      color:
        activeMenu === 'Aircraft Management'
          ? '#ffffff'
          : '#b9c4d3',
      fontWeight:
        activeMenu === 'Aircraft Management'
          ? '700'
          : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Aircraft Management
  </div>
)}

  {/* FREIGHTER LOADSHEET */}

  {(
  userRole === 'freighter' ||
  userRole === 'admin' ||
  userRole === 'student' ||
  userRole === 'super_admin'
) && (
    <div
      onClick={() =>
        setActiveMenu('FreighterLoadsheet')
      }
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'FreighterLoadsheet'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'FreighterLoadsheet'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'FreighterLoadsheet'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'FreighterLoadsheet'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Freighter Loadsheet
    </div>
  )}


  {/* PASSENGER LOADSHEET */}

  {(
  userRole === 'passenger' ||
  userRole === 'admin' ||
  userRole === 'student' ||
  userRole === 'super_admin'
) && (
    <div
      onClick={() => setActiveMenu('Loadsheet')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Loadsheet'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Loadsheet'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Loadsheet'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Loadsheet'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Passenger Loadsheet
    </div>
  )}


  {/* FUEL */}

  <div
    onClick={() => setActiveMenu('Fuel')}
    style={{
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background:
        activeMenu === 'Fuel'
          ? 'rgba(21,101,255,0.16)'
          : 'transparent',
      border:
        activeMenu === 'Fuel'
          ? '1px solid rgba(21,101,255,0.40)'
          : '1px solid transparent',
      color:
        activeMenu === 'Fuel'
          ? '#ffffff'
          : '#b9c4d3',
      fontWeight:
        activeMenu === 'Fuel'
          ? '700'
          : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Fuel Load
  </div>


  {/* AIRCRAFT */}

  {userRole !== 'freighter' && (
    <div
      onClick={() => setActiveMenu('Aircraft')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Aircraft'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Aircraft'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Aircraft'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Aircraft'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Aircraft Data
    </div>
  )}


  {/* SEAT MAP */}

  {userRole !== 'freighter' && (
    <div
      onClick={() => setActiveMenu('Seat Map')}
      style={{
        marginBottom: '10px',
        padding: '12px 15px',
        borderRadius: '9px',
        background:
          activeMenu === 'Seat Map'
            ? 'rgba(21,101,255,0.16)'
            : 'transparent',
        border:
          activeMenu === 'Seat Map'
            ? '1px solid rgba(21,101,255,0.40)'
            : '1px solid transparent',
        color:
          activeMenu === 'Seat Map'
            ? '#ffffff'
            : '#b9c4d3',
        fontWeight:
          activeMenu === 'Seat Map'
            ? '700'
            : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Seat Map
    </div>
  )}


  {/* WEATHER */}

  <div
    onClick={() => setActiveMenu('Settings')}
    style={{
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background:
        activeMenu === 'Settings'
          ? 'rgba(21,101,255,0.16)'
          : 'transparent',
      border:
        activeMenu === 'Settings'
          ? '1px solid rgba(21,101,255,0.40)'
          : '1px solid transparent',
      color:
        activeMenu === 'Settings'
          ? '#ffffff'
          : '#b9c4d3',
      fontWeight:
        activeMenu === 'Settings'
          ? '700'
          : '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Weather Center
  </div>
{/* CURRENT USER */}

{currentUser && (
  <div
    style={{
      marginTop: 'auto',
      marginBottom: '10px',
      padding: '12px 15px',
      borderRadius: '9px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)'
    }}
  >
    <div
      style={{
        fontSize: '10px',
        color: '#66758a',
        letterSpacing: '1px',
        marginBottom: '5px'
      }}
    >
      SIGNED IN AS
    </div>

    <div
      style={{
        fontSize: '13px',
        color: '#ffffff',
        fontWeight: '600'
      }}
    >
      {currentUser.fullName || currentUser.email}
    </div>

    <div
      style={{
        fontSize: '11px',
        color: '#8f9bad',
        marginTop: '3px',
        textTransform: 'capitalize'
      }}
    >
      {currentUser.role}
    </div>
  </div>
)}

  {/* SIGN OUT */}

  <div
   onClick={async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('SIGN OUT ERROR:', error)
    return
  }

  localStorage.removeItem('user')
  setLogged(false)
  setUserRole(null)
  setCurrentUser(null)
  setActiveMenu('Dashboard')
}}
    style={{
      marginTop: '0',
      padding: '12px 15px',
      borderRadius: '9px',
      background: 'rgba(255,255,255,0.035)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#8f9bad',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    Sign Out
  </div>

</div>
{/* MAIN CONTENT */}
{
activeMenu === 'FreighterLoadsheet'
&& (

<div
style={{

padding:'40px',

borderRadius:'20px',

background:
'linear-gradient(145deg, rgba(8,24,44,0.96), rgba(5,16,31,0.96))',

border:
'1px solid rgba(255,255,255,0.08)',

boxShadow:
'0 12px 35px rgba(0,0,0,0.20)',

textAlign:'center'

}}

>

{/* HEADER */}

<div
style={{
marginBottom:'28px'
}}
>

<div
style={{
fontSize:'12px',
letterSpacing:'2.5px',
fontWeight:'700',
color:'#4f8cff',
marginBottom:'8px'
}}
>
OPERDAT · CARGO OPERATIONS
</div>

<h1
style={{
color:'#f4f7fb',
margin:'0 0 8px 0',
fontSize:'38px',
fontWeight:'700',
letterSpacing:'-0.5px'
}}
>
B737-800 CF
</h1>

<div
style={{
fontSize:'14px',
color:'#8fa0b7',
letterSpacing:'0.5px'
}}
>
Cargo Weight & Balance Module
</div>

</div>


{/* AIRCRAFT SELECTOR + CLEAR */}

<div
style={{
display:'flex',
justifyContent:'center',
alignItems:'center',
gap:'12px',
marginBottom:'28px',
flexWrap:'wrap'
}}
>

<select

value={
selectedCargoAircraft.registration
}

onChange={(e)=>{

setSelectedCargoAircraft(
  cargoAircraftFleet.find(
    a =>
      a.registration ===
      e.target.value
  )
)

}}

style={{

padding:'11px 16px',

borderRadius:'9px',

background:'#08182c',

color:'#f4f7fb',

border:
'1px solid rgba(21,101,255,0.30)',

fontSize:'13px',

fontWeight:'600',

cursor:'pointer',

outline:'none'

}}

>

{

cargoAircraftFleet.map(
  a => (
    <option

key={a.registration}

value={a.registration}

>

{a.registration}

</option>

)

)

}

</select>


<button

onClick={
clearCargo
}

style={{

padding:'10px 18px',

borderRadius:'9px',

border:
'1px solid rgba(255,90,90,0.28)',

background:
'rgba(255,70,70,0.06)',

color:'#ff7a7a',

cursor:'pointer',

fontWeight:'700',

fontSize:'11px',

letterSpacing:'0.8px'

}}

>

CLEAR ALL

</button>

</div>


{/* FLIGHT INFORMATION */}

<div
style={{

display:'flex',

justifyContent:'center',

gap:'26px',

marginBottom:'22px',

fontSize:'13px',

color:'#8fa0b7',

flexWrap:'wrap',

alignItems:'flex-start'

}}

>

{/* FROM */}

<div>

<div
style={{
fontSize:'10px',
letterSpacing:'1.3px',
marginBottom:'6px',
fontWeight:'700',
color:'#7f8da0'
}}
>
FROM
</div>

<input

value={cargoFlightFrom}

onChange={(e)=>

setCargoFlightFrom(

e.target.value.toUpperCase()

)

}

style={{

width:'82px',

textAlign:'center',

padding:'8px',

borderRadius:'7px',

background:
'rgba(255,255,255,0.04)',

border:
'1px solid rgba(255,255,255,0.10)',

color:'#f4f7fb',

fontWeight:'700',

outline:'none'

}}

/>

</div>


{/* TO */}

<div>

<div
style={{
fontSize:'10px',
letterSpacing:'1.3px',
marginBottom:'6px',
fontWeight:'700',
color:'#7f8da0'
}}
>
TO
</div>

<input

value={cargoFlightTo}

onChange={(e)=>

setCargoFlightTo(

e.target.value.toUpperCase()

)

}

style={{

width:'82px',

textAlign:'center',

padding:'8px',

borderRadius:'7px',

background:
'rgba(255,255,255,0.04)',

border:
'1px solid rgba(255,255,255,0.10)',

color:'#f4f7fb',

fontWeight:'700',

outline:'none'

}}

/>

</div>


{/* FLIGHT */}

<div>

<div
style={{
fontSize:'10px',
letterSpacing:'1.3px',
marginBottom:'6px',
fontWeight:'700',
color:'#7f8da0'
}}
>
FLIGHT
</div>

<input

value={cargoFlightNumber}

onChange={(e)=>

setCargoFlightNumber(

e.target.value.toUpperCase()

)

}

style={{

width:'105px',

textAlign:'center',

padding:'8px',

borderRadius:'7px',

background:
'rgba(255,255,255,0.04)',

border:
'1px solid rgba(255,255,255,0.10)',

color:'#f4f7fb',

fontWeight:'700',

outline:'none'

}}

/>

</div>


{/* WEATHER */}

<div

style={{

minWidth:'320px',

maxWidth:'440px',

textAlign:'left',

padding:'10px 14px',

borderRadius:'10px',

background:
'rgba(255,255,255,0.025)',

border:
'1px solid rgba(255,255,255,0.06)',

fontSize:'12px',

lineHeight:'1.45'

}}

>

<div>

<span
style={{
color:'#4f8cff',
fontWeight:'700'
}}
>
DEP {cargoFlightFrom || '----'}:
</span>{' '}

<span
style={{
color:'#aeb9c8'
}}
>
{cargoMetarFrom || '---'}
</span>

</div>


<div
style={{
marginTop:'5px'
}}
>

<span
style={{
color:'#4f8cff',
fontWeight:'700'
}}
>
ARR {cargoFlightTo || '----'}:
</span>{' '}

<span
style={{
color:'#aeb9c8'
}}
>
{cargoMetarTo || '---'}
</span>

</div>

</div>

</div>


{/* ACTIONS */}

<div
style={{
display:'flex',
justifyContent:'center',
gap:'10px',
marginBottom:'18px',
flexWrap:'wrap'
}}
>

<button

onClick={saveCurrentFreighterFlight}

style={{

padding:'10px 22px',

borderRadius:'9px',

border:
'1px solid rgba(21,101,255,0.42)',

background:
'rgba(21,101,255,0.15)',

color:'#75a5ff',

fontWeight:'700',

cursor:'pointer',

letterSpacing:'0.7px',

fontSize:'11px'

}}

>

{activeFreighterFlightId
? 'UPDATE FLIGHT'
: 'SAVE FLIGHT'}

</button>


<button

onClick={newFreighterFlight}

style={{

padding:'10px 22px',

borderRadius:'9px',

border:
'1px solid rgba(255,255,255,0.12)',

background:
'rgba(255,255,255,0.04)',

color:'#aeb9c8',

fontWeight:'700',

cursor:'pointer',

letterSpacing:'0.7px',

fontSize:'11px'

}}

>

NEW FLIGHT

</button>

</div>


{/* UTC */}

<div
style={{
marginBottom:'28px',
fontSize:'11px',
letterSpacing:'1.2px',
color:'#7f8da0'
}}
>

<span
style={{
fontWeight:'700',
color:'#aeb9c8'
}}
>
UTC
</span>

&nbsp;·&nbsp;

{
new Date().toLocaleTimeString(

'en-GB',

{

timeZone:'UTC',

hour:'2-digit',

minute:'2-digit'

}

) + 'Z'
}

</div>
<div
style={{

display:'grid',

gridTemplateColumns:

'repeat(5,1fr)',

gap:'12px'

}}

>

{

selectedCargoAircraft?.cargoConfig?.mainDeck?.map((position ) => (

<div key={position.id}

style={{

padding:'20px',

minHeight:'140px',

borderRadius:'12px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)',

display:'flex',

alignItems:'center',

justifyContent:'center'

}}

>

<div>

<div
style={{

fontWeight:'700',

fontSize:'22px',

marginBottom:'18px'

}}

>

{position.id}

</div>

<input

type="number"

value={

cargoWeights[

position.id

]

||

''

}

onChange={(e)=>

setCargoWeights({

...cargoWeights,

[position.id]:

Number(

e.target.value

)

||

0

})

}

placeholder="0"

style={{

width:'90px',

padding:'10px',

textAlign:'center',

background:

'rgba(255,255,255,0.06)',

border:

'1px solid rgba(255,255,255,0.08)',

borderRadius:'8px',

color:'#00ff88',

fontSize:'18px',

marginBottom:'12px'

}}

/>
<div

style={{

marginTop:'12px',

fontSize:'18px',

color:'#00ff88',

fontWeight:'700'

}}

>

{

cargoWeights[

position.id

]

||

0

}

kg

</div>
<div
style={{

fontSize:'12px',

opacity:0.55

}}

>

<div

style={{

fontSize:'12px',

marginTop:'10px',

color:

(

cargoWeights[

position.id

]

||

0

)

>

position.max

?

'#ff4444'

:

'#b8c0cc'

}}

>

MAX {

position.max

} kg
<div

style={{

fontSize:'11px',

opacity:0.5,

marginTop:'4px'

}}

>

ARM {

position.arm

}

</div>
</div>

{

(

cargoWeights[

position.id

]

||

0

)

>

position.max

&& (

<div

style={{

marginTop:'8px',

fontSize:'12px',

fontWeight:'700',

color:'#ff4444'

}}

>

LIMIT EXCEEDED

</div>

)

}

</div>

</div>

</div>

)

)

}
<div

style={{

marginTop:'40px'

}}

>

<div
  style={{
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:'15px'
  }}
>

  <h2
    style={{
      margin:0
    }}
  >
    LOWER DECK
  </h2>

  <button
    onClick={() =>
      generateCargoLoadOrder({

        registration:
          selectedCargoAircraft.registration,

        cargoFlightFrom,

        cargoFlightTo,

        cargoFlightNumber,

        cargoWeights,

        mainCargo,

        lowerCargo,

        totalCargo
      })
    }

    style={{
      padding:'8px 14px',

      borderRadius:'8px',

      border:
        '1px solid rgba(0,255,140,0.30)',

      background:
        'rgba(0,255,140,0.08)',

      color:'#00ff88',

      fontWeight:'700',

      cursor:'pointer'
    }}
  >
    GENERATE LOAD ORDER
  </button>

</div>

<div

style={{

display:'grid',

gridTemplateColumns:

'repeat(3,1fr)',

gap:'12px',

maxWidth:'360px',

margin:'0 auto'

}}

>

{

selectedCargoAircraft
?.cargoConfig
?.lowerDeck
?.map(

(position)=>(

<div
key={position.id}
>

<div
style={{
fontWeight:'700',
fontSize:'22px',
marginBottom:'18px'
}}
>

{position.id}

</div>
<input

type="number"

value={

cargoWeights[

position.id

]

||

''

}

onChange={(e)=>

setCargoWeights({

...cargoWeights,

[position.id]:

Number(

e.target.value

)

||

0

})

}

placeholder="0"

style={{

width:'90px',

width:'90px'

}}

/>

<div

style={{

marginTop:'10px',

fontSize:'12px',

opacity:0.7

}}

>

MAX

{

position.max

}

kg

</div>

<div

style={{

fontSize:'12px',

opacity:0.55

}}

>

<div

style={{

fontSize:'12px',

marginTop:'10px',

color:

(

cargoWeights[

position.id

]

||

0

)

>

position.max

?

'#ff4444'

:

'#b8c0cc'

}}

>

MAX {

position.max

} kg
<div

style={{

fontSize:'11px',

opacity:0.5,

marginTop:'4px'

}}

>

ARM {

position.arm

}

</div>
</div>

{

(

cargoWeights[

position.id

]

||

0

)

>

position.max

&& (

<div

style={{

marginTop:'8px',

fontSize:'12px',

fontWeight:'700',

color:'#ff4444'

}}

>

LIMIT EXCEEDED

</div>

)

}

</div>

</div>
)

)

}

</div>

</div>
</div>
<div

style={{

marginTop:'40px',

padding:'24px',

borderRadius:'16px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)'

}}

>
<div

style={{

marginTop:'40px',

padding:'24px',

borderRadius:'16px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)',

marginBottom:'20px'

}}

>

<h2>

AIRCRAFT DATA

</h2>

<div

style={{

display:'flex',

gap:'15px',

flexDirection:'column',

alignItems:'center'

}}

>

<div style={{display:'flex'}}>

<span style={{width:'100px'}}>

BASIC

</span>

<strong>

{

selectedCargoAircraft.basicWeight

}

kg

</strong>

</div>

<div style={{display:'flex'}}>

<span style={{width:'100px'}}>

MAX ZFW

</span>

<strong>

{

selectedCargoAircraft.maxZFW

}

kg

</strong>

</div>
<div
  style={{
    display:'flex',
    alignItems:'center',
    marginBottom:'6px'
  }}
>

  <span style={{width:'100px'}}>
    MAX TOW
  </span>

  <strong
    style={{
      width:'100px'
    }}
  >
    {selectedCargoAircraft.maxTOW} kg
  </strong>


  <span
    style={{
      marginLeft:'25px',
      marginRight:'10px'
    }}
  >
    ALLOWED MAX TOW 
  </span>


  <input
    type="number"

    value={performanceMaxTow}

    onChange={(e) =>
      setPerformanceMaxTow(
        e.target.value
      )
    }

    placeholder="kg"

    style={{
      width:'90px',
      padding:'5px 8px',

      borderRadius:'6px',

      border:
        '1px solid rgba(255,255,255,0.15)',

      background:
        'rgba(255,255,255,0.05)',

      color:'#ffffff',

      textAlign:'center'
    }}
  />

  <span
    style={{
      marginLeft:'6px'
    }}
  >
    kg
  </span>

</div>

<div style={{display:'flex'}}>

<span style={{width:'100px'}}>



MAX LW

</span>

<strong>

{

selectedCargoAircraft.maxLW

}

kg

</strong>

</div>

</div>
<div
  style={{
    marginTop: '6px',
    fontSize: '15px',
    color: '#b8c0cc'
  }}
>
  TOW LIMIT APPLIED:{' '}
  <strong
    style={{
      color: '#00ff88'
    }}
  >
    {effectiveMaxTow} kg
  </strong>
</div>
</div>

<h2>

CARGO SUMMARY

</h2>

<div

style={{

display:'flex',

gap:'25px',

alignItems:'center',

marginBottom:'10px'

}}

>
  
<span>

BASIC WEIGHT

</span>

<strong>

{selectedCargoAircraft.basicWeight} kg

</strong>

</div>

<div

style={{ display:'flex', gap:'130px', alignItems:'center', marginBottom:'10px'}}

>
<span>

MAIN

</span>

<strong>

{mainCargo} kg

</strong>

</div>

<div

style={{ display:'flex', gap:'120px', alignItems:'center', marginBottom:'10px'}}
>
<span>
LOWER
</span>
<strong>
{lowerCargo} kg

</strong>

</div>

<div
style={{display:'flex', gap:'70px', alignItems:'center', marginBottom:'10px'}}
>

<span>
TRAFFIC LOAD
</span>

<strong>
{totalCargo} kg
</strong>
 
</div>
<div
style={{

display:'flex',

gap:'100px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

ZFW

</span>

<div
style={{

display:'flex',

gap:'50px',

alignItems:'center'

}}
>

<strong>

{cargoZfw} kg

</strong>

<strong
style={{

color:

cargoZfw >

selectedCargoAircraft.maxZFW

?

'#ff4444'

:

'#00ff88'

}}
>

{

cargoZfw >

selectedCargoAircraft.maxZFW

?

'🔴 LIMIT EXCEEDED'

:

'🟢 OK'

}

</strong>

</div>

</div>
<div
style={{

display:'flex',

gap:'80px',

alignItems:'center',

marginBottom:'10px'

}}
>
<span>
RAMP FUEL
</span>
<strong>
{fuel} kg
</strong>

</div>
<div
style={{

display:'flex',

gap:'30px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

RAMP WEIGHT

</span>

<strong>

{

rampWeight

}

kg

</strong>

</div>
<div
style={{

display:'flex',

gap:'100px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

TAXI FUEL

</span>

<strong>

{

taxiFuel

}

kg

</strong>

</div>
<div
  style={{
    display:'flex',
    gap:'100px',
    alignItems:'center',
    marginBottom:'10px'
  }}
>

  <span>
    TAKEOFF FUEL
  </span>

  <strong>
    {Number(
      fuelData.takeoffFuel || 0
    ).toFixed(0)}
    kg
  </strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'140px'
}}

>

TAKEOFF WEIGHT

</span>

<strong
style={{
  width:'110px'
}}
>

{weightData.takeoffWeight} kg

</strong>

<strong
style={{

color:
  weightData.takeoffWeight >
  effectiveMaxTow
    ? '#ff4444'
    : '#00ff88'

}}
>

{

weightData.takeoffWeight >
effectiveMaxTow
  ? '🔴 LIMIT EXCEEDED'
  : '🟢 OK'

}

</strong>

</div>
<div
style={{

display:'flex',

gap:'100px',

alignItems:'center',

marginBottom:'10px'

}}
>

<span>

TRIP FUEL

</span>

<strong>

{tripFuel}

kg

</strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'140px'
}}
>

LANDING WEIGHT

</span>

<strong
style={{
  width:'110px'
}}
>

{weightData.landingWeight} kg

</strong>

<strong
style={{

color:

weightData.landingWeight >

selectedCargoAircraft.maxLW

?

'#ff4444'

:

'#00ff88'

}}
>

{

weightData.landingWeight >

selectedCargoAircraft.maxLW

?

'🔴 LIMIT EXCEEDED'

:

'🟢 OK'

}

</strong>

</div>

<div
style={{
  fontSize:'18px',
  fontWeight:'700',
  marginBottom:'15px',
  marginTop:'10px'
}}
>

LOAD INDEX

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'100px'
}}
>

BASIC INDEX

</span>

<strong>

{cargoEffectiveBasicIndex.toFixed(2)}

</strong>

</div>

<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'

}}

>

<span>

LOWER DECK INDEX

</span>

<strong>

{

lowerDeckIndex

}

</strong>

</div>
<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'

}}

>

<span>

MAIN DECK INDEX

</span>

<strong>

{

Number(

mainDeckIndex

)

.toFixed(

2

)

}

</strong>

</div>

<div
  style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'
  }}
>
  <span>TOTAL DECK INDEX</span>

  <strong>
    {totalCargoIndex.toFixed(2)}
  </strong>
</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'85px'
}}
>

ZFW INDEX

</span>

<strong>

{cargoZfwIndex.toFixed(2)}

</strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'120px'
}}
>

TAKEOFF INDEX

</span>

<strong>

{cargoTowIndex.toFixed(2)}

</strong>

</div>
<div
style={{
  display:'flex',
  alignItems:'center',
  marginBottom:'10px'
}}
>

<span
style={{
  width:'120px'
}}
>

LANDING INDEX

</span>

<strong>

{cargoLandingIndex.toFixed(2)}

</strong>

</div>
<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.08)'
  }}
>

  <div
    style={{
      minWidth: '110px',
      padding: '14px 18px',
      textAlign: 'center',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}
  >

    <div
      style={{
        fontSize: '12px',
        opacity: 0.6,
        marginBottom: '8px'
      }}
    >
      ZFW CG
    </div>

    <strong
      style={{
        fontSize: '20px'
      }}
    >
      {cargoZfwCg.toFixed(2)} %
    </strong>

  </div>


  <div
    style={{
      minWidth: '110px',
      padding: '14px 18px',
      textAlign: 'center',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}
  >

    <div
      style={{
        fontSize: '12px',
        opacity: 0.6,
        marginBottom: '8px'
      }}
    >
      TOW CG
    </div>

    <strong
      style={{
        fontSize: '20px'
      }}
    >
      {cargoTowCg.toFixed(2)} %
    </strong>

  </div>


  <div
    style={{
      minWidth: '110px',
      padding: '14px 18px',
      textAlign: 'center',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}
  >

    <div
      style={{
        fontSize: '12px',
        opacity: 0.6,
        marginBottom: '8px'
      }}
    >
      LW CG
    </div>

    <strong
      style={{
        fontSize: '20px'
      }}
    >
      {cargoLandingCg.toFixed(2)} %
    </strong>

  </div>

</div>
<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25px',
    marginBottom: '20px'
  }}
>

  <button
    onClick={() => {
if (!freighterPrintValid) {

  let message =
    'LOADSHEET CANNOT BE GENERATED\n\n'

  if (cargoPositionOverLimit) {

    message +=
      `${cargoPositionOverLimit.id} LOAD LIMIT EXCEEDED\n`

  }

  if (
    cargoZfw >
    selectedCargoAircraft.maxZFW
  ) {

    message +=
      'MAXIMUM ZFW EXCEEDED\n'
  }

 if (
  weightData.takeoffWeight >
  effectiveMaxTow
) {

  message +=
    `ALLOWED MAX TOW EXCEEDED - LIMIT ${effectiveMaxTow} kg\n`
}

  if (
    weightData.landingWeight >
    selectedCargoAircraft.maxLW
  ) {

    message +=
      'MAXIMUM LANDING WEIGHT EXCEEDED\n'
  }

  if (!cargoZfwInsideEnvelope) {

    message +=
      'ZFW CG OUT OF ENVELOPE\n'
  }

  if (!cargoTowInsideEnvelope) {

    message +=
      'TOW CG OUT OF ENVELOPE\n'
  }

  if (!cargoLwInsideEnvelope) {

    message +=
      'LW CG OUT OF ENVELOPE\n'
  }

  alert(message)

  return
}
  generateFreighterLoadsheet({

    registration:
      selectedCargoAircraft.registration,
      cargoFlightFrom,
cargoFlightTo,
cargoFlightNumber,
preparedBy: currentUser?.fullName || currentUser?.email || 'Unknown User',
cargoMetarFrom,
  cargoMetarTo,
basicWeight:
  selectedCargoAircraft.basicWeight,


basicIndex:
  selectedCargoAircraft.basicIndex,

maxZFW:
  selectedCargoAircraft.maxZFW,

maxTOW:
  selectedCargoAircraft.maxTOW,

maxLW:
  selectedCargoAircraft.maxLW,
    mainCargo,

    lowerCargo,

    totalCargo,

    cargoZfw,

    rampWeight,

    takeoffWeight:
      weightData.takeoffWeight,

    landingWeight:
      weightData.landingWeight,

    mainDeckIndex,

    lowerDeckIndex,

    totalCargoIndex,

    cargoZfwIndex,

    cargoTowIndex,

    cargoLandingIndex,

    cargoZfwCg,

    cargoTowCg,

    cargoLandingCg,

    blockFuel: fuel,

    taxiFuel,

    takeoffFuel:
      fuelData.takeoffFuel,

    tripFuel,

    remainingFuel:
      fuelData.remainingFuel,

    cargoWeights

  })

}}

    style={{
      padding: '14px 28px',
      borderRadius: '10px',
      border: '1px solid rgba(0,255,140,0.25)',
      background: 'rgba(0,255,140,0.10)',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '1px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}

    onMouseEnter={(e) => {
      e.currentTarget.style.background =
        'rgba(0,255,140,0.18)'

      e.currentTarget.style.boxShadow =
        '0 0 20px rgba(0,255,140,0.15)'
    }}

    onMouseLeave={(e) => {
      e.currentTarget.style.background =
        'rgba(0,255,140,0.10)'

      e.currentTarget.style.boxShadow =
        'none'
    }}
  >

    GENERATE FREIGHTER LOADSHEET

  </button>

</div>

<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginBottom:'10px'

}}

>
  
<span>

Loaded

</span>

<strong>

{

loadedPercent.toFixed(1)

}

%

</strong>

</div>
<div

style={{

marginTop:'20px'

}}

>

<div

style={{

height:'12px',

borderRadius:'8px',

background:

'rgba(255,255,255,0.08)',

overflow:'hidden'

}}

>

<div

style={{

width:
`${Math.min(
  loadedPercent,
  100
)}%`,

height:'100%',

background:
  totalCargo
  >
  payloadCapacity
  ?
  '#ff4444'
  :
  '#00ff88'

}}

></div>

</div>
<span>

AVAILABLE PAYLOAD

</span>

<strong>

{

availablePayload

}

kg

</strong>

</div>
<div

style={{

display:'flex',

gap:'8px',

alignItems:'center',

marginTop:'16px',

fontSize:'18px',

color:

totalCargo

>

payloadCapacity

?

'#ff4444'

:

'#00ff88'

}}

>

<div

style={{

marginTop:'8px',

fontSize:'14px'

}}

>

{

loadedPercent.toFixed(1)

}

%

</div>
<FreighterEnvelope
  zfw={cargoZfw}
  zfwCg={cargoZfwCg}
  zfwIndex={cargoZfwIndex}

  tow={weightData.takeoffWeight}
  towCg={cargoTowCg}
  towIndex={cargoTowIndex}

  lw={weightData.landingWeight}
  lwCg={cargoLandingCg}
  lwIndex={cargoLandingIndex}
/>
</div>
</div>
</div>
)

}

{

activeMenu ===

'Seat Map'

&& (

<div

style={{

padding:'30px',

width:'100%',

display:'flex',

flexDirection:'column',

alignItems:'center'

}}

>

<h1

style={{

marginBottom:'25px'

}}

>

SEAT MAP

</h1>
<div

style={{

marginBottom:'25px',

padding:'15px',

borderRadius:'12px',

background:
'linear-gradient(145deg, rgba(8,24,44,0.94), rgba(5,16,31,0.94))',

display:'flex',

gap:'30px'

}}

>
  <div
style={{

fontSize:'14px',

fontWeight:'bold',

marginBottom:'10px'

}}

>

LOAD CABINS

</div>

<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    minWidth: '120px',
    padding: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.02)'
  }}
>
FWD CABIN

<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  AD
  <input
    type="number"
    value={fwdAdults === 0 ? '' : fwdAdults}
    onChange={(e) =>
      setFwdAdults(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  CH
  <input
    type="number"
    value={fwdChildren === 0 ? '' : fwdChildren}
    onChange={(e) =>
      setFwdChildren(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  INF
  <input
    type="number"
    value={fwdInfants === 0 ? '' : fwdInfants}
    onChange={(e) =>
      setFwdInfants(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

</div>
MID CABIN

<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  AD
  <input
    type="number"
    value={midAdults === 0 ? '' : midAdults}
    onChange={(e) =>
      setMidAdults(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  CH
  <input
    type="number"
    value={midChildren === 0 ? '' : midChildren}
    onChange={(e) =>
      setMidChildren(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  INF
  <input
    type="number"
    value={midInfants === 0 ? '' : midInfants}
    onChange={(e) =>
      setMidInfants(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

</div>
AFT CABIN

<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  AD
  <input
    type="number"
    value={aftAdults === 0 ? '' : aftAdults}
    onChange={(e) =>
      setAftAdults(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  CH
  <input
    type="number"
    value={aftChildren === 0 ? '' : aftChildren}
    onChange={(e) =>
      setAftChildren(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

  INF
  <input
    type="number"
    value={aftInfants === 0 ? '' : aftInfants}
    onChange={(e) =>
      setAftInfants(parseInt(e.target.value) || 0)
    }
    style={{ width: '55px' }}
  />

</div>

</div>

<div

style={{

display:'flex',

flexDirection:'column',

gap:'8px'

}}

>

<button

onClick={

loadCabins

}

>

LOAD CABINS

</button>

<button

onClick={()=>

setSelectedSeats(

[]

)

}

>

CLEAR ALL

</button>

</div>

<div>

TOTAL PAX:
{' '}

{selectedSeats.length}

</div>


<div>

FWD:
{' '}

{forwardSeats}

</div>

<div>

MID:
{' '}

{midSeats}

</div>

<div>

AFT:
{' '}

{aftSeats}

</div>

</div>
<div

style={{

width:'100%',

maxWidth:'600px'

}}

>

<SeatMap

selectedSeats={

selectedSeats

}

toggleSeat={

toggleSeat

}

/>

</div>

</div>

)

}

{activeMenu === 'Aircraft' && (

<div

style={{

flex:1,

padding:'40px'

}}

>

<h1

style={{

fontSize:'42px',

marginBottom:'10px'

}}

>

AIRCRAFT DATA

</h1>

<p

style={{

color: '#4f8cff',

marginBottom:'30px'

}}

>

Aircraft Information

</p>


<div

style={{

background:'rgba(255,255,255,.04)',

border:'1px solid rgba(255,255,255,.08)',

borderRadius:'18px',

padding:'25px',

maxWidth:'620px'

}}

>

<h3>

AIRCRAFT SUMMARY

</h3>

<select

value={selectedAircraft.registration}

onChange={(e)=>{

const paxAircraft =
aircraftDatabase.find(
a=>a.registration===e.target.value
)

const cargoAircraft =
  cargoAircraftFleet.find(
    a => a.registration === e.target.value
  )
const [
  performanceMaxTow,
  setPerformanceMaxTow
] = useState('')
console.log('PAX', paxAircraft)
console.log('CARGO', cargoAircraft)

if(paxAircraft)
setSelectedAircraft(paxAircraft)

if(cargoAircraft)
setSelectedCargoAircraft(cargoAircraft)

}}

style={{

padding:'12px',

marginBottom:'20px',

borderRadius:'10px',

background:'#1f2937',

color:'white',

border:'1px solid #374151',

outline:'none'

}}

>

{

[
  ...aircraftDatabase,
  ...cargoAircraftFleet
].map(a => (

<option

key={a.registration}

value={a.registration}

style={{

background:'#1f2937',

color:'white'

}}

>

{a.registration}

</option>

))

}

</select>
<div

style={{

display:'flex',

justifyContent:'center',

marginBottom:'25px'

}}

>

<img

src={
  aircraftSummary.type.includes('CF')
    ? b737cfPerfil
    : b737Perfil
}

style={{

width:'320px',

maxHeight:'240px',

objectFit:'contain',

display:'block',

margin:'0 auto'

}}

/>

</div>
<div

style={{

display:'grid',

gridTemplateColumns:'1fr 1fr',

gap:'20px'

}}

>

<div>

REG<br/>

<strong>

{aircraftSummary.registration}

</strong>

</div>



<div>

TYPE<br/>

<strong>

{aircraftSummary.type}

</strong>

</div>


<div>

BASIC WT<br/>

<strong>

{effectiveBasicWeight}

kg

</strong>

</div>


<div>

BASIC INDEX<br/>

<strong>

{effectiveBasicIndex?.toFixed(1)}

</strong>

</div>


<div>

CREW<br/>

<strong>

{crewConfiguration||'-'}

</strong>

</div>


<div>
MRW<br/>

<strong>

{

aircraftSummary.maxRW

}

kg

</strong>

</div>


<div>
MTOW<br/>

<strong>

{

aircraftSummary.maxTOW

}

kg

</strong>

</div>


<div>

MLW<br/>

<strong>

{

aircraftSummary.maxLW

}

kg

</strong>

</div>


<div>

MZFW<br/>

<strong>

{

aircraftSummary.maxZFW

}

kg

</strong>

</div>

</div>

</div>

</div>

)}
{activeMenu === 'Dashboard' && (

  <div

    style={{

      flex: 1,

      padding: '40px'

    }}

  >
<div

  style={{

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center'

  }}

>
      <div>

        <p

          style={{

            color: '#4f8cff',

            letterSpacing: '3px',

            fontSize: '13px',

            marginBottom: '8px'

          }}

        >

          OPERDAT · FLIGHT OPERATIONS

        </p>

        <h1

          style={{

            fontSize: '42px',

            margin: 0,

            fontWeight: '700'

          }}

        >

          {aircraftSummary.registration}

        </h1>

        <p

          style={{

            color: '#b8c0cc',

            marginTop: '10px'

          }}

        >

          {aircraftSummary.type}

        </p>
<div

style={{

marginTop:'20px',

display:'flex',

gap:'12px',

alignItems:'center',

flexWrap:'wrap'

}}

>

<input

placeholder="FROM-ICAO"

value={flightFrom}

onChange={(e)=>

setFlightFrom(

e.target.value

)

}

style={{

width:'90px'

}}

>

</input>

<input

placeholder="TO-ICAO"

value={flightTo}

onChange={(e)=>

setFlightTo(

e.target.value

)

}

style={{

width:'90px'

}}

>

</input>

<input

placeholder="FLIGHT NR"

value={flightNumber}

onChange={(e)=>

setFlightNumber(

e.target.value

)

}

style={{

width:'120px'

}}

>

</input>

</div>
      </div>
<img

  src={aircraftImage}

  alt="aircraft"

  style={{

    width: '340px',

    objectFit: 'contain',

    filter:
    'drop-shadow(0 0 22px rgba(21,101,255,0.20))'

  }}

/>
      <select

        value={aircraftSummary.registration}

        onChange={(e) => {

          const aircraft =
            aircraftDatabase.find(
              acft =>
                acft.registration === e.target.value
            )

          setSelectedAircraft(aircraft)

        }}
style={{

background:'#08182c',

color:'#ffffff',

border:'1px solid rgba(255,255,255,0.12)',

padding:'10px 14px',

borderRadius:'10px',

fontSize:'14px',

cursor:'pointer',
boxShadow:
'0 0 18px rgba(21,101,255,0.12)'
}}

>
      

        {
        aircraftDatabase.map((aircraft) => (

          <option

            key={aircraft.registration}

            value={aircraft.registration}

          >

            {aircraft.registration}

          </option>

        ))}

      </select>

    </div>

    <div

      style={{

        display: 'flex',

        gap: '20px',

        marginTop: '40px',

        flexWrap: 'wrap'

      }}

    >
     

<StatusCard

title="Basic WT"

value={effectiveBasicWeight}

unit="kg"

status={true}
subtitle={

`${crewConfiguration}

· Δ ${basicWeightDelta} kg`

}
/>

<StatusCard

title="BWI"

value={effectiveBasicIndex?.toFixed(2)}

unit="UI"

status={true}

/>
 <StatusCard
        title="ZFW"
        value={

zfw +

(extraCrew *85)+

(catering ? 250 : 0)

}
        unit="kg"
        status={zfwStatus}
        limit={selectedAircraft.maxZFW}
      />
<StatusCard

title="ZFI"

value={zfi.toFixed(1)}

unit="IU"status={true}

/>
 <StatusCard
title="ZF CG"

value={
zfCg?.toFixed?.(1)
}

unit="%"

status={true}
/>
<StatusCard

title="BLOCK FUEL"

value={fuel}

unit="kg"

status={true}

/>
<StatusCard

title="RW"

value={

rw +

(extraCrew * 85) +

(catering ? 250 : 0)

}

unit="kg"

status={

(

rw +

(extraCrew * 85) +

(catering ? 250 : 0)

)

<=

selectedAircraft.maxRW

}

limit={

selectedAircraft.maxRW

}

/>
  <StatusCard

title="TOW"

value={

tow +

(extraCrew *85)+

(catering ? 250 : 0)

}

unit="kg"

status={

(

tow +

(extraCrew *85)+

(catering ? 250 : 0)

)

<=

selectedAircraft.maxTOW

}

limit={

selectedAircraft.maxTOW

}

/>
      <StatusCard

title="TOI"

value={toi.toFixed(1)}

unit="IU"status={true}

/>
      
     
      
{/*
<StatusCard

title="TRIP FI"

value={

tripFuelIndex

}

unit="IU"

status={true}

/>


<StatusCard

title="FUEL INDEX"

value={

FuelIndex

}

unit="IU"

status={true}

/>


<StatusCard

  title="INDEX"

  value={cg.toFixed(1)}

  status={true}
  unit="IU"

/>
<StatusCard

title="PAX INDEX"

value={

paxIndex.toFixed(

1

)

}

unit="IU"

status={true}

/>
*/}


<StatusCard
title="TO CG"

value={
toCg?.toFixed?.(1)
}

unit="%"

status={true}
/>

<StatusCard

  title={`TRIM · ${trimLabel}`}

  value={trim.toFixed(1)}

  unit="U"

  status={true}

/>

<div

  style={{

    marginTop: '25px',

    padding: '18px',

    borderRadius: '14px',

    textAlign: 'center',

    background:

      loadStatus ===
      'READY FOR DISPATCH'

        ? 'rgba(0,255,120,0.10)'

        : loadStatus ===
          'REVIEW LOAD'

          ? 'rgba(255,180,0,0.10)'

          : 'rgba(255,60,60,0.10)',

    border:

      '1px solid rgba(255,255,255,0.08)'

  }}

>

 

</div>

    </div>

   <EnvelopeChart

cg={cg}

zfCg={zfCg}

toCg={toCg}
zfStatus={zfWithinEnvelope}
toStatus={toWithinEnvelope}
lwCg={lwCg}

zfi={zfi}

toi={toi}

li={li}

zfw={zfw}

tow={tow}

ldw={ldw}

status={cgStatus}

mtow={
selectedAircraft.maxTOW
}

mlw={
selectedAircraft.maxLW
}

mzfw={
selectedAircraft.maxZFW
}

/>


    <CargoPanel
      forwardCargo={forwardCargo}
      aftCargo={aftCargo}
    />
  </div>

)}
{

activeMenu !==

'Aircraft'

&&

activeMenu !==

'Seat Map'

&&
activeMenu !==

'Passenger'

&&
activeMenu !== 'Freighter'
&& (

<div

  style={{

    marginTop: '20px',

    padding: '18px',

    borderRadius: '14px',

    background:
      'rgba(255,255,255,0.04)',

    border:
      '1px solid rgba(255,255,255,0.08)'

  }}

>
{activeMenu === 'Dashboard' && (

<div>
  <h3>

    FUEL PREDICTION

  </h3>

  <div>

    TOW:
    {tow.toFixed(0)}
    KG

  </div>

  <div>

    TRIP:
    -
    {tripFuel.toFixed(0)}
    KG

  </div>

  <div

    style={{

      marginTop:
        '10px',

      fontWeight:
        '700'

    }}

  >

    EST LDW:
    {ldw.toFixed(0)}
    KG

  </div>
<div

  style={{

    marginTop: '20px',

    padding: '18px',

    borderRadius: '14px',

    background:
      'rgba(255,255,255,0.04)',

    border:
      '1px solid rgba(255,255,255,0.08)'

  }}

>

  <h3>

    LOAD SUMMARY

  </h3>

  <div>

    PAX:
    {selectedSeats.length}

  </div>

  <div>

    CARGO:

    {(
      forwardCargo +

      aftCargo

    ).toFixed(0)}

    KG

  </div>


  <div

    style={{

      marginTop:
        '12px',

      fontWeight:
        '700'

    }}

  >

    PAYLOAD:

    {(
      passengerWeight +

      forwardCargo +

      aftCargo

    ).toFixed(0)}

    KG

  </div>

</div>
<div

style={{

marginTop:'20px',

padding:'1px',

borderRadius:'14px',

background:

'rgba(255,255,255,0.04)',

border:

'1px solid rgba(255,255,255,0.08)',

width:'100%'

}}

>

<h3

style={{

marginBottom:'10px',

fontSize:'14px'

}}

>

TIME UTC

</h3>

<div

style={{

fontSize:'22px',

fontWeight:'700'

}}

>

{

new Date()

.toLocaleTimeString(

'en-GB',

{

timeZone:'UTC',

hour:'2-digit',

minute:'2-digit'

}

)

}Z

</div>
<div className="metar-card">

<div className="metar-title">

METAR 

</div>

<div className="metar-container">

<div className="metar-card">

<div className="metar-title">

FROM · {flightFrom}

</div>

<div className="metar-text">

{metar || "Loading METAR..."}

</div>

</div>

<div className="metar-card">

<div className="metar-title">

TO · {flightTo}

</div>

<div className="metar-text">

{metarTo || "Loading METAR..."}

</div>

</div>

</div>

</div>

</div>

</div>

)
}
</div>

)}
{activeMenu === 'Settings' && (

<div

style={{

flex:1,

padding:'40px'

}}

>

<h1>

WEATHER CENTER

</h1>

<div className="weather-search">

<input

placeholder="SEARCH ICAO"

value={weatherAirport}

onChange={(e)=>

setWeatherAirport(
e.target.value.toUpperCase()
)

}

/>

<button

onClick={
searchAirportWeather
}

>

SEARCH

</button>

</div>
<button
  onClick={() => {

  generateWeatherPdf({

    icao: weatherAirport,

    metar: searchMetar,

    taf: searchTaf

  })

}}
>
  GENERATE WEATHER PDF
</button>
<div className="metar-card">

<div className="metar-title">

METAR

</div>

<div className="metar-text">

{

searchMetar ||

"ENTER ICAO"

}

</div>

</div>

<div className="metar-card">

<div className="metar-title">

TAF

</div>

<div className="metar-text">

{

searchTaf ||

"COMING SOON"

}

</div>

</div>

</div>

)}
{activeMenu === 'Loadsheet' && (

  <div

    style={{flex: 1, padding: '40px'}}

  >

    <div

  style={{

    display: 'flex',

    gap: '20px',

    alignItems: 'center',

    marginBottom: '20px'

  }}

>

  <h1

    style={{

      fontSize: '42px',

      margin: 0

    }}

  >

    LOADSHEET CENTER

  </h1>

  <img

    src={aircraftImage}

    alt="aircraft"

    style={{

      width: '180px',

      objectFit: 'contain',

      filter:
        'drop-shadow(0 0 22px rgba(21,101,255,0.20))'

    }}

  />

</div>

    <p
  style={{
    color: '#4f8cff',
    marginBottom: '30px'
  }}
>
  Generate operational loadsheet PDF.
</p>

    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '12px'

      }}

    >

      Aircraft:
      <strong>
        {' '}
        {selectedAircraft.registration}
      </strong>

    </div>

    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '12px'

      }}

    >

      Passengers:
      <strong>
        {' '}
        {selectedSeats.length}
      </strong>

    </div>
<div

style={{

marginBottom:'20px'

}}

>

<h3>

EXTRA CREW

</h3>

<div

style={{

display:'flex',

alignItems:'center',

gap:'12px'

}}

>

<button

onClick={()=>

setExtraCrew(

Math.max(

0,

extraCrew-1

)

)

}

>

−

</button>

<span>

{

extraCrew

}

</span>

<button

onClick={()=>

setExtraCrew(

Math.min(

4,

extraCrew+1

)

)

}

>

+

</button>

</div>
<div

style={{

marginTop:'15px'

}}

>

<label>

<input

type="checkbox"

checked={catering}

onChange={(e)=>

setCatering(

e.target.checked

?

1

:

0

)

}

/>

CATERING

</label>

</div>
</div>
    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '12px'

      }}

    >

      fuel:
      <strong>
        {' '}
        {fuel} KG
      </strong>

    </div>

    <div

      style={{

        padding: '14px',

        borderRadius: '12px',

        background:
          'rgba(255,255,255,0.05)',

        border:
          '1px solid rgba(255,255,255,0.08)',

        marginBottom: '25px'

      }}

    >

   {
    
activeMenu !== 'Loadsheet' && (

<div>

CG Status:

<strong

style={{

color:

cgStatus

?

'#00ff88'

:

'#ff4444',

marginLeft:'8px'

}}

>

{

loadStatus

}

</strong>

</div>

)

}

    </div>
<div style={{ marginBottom: '20px' }}>



</div>
<div style={{ marginBottom: '25px' }}>

  <label>Forward Cargo (kg)</label>

  <input

    type="number"

    value={forwardCargo === 0 ? '' : forwardCargo}

    onChange={(e)=>{

const value=

parseInt(

e.target.value

)||0

setForwardCargo(

Math.min(

value,

3000

)

)

}}

    style={{

      width: '100%',

      padding: '12px',

      marginTop: '8px',

      borderRadius: '10px',

      border:
        '1px solid rgba(255,255,255,0.08)',

      background:
        'rgba(255,255,255,0.05)',

      color: 'white'

    }}

  />

</div>

<div style={{ marginBottom: '30px' }}>

  <label>Aft Cargo (kg)</label>

  <input

    type="number"

    value={aftCargo === 0 ? '' : aftCargo}

    onChange={(e)=>{

const value=

parseInt(

e.target.value

)||0

setAftCargo(

Math.min(

value,

5000

)

)

}}

    style={{

      width: '100%',

      padding: '12px',

      marginTop: '8px',

      borderRadius: '10px',

      border:
        '1px solid rgba(255,255,255,0.08)',

      background:
        'rgba(255,255,255,0.05)',

      color: 'white'

    }}

  />

</div>
    <button
 onMouseEnter={(e) => {

    e.target.style.transform =
      'translateY(-3px)'

    e.target.style.boxShadow =
      '0 0 35px rgba(0,255,140,0.35)'

  }}

  onMouseLeave={(e) => {

    e.target.style.transform =
      'translateY(0px)'

    e.target.style.boxShadow =
      '0 0 25px rgba(0,255,140,0.20)'
      

  }}
      onClick={() =>
        

        generateLoadsheet({

          selectedAircraft,
metarFrom: metar,
metarTo,
          selectedSeats,

          forwardCargo,

          aftCargo,

          fuel,
          taxiFuel,
          tripFuel,
          ldw,
payload,

          zfw,
rw,
          tow,
          cg,
crewConfiguration,

catering,
          cgStatus,
          zfCg,

toCg,
          flightFrom,

flightTo,

flightNumber,
trim,
effectiveBasicWeight,

effectiveBasicIndex,
forwardSeats,
midSeats,

aftSeats,
fwdAdults,
fwdChildren,
fwdInfants,

midAdults,
midChildren,
midInfants,

aftAdults,
aftChildren,
aftInfants
        })

      }

      style={{

        padding: '16px 32px',

        background:
          '#00aa66',

        color: 'white',

        border:
          '1px solid rgba(255,255,255,0.08)',

        borderRadius: '12px',

        fontSize: '16px',

        cursor: 'pointer',

        boxShadow:
        
          '0 0 25px rgba(0,255,140,0.20)'
          

      }}

    >

      Generate Loadsheet PDF

    </button>

  </div>



)}
{activeMenu === 'Platform Management' && (
  <div
    style={{
      flex: 1,
      padding: '40px'
    }}
  >

    <div style={{ marginBottom: '32px' }}>
      <div
        style={{
          color: '#4f8cff',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          marginBottom: '8px'
        }}
      >
        OPERDAT · PLATFORM ADMINISTRATION
      </div>

      <h1
        style={{
          fontSize: '38px',
          margin: 0,
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}
      >
        PLATFORM MANAGEMENT
      </h1>

      <p
        style={{
          color: '#8fa0b7',
          marginTop: '8px',
          marginBottom: 0,
          fontSize: '14px'
        }}
      >
        Organizations and platform configuration
      </p>
    </div>

    {/* ORGANIZATIONS */}

    <div
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background:
          'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
      }}
    >

     <div
  style={{
    padding: '20px 22px',
    borderBottom:
      '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}
>
  <div
    style={{
      color: '#4f8cff',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1.5px'
    }}
  >
    ORGANIZATIONS
  </div>

  <button
    type="button"
    onClick={() => {
      setShowNewOrganizationForm(
        current => !current
      )
    }}
    style={{
      padding: '9px 14px',
      borderRadius: '8px',
      border:
        '1px solid rgba(79,140,255,0.35)',
      background:
        'rgba(79,140,255,0.10)',
      color: '#4f8cff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.7px',
      cursor: 'pointer'
    }}
  >
    {showNewOrganizationForm
      ? 'CANCEL'
      : '+ NEW ORGANIZATION'}
  </button>
</div>
{showNewOrganizationForm && (
  <div
    style={{
      padding: '20px 22px',
      background: 'rgba(79,140,255,0.04)',
      borderBottom:
        '1px solid rgba(255,255,255,0.07)'
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr auto',
        gap: '14px',
        alignItems: 'end'
      }}
    >

      {/* NAME */}

      <div>
        <div
          style={{
            color: '#8fa0b7',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.8px',
            marginBottom: '7px'
          }}
        >
          ORGANIZATION NAME
        </div>

        <input
          type="text"
          value={newOrganizationName}
          onChange={(e) =>
            setNewOrganizationName(e.target.value)
          }
          placeholder="Example Aviation"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '11px 12px',
            borderRadius: '8px',
            border:
              '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.20)',
            color: '#ffffff',
            outline: 'none'
          }}
        />
      </div>

      {/* CODE */}

      <div>
        <div
          style={{
            color: '#8fa0b7',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.8px',
            marginBottom: '7px'
          }}
        >
          CODE
        </div>

        <input
          type="text"
          value={newOrganizationCode}
          onChange={(e) =>
            setNewOrganizationCode(
              e.target.value.toUpperCase()
            )
          }
          placeholder="EXA"
          maxLength={10}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '11px 12px',
            borderRadius: '8px',
            border:
              '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.20)',
            color: '#ffffff',
            outline: 'none'
          }}
        />
      </div>

      {/* CREATE */}

      <button
        type="button"
        disabled={
          creatingOrganization ||
          !newOrganizationName.trim() ||
          !newOrganizationCode.trim()
        }
        onClick={async () => {
          try {
            setCreatingOrganization(true)

            const created =
              await createOrganization({
                name: newOrganizationName,
                code: newOrganizationCode
              })

            console.log(
              'ORGANIZATION CREATED:',
              created
            )

            setPlatformOrganizations(
              current =>
                [...current, created].sort(
                  (a, b) =>
                    a.name.localeCompare(b.name)
                )
            )

            setNewOrganizationName('')
            setNewOrganizationCode('')
            setShowNewOrganizationForm(false)

          } catch (error) {
            console.error(
              'CREATE ORGANIZATION ERROR:',
              error
            )
          } finally {
            setCreatingOrganization(false)
          }
        }}
        style={{
          padding: '11px 16px',
          borderRadius: '8px',
          border:
            '1px solid rgba(79,140,255,0.40)',
          background:
            'rgba(79,140,255,0.15)',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.7px',
          cursor:
            creatingOrganization
              ? 'wait'
              : 'pointer',
          opacity:
            creatingOrganization ||
            !newOrganizationName.trim() ||
            !newOrganizationCode.trim()
              ? 0.45
              : 1
        }}
      >
        {creatingOrganization
          ? 'CREATING...'
          : 'CREATE'}
      </button>

    </div>
  </div>
)}

      {platformOrganizations.map((organization) => (
  <div
    key={organization.id}

    onClick={async () => {
      try {
        setSelectedPlatformOrganization(organization)

        const aircraft = await getAircraft()

        const organizationAircraft = aircraft.filter(
  item =>
    item.organization_id === organization.id
)

const aircraftWithStatus =
  await getAircraftConfigurationStatus(
    organizationAircraft
  )

setPlatformOrganizationAircraft(
  aircraftWithStatus
)
      } catch (error) {
        console.error(
          'PLATFORM ORGANIZATION AIRCRAFT ERROR:',
          error
        )
      }
    }}

    style={{
            display: 'grid',
            gridTemplateColumns:
              '0.6fr 2fr 0.8fr 1fr',
            gap: '16px',
            padding: '18px 22px',
            alignItems: 'center',
            borderTop:
              '1px solid rgba(255,255,255,0.05)'
          }}
        >
          {editingOrganizationId === organization.id ? (
  <>
    {/* EDIT NAME */}

    <input
      type="text"
      value={editingOrganizationName}
      onChange={(e) =>
        setEditingOrganizationName(e.target.value)
      }
      onClick={(e) => e.stopPropagation()}
      style={{
        gridColumn: '1 / 3',
        padding: '9px 10px',
        borderRadius: '7px',
        border:
          '1px solid rgba(79,140,255,0.35)',
        background: 'rgba(0,0,0,0.20)',
        color: '#ffffff',
        outline: 'none'
      }}
    />

    {/* EDIT CODE */}

    <input
      type="text"
      value={editingOrganizationCode}
      maxLength={10}
      onChange={(e) =>
        setEditingOrganizationCode(
          e.target.value.toUpperCase()
        )
      }
      onClick={(e) => e.stopPropagation()}
      style={{
        padding: '9px 10px',
        borderRadius: '7px',
        border:
          '1px solid rgba(79,140,255,0.35)',
        background: 'rgba(0,0,0,0.20)',
        color: '#ffffff',
        outline: 'none'
      }}
    />

    {/* SAVE / CANCEL */}

    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px'
      }}
    >
      <button
        type="button"
        disabled={
          updatingOrganization ||
          !editingOrganizationName.trim() ||
          !editingOrganizationCode.trim()
        }
        onClick={async (e) => {
          e.stopPropagation()

          try {
            setUpdatingOrganization(true)

            const updated =
              await updateOrganization(
                organization.id,
                {
                  name:
                    editingOrganizationName.trim(),
                  code:
                    editingOrganizationCode
                      .trim()
                      .toUpperCase()
                }
              )

            setPlatformOrganizations(
              current =>
                current
                  .map(item =>
                    item.id === updated.id
                      ? updated
                      : item
                  )
                  .sort((a, b) =>
                    a.name.localeCompare(b.name)
                  )
            )

            if (
              selectedPlatformOrganization?.id ===
              updated.id
            ) {
              setSelectedPlatformOrganization(
                updated
              )
            }

            setEditingOrganizationId(null)
            setEditingOrganizationName('')
            setEditingOrganizationCode('')

            console.log(
              'ORGANIZATION UPDATED:',
              updated
            )

          } catch (error) {
            console.error(
              'EDIT ORGANIZATION ERROR:',
              error
            )
          } finally {
            setUpdatingOrganization(false)
          }
        }}
        style={{
          padding: '8px 11px',
          borderRadius: '7px',
          border:
            '1px solid rgba(79,140,255,0.40)',
          background:
            'rgba(79,140,255,0.15)',
          color: '#ffffff',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        {updatingOrganization
          ? 'SAVING...'
          : 'SAVE'}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()

          setEditingOrganizationId(null)
          setEditingOrganizationName('')
          setEditingOrganizationCode('')
        }}
        style={{
          padding: '8px 11px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>
  </>
) : (
  <>
    {/* NORMAL ROW */}

    <div
      style={{
        color: '#4f8cff',
        fontWeight: '700'
      }}
    >
      {organization.code || '----'}
    </div>

    <div
      style={{
        color: '#ffffff',
        fontWeight: '600'
      }}
    >
      {organization.name}
    </div>

    <div
      style={{
        fontSize: '11px',
        fontWeight: '700'
      }}
    >
      {(organization.status || '----')
        .toUpperCase()}
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '10px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '12px'
        }}
      >
        ID {organization.id}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()

          setEditingOrganizationId(
            organization.id
          )
          setEditingOrganizationName(
            organization.name || ''
          )
          setEditingOrganizationCode(
            organization.code || ''
          )
        }}
        style={{
          padding: '7px 10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(79,140,255,0.25)',
          background:
            'rgba(79,140,255,0.08)',
          color: '#4f8cff',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        EDIT
      </button>

      <button
        type="button"
        onClick={async (e) => {
          e.stopPropagation()

          try {
            const nextStatus =
              organization.status === 'active'
                ? 'inactive'
                : 'active'

            const updated =
              await updateOrganization(
                organization.id,
                { status: nextStatus }
              )

            setPlatformOrganizations(
              current =>
                current.map(item =>
                  item.id === updated.id
                    ? updated
                    : item
                )
            )

            if (
              selectedPlatformOrganization?.id ===
              updated.id
            ) {
              setSelectedPlatformOrganization(
                updated
              )
            }

          } catch (error) {
            console.error(
              'ORGANIZATION STATUS UPDATE ERROR:',
              error
            )
          }
        }}
        style={{
          padding: '7px 10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color:
            organization.status === 'active'
              ? '#8fa0b7'
              : '#4f8cff',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        {organization.status === 'active'
          ? 'DEACTIVATE'
          : 'ACTIVATE'}
      </button>
    </div>
  </>
)}
        </div>
      ))}

    </div>
    {/* USERS */}

<div
  style={{
    marginTop: '22px',
    borderRadius: '16px',
    overflow: 'hidden',
    background:
      'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
  }}
>
  {/* USERS HEADER */}

  <div
    style={{
      padding: '20px 22px',
      borderBottom:
        '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    <div
      style={{
        color: '#4f8cff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1.5px'
      }}
    >
      USERS
    </div>

    <button
      type="button"
      onClick={() => {
        setShowNewUserForm(
          current => !current
        )

        setUserCreationMessage('')
      }}
      style={{
        padding: '9px 14px',
        borderRadius: '8px',
        border:
          '1px solid rgba(79,140,255,0.35)',
        background:
          'rgba(79,140,255,0.10)',
        color: '#4f8cff',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.7px',
        cursor: 'pointer'
      }}
    >
      {showNewUserForm
        ? 'CANCEL'
        : '+ NEW USER'}
    </button>
  </div>

  {/* NEW USER FORM */}

  {showNewUserForm && (
    <div
      style={{
        padding: '20px 22px',
        background:
          'rgba(79,140,255,0.04)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
  '1.3fr 1.1fr 1.5fr 0.9fr 1.2fr',
          gap: '14px'
        }}
      >
        {/* FULL NAME */}

        <div>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '10px',
              fontWeight: '700',
              marginBottom: '7px'
            }}
          >
            FULL NAME
          </div>

          <input
            type="text"
            value={newUserFullName}
            onChange={(e) =>
              setNewUserFullName(e.target.value)
            }
            placeholder="User name"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '11px 12px',
              borderRadius: '8px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background:
                'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
{/* USERNAME */}

<div>
  <div
    style={{
      color: '#8fa0b7',
      fontSize: '10px',
      fontWeight: '700',
      marginBottom: '7px'
    }}
  >
    USERNAME
  </div>

  <input
    type="text"
    value={newUserUsername}
    onChange={(e) =>
      setNewUserUsername(
        e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9._-]/g, '')
      )
    }
    placeholder="aca.dispatch01"
    autoComplete="off"
    maxLength={40}
    style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: '11px 12px',
      borderRadius: '8px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(0,0,0,0.20)',
      color: '#ffffff',
      outline: 'none'
    }}
  />
</div>
        {/* EMAIL */}

        <div>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '10px',
              fontWeight: '700',
              marginBottom: '7px'
            }}
          >
            EMAIL
          </div>

          <input
            type="email"
            value={newUserEmail}
            onChange={(e) =>
              setNewUserEmail(e.target.value)
            }
            placeholder="user@example.com"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '11px 12px',
              borderRadius: '8px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background:
                'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>

        {/* ROLE */}

        <div>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '10px',
              fontWeight: '700',
              marginBottom: '7px'
            }}
          >
            ROLE
          </div>

          <select
            value={newUserRole}
            onChange={(e) =>
              setNewUserRole(e.target.value)
            }
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: '8px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: '#071526',
              color: '#ffffff',
              outline: 'none'
            }}
          >
            <option value="admin">
  Admin
</option>

<option value="passenger">
  Passenger
</option>

<option value="freighter">
  Freighter
</option>

<option value="student">
  Student
</option>
          </select>
        </div>

        {/* ORGANIZATION */}

        <div>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '10px',
              fontWeight: '700',
              marginBottom: '7px'
            }}
          >
            ORGANIZATION
          </div>

          <select
            value={newUserOrganizationId}
            onChange={(e) =>
              setNewUserOrganizationId(
                e.target.value
              )
            }
            style={{
              width: '100%',
              padding: '11px 12px',
              borderRadius: '8px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: '#071526',
              color: '#ffffff',
              outline: 'none'
            }}
          >
            <option value="">
              Select organization
            </option>

            {platformOrganizations
              .filter(
                organization =>
                  organization.status ===
                  'active'
              )
              .map(organization => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* PASSWORD + CREATE */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '14px',
          alignItems: 'end',
          marginTop: '14px'
        }}
      >
        <div>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '10px',
              fontWeight: '700',
              marginBottom: '7px'
            }}
          >
            TEMPORARY PASSWORD
          </div>

          <input
            type="password"
            value={newUserPassword}
            onChange={(e) =>
              setNewUserPassword(
                e.target.value
              )
            }
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '11px 12px',
              borderRadius: '8px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background:
                'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>

        <button
          type="button"
          disabled={
            creatingUser ||
            !newUserFullName.trim() ||
            newUserUsername.trim().length < 3 ||
            !newUserEmail.trim() ||
            newUserPassword.length < 8 ||
            !newUserOrganizationId
          }
          onClick={async () => {
            try {
              setCreatingUser(true)
              setUserCreationMessage('')

              const createdUser =
                await createPlatformUser({
                  fullName:
                    newUserFullName.trim(),
                    username:
      newUserUsername
        .trim()
        .toLowerCase(),
                  email:
                    newUserEmail
                      .trim()
                      .toLowerCase(),
                  password:
                    newUserPassword,
                  role:
                    newUserRole,
                  organizationId:
                    Number(
                      newUserOrganizationId
                    )
                })

              console.log(
                'PLATFORM USER CREATED:',
                createdUser
              )

              setUserCreationMessage(
                `User ${createdUser.fullName} created successfully`
              )

              setNewUserFullName('')
              setNewUserUsername('')
              setNewUserEmail('')
              setNewUserPassword('')
              setNewUserRole('freighter')
              setNewUserOrganizationId('')
await refreshPlatformUsers()
            } catch (error) {
              console.error(
                'CREATE PLATFORM USER ERROR:',
                error
              )

              setUserCreationMessage(
                error.message ||
                'Could not create user'
              )
            } finally {
              setCreatingUser(false)
            }
          }}
          style={{
            padding: '11px 18px',
            borderRadius: '8px',
            border:
              '1px solid rgba(79,140,255,0.40)',
            background:
              'rgba(79,140,255,0.15)',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.7px',
            cursor:
              creatingUser
                ? 'wait'
                : 'pointer',
            opacity:
              creatingUser ||
              !newUserFullName.trim() ||
              newUserUsername.trim().length < 3 ||
              !newUserEmail.trim() ||
              newUserPassword.length < 8 ||
              !newUserOrganizationId
                ? 0.45
                : 1
          }}
        >
          {creatingUser
            ? 'CREATING...'
            : 'CREATE USER'}
        </button>
      </div>

      {userCreationMessage && (
        <div
          style={{
            marginTop: '14px',
            color: '#8fa0b7',
            fontSize: '12px'
          }}
        >
          {userCreationMessage}
        </div>
      )}
      {/* PLATFORM USERS LIST */}

<div
  style={{
    marginTop: 18,
    borderTop: '1px solid #334155',
    paddingTop: 16
  }}
>
  {loadingPlatformUsers ? (
    <div
      style={{
        color: '#94a3b8',
        fontSize: 13
      }}
    >
      Loading users...
    </div>
  ) : platformUsers.length === 0 ? (
    <div
      style={{
        color: '#94a3b8',
        fontSize: 13
      }}
    >
      No users found.
    </div>
  ) : (
    <div
      style={{
        overflowX: 'auto'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 13
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom:
                '1px solid #334155',
              color: '#94a3b8',
              textAlign: 'left'
            }}
          >
            <th style={{ padding: '10px 8px' }}>
              NAME
            </th>

            <th style={{ padding: '10px 8px' }}>
              USERNAME
            </th>

            <th style={{ padding: '10px 8px' }}>
              ORGANIZATION
            </th>

            <th style={{ padding: '10px 8px' }}>
              ROLE
            </th>

            <th style={{ padding: '10px 8px' }}>
              STATUS
            </th>
            <th style={{ padding: '10px 8px' }}>
  ACTION
</th>
          </tr>
        </thead>

        <tbody>
          {platformUsers.map((user) => (
            <tr
              key={user.id}
              style={{
                borderBottom:
                  '1px solid #1e293b'
              }}
            >
              <td
                style={{
                  padding: '12px 8px',
                  color: '#e2e8f0',
                  fontWeight: 600
                }}
              >
                {user.fullName}
              </td>

              <td
                style={{
                  padding: '12px 8px',
                  color: '#cbd5e1'
                }}
              >
                {user.username || '—'}
              </td>

              <td
                style={{
                  padding: '12px 8px',
                  color: '#cbd5e1'
                }}
              >
                {user.organizationName}
              </td>

              <td
                style={{
                  padding: '12px 8px',
                  color: '#cbd5e1',
                  textTransform: 'uppercase'
                }}
              >
                {user.role}
              </td>

              <td
                style={{
                  padding: '12px 8px',
                  fontWeight: 700,
                  color:
                    user.status === 'active'
                      ? '#22c55e'
                      : '#ef4444',
                  textTransform: 'uppercase'
                }}
              >
                {user.status}
              </td>
              <td
  style={{
    padding: '12px 8px'
  }}
>
  {user.role === 'super_admin' ? (
    <span
      style={{
        color: '#64748b',
        fontSize: 12,
        fontWeight: 600
      }}
    >
      PROTECTED
    </span>
  ) : (
    <button
      type="button"
      disabled={updatingUserId === user.id}
      onClick={async () => {
        const nextStatus =
          user.status === 'active'
            ? 'inactive'
            : 'active'

        const action =
          nextStatus === 'inactive'
            ? 'deactivate'
            : 'activate'

        const confirmed =
          window.confirm(
            `Are you sure you want to ${action} ${user.fullName}?`
          )

        if (!confirmed) return

        try {
          setUpdatingUserId(user.id)

          await updatePlatformUserStatus(
            user.id,
            nextStatus
          )

          await refreshPlatformUsers()

        } catch (error) {
          console.error(
            'UPDATE USER STATUS ERROR:',
            error
          )

          alert(
            error.message ||
            'Could not update user status'
          )

        } finally {
          setUpdatingUserId(null)
        }
      }}
      style={{
        padding: '7px 11px',
        borderRadius: 6,
        border: '1px solid #475569',
        background:
          user.status === 'active'
            ? '#7f1d1d'
            : '#14532d',
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 700,
        cursor:
          updatingUserId === user.id
            ? 'wait'
            : 'pointer',
        opacity:
          updatingUserId === user.id
            ? 0.6
            : 1
      }}
    >
      {updatingUserId === user.id
        ? 'UPDATING...'
        : user.status === 'active'
          ? 'DEACTIVATE'
          : 'ACTIVATE'}
    </button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
    </div>
    
  )}
</div>
{/* SELECTED ORGANIZATION */}

{selectedPlatformOrganization && (

  <div
    style={{
      marginTop: '24px',
      borderRadius: '16px',
      padding: '24px',
      background:
        'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
      border:
        '1px solid rgba(255,255,255,0.08)',
      boxShadow:
        '0 8px 24px rgba(0,0,0,0.18)'
    }}
  >

    {/* HEADER */}

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}
    >

      <div>

        <div
          style={{
            color: '#4f8cff',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            marginBottom: '7px'
          }}
        >
          ORGANIZATION
        </div>

        <div
          style={{
            fontSize: '24px',
            fontWeight: '700'
          }}
        >
          {selectedPlatformOrganization.name}
        </div>

        <div
          style={{
            color: '#8fa0b7',
            fontSize: '13px',
            marginTop: '6px'
          }}
        >
          {selectedPlatformOrganization.code}
          {' · '}
          {(selectedPlatformOrganization.status || '')
            .toUpperCase()}
        </div>

      </div>

      {/* CLOSE */}

      <button
        type="button"
        onClick={() => {
          setSelectedPlatformOrganization(null)
          setPlatformOrganizationAircraft([])
        }}
        title="Close organization"
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        ▲
      </button>

    </div>
<AircraftTechnicalConfiguration
  aircraft={selectedPlatformAircraft}
  fullData={selectedPlatformAircraftFullData}
  onClose={() => {
  setSelectedPlatformAircraft(null)
  setSelectedPlatformAircraftFullData(null)
  setShowAircraftConfigurationForm(false)
}}
  onConfigure={() => {
  console.log('CONFIGURE W&B CLICKED')
  setShowAircraftConfigurationForm(true)
}}
onConfigureEnvelopes={() => {
  setShowAircraftEnvelopesForm(true)
}}
onConfigureCargoPositions={() => {
  setShowCargoPositionsForm(true)
}}
onEditAircraftData={() => {
  const aircraft =
    selectedPlatformAircraftFullData?.aircraft

  if (!aircraft) return

  setEditingAircraftData({
    dow: aircraft.dow ?? '',
    mzfw: aircraft.mzfw ?? '',
    mtow: aircraft.mtow ?? '',
    mrw: aircraft.mrw ?? '',
    mlw: aircraft.mlw ?? ''
  })

  setAircraftDataRevisionMeta({
    changeReason: '',
    sourceDocument: '',
    sourceRevision: '',
    effectiveDate:
      new Date().toISOString().slice(0, 10)
  })
}}

onEditWeightBalance={() => {
  const config =
    selectedPlatformAircraftFullData?.configuration

  if (!config) return

  setEditingWeightBalance({
    datum: config.datum ?? '',
    mac: config.mac ?? '',
    lemac: config.lemac ?? '',

    basicWeight: config.basic_weight ?? '',
    basicIndex: config.basic_index ?? '',

    indexReferenceArm:
      config.index_reference_arm ?? '',

    indexConstant:
      config.index_constant ?? '',

    indexOffset:
      config.index_offset ?? '',

    basicConfig:
      config.basic_config ?? '',

    basicCrew:
      config.basic_crew ?? '',

    seatArmFwd:
      config.seat_arm_fwd ?? '',

    seatArmMid:
      config.seat_arm_mid ?? '',

    seatArmAft:
      config.seat_arm_aft ?? '',

    fuelArm:
      config.fuel_arm ?? '',

    forwardCargoArm:
      config.forward_cargo_arm ?? '',

    aftCargoArm:
      config.aft_cargo_arm ?? ''
  })

  setWeightBalanceRevisionMeta({
    changeReason: '',
    sourceDocument: '',
    sourceRevision: '',
    effectiveDate:
      new Date().toISOString().slice(0, 10)
  })
}}
onEditEnvelopes={() => {
  const envelopes =
    selectedPlatformAircraftFullData?.envelopes

  if (!envelopes?.length) return

 const zf = envelopes.find(
  item =>
    String(item.phase).trim().toUpperCase() === 'ZFW'
)

const tow = envelopes.find(
  item =>
    String(item.phase).trim().toUpperCase() === 'TOW'
)

const lw = envelopes.find(
  item =>
    String(item.phase).trim().toUpperCase() === 'LDW'
)

  setEditingEnvelopes({
    zf: {
      indexMin: zf?.index_min ?? '',
      indexMax: zf?.index_max ?? '',
      cgMin: zf?.cg_min ?? '',
      cgMax: zf?.cg_max ?? ''
    },

    tow: {
      indexMin: tow?.index_min ?? '',
      indexMax: tow?.index_max ?? '',
      cgMin: tow?.cg_min ?? '',
      cgMax: tow?.cg_max ?? ''
    },

    lw: {
      indexMin: lw?.index_min ?? '',
      indexMax: lw?.index_max ?? '',
      cgMin: lw?.cg_min ?? '',
      cgMax: lw?.cg_max ?? ''
    }
  })

  setEnvelopesRevisionMeta({
    changeReason: '',
    sourceDocument: '',
    sourceRevision: '',
    effectiveDate:
      new Date().toISOString().slice(0, 10)
  })
}}

onEditCargoPositions={() => {
  const cargoPositions =
    selectedPlatformAircraftFullData?.cargoPositions

  if (!cargoPositions?.length) return

  setEditingCargoPositions(
    cargoPositions.map(position => ({
      id: position.id,
      positionCode:
        position.position_code,
      deck: position.deck,
      maxWeight:
        position.max_weight,
      arm: position.arm
    }))
  )

  setCargoPositionsRevisionMeta({
    changeReason: '',
    sourceDocument: '',
    sourceRevision: '',
    effectiveDate:
      new Date().toISOString().slice(0, 10)
  })
}}
technicalRevisions={
  selectedAircraftTechnicalRevisions
}
showRevisionHistory={
  showTechnicalRevisionHistory
}
onShowRevisionHistory={() => {
  setShowTechnicalRevisionHistory(
    current => !current
  )
}}
/>
{editingEnvelopes &&
 selectedPlatformAircraft && (
  <div
    style={{
      marginTop: '20px',
      marginBottom: '24px',
      padding: '22px',
      borderRadius: '12px',
      background: 'rgba(12,22,38,0.92)',
      border:
        '1px solid rgba(79,140,255,0.20)'
    }}
  >
    {/* HEADER */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
      <div>
        <div
          style={{
            color: '#4f8cff',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px'
          }}
        >
          OPERATIONAL ENVELOPES REVISION
        </div>

        <div
          style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            marginTop: '4px'
          }}
        >
          {selectedPlatformAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setEditingEnvelopes(null)
        }
        style={{
          padding: '7px 12px',
          borderRadius: '6px',
          border:
            '1px solid rgba(255,255,255,0.12)',
          background: 'transparent',
          color: '#9aa8ba',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>

    {/* TABLE HEADER */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          '0.7fr 1fr 1fr 1fr 1fr',
        gap: '12px',
        marginBottom: '8px',
        color: '#8fa0b7',
        fontSize: '9px',
        fontWeight: '700'
      }}
    >
      <div>PHASE</div>
      <div>INDEX MIN</div>
      <div>INDEX MAX</div>
      <div>CG MIN</div>
      <div>CG MAX</div>
    </div>

    {/* ENVELOPE ROWS */}
    {[
  ['ZFW', 'zf'],
  ['TOW', 'tow'],
  ['LDW', 'lw']
].map(([label, phase]) => (
      <div
        key={phase}
        style={{
          display: 'grid',
          gridTemplateColumns:
            '0.7fr 1fr 1fr 1fr 1fr',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '10px'
        }}
      >
        <div
          style={{
            color: '#4f8cff',
            fontSize: '11px',
            fontWeight: '700'
          }}
        >
          {label}
        </div>

        {[
          'indexMin',
          'indexMax',
          'cgMin',
          'cgMax'
        ].map(field => (
          <input
            key={field}
            type="number"
            step="any"
            value={
              editingEnvelopes?.[phase]?.[field] ??
              ''
            }
            onChange={(e) =>
              setEditingEnvelopes(current => ({
                ...current,
                [phase]: {
                  ...current[phase],
                  [field]: e.target.value
                }
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background:
                'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        ))}
      </div>
    ))}
    {/* REVISION TRACEABILITY */}
<div
  style={{
    marginTop: '24px',
    paddingTop: '20px',
    borderTop:
      '1px solid rgba(255,255,255,0.07)'
  }}
>
  <div
    style={{
      color: '#8fa0b7',
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '1px',
      marginBottom: '12px'
    }}
  >
    REVISION TRACEABILITY
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        '2fr 1.5fr 1fr 1fr',
      gap: '12px'
    }}
  >
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        CHANGE REASON
      </span>

      <input
        type="text"
        value={envelopesRevisionMeta.changeReason}
        onChange={(e) =>
          setEnvelopesRevisionMeta(current => ({
            ...current,
            changeReason: e.target.value
          }))
        }
        placeholder="Reason for technical revision"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        SOURCE DOCUMENT
      </span>

      <input
        type="text"
        value={envelopesRevisionMeta.sourceDocument}
        onChange={(e) =>
          setEnvelopesRevisionMeta(current => ({
            ...current,
            sourceDocument: e.target.value
          }))
        }
        placeholder="WBM / AFM / approved document"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        SOURCE REVISION
      </span>

      <input
        type="text"
        value={envelopesRevisionMeta.sourceRevision}
        onChange={(e) =>
          setEnvelopesRevisionMeta(current => ({
            ...current,
            sourceRevision: e.target.value
          }))
        }
        placeholder="Revision"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        EFFECTIVE DATE
      </span>

      <input
        type="date"
        value={envelopesRevisionMeta.effectiveDate}
        onChange={(e) =>
          setEnvelopesRevisionMeta(current => ({
            ...current,
            effectiveDate: e.target.value
          }))
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>
  </div>
<div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  }}
>
  <button
    type="button"
    disabled={
      savingEnvelopesRevision ||
      !envelopesRevisionMeta.changeReason.trim() ||
      !envelopesRevisionMeta.sourceDocument.trim() ||
      !envelopesRevisionMeta.effectiveDate
    }
    onClick={async () => {
      try {
        const phases = [
          ['ZFW', editingEnvelopes.zf],
          ['TOW', editingEnvelopes.tow],
          ['LDW', editingEnvelopes.lw]
        ]

        for (const [phase, values] of phases) {
          const indexMin = Number(values.indexMin)
          const indexMax = Number(values.indexMax)
          const cgMin = Number(values.cgMin)
          const cgMax = Number(values.cgMax)

          if (
            !Number.isFinite(indexMin) ||
            !Number.isFinite(indexMax) ||
            !Number.isFinite(cgMin) ||
            !Number.isFinite(cgMax)
          ) {
            alert(
              `${phase}: all envelope values are required.`
            )
            return
          }

          if (indexMin >= indexMax) {
            alert(
              `${phase}: INDEX MIN must be lower than INDEX MAX.`
            )
            return
          }

          if (cgMin >= cgMax) {
            alert(
              `${phase}: CG MIN must be lower than CG MAX.`
            )
            return
          }
        }

        setSavingEnvelopesRevision(true)

        const revision =
          await createEnvelopesRevision({
            aircraftId:
              selectedPlatformAircraft.id,

            ...editingEnvelopes,
            ...envelopesRevisionMeta
          })

        console.log(
          'ENVELOPES REVISION CREATED:',
          revision
        )

        const refreshed =
          await getAircraftFullData(
            selectedPlatformAircraft.id
          )

        setSelectedPlatformAircraftFullData(
          refreshed
        )

        const refreshedRevisions =
          await getAircraftTechnicalRevisions(
            selectedPlatformAircraft.id
          )

        setSelectedAircraftTechnicalRevisions(
          refreshedRevisions
        )

        await refreshCargoFleet()

        setEditingEnvelopes(null)

      } catch (error) {
        console.error(
          'SAVE ENVELOPES REVISION ERROR:',
          error
        )
      } finally {
        setSavingEnvelopesRevision(false)
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: '7px',
      border: 'none',
      background:
        savingEnvelopesRevision ||
        !envelopesRevisionMeta.changeReason.trim() ||
        !envelopesRevisionMeta.sourceDocument.trim() ||
        !envelopesRevisionMeta.effectiveDate
          ? 'rgba(79,140,255,0.25)'
          : '#4f8cff',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.6px',
      cursor:
        savingEnvelopesRevision ||
        !envelopesRevisionMeta.changeReason.trim() ||
        !envelopesRevisionMeta.sourceDocument.trim() ||
        !envelopesRevisionMeta.effectiveDate
          ? 'not-allowed'
          : 'pointer'
    }}
  >
    {savingEnvelopesRevision
      ? 'SAVING...'
      : 'SAVE REVISION'}
  </button>
</div>
</div>
  </div>
)}
{editingCargoPositions &&
 selectedPlatformAircraft && (
  <div
    style={{
      marginTop: '20px',
      padding: '20px',
      borderRadius: '10px',
      background: 'rgba(8,18,32,0.95)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}
  >
    {/* HEADER */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
      <div>
        <div
          style={{
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '700'
          }}
        >
          CARGO POSITIONS REVISION
        </div>

        <div
          style={{
            color: '#8fa0b7',
            fontSize: '10px',
            marginTop: '4px'
          }}
        >
          {selectedPlatformAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setEditingCargoPositions(null)
        }
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'transparent',
          color: '#ffffff',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>

    {/* DECKS */}
    {['MAIN', 'LOWER'].map(deck => {
      const deckPositions =
        editingCargoPositions.filter(
          position => position.deck === deck
        )

      return (
        <div
          key={deck}
          style={{
            marginBottom: '24px'
          }}
        >
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '10px'
            }}
          >
            {deck} DECK
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '120px 1fr 1fr',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                color: '#708198',
                fontSize: '9px',
                fontWeight: '700'
              }}
            >
              POSITION
            </div>

            <div
              style={{
                color: '#708198',
                fontSize: '9px',
                fontWeight: '700'
              }}
            >
              MAX WEIGHT (KG)
            </div>

            <div
              style={{
                color: '#708198',
                fontSize: '9px',
                fontWeight: '700'
              }}
            >
              ARM
            </div>

            {deckPositions.map(position => {
              const positionIndex =
                editingCargoPositions.findIndex(
                  item => item.id === position.id
                )

              return (
                <Fragment
  key={position.id}
>
                  <div
                    style={{
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}
                  >
                    {position.positionCode}
                  </div>

                  <input
                    type="number"
                    step="0.01"
                    value={position.maxWeight}
                    onChange={(e) => {
                      const value = e.target.value

                      setEditingCargoPositions(
                        current =>
                          current.map(
                            (item, index) =>
                              index === positionIndex
                                ? {
                                    ...item,
                                    maxWeight: value
                                  }
                                : item
                          )
                      )
                    }}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px',
                      borderRadius: '6px',
                      border:
                        '1px solid rgba(255,255,255,0.10)',
                      background:
                        'rgba(0,0,0,0.20)',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />

                  <input
                    type="number"
                    step="0.01"
                    value={position.arm}
                    onChange={(e) => {
                      const value = e.target.value

                      setEditingCargoPositions(
                        current =>
                          current.map(
                            (item, index) =>
                              index === positionIndex
                                ? {
                                    ...item,
                                    arm: value
                                  }
                                : item
                          )
                      )
                    }}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px',
                      borderRadius: '6px',
                      border:
                        '1px solid rgba(255,255,255,0.10)',
                      background:
                        'rgba(0,0,0,0.20)',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </Fragment>
              )
            })}
          </div>
        </div>
      )
    })}

    {/* REVISION TRACEABILITY */}
    <div
      style={{
        marginTop: '24px',
        paddingTop: '20px',
        borderTop:
          '1px solid rgba(255,255,255,0.07)'
      }}
    >
      <div
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          letterSpacing: '1px',
          marginBottom: '12px'
        }}
      >
        REVISION TRACEABILITY
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            '2fr 1.5fr 1fr 1fr',
          gap: '12px'
        }}
      >
        {[
  ['CHANGE REASON', 'changeReason'],
  ['SOURCE DOCUMENT', 'sourceDocument'],
  ['SOURCE REVISION', 'sourceRevision']
].map(([label, field]) => (
  <label
    key={field}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '7px'
    }}
  >
    <span
      style={{
        color: '#8fa0b7',
        fontSize: '9px',
        fontWeight: '700'
      }}
    >
      {label}
    </span>

    <input
      type="text"
      value={
        cargoPositionsRevisionMeta[field]
      }
      onChange={(e) =>
        setCargoPositionsRevisionMeta(
          current => ({
            ...current,
            [field]: e.target.value
          })
        )
      }
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px',
        borderRadius: '7px',
        border:
          '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(0,0,0,0.20)',
        color: '#ffffff',
        outline: 'none'
      }}
    />
  </label>
))}

        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '7px'
          }}
        >
          <span
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700'
            }}
          >
            EFFECTIVE DATE
          </span>

          <input
            type="date"
            value={
              cargoPositionsRevisionMeta.effectiveDate
            }
            onChange={(e) =>
              setCargoPositionsRevisionMeta(
                current => ({
                  ...current,
                  effectiveDate:
                    e.target.value
                })
              )
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background:
                'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </label>
      </div>
      <div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  }}
>
  <button
    type="button"
    disabled={
      savingCargoPositionsRevision ||
      !cargoPositionsRevisionMeta.changeReason.trim() ||
      !cargoPositionsRevisionMeta.sourceDocument.trim() ||
      !cargoPositionsRevisionMeta.effectiveDate
    }
    onClick={async () => {
      try {
        /*
          Validate complete cargo configuration
          before sending anything to Supabase.
        */
        for (const position of editingCargoPositions) {
          const maxWeight =
            Number(position.maxWeight)

          const arm =
            Number(position.arm)

          if (
            position.maxWeight === '' ||
            position.arm === '' ||
            !Number.isFinite(maxWeight) ||
            !Number.isFinite(arm)
          ) {
            alert(
              `${position.positionCode}: all technical values are required.`
            )
            return
          }

          if (maxWeight <= 0) {
            alert(
              `${position.positionCode}: MAX WEIGHT must be greater than zero.`
            )
            return
          }
        }

        if (
          editingCargoPositions.length === 0
        ) {
          alert(
            'Cargo position configuration is empty.'
          )
          return
        }

        setSavingCargoPositionsRevision(true)

        const revision =
          await createCargoPositionsRevision({
            aircraftId:
              selectedPlatformAircraft.id,

            positions:
              editingCargoPositions,

            ...cargoPositionsRevisionMeta
          })

        console.log(
          'CARGO POSITIONS REVISION CREATED:',
          revision
        )

        const refreshed =
          await getAircraftFullData(
            selectedPlatformAircraft.id
          )

        setSelectedPlatformAircraftFullData(
          refreshed
        )

        const refreshedRevisions =
          await getAircraftTechnicalRevisions(
            selectedPlatformAircraft.id
          )

        setSelectedAircraftTechnicalRevisions(
          refreshedRevisions
        )

        await refreshCargoFleet()

        setEditingCargoPositions(null)

      } catch (error) {
        console.error(
          'SAVE CARGO POSITIONS REVISION ERROR:',
          error
        )

        alert(
          error?.message ||
          'Unable to save cargo positions revision.'
        )
      } finally {
        setSavingCargoPositionsRevision(false)
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: '7px',
      border: 'none',

      background:
        savingCargoPositionsRevision ||
        !cargoPositionsRevisionMeta.changeReason.trim() ||
        !cargoPositionsRevisionMeta.sourceDocument.trim() ||
        !cargoPositionsRevisionMeta.effectiveDate
          ? 'rgba(79,140,255,0.25)'
          : '#4f8cff',

      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.6px',

      cursor:
        savingCargoPositionsRevision ||
        !cargoPositionsRevisionMeta.changeReason.trim() ||
        !cargoPositionsRevisionMeta.sourceDocument.trim() ||
        !cargoPositionsRevisionMeta.effectiveDate
          ? 'not-allowed'
          : 'pointer'
    }}
  >
    {savingCargoPositionsRevision
      ? 'SAVING...'
      : 'SAVE REVISION'}
  </button>
</div>
    </div>
  </div>
)}
{editingAircraftData &&
 selectedPlatformAircraft && (
  <div
    style={{
      marginTop: '20px',
      marginBottom: '24px',
      padding: '22px',
      borderRadius: '12px',
      background:
        'rgba(12,22,38,0.92)',
      border:
        '1px solid rgba(79,140,255,0.20)'
    }}
  >
    {/* HEADER */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
      <div>
        <div
          style={{
            color: '#4f8cff',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px'
          }}
        >
          AIRCRAFT DATA REVISION
        </div>

        <div
          style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            marginTop: '4px'
          }}
        >
          {selectedPlatformAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setEditingAircraftData(null)
        }
        style={{
          padding: '7px 12px',
          borderRadius: '6px',
          border:
            '1px solid rgba(255,255,255,0.12)',
          background: 'transparent',
          color: '#9aa8ba',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>

    {/* CERTIFIED WEIGHTS */}
    <div
      style={{
        color: '#8fa0b7',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '1px',
        marginBottom: '12px'
      }}
    >
      CERTIFIED WEIGHTS
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px'
      }}
    >
      {[
        ['DOW', 'dow'],
        ['MZFW', 'mzfw'],
        ['MTOW', 'mtow'],
        ['MRW', 'mrw'],
        ['MLW', 'mlw']
      ].map(([label, field]) => (
        <RevisionInput
          key={field}
          label={label}
          field={field}
          value={
            editingAircraftData?.[field] ?? ''
          }
          setValue={setEditingAircraftData}
        />
      ))}
    </div>
   {/* REVISION TRACEABILITY */}
<div
  style={{
    marginTop: '24px',
    paddingTop: '20px',
    borderTop:
      '1px solid rgba(255,255,255,0.07)'
  }}
>
  <div
    style={{
      color: '#8fa0b7',
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '1px',
      marginBottom: '12px'
    }}
  >
    REVISION TRACEABILITY
    <div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  }}
>
  <button
    type="button"
    disabled={
      savingAircraftDataRevision ||
      !aircraftDataRevisionMeta.changeReason.trim() ||
      !aircraftDataRevisionMeta.sourceDocument.trim() ||
      !aircraftDataRevisionMeta.effectiveDate
    }
    onClick={async () => {
      try {
        setSavingAircraftDataRevision(true)

        const revision =
          await createAircraftDataRevision({
            aircraftId:
              selectedPlatformAircraft.id,

            ...editingAircraftData,
            ...aircraftDataRevisionMeta
          })

        console.log(
          'AIRCRAFT DATA REVISION CREATED:',
          revision
        )

        const refreshed =
          await getAircraftFullData(
            selectedPlatformAircraft.id
          )

        setSelectedPlatformAircraftFullData(
          refreshed
        )

        const refreshedRevisions =
          await getAircraftTechnicalRevisions(
            selectedPlatformAircraft.id
          )

        setSelectedAircraftTechnicalRevisions(
          refreshedRevisions
        )

        await refreshCargoFleet()

        setEditingAircraftData(null)

      } catch (error) {
        console.error(
          'SAVE AIRCRAFT DATA REVISION ERROR:',
          error
        )
      } finally {
        setSavingAircraftDataRevision(false)
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: '7px',
      border: 'none',
      background:
        savingAircraftDataRevision ||
        !aircraftDataRevisionMeta.changeReason.trim() ||
        !aircraftDataRevisionMeta.sourceDocument.trim() ||
        !aircraftDataRevisionMeta.effectiveDate
          ? 'rgba(79,140,255,0.25)'
          : '#4f8cff',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.6px',
      cursor:
        savingAircraftDataRevision ||
        !aircraftDataRevisionMeta.changeReason.trim() ||
        !aircraftDataRevisionMeta.sourceDocument.trim() ||
        !aircraftDataRevisionMeta.effectiveDate
          ? 'not-allowed'
          : 'pointer'
    }}
  >
    {savingAircraftDataRevision
      ? 'SAVING...'
      : 'SAVE REVISION'}
  </button>
</div>
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        '2fr 1.5fr 1fr 1fr',
      gap: '12px'
    }}
  >
    {/* CHANGE REASON */}
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        CHANGE REASON
      </span>

      <input
        type="text"
        value={
          aircraftDataRevisionMeta.changeReason
        }
        onChange={(e) =>
          setAircraftDataRevisionMeta(
            current => ({
              ...current,
              changeReason: e.target.value
            })
          )
        }
        placeholder="Reason for technical revision"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    {/* SOURCE DOCUMENT */}
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        SOURCE DOCUMENT
      </span>

      <input
        type="text"
        value={
          aircraftDataRevisionMeta.sourceDocument
        }
        onChange={(e) =>
          setAircraftDataRevisionMeta(
            current => ({
              ...current,
              sourceDocument: e.target.value
            })
          )
        }
        placeholder="WBM / AFM / approved document"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    {/* SOURCE REVISION */}
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        SOURCE REVISION
      </span>

      <input
        type="text"
        value={
          aircraftDataRevisionMeta.sourceRevision
        }
        onChange={(e) =>
          setAircraftDataRevisionMeta(
            current => ({
              ...current,
              sourceRevision: e.target.value
            })
          )
        }
        placeholder="Revision"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    {/* EFFECTIVE DATE */}
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        EFFECTIVE DATE
      </span>

      <input
        type="date"
        value={
          aircraftDataRevisionMeta.effectiveDate
        }
        onChange={(e) =>
          setAircraftDataRevisionMeta(
            current => ({
              ...current,
              effectiveDate: e.target.value
            })
          )
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
        </label>
  </div>
</div>

  </div>
)}

{editingWeightBalance &&
 selectedPlatformAircraft && (

  <div
    style={{
      marginTop: '18px',
      padding: '24px',
      borderRadius: '16px',
      background:
        'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
      border:
        '1px solid rgba(79,140,255,0.20)'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <div
          style={{
            color: '#4f8cff',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.3px'
          }}
        >
          WEIGHT & BALANCE REVISION
        </div>

        <div
          style={{
            marginTop: '6px',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700'
          }}
        >
          {selectedPlatformAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setEditingWeightBalance(null)
        }
        style={{
          padding: '8px 12px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>
    <div
  style={{
    marginTop: '24px'
  }}
>
  <div
    style={{
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: '700',
      marginBottom: '14px'
    }}
  >
    BASIC CONFIGURATION
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        'repeat(4, minmax(0, 1fr))',
      gap: '14px'
    }}
  >
    {[
      ['Basic Weight', 'basicWeight'],
      ['Basic Index', 'basicIndex'],
      ['Basic Configuration', 'basicConfig'],
      ['Basic Crew', 'basicCrew']
    ].map(([label, field]) => (
      <label
        key={field}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7px'
        }}
      >
        <span
          style={{
            color: '#8fa0b7',
            fontSize: '9px',
            fontWeight: '700'
          }}
        >
          {label.toUpperCase()}
        </span>

        <input
          type={
            field === 'basicConfig' ||
            field === 'basicCrew'
              ? 'text'
              : 'number'
          }
          step="any"
          value={editingWeightBalance[field]}
          onChange={(e) =>
            setEditingWeightBalance(current => ({
              ...current,
              [field]: e.target.value
            }))
          }
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px',
            borderRadius: '7px',
            border:
              '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.20)',
            color: '#ffffff',
            outline: 'none'
          }}
        />
      </label>
    ))}
  </div>
</div>
<div
  style={{
    marginTop: '22px'
  }}
>
  <div
    style={{
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: '700',
      marginBottom: '14px'
    }}
  >
    AIRCRAFT GEOMETRY
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        'repeat(3, minmax(0, 1fr))',
      gap: '14px'
    }}
  >
    {[
      ['Datum', 'datum'],
      ['MAC', 'mac'],
      ['LEMAC', 'lemac']
    ].map(([label, field]) => (
      <RevisionInput
        key={field}
        label={label}
        field={field}
        value={editingWeightBalance[field]}
        setValue={setEditingWeightBalance}
      />
    ))}
  </div>
</div>
<div
  style={{
    marginTop: '22px'
  }}
>
  <div
    style={{
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: '700',
      marginBottom: '14px'
    }}
  >
    INDEX SYSTEM
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        'repeat(3, minmax(0, 1fr))',
      gap: '14px'
    }}
  >
    {[
      ['Reference Arm', 'indexReferenceArm'],
      ['Index Constant', 'indexConstant'],
      ['Index Offset', 'indexOffset']
    ].map(([label, field]) => (
      <RevisionInput
        key={field}
        label={label}
        field={field}
        value={editingWeightBalance[field]}
        setValue={setEditingWeightBalance}
      />
    ))}
  </div>
</div>
<div
  style={{
    marginTop: '22px'
  }}
>
  <div
    style={{
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: '700',
      marginBottom: '14px'
    }}
  >
    STATION ARMS
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        'repeat(3, minmax(0, 1fr))',
      gap: '14px'
    }}
  >
    {[
      ['Seat Arm FWD', 'seatArmFwd'],
      ['Seat Arm MID', 'seatArmMid'],
      ['Seat Arm AFT', 'seatArmAft'],
      ['Fuel Arm', 'fuelArm'],
      ['Forward Cargo Arm', 'forwardCargoArm'],
      ['Aft Cargo Arm', 'aftCargoArm']
    ].map(([label, field]) => (
      <RevisionInput
        key={field}
        label={label}
        field={field}
        value={editingWeightBalance?.[field] ?? ''}
        setValue={setEditingWeightBalance}
      />
    ))}
  </div>
  <div
  style={{
    marginTop: '26px',
    paddingTop: '22px',
    borderTop:
      '1px solid rgba(255,255,255,0.08)'
  }}
>
  <div
    style={{
      color: '#4f8cff',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1.2px',
      marginBottom: '14px'
    }}
  >
    REVISION TRACEABILITY
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        '2fr 1fr 1fr 1fr',
      gap: '14px'
    }}
  >
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        CHANGE REASON
      </span>

      <input
        type="text"
        value={
          weightBalanceRevisionMeta.changeReason
        }
        onChange={(e) =>
          setWeightBalanceRevisionMeta(
            current => ({
              ...current,
              changeReason: e.target.value
            })
          )
        }
        placeholder="Reason for technical revision"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        SOURCE DOCUMENT
      </span>

      <input
        type="text"
        value={
          weightBalanceRevisionMeta.sourceDocument
        }
        onChange={(e) =>
          setWeightBalanceRevisionMeta(
            current => ({
              ...current,
              sourceDocument: e.target.value
            })
          )
        }
        placeholder="WBM / AFM / Weight Report"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        SOURCE REVISION
      </span>

      <input
        type="text"
        value={
          weightBalanceRevisionMeta.sourceRevision
        }
        onChange={(e) =>
          setWeightBalanceRevisionMeta(
            current => ({
              ...current,
              sourceRevision: e.target.value
            })
          )
        }
        placeholder="REV 01"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>

    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        EFFECTIVE DATE
      </span>

      <input
        type="date"
        value={
          weightBalanceRevisionMeta.effectiveDate
        }
        onChange={(e) =>
          setWeightBalanceRevisionMeta(
            current => ({
              ...current,
              effectiveDate: e.target.value
            })
          )
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: '#08182a',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>
  </div>
</div>
<div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '22px'
  }}
>
  <button
    type="button"
    onClick={() =>
      setEditingWeightBalance(null)
    }
    style={{
      padding: '10px 14px',
      borderRadius: '8px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(255,255,255,0.04)',
      color: '#8fa0b7',
      fontSize: '10px',
      fontWeight: '700',
      cursor: 'pointer'
    }}
  >
    CANCEL
  </button>

  <button
    type="button"
    disabled={
      savingWeightBalanceRevision ||
      !weightBalanceRevisionMeta.changeReason.trim() ||
      !weightBalanceRevisionMeta.sourceDocument.trim() ||
      !weightBalanceRevisionMeta.effectiveDate
    }
    onClick={async () => {
      try {
        setSavingWeightBalanceRevision(true)

        const revision =
          await createWeightBalanceRevision({
            aircraftId:
              selectedPlatformAircraft.id,

            ...editingWeightBalance,
            ...weightBalanceRevisionMeta
          })

        console.log(
          'W&B REVISION CREATED:',
          revision
        )
const [
  editingAircraftData,
  setEditingAircraftData
] = useState(null)

const [
  savingAircraftDataRevision,
  setSavingAircraftDataRevision
] = useState(false)

const [
  aircraftDataRevisionMeta,
  setAircraftDataRevisionMeta
] = useState({
    changeReason: '',
    sourceDocument: '',
    sourceRevision: '',
    effectiveDate:
      new Date().toISOString().slice(0, 10)
  })
        const refreshed =
          await getAircraftFullData(
            selectedPlatformAircraft.id
          )

        setSelectedPlatformAircraftFullData(
          refreshed
        )
const refreshedRevisions =
  await getAircraftTechnicalRevisions(
    selectedPlatformAircraft.id
  )

setSelectedAircraftTechnicalRevisions(
  refreshedRevisions
)
        await refreshCargoFleet()

        setEditingWeightBalance(null)

      } catch (error) {
        console.error(
          'SAVE W&B REVISION ERROR:',
          error
        )
      } finally {
        setSavingWeightBalanceRevision(false)
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: '8px',
      border:
        '1px solid rgba(79,140,255,0.40)',
      background:
        'rgba(79,140,255,0.15)',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.7px',
      cursor:
        savingWeightBalanceRevision
          ? 'not-allowed'
          : 'pointer',
      opacity:
        savingWeightBalanceRevision ||
        !weightBalanceRevisionMeta.changeReason.trim() ||
        !weightBalanceRevisionMeta.sourceDocument.trim() ||
        !weightBalanceRevisionMeta.effectiveDate
          ? 0.45
          : 1
    }}
  >
    {savingWeightBalanceRevision
      ? 'SAVING REVISION...'
      : 'SAVE REVISION'}
  </button>
</div>
</div>
  </div>

)}
{showCargoPositionsForm &&
 selectedPlatformAircraft &&
 (selectedPlatformAircraftFullData?.cargoPositions || []).length === 0 && (

  <div
    style={{
      marginTop: '18px',
      padding: '24px',
      borderRadius: '16px',
      background:
        'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
      border:
        '1px solid rgba(79,140,255,0.20)'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <div
          style={{
            color: '#4f8cff',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.3px'
          }}
        >
          CARGO POSITIONS CONFIGURATION
        </div>

        <div
          style={{
            color: '#8fa0b7',
            fontSize: '12px',
            marginTop: '6px'
          }}
        >
          {selectedPlatformAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setShowCargoPositionsForm(false)
        }}
        style={{
          padding: '8px 12px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>

   {/* MAIN DECK */}

<div
  style={{
    marginTop: '24px',
    padding: '18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)'
  }}
>
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }}
  >
    <div
      style={{
        color: '#4f8cff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1.2px'
      }}
    >
      MAIN DECK
    </div>

    <button
      type="button"
      onClick={() => {
        setNewCargoPositions(current => ({
          ...current,
          mainDeck: [
            ...current.mainDeck,
            {
              positionCode: '',
              maxWeight: '',
              arm: ''
            }
          ]
        }))
      }}
      style={{
        padding: '8px 12px',
        borderRadius: '7px',
        border: '1px solid rgba(79,140,255,0.40)',
        background: 'rgba(79,140,255,0.15)',
        color: '#ffffff',
        fontSize: '9px',
        fontWeight: '700',
        cursor: 'pointer'
      }}
    >
      + ADD POSITION
    </button>
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 90px',
      gap: '12px',
      marginBottom: '8px',
      color: '#7f8da0',
      fontSize: '9px',
      fontWeight: '700'
    }}
  >
    <div>POSITION</div>
    <div>MAX WEIGHT</div>
    <div>ARM</div>
    <div></div>
  </div>

  {newCargoPositions.mainDeck.map((position, index) => (
    <CargoPositionEditorRow
      key={`main-${index}`}
      position={position}
      onChange={(field, value) => {
        setNewCargoPositions(current => ({
          ...current,
          mainDeck: current.mainDeck.map((item, itemIndex) =>
            itemIndex === index
              ? { ...item, [field]: value }
              : item
          )
        }))
      }}
      onRemove={() => {
        setNewCargoPositions(current => ({
          ...current,
          mainDeck: current.mainDeck.filter(
            (_, itemIndex) => itemIndex !== index
          )
        }))
      }}
    />
  ))}
</div>


{/* LOWER DECK */}

<div
  style={{
    marginTop: '18px',
    padding: '18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)'
  }}
>
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }}
  >
    <div
      style={{
        color: '#4f8cff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1.2px'
      }}
    >
      LOWER DECK
    </div>

    <button
      type="button"
      onClick={() => {
        setNewCargoPositions(current => ({
          ...current,
          lowerDeck: [
            ...current.lowerDeck,
            {
              positionCode: '',
              maxWeight: '',
              arm: ''
            }
          ]
        }))
      }}
      style={{
        padding: '8px 12px',
        borderRadius: '7px',
        border: '1px solid rgba(79,140,255,0.40)',
        background: 'rgba(79,140,255,0.15)',
        color: '#ffffff',
        fontSize: '9px',
        fontWeight: '700',
        cursor: 'pointer'
      }}
    >
      + ADD POSITION
    </button>
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 90px',
      gap: '12px',
      marginBottom: '8px',
      color: '#7f8da0',
      fontSize: '9px',
      fontWeight: '700'
    }}
  >
    <div>POSITION</div>
    <div>MAX WEIGHT</div>
    <div>ARM</div>
    <div></div>
  </div>

  {newCargoPositions.lowerDeck.map((position, index) => (
    <CargoPositionEditorRow
      key={`lower-${index}`}
      position={position}
      onChange={(field, value) => {
        setNewCargoPositions(current => ({
          ...current,
          lowerDeck: current.lowerDeck.map((item, itemIndex) =>
            itemIndex === index
              ? { ...item, [field]: value }
              : item
          )
        }))
      }}
      onRemove={() => {
        setNewCargoPositions(current => ({
          ...current,
          lowerDeck: current.lowerDeck.filter(
            (_, itemIndex) => itemIndex !== index
          )
        }))
      }}
    />
  ))}
  {/* CARGO ACTIONS */}

<div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '22px'
  }}
>
  <button
    type="button"
    onClick={() => {
      setShowCargoPositionsForm(false)
    }}
    style={{
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.10)',
      background: 'rgba(255,255,255,0.04)',
      color: '#8fa0b7',
      fontSize: '10px',
      fontWeight: '700',
      cursor: 'pointer'
    }}
  >
    CANCEL
  </button>

  <button
    type="button"
    disabled={
      creatingCargoPositions ||
      (
        newCargoPositions.mainDeck.length === 0 &&
        newCargoPositions.lowerDeck.length === 0
      ) ||
      [
        ...newCargoPositions.mainDeck,
        ...newCargoPositions.lowerDeck
      ].some(position =>
        String(position.positionCode).trim() === '' ||
        String(position.maxWeight).trim() === '' ||
        String(position.arm).trim() === ''
      )
    }
    onClick={async () => {
      try {
        setCreatingCargoPositions(true)

        await createCargoPositions({
          aircraftId: selectedPlatformAircraft.id,
          mainDeck: newCargoPositions.mainDeck,
          lowerDeck: newCargoPositions.lowerDeck
        })

        const refreshedFullData =
          await getAircraftFullData(
            selectedPlatformAircraft.id
          )

        setSelectedPlatformAircraftFullData(
          refreshedFullData
        )

        setShowCargoPositionsForm(false)

        setNewCargoPositions({
          mainDeck: [],
          lowerDeck: []
        })

      } catch (error) {
        console.error(
          'CREATE CARGO POSITIONS ERROR:',
          error
        )
      } finally {
        setCreatingCargoPositions(false)
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(79,140,255,0.40)',
      background: 'rgba(79,140,255,0.15)',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.7px',

      cursor:
        creatingCargoPositions ||
        (
          newCargoPositions.mainDeck.length === 0 &&
          newCargoPositions.lowerDeck.length === 0
        ) ||
        [
          ...newCargoPositions.mainDeck,
          ...newCargoPositions.lowerDeck
        ].some(position =>
          String(position.positionCode).trim() === '' ||
          String(position.maxWeight).trim() === '' ||
          String(position.arm).trim() === ''
        )
          ? 'not-allowed'
          : 'pointer',

      opacity:
        creatingCargoPositions ||
        (
          newCargoPositions.mainDeck.length === 0 &&
          newCargoPositions.lowerDeck.length === 0
        ) ||
        [
          ...newCargoPositions.mainDeck,
          ...newCargoPositions.lowerDeck
        ].some(position =>
          String(position.positionCode).trim() === '' ||
          String(position.maxWeight).trim() === '' ||
          String(position.arm).trim() === ''
        )
          ? 0.45
          : 1
    }}
  >
    {creatingCargoPositions
      ? 'SAVING...'
      : 'SAVE CARGO POSITIONS'}
  </button>
</div>
</div>

  </div>
)}
{showAircraftEnvelopesForm &&
 selectedPlatformAircraft &&
 selectedPlatformAircraftFullData?.configuration &&
 (selectedPlatformAircraftFullData?.envelopes || []).length === 0 && (

  <div
    style={{
      marginTop: '18px',
      padding: '24px',
      borderRadius: '16px',
      background:
        'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
      border:
        '1px solid rgba(79,140,255,0.20)'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '22px'
      }}
    >
      <div>
        <div
          style={{
            color: '#4f8cff',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.3px'
          }}
        >
          OPERATIONAL ENVELOPES
        </div>

        <div
          style={{
            color: '#8fa0b7',
            fontSize: '12px',
            marginTop: '6px'
          }}
        >
          {selectedPlatformAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setShowAircraftEnvelopesForm(false)
        }
        style={{
          padding: '8px 12px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>

    {/* COLUMN HEADERS */}

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          '0.7fr 1fr 1fr 1fr 1fr',
        gap: '12px',
        marginBottom: '10px',
        color: '#7f8da0',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '0.7px'
      }}
    >
      <div>PHASE</div>
      <div>INDEX MIN</div>
      <div>INDEX MAX</div>
      <div>CG MIN</div>
      <div>CG MAX</div>
    </div>

    {[
  ['zfw', 'ZFW'],
  ['tow', 'TOW'],
  ['ldw', 'LDW']
].map(([phase, label]) => (

  <div
    key={phase}
    style={{
      display: 'grid',
      gridTemplateColumns:
        '0.7fr 1fr 1fr 1fr 1fr',
      gap: '12px',
      alignItems: 'center',
      padding: '10px 0',
      borderTop:
        '1px solid rgba(255,255,255,0.05)'
    }}
  >
    <div
      style={{
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '700'
      }}
    >
      {label}
    </div>

    {[
      'indexMin',
      'indexMax',
      'cgMin',
      'cgMax'
    ].map(field => (

      <input
        key={field}
        type="number"
        step="any"
        value={
          newAircraftEnvelopes[phase][field]
        }
        onChange={(e) =>
          setNewAircraftEnvelopes(current => ({
            ...current,
            [phase]: {
              ...current[phase],
              [field]: e.target.value
            }
          }))
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />

    ))}

  </div>

))}

{/* ENVELOPE ACTIONS */}

<div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '22px'
  }}
>
  <button
    type="button"
    onClick={() => {
      setShowAircraftEnvelopesForm(false)
    }}
    style={{
      padding: '10px 14px',
      borderRadius: '8px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(255,255,255,0.04)',
      color: '#8fa0b7',
      fontSize: '10px',
      fontWeight: '700',
      cursor: 'pointer'
    }}
  >
    CANCEL
  </button>

  <button
    type="button"
    disabled={
      creatingAircraftEnvelopes ||
      Object.values(newAircraftEnvelopes)
        .some(phase =>
          Object.values(phase).some(
            value =>
              String(value).trim() === ''
          )
        )
    }
    onClick={async () => {
      try {
        setCreatingAircraftEnvelopes(true)

        const created =
          await createAircraftEnvelopes({
            aircraftId:
              selectedPlatformAircraft.id,
            ...newAircraftEnvelopes
          })

        const refreshedFullData =
          await getAircraftFullData(
            selectedPlatformAircraft.id
          )

        setSelectedPlatformAircraftFullData(
          refreshedFullData
        )

        setShowAircraftEnvelopesForm(false)

        setNewAircraftEnvelopes({
          zfw: {
            indexMin: '',
            indexMax: '',
            cgMin: '',
            cgMax: ''
          },
          tow: {
            indexMin: '',
            indexMax: '',
            cgMin: '',
            cgMax: ''
          },
          ldw: {
            indexMin: '',
            indexMax: '',
            cgMin: '',
            cgMax: ''
          }
        })

      } catch (error) {
        console.error(
          'CREATE AIRCRAFT ENVELOPES ERROR:',
          error
        )
      } finally {
        setCreatingAircraftEnvelopes(false)
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: '8px',
      border:
        '1px solid rgba(79,140,255,0.40)',
      background:
        'rgba(79,140,255,0.15)',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.7px',

      cursor:
        creatingAircraftEnvelopes ||
        Object.values(newAircraftEnvelopes)
          .some(phase =>
            Object.values(phase).some(
              value =>
                String(value).trim() === ''
            )
          )
          ? 'not-allowed'
          : 'pointer',

      opacity:
        creatingAircraftEnvelopes ||
        Object.values(newAircraftEnvelopes)
          .some(phase =>
            Object.values(phase).some(
              value =>
                String(value).trim() === ''
            )
          )
          ? 0.45
          : 1
    }}
  >
    {creatingAircraftEnvelopes
      ? 'SAVING...'
      : 'SAVE ENVELOPES'}
  </button>
</div>

</div>
)}
{showAircraftConfigurationForm &&
 selectedPlatformAircraft &&
 !selectedPlatformAircraftFullData?.configuration && (

  <div
    style={{
      marginTop: '18px',
      padding: '24px',
      borderRadius: '16px',
      background:
        'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
      border:
        '1px solid rgba(79,140,255,0.20)'
    }}
  >

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '22px'
      }}
    >
      <div>
        <div
          style={{
            color: '#4f8cff',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.3px'
          }}
        >
          WEIGHT & BALANCE CONFIGURATION
        </div>

        <div
          style={{
            color: '#8fa0b7',
            fontSize: '12px',
            marginTop: '6px'
          }}
        >
          {selectedPlatformAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setShowAircraftConfigurationForm(false)
        }
        style={{
          padding: '8px 12px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>

    {/* BASIC CONFIGURATION */}

    <div
      style={{
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '1px',
        marginBottom: '12px'
      }}
    >
      BASIC CONFIGURATION
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px'
      }}
    >
      {[
        ['basicWeight', 'BASIC WEIGHT', 'number'],
        ['basicIndex', 'BASIC INDEX', 'number'],
        ['basicConfig', 'BASIC CONFIG', 'text'],
        ['basicCrew', 'BASIC CREW', 'text']
      ].map(([field, label, type]) => (
        <div key={field}>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700',
              marginBottom: '6px'
            }}
          >
            {label}
          </div>

          <input
            type={type}
            value={newAircraftConfiguration[field]}
            onChange={(e) =>
              setNewAircraftConfiguration(current => ({
                ...current,
                [field]: e.target.value
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
      ))}
    </div>

    {/* GEOMETRY */}

    <div
      style={{
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '1px',
        marginTop: '22px',
        marginBottom: '12px'
      }}
    >
      AIRCRAFT GEOMETRY
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px'
      }}
    >
      {[
        ['datum', 'DATUM'],
        ['mac', 'MAC'],
        ['lemac', 'LEMAC']
      ].map(([field, label]) => (
        <div key={field}>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700',
              marginBottom: '6px'
            }}
          >
            {label}
          </div>

          <input
            type="number"
            step="any"
            value={newAircraftConfiguration[field]}
            onChange={(e) =>
              setNewAircraftConfiguration(current => ({
                ...current,
                [field]: e.target.value
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
      ))}
    </div>

    {/* INDEX SYSTEM */}

    <div
      style={{
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '1px',
        marginTop: '22px',
        marginBottom: '12px'
      }}
    >
      INDEX SYSTEM
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px'
      }}
    >
      {[
        ['indexReferenceArm', 'REFERENCE ARM'],
        ['indexConstant', 'INDEX CONSTANT'],
        ['indexOffset', 'INDEX OFFSET']
      ].map(([field, label]) => (
        <div key={field}>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700',
              marginBottom: '6px'
            }}
          >
            {label}
          </div>

          <input
            type="number"
            step="any"
            value={newAircraftConfiguration[field]}
            onChange={(e) =>
              setNewAircraftConfiguration(current => ({
                ...current,
                [field]: e.target.value
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
      ))}
    </div>

    {/* ARMS */}

    <div
      style={{
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '1px',
        marginTop: '22px',
        marginBottom: '12px'
      }}
    >
      STATION ARMS
    </div>
<div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '24px'
  }}
>
  <button
    type="button"
    onClick={() => {
      setShowAircraftConfigurationForm(false)
    }}
    style={{
      padding: '10px 14px',
      borderRadius: '8px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(255,255,255,0.04)',
      color: '#8fa0b7',
      fontSize: '10px',
      fontWeight: '700',
      cursor: 'pointer'
    }}
  >
    CANCEL
  </button>

  <button
    type="button"
    disabled={
  creatingAircraftConfiguration ||
  Object.values(newAircraftConfiguration).some(
    value => String(value).trim() === ''
  )
}

    onClick={async () => {
      try {
        setCreatingAircraftConfiguration(true)

        const created =
          await createAircraftConfiguration({
            aircraftId:
              selectedPlatformAircraft.id,
            ...newAircraftConfiguration
          })

        console.log(
          'AIRCRAFT CONFIGURATION CREATED:',
          created
        )

        const refreshedFullData =
          await getAircraftFullData(
            selectedPlatformAircraft.id
          )

        setSelectedPlatformAircraftFullData(
          refreshedFullData
        )

        setShowAircraftConfigurationForm(false)

        setNewAircraftConfiguration({
          datum: '',
          mac: '',
          lemac: '',
          basicWeight: '',
          basicIndex: '',
          indexReferenceArm: '',
          indexConstant: '',
          indexOffset: '',
          basicConfig: '',
          basicCrew: '',
          seatArmFwd: '',
          seatArmMid: '',
          seatArmAft: '',
          fuelArm: '',
          forwardCargoArm: '',
          aftCargoArm: ''
        })

      } catch (error) {
        console.error(
          'CREATE AIRCRAFT CONFIGURATION ERROR:',
          error
        )
      } finally {
        setCreatingAircraftConfiguration(false)
      }
    }}
    style={{
      padding: '10px 16px',
      borderRadius: '8px',
      border:
        '1px solid rgba(79,140,255,0.40)',
      background:
        'rgba(79,140,255,0.15)',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.7px',
      cursor:
  creatingAircraftConfiguration ||
  Object.values(newAircraftConfiguration).some(
    value => String(value).trim() === ''
  )
    ? 'not-allowed'
    : 'pointer',
      opacity:
  creatingAircraftConfiguration ||
  Object.values(newAircraftConfiguration).some(
    value => String(value).trim() === ''
  )
    ? 0.45
    : 1,
    }}
  >
    {creatingAircraftConfiguration
      ? 'SAVING...'
      : 'SAVE CONFIGURATION'}
  </button>
</div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px'
      }}
    >
      {[
        ['seatArmFwd', 'SEAT ARM FWD'],
        ['seatArmMid', 'SEAT ARM MID'],
        ['seatArmAft', 'SEAT ARM AFT'],
        ['fuelArm', 'FUEL ARM'],
        ['forwardCargoArm', 'FORWARD CARGO ARM'],
        ['aftCargoArm', 'AFT CARGO ARM']
      ].map(([field, label]) => (
        <div key={field}>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700',
              marginBottom: '6px'
            }}
          >
            {label}
          </div>

          <input
            type="number"
            step="any"
            value={newAircraftConfiguration[field]}
            onChange={(e) =>
              setNewAircraftConfiguration(current => ({
                ...current,
                [field]: e.target.value
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
      ))}
    </div>

  </div>
)}
    {/* FLEET TITLE */}

    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  }}
>
  <div
    style={{
      color: '#4f8cff',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1.3px'
    }}
  >
    AIRCRAFT FLEET
  </div>

  <button
    type="button"
    onClick={() => {
      setShowNewAircraftForm(
        current => !current
      )
    }}
    style={{
      padding: '9px 14px',
      borderRadius: '8px',
      border:
        '1px solid rgba(79,140,255,0.35)',
      background:
        'rgba(79,140,255,0.10)',
      color: '#4f8cff',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.7px',
      cursor: 'pointer'
    }}
  >
    {showNewAircraftForm
      ? 'CANCEL'
      : '+ ADD AIRCRAFT'}
  </button>
</div>
{showNewAircraftForm && (
  <div
    style={{
      marginBottom: '20px',
      padding: '20px',
      borderRadius: '12px',
      background: 'rgba(79,140,255,0.04)',
      border: '1px solid rgba(79,140,255,0.15)'
    }}
  >
    <div
      style={{
        color: '#4f8cff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1.3px',
        marginBottom: '18px'
      }}
    >
      AIRCRAFT MASTER DATA
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '14px'
      }}
    >
      {[
        ['registration', 'REGISTRATION', 'LV-XXX'],
        ['manufacturer', 'MANUFACTURER', 'Boeing'],
        ['model', 'MODEL', '737'],
        ['variant', 'VARIANT', '800CF'],
        ['aircraftType', 'AIRCRAFT TYPE', 'B737-800CF']
      ].map(([field, label, placeholder]) => (
        <div key={field}>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '0.7px',
              marginBottom: '7px'
            }}
          >
            {label}
          </div>

          <input
            type="text"
            value={newAircraft[field]}
            placeholder={placeholder}
            onChange={(e) =>
              setNewAircraft(current => ({
                ...current,
                [field]: e.target.value
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
      ))}
    </div>

    {/* WEIGHTS */}

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '14px',
        marginTop: '16px'
      }}
    >
      {[
        ['dow', 'DOW'],
        ['mzfw', 'MZFW'],
        ['mtow', 'MTOW'],
        ['mlw', 'MLW'],
        ['mrw', 'MRW']
      ].map(([field, label]) => (
        <div key={field}>
          <div
            style={{
              color: '#8fa0b7',
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '0.7px',
              marginBottom: '7px'
            }}
          >
            {label} · KG
          </div>

          <input
            type="number"
            min="0"
            value={newAircraft[field]}
            onChange={(e) =>
              setNewAircraft(current => ({
                ...current,
                [field]: e.target.value
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </div>
      ))}
    </div>

    {/* CREATE */}

    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px'
      }}
    >
      <button
        type="button"
        disabled={
          creatingAircraft ||
          !newAircraft.registration.trim() ||
          !newAircraft.manufacturer.trim() ||
          !newAircraft.model.trim() ||
          !newAircraft.variant.trim() ||
          !newAircraft.aircraftType.trim() ||
          !newAircraft.dow ||
          !newAircraft.mzfw ||
          !newAircraft.mtow ||
          !newAircraft.mlw ||
          !newAircraft.mrw
        }
        onClick={async () => {
          try {
            setCreatingAircraft(true)

            const created =
              await createAircraft({
                organizationId:
                  selectedPlatformOrganization.id,
                ...newAircraft
              })

            setPlatformOrganizationAircraft(
              current =>
                [...current, created].sort(
                  (a, b) =>
                    a.registration.localeCompare(
                      b.registration
                    )
                )
            )

            console.log(
              'AIRCRAFT CREATED:',
              created
            )

            setNewAircraft({
              registration: '',
              manufacturer: '',
              model: '',
              variant: '',
              aircraftType: '',
              dow: '',
              mzfw: '',
              mtow: '',
              mlw: '',
              mrw: ''
            })

            setShowNewAircraftForm(false)

          } catch (error) {
            console.error(
              'CREATE AIRCRAFT ERROR:',
              error
            )
          } finally {
            setCreatingAircraft(false)
          }
        }}
        style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border:
            '1px solid rgba(79,140,255,0.40)',
          background:
            'rgba(79,140,255,0.15)',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.7px',
          cursor:
            creatingAircraft
              ? 'wait'
              : 'pointer',
          opacity:
            creatingAircraft ||
            !newAircraft.registration.trim() ||
            !newAircraft.manufacturer.trim() ||
            !newAircraft.model.trim() ||
            !newAircraft.variant.trim() ||
            !newAircraft.aircraftType.trim() ||
            !newAircraft.dow ||
            !newAircraft.mzfw ||
            !newAircraft.mtow ||
            !newAircraft.mlw ||
            !newAircraft.mrw
              ? 0.45
              : 1
        }}
      >
        {creatingAircraft
          ? 'CREATING...'
          : 'CREATE AIRCRAFT'}
      </button>
    </div>
  </div>
)}

    {/* FLEET */}

    {platformOrganizationAircraft.map(
      (aircraft) => (

        <div
          key={aircraft.id}
          onClick={async () => {
  try {
    setSelectedPlatformAircraft(aircraft)

    const fullData =
      await getAircraftFullData(aircraft.id)

    setSelectedPlatformAircraftFullData(
      fullData
    )
    const revisions =
  await getAircraftTechnicalRevisions(
    aircraft.id
  )

setSelectedAircraftTechnicalRevisions(
  revisions
)

setShowTechnicalRevisionHistory(false)
  } catch (error) {
    console.error(
      'PLATFORM AIRCRAFT CONFIGURATION ERROR:',
      error
    )
  }
}}
          style={{
            display: 'grid',
            cursor: 'pointer',
            gridTemplateColumns:
  '1fr 1.5fr 1fr 0.8fr 1.2fr 0.7fr',
            gap: '16px',
            padding: '14px 0',
            alignItems: 'center',
            borderTop:
              '1px solid rgba(255,255,255,0.06)'
          }}
        >

          <div
            style={{
              color: '#ffffff',
              fontWeight: '700'
            }}
          >
            {aircraft.registration}
          </div>

          <div
            style={{
              color: '#b9c4d3'
            }}
          >
            {aircraft.aircraft_type}
          </div>

          <div
            style={{
              color: '#8fa0b7',
              fontSize: '12px'
            }}
          >
            {aircraft.manufacturer}
          </div>

          <div
            style={{
              fontSize: '11px',
              fontWeight: '700'
            }}
          >
            {(aircraft.status || '----')
              .toUpperCase()}
          </div>
<div>
  <div
  style={{
    display: 'flex',
    justifyContent: 'flex-end'
  }}
>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation()

      setEditingAircraftId(aircraft.id)

      setEditingAircraft({
        registration: aircraft.registration || '',
        manufacturer: aircraft.manufacturer || '',
        model: aircraft.model || '',
        variant: aircraft.variant || '',
        aircraftType: aircraft.aircraft_type || '',
        status: aircraft.status || 'active'
      })
    }}
    style={{
      padding: '7px 12px',
      borderRadius: '7px',
      border:
        '1px solid rgba(79,140,255,0.35)',
      background:
        'rgba(79,140,255,0.10)',
      color: '#8fb5ff',
      fontSize: '9px',
      fontWeight: '700',
      letterSpacing: '0.6px',
      cursor: 'pointer'
    }}
  >
    EDIT
  </button>
</div>
  <div
    style={{
      fontSize: '11px',
      fontWeight: '700',
      color:
        aircraft.configurationStatus === 'READY'
          ? '#59d98e'
          : aircraft.configurationStatus === 'ERROR'
            ? '#ff6b6b'
            : '#f0b95a'
    }}
  >
    {aircraft.configurationStatus || 'PENDING'}
  </div>

  {aircraft.configurationStatus === 'PENDING' &&
   aircraft.configurationMissing?.length > 0 && (
    <div
      style={{
        marginTop: '4px',
        color: '#8fa0b7',
        fontSize: '9px',
        lineHeight: '1.4'
      }}
    >
      MISSING:{' '}
      {aircraft.configurationMissing.join(', ')}
    </div>
    
  )}
</div>
        </div>

      )
    )}

  </div>

)}
{editingAircraftId && editingAircraft && (

  <div
    style={{
      marginTop: '20px',
      padding: '22px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(79,140,255,0.20)'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
      <div>
        <div
          style={{
            color: '#4f8cff',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.3px'
          }}
        >
          EDIT AIRCRAFT
        </div>

        <div
          style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            marginTop: '6px'
          }}
        >
          {editingAircraft.registration}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setEditingAircraftId(null)
          setEditingAircraft(null)
        }}
        style={{
          padding: '8px 12px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(2, minmax(0, 1fr))',
        gap: '14px'
      }}
    >

      {[
        ['Registration', 'registration'],
        ['Manufacturer', 'manufacturer'],
        ['Model', 'model'],
        ['Variant', 'variant'],
        ['Aircraft Type', 'aircraftType']
      ].map(([label, field]) => (

        <label
          key={field}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '7px'
          }}
        >
          <span
            style={{
              color: '#8fa0b7',
              fontSize: '10px',
              fontWeight: '700'
            }}
          >
            {label}
          </span>

          <input
            type="text"
            value={editingAircraft[field]}
            onChange={(e) =>
              setEditingAircraft(current => ({
                ...current,
                [field]: e.target.value
              }))
            }
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px',
              borderRadius: '7px',
              border:
                '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(0,0,0,0.20)',
              color: '#ffffff',
              outline: 'none'
            }}
          />
        </label>

      ))}

      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7px'
        }}
      >
        <span
          style={{
            color: '#8fa0b7',
            fontSize: '10px',
            fontWeight: '700'
          }}
        >
          STATUS
        </span>

        <select
          value={editingAircraft.status}
          onChange={(e) =>
            setEditingAircraft(current => ({
              ...current,
              status: e.target.value
            }))
          }
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px',
            borderRadius: '7px',
            border:
              '1px solid rgba(255,255,255,0.10)',
            background: '#0a1c32',
            color: '#ffffff',
            outline: 'none'
          }}
        >
          <option value="active">
            ACTIVE
          </option>

          <option value="inactive">
            INACTIVE
          </option>
        </select>
      </label>

    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '22px'
      }}
    >
      <button
        type="button"
        onClick={() => {
          setEditingAircraftId(null)
          setEditingAircraft(null)
        }}
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background:
            'rgba(255,255,255,0.04)',
          color: '#8fa0b7',
          fontSize: '10px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        CANCEL
      </button>

      <button
        type="button"
        disabled={
          updatingAircraft ||
          !editingAircraft.registration.trim() ||
          !editingAircraft.manufacturer.trim() ||
          !editingAircraft.aircraftType.trim()
        }
        onClick={async () => {
          try {
            setUpdatingAircraft(true)

            const updated =
              await updateAircraft({
                aircraftId: editingAircraftId,
                ...editingAircraft
              })

            const updatedFleet =
              platformOrganizationAircraft.map(
                aircraft =>
                  aircraft.id === updated.id
                    ? {
                        ...aircraft,
                        ...updated
                      }
                    : aircraft
              )

            setPlatformOrganizationAircraft(
              updatedFleet
            )
await refreshCargoFleet()
            if (
              selectedPlatformAircraft?.id ===
              updated.id
            ) {
              setSelectedPlatformAircraft(
                current => ({
                  ...current,
                  ...updated
                })
              )
            }

            setEditingAircraftId(null)
            setEditingAircraft(null)

          } catch (error) {
            console.error(
              'AIRCRAFT UPDATE ERROR:',
              error
            )
          } finally {
            setUpdatingAircraft(false)
          }
        }}
        style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border:
            '1px solid rgba(79,140,255,0.40)',
          background:
            'rgba(79,140,255,0.15)',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.7px',
          cursor:
            updatingAircraft
              ? 'not-allowed'
              : 'pointer',
          opacity:
            updatingAircraft
              ? 0.45
              : 1
        }}
      >
        {updatingAircraft
          ? 'SAVING...'
          : 'SAVE CHANGES'}
      </button>
    </div>

  </div>

)}
  </div>
  
)}

{(
  userRole === 'freighter' ||
  userRole === 'admin' ||
  userRole === 'super_admin'
) &&
 activeMenu === 'Flight Records' && (

  <div
    style={{
      flex: 1,
      padding: '40px'
    }}
  >

    {/* HEADER */}

    <div
      style={{
        marginBottom: '32px'
      }}
    >

      <div
        style={{
          color: '#4f8cff',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          marginBottom: '8px'
        }}
      >
        OPERDAT · OPERATIONS
      </div>

      <h1
        style={{
          fontSize: '38px',
          margin: 0,
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}
      >
        FLIGHT RECORDS
      </h1>

      <p
        style={{
          color: '#8fa0b7',
          marginTop: '8px',
          marginBottom: 0,
          fontSize: '14px'
        }}
      >
        Recent freighter operational records
      </p>

    </div>


    {/* EMPTY STATE */}

    {cargoFlightRecords.length === 0 && (

      <div
        style={{
          padding: '50px 30px',
          borderRadius: '16px',

          background:
            'linear-gradient(145deg, rgba(10,28,50,0.92), rgba(5,17,32,0.92))',

          border:
            '1px solid rgba(255,255,255,0.08)',

          color: '#7f8da0',

          textAlign: 'center',

          boxShadow:
            '0 10px 30px rgba(0,0,0,0.18)'
        }}
      >

        <div
          style={{
            fontSize: '13px',
            letterSpacing: '1.5px',
            fontWeight: '600'
          }}
        >
          NO FLIGHT RECORDS AVAILABLE
        </div>

      </div>

    )}

    {/* FLIGHT RECORDS */}

    {filteredHistoryFlights.map(flight => (

        <div
          key={flight.id}

          style={{
            marginBottom: '14px',

            padding: '20px 22px',

            borderRadius: '16px',

            background:
              'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',

            border:
              '1px solid rgba(255,255,255,0.08)',

            boxShadow:
              '0 8px 24px rgba(0,0,0,0.18)'
          }}
        >

          {/* FLIGHT HEADER */}

          <div
            style={{
              display: 'flex',

              justifyContent:
                'space-between',

              alignItems: 'center',

              gap: '20px'
            }}
          >

            <div>

              <strong
                style={{
                  fontSize: '20px',
                  color: '#f4f7fb',
                  letterSpacing: '0.5px'
                }}
              >
                {flight.flightNumber}
              </strong>


              <div
                style={{
                  color: '#8fa0b7',

                  marginTop: '5px',

                  fontSize: '13px'
                }}
              >

                {flight.from}

                <span
                  style={{
                    color: '#4f8cff',
                    margin: '0 8px'
                  }}
                >
                  →
                </span>

                {flight.to}

                <span
                  style={{
                    color: '#556579',
                    margin: '0 8px'
                  }}
                >
                  ·
                </span>

                {flight.registration}

              </div>

            </div>


            {/* STATUS */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',

                padding: '6px 10px',

                borderRadius: '20px',

                background:
                  flight.status === 'OPEN'
                    ? 'rgba(21,101,255,0.12)'
                    : 'rgba(255,255,255,0.05)',

                border:
                  flight.status === 'OPEN'
                    ? '1px solid rgba(21,101,255,0.28)'
                    : '1px solid rgba(255,255,255,0.08)'
              }}
            >

              <div
                style={{
                  width: '7px',

                  height: '7px',

                  borderRadius: '50%',

                  background:
                    flight.status === 'OPEN'
                      ? '#4f8cff'
                      : '#778395',

                  boxShadow:
                    flight.status === 'OPEN'
                      ? '0 0 8px rgba(79,140,255,0.60)'
                      : 'none'
                }}
              />

              <span
                style={{
                  color:
                    flight.status === 'OPEN'
                      ? '#6ea0ff'
                      : '#8d99aa',

                  fontSize: '10px',

                  fontWeight: '700',

                  letterSpacing: '1.3px'
                }}
              >
                {flight.status}
              </span>

            </div>

          </div>


          {/* WEIGHTS */}

          <div
            style={{
              display: 'grid',

              gridTemplateColumns:
                'repeat(3, minmax(120px, 1fr))',

              gap: '12px',

              marginTop: '20px'
            }}
          >

            {/* ZFW */}

            <div
              style={{
                padding: '12px 14px',

                borderRadius: '10px',

                background:
                  'rgba(255,255,255,0.025)',

                border:
                  '1px solid rgba(255,255,255,0.05)'
              }}
            >

              <div
                style={{
                  color: '#7f8da0',

                  fontSize: '10px',

                  letterSpacing: '1.4px',

                  marginBottom: '5px'
                }}
              >
                ZFW
              </div>

              <strong
                style={{
                  fontSize: '16px',
                  color: '#eaf0f7'
                }}
              >
                {Number(
                  flight.zfw
                ).toFixed(0)}
              </strong>

              <span
                style={{
                  marginLeft: '5px',

                  fontSize: '10px',

                  color: '#7f8da0'
                }}
              >
                KG
              </span>

            </div>


            {/* TOW */}

            <div
              style={{
                padding: '12px 14px',

                borderRadius: '10px',

                background:
                  'rgba(255,255,255,0.025)',

                border:
                  '1px solid rgba(255,255,255,0.05)'
              }}
            >

              <div
                style={{
                  color: '#7f8da0',

                  fontSize: '10px',

                  letterSpacing: '1.4px',

                  marginBottom: '5px'
                }}
              >
                TOW
              </div>

              <strong
                style={{
                  fontSize: '16px',
                  color: '#eaf0f7'
                }}
              >
                {Number(
                  flight.tow
                ).toFixed(0)}
              </strong>

              <span
                style={{
                  marginLeft: '5px',

                  fontSize: '10px',

                  color: '#7f8da0'
                }}
              >
                KG
              </span>

            </div>


            {/* LW */}

            <div
              style={{
                padding: '12px 14px',

                borderRadius: '10px',

                background:
                  'rgba(255,255,255,0.025)',

                border:
                  '1px solid rgba(255,255,255,0.05)'
              }}
            >

              <div
                style={{
                  color: '#7f8da0',

                  fontSize: '10px',

                  letterSpacing: '1.4px',

                  marginBottom: '5px'
                }}
              >
                LW
              </div>

              <strong
                style={{
                  fontSize: '16px',
                  color: '#eaf0f7'
                }}
              >
                {Number(
                  flight.lw
                ).toFixed(0)}
              </strong>

              <span
                style={{
                  marginLeft: '5px',

                  fontSize: '10px',

                  color: '#7f8da0'
                }}
              >
                KG
              </span>

            </div>

          </div>


          {/* OPEN FLIGHT ACTIONS */}

          {flight.status === 'OPEN' && (

            <div
              style={{
                display: 'flex',

                gap: '10px',

                marginTop: '18px',

                paddingTop: '16px',

                borderTop:
                  '1px solid rgba(255,255,255,0.06)'
              }}
            >

              <button
                onClick={() =>
                  openFreighterFlight(
                    flight.id
                  )
                }

                style={{
                  padding: '9px 16px',

                  borderRadius: '8px',

                  border:
                    '1px solid rgba(21,101,255,0.45)',

                  background:
                    'rgba(21,101,255,0.16)',

                  color: '#75a5ff',

                  fontSize: '11px',

                  letterSpacing: '0.8px',

                  fontWeight: '700',

                  cursor: 'pointer'
                }}
              >
                OPEN FLIGHT
              </button>


              <button
                onClick={() =>
                  closeFreighterFlight(
                    flight.id
                  )
                }

                style={{
                  padding: '9px 16px',

                  borderRadius: '8px',

                  border:
                    '1px solid rgba(255,255,255,0.12)',

                  background:
                    'rgba(255,255,255,0.04)',

                  color: '#aeb9c8',

                  fontSize: '11px',

                  letterSpacing: '0.8px',

                  fontWeight: '700',

                  cursor: 'pointer'
                }}
              >
                CLOSE FLIGHT
              </button>

            </div>

          )}


          {/* CLOSED FLIGHT */}

        {flight.status === 'CLOSED' && (

  <div
    style={{
      display: 'flex',
      gap: '10px',
      marginTop: '18px'
    }}
  >

    <button
      onClick={() =>
        printClosedFreighterFlight(
          flight
        )
      }

      style={{
        padding: '8px 14px',
        borderRadius: '8px',

        border:
          '1px solid rgba(0,255,140,0.35)',

        background:
          'rgba(0,255,140,0.10)',

        color: '#00ff88',

        fontWeight: '700',

        cursor: 'pointer'
      }}
    >
      LOADSHEET PDF
    </button>


    <button
      onClick={() =>
        printClosedLoadOrder(
          flight
        )
      }

      style={{
        padding: '8px 14px',
        borderRadius: '8px',

        border:
          '1px solid rgba(255,255,255,0.18)',

        background:
          'rgba(255,255,255,0.05)',

        color: '#b8c0cc',

        fontWeight: '700',

        cursor: 'pointer'
      }}
    >
      LOAD ORDER PDF
    </button>

  </div>

)}

        </div>

      )
    )}

  </div>

)}
{activeMenu === 'Flight History' && (

  <div
    style={{
      flex: 1,
      padding: '40px'
    }}
  >

    {/* HEADER */}

    <div
      style={{
        marginBottom: '32px'
      }}
    >

      <div
        style={{
          color: '#4f8cff',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          marginBottom: '8px'
        }}
      >
        OPERDAT · OPERATIONS
      </div>

      <h1
        style={{
          fontSize: '38px',
          margin: 0,
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}
      >
        FLIGHT HISTORY
      </h1>

      <p
        style={{
          color: '#8fa0b7',
          marginTop: '8px',
          marginBottom: 0,
          fontSize: '14px'
        }}
      >
        Complete freighter operational history
      </p>

    </div>
{/* HISTORY FILTERS */}

<div
  style={{
    display: 'flex',
    gap: '12px',
    marginBottom: '28px',
    flexWrap: 'wrap',
    alignItems: 'center'
  }}
>

  {/* SEARCH */}

  <input
    type="text"
    value={historySearch}
    onChange={(e) =>
      setHistorySearch(e.target.value)
    }
    placeholder="Flight, registration, origin or destination"
    style={{
      width: '420px',
maxWidth: '100%',
      padding: '12px 14px',
      borderRadius: '9px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(5,17,32,0.80)',
      color: '#ffffff',
      fontSize: '13px',
      outline: 'none'
    }}
  />


  {/* STATUS */}

  <select
    value={historyStatus}
    onChange={(e) =>
      setHistoryStatus(e.target.value)
    }
    style={{
      padding: '12px 14px',
      borderRadius: '9px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(5,17,32,0.80)',
      color: '#ffffff',
      fontSize: '13px',
      outline: 'none',
      cursor: 'pointer'
    }}
  >
    <option value="ALL">
      All Status
    </option>

    <option value="OPEN">
      Open
    </option>

    <option value="CLOSED">
      Closed
    </option>
  </select>
{userRole === 'admin' && (
  <select
    value={historyUser}
    onChange={(e) =>
      setHistoryUser(e.target.value)
    }
    style={{
      padding: '12px 14px',
      borderRadius: '9px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(5,17,32,0.80)',
      color: '#ffffff',
      fontSize: '13px',
      outline: 'none',
      cursor: 'pointer'
    }}
  >
    <option value="ALL">
      All Users
    </option>

    {[
      ...new Set(
        cargoFlightRecords
          .map(flight => flight.createdByName)
          .filter(Boolean)
      )
    ].map(name => (
      <option
        key={name}
        value={name}
      >
        {name}
      </option>
    ))}

  </select>
)}

  {/* DATE */}

  <input
    type="date"
    value={historyDate}
    onChange={(e) =>
      setHistoryDate(e.target.value)
    }
    style={{
      padding: '11px 14px',
      borderRadius: '9px',
      border:
        '1px solid rgba(255,255,255,0.10)',
      background:
        'rgba(5,17,32,0.80)',
      color: '#ffffff',
      fontSize: '13px',
      outline: 'none'
    }}
  />

</div>
{/* HISTORY SUMMARY */}

<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  }}
>
  <div
    style={{
      color: '#8fa0b7',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '1px'
    }}
  >
    {filteredHistoryFlights.length}{' '}
    {filteredHistoryFlights.length === 1
      ? 'RECORD FOUND'
      : 'RECORDS FOUND'}
  </div>

  {(historySearch ||
    historyStatus !== 'ALL' ||
    historyDate ||
    historyUser !== 'ALL') && (

    <button
      onClick={() => {
        setHistorySearch('')
        setHistoryStatus('ALL')
        setHistoryDate('')
        setHistoryUser('ALL')
      }}
      style={{
        padding: '8px 14px',
        borderRadius: '8px',
        border:
          '1px solid rgba(79,140,255,0.35)',
        background:
          'rgba(79,140,255,0.10)',
        color: '#4f8cff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.8px',
        cursor: 'pointer'
      }}
    >
      CLEAR FILTERS
    </button>

  )}
</div>
    {/* EMPTY STATE */}

    {filteredHistoryFlights.length === 0 && (

      <div
        style={{
          padding: '50px 30px',
          borderRadius: '16px',
          background:
            'linear-gradient(145deg, rgba(10,28,50,0.92), rgba(5,17,32,0.92))',
          border:
            '1px solid rgba(255,255,255,0.08)',
          color: '#7f8da0',
          textAlign: 'center',
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.18)'
        }}
      >

        <div
          style={{
            fontSize: '13px',
            letterSpacing: '1.5px',
            fontWeight: '600'
          }}
        >{cargoFlightRecords.length === 0
  ? 'NO FLIGHT HISTORY AVAILABLE'
  : 'NO RECORDS MATCH THE SELECTED FILTERS'}
          NO FLIGHT HISTORY AVAILABLE
        </div>

      </div>

    )}


    {/* HISTORY */}

    {filteredHistoryFlights.map(flight => (

        <div
          key={flight.id}
          style={{
            marginBottom: '14px',
            padding: '20px 22px',
            borderRadius: '16px',
            background:
              'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
            border:
              '1px solid rgba(255,255,255,0.08)',
            boxShadow:
              '0 8px 24px rgba(0,0,0,0.18)'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px'
            }}
          >

            <div>

              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '6px'
                }}
              >
                {flight.flightNumber || '----'}
              </div>

              <div
                style={{
                  color: '#8fa0b7',
                  fontSize: '13px'
                }}
              >
                {flight.from || '----'}
                {' → '}
                {flight.to || '----'}
                {' · '}
                {flight.registration || '----'}
              </div>

            </div>

            <div
              style={{
                textAlign: 'right'
              }}
            >

              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}
              >
                {flight.status || '----'}
              </div>

              <div
                style={{
                  color: '#8fa0b7',
                  fontSize: '12px',
                  marginTop: '5px'
                }}
              >
                {flight.createdAt
                  ? new Date(
                      flight.createdAt
                    ).toLocaleString()
                  : '----'}
              </div>

            </div>

          </div>

        </div>

      ))}

  </div>

)}
{activeMenu === 'Aircraft Management' && (

  <div
    style={{
      flex: 1,
      padding: '40px'
    }}
  >

    <div
      style={{
        color: '#4f8cff',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '2.5px',
        marginBottom: '8px'
      }}
    >
      OPERDAT · ADMINISTRATION
    </div>

    <h1
      style={{
        fontSize: '38px',
        margin: 0,
        fontWeight: '700',
        letterSpacing: '-0.5px'
      }}
    >
      AIRCRAFT MANAGEMENT
    </h1>

    <p
      style={{
        color: '#8fa0b7',
        marginTop: '8px',
        fontSize: '14px'
      }}
    >
      Organization fleet and aircraft configuration
    </p>

   {/* FLEET SUMMARY */}

<div
  style={{
    marginTop: '30px',
    marginBottom: '16px',
    color: '#8fa0b7',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px'
  }}
>
  {adminAircraft.length}{' '}
  {adminAircraft.length === 1
    ? 'AIRCRAFT'
    : 'AIRCRAFT'}{' '}
  IN ORGANIZATION FLEET
</div>


{/* FLEET TABLE */}

<div
  style={{
    borderRadius: '16px',
    overflow: 'hidden',
    border:
      '1px solid rgba(255,255,255,0.08)',
    background:
      'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.18)'
  }}
>

  {/* TABLE HEADER */}

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        '1.1fr 1.5fr 0.9fr 0.9fr 0.9fr 0.9fr 0.8fr 1.2fr',
      gap: '12px',
      padding: '14px 18px',
      background:
        'rgba(255,255,255,0.035)',
      color: '#7f8da0',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '1px'
    }}
  >
    <div>REGISTRATION</div>
    <div>TYPE</div>
    <div>DOW</div>
    <div>MZFW</div>
    <div>MTOW</div>
    <div>MLW</div>
    <div>STATUS</div>
    <div>ACTION</div>
  </div>


  {/* AIRCRAFT ROWS */}

  {adminAircraft.map((aircraft) => (

    <div
      key={aircraft.id}
      style={{
        display: 'grid',
        gridTemplateColumns:
          '1.1fr 1.5fr 0.9fr 0.9fr 0.9fr 0.9fr 0.8fr 1.2fr',
        gap: '12px',
        padding: '18px',
        alignItems: 'center',
        borderTop:
          '1px solid rgba(255,255,255,0.06)',
        fontSize: '13px'
      }}
    >

      <div
        style={{
          color: '#ffffff',
          fontWeight: '700'
        }}
      >
        {aircraft.registration}
      </div>

      <div
        style={{
          color: '#b9c4d3'
        }}
      >
        {aircraft.aircraft_type}
      </div>

      <div>
        {Number(aircraft.dow).toLocaleString()}
      </div>

      <div>
        {Number(aircraft.mzfw).toLocaleString()}
      </div>

      <div>
        {Number(aircraft.mtow).toLocaleString()}
      </div>

      <div>
        {Number(aircraft.mlw).toLocaleString()}
      </div>

      <div
        style={{
          fontWeight: '700',
          fontSize: '11px',
          letterSpacing: '0.7px'
        }}
      >
        {aircraft.status?.toUpperCase()}
      </div>

      <button
        type="button"
        onClick={async () => {
  try {
    console.log(
  'VIEW CONFIGURATION CLICK:',
  aircraft.id,
  aircraft.registration
)
    setSelectedAdminAircraft(aircraft)

    const fullData =
      await getAircraftFullData(
        aircraft.id
      )

    setSelectedAdminAircraftFullData(
      fullData
    )

    console.log(
      'ADMIN AIRCRAFT FULL DATA:',
      fullData
    )

  } catch (error) {
    console.error(
      'AIRCRAFT CONFIGURATION LOAD ERROR:',
      error
    )
  }
}}
  style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border:
            '1px solid rgba(79,140,255,0.35)',
          background:
            'rgba(79,140,255,0.10)',
          color: '#4f8cff',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.6px',
          cursor: 'pointer'
        }}
      >
        VIEW CONFIGURATION
      </button>

    </div>

  ))}
{selectedAdminAircraft && (

  <div
    style={{
      marginTop: '28px',
      padding: '24px',
      borderRadius: '16px',
      background:
        'linear-gradient(145deg, rgba(10,28,50,0.94), rgba(5,17,32,0.94))',
      border:
        '1px solid rgba(79,140,255,0.20)',
      boxShadow:
        '0 8px 24px rgba(0,0,0,0.18)'
    }}
  >

   <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  }}
>
  <div
    style={{
      color: '#4f8cff',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1.5px'
    }}
  >
    AIRCRAFT CONFIGURATION
  </div>

  <button
    type="button"
    onClick={() => {
      setSelectedAdminAircraft(null)
      setSelectedAdminAircraftFullData(null)
    }}
    title="Close configuration"
    style={{
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.10)',
      background: 'rgba(255,255,255,0.04)',
      color: '#8fa0b7',
      fontSize: '18px',
      cursor: 'pointer'
    }}
  >
    ▲
  </button>
</div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}
    >

      <div>

        <div
          style={{
            fontSize: '26px',
            fontWeight: '700'
          }}
        >
          {selectedAdminAircraft.registration}
        </div>

        <div
          style={{
            color: '#8fa0b7',
            marginTop: '5px',
            fontSize: '13px'
          }}
        >
          {selectedAdminAircraft.manufacturer}{' '}
          {selectedAdminAircraft.model}{' '}
          {selectedAdminAircraft.variant}
        </div>

      </div>

      <div
        style={{
          textAlign: 'right'
        }}
      >
        <div
          style={{
            color: '#8fa0b7',
            fontSize: '10px',
            letterSpacing: '1px'
          }}
        >
          STATUS
        </div>

        <div
          style={{
            marginTop: '5px',
            fontWeight: '700',
            fontSize: '13px'
          }}
        >
          {selectedAdminAircraft.status?.toUpperCase()}
          {selectedAdminAircraftFullData && (

  <div
    style={{
      marginTop: '26px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '18px'
    }}
  >

    {/* AIRCRAFT DATA */}

    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)'
      }}
    >

      <div
        style={{
          color: '#4f8cff',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1.3px',
          marginBottom: '18px'
        }}
      >
        AIRCRAFT DATA
      </div>

      {[
        ['DOW', selectedAdminAircraftFullData.aircraft.dow],
        ['MZFW', selectedAdminAircraftFullData.aircraft.mzfw],
        ['MTOW', selectedAdminAircraftFullData.aircraft.mtow],
        ['MRW', selectedAdminAircraftFullData.aircraft.mrw],
        ['MLW', selectedAdminAircraftFullData.aircraft.mlw]
      ].map(([label, value]) => (

        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '9px 0',
            borderBottom:
              '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <span style={{ color: '#8fa0b7' }}>
            {label}
          </span>

          <span style={{ fontWeight: '600' }}>
            {Number(value).toLocaleString()} kg
          </span>
        </div>

      ))}

    </div>


    {/* W&B CONFIGURATION */}

    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)'
      }}
    >

      <div
        style={{
          color: '#4f8cff',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '1.3px',
          marginBottom: '18px'
        }}
      >
        WEIGHT & BALANCE CONFIGURATION
      </div>

      {[
  ['Basic Weight', selectedAdminAircraftFullData.configuration.basic_weight],
  ['Basic Index', selectedAdminAircraftFullData.configuration.basic_index],

  ['Basic Configuration', selectedAdminAircraftFullData.configuration.basic_config],
  ['Basic Crew', selectedAdminAircraftFullData.configuration.basic_crew],

  ['MAC', selectedAdminAircraftFullData.configuration.mac],
  ['LEMAC', selectedAdminAircraftFullData.configuration.lemac],
  ['Datum', selectedAdminAircraftFullData.configuration.datum],

  ['Index Reference Arm', selectedAdminAircraftFullData.configuration.index_reference_arm],
  ['Index Constant', selectedAdminAircraftFullData.configuration.index_constant],
  ['Index Offset', selectedAdminAircraftFullData.configuration.index_offset],

  ['Seat Arm FWD', selectedAdminAircraftFullData.configuration.seat_arm_fwd],
  ['Seat Arm MID', selectedAdminAircraftFullData.configuration.seat_arm_mid],
  ['Seat Arm AFT', selectedAdminAircraftFullData.configuration.seat_arm_aft],

  ['Fuel Arm', selectedAdminAircraftFullData.configuration.fuel_arm],
  ['Forward Cargo Arm', selectedAdminAircraftFullData.configuration.foward_cargo_arm],
  ['Aft Cargo Arm', selectedAdminAircraftFullData.configuration.aft_cargo_arm]
].map(([label, value]) => (

        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '9px 0',
            borderBottom:
              '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <span style={{ color: '#8fa0b7' }}>
            {label}
          </span>

          <span style={{ fontWeight: '600' }}>
            {value ?? '----'}
          </span>
        </div>

      ))}
{/* OPERATIONAL ENVELOPES */}

<div
  style={{
    marginTop: '18px',
    padding: '20px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)'
  }}
>

  <div
    style={{
      color: '#4f8cff',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1.3px',
      marginBottom: '18px'
    }}
  >
    OPERATIONAL ENVELOPES
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns:
        '0.8fr 1fr 1fr 1fr 1fr',
      gap: '12px',
      paddingBottom: '10px',
      color: '#7f8da0',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.8px'
    }}
  >
    <div>PHASE</div>
    <div>INDEX MIN</div>
    <div>INDEX MAX</div>
    <div>CG MIN</div>
    <div>CG MAX</div>
  </div>

  {selectedAdminAircraftFullData.envelopes.map(
    (envelope) => (

      <div
        key={envelope.id}
        style={{
          display: 'grid',
          gridTemplateColumns:
            '0.8fr 1fr 1fr 1fr 1fr',
          gap: '12px',
          padding: '11px 0',
          borderTop:
            '1px solid rgba(255,255,255,0.05)',
          fontSize: '13px'
        }}
      >

        <div
          style={{
            fontWeight: '700',
            color: '#ffffff'
          }}
        >
          {envelope.phase}
        </div>

        <div>{envelope.index_min}</div>
        <div>{envelope.index_max}</div>

        <div>
          {envelope.cg_min} %
        </div>

        <div>
          {envelope.cg_max} %
        </div>

      </div>

    )
  )}

</div>
{/* CARGO POSITIONS */}

<div
  style={{
    marginTop: '18px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px'
  }}
>

  {/* MAIN DECK */}

  <div
    style={{
      padding: '20px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)'
    }}
  >

    <div
      style={{
        color: '#4f8cff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1.3px',
        marginBottom: '18px'
      }}
    >
      MAIN DECK CARGO POSITIONS
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
        paddingBottom: '9px',
        color: '#7f8da0',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.7px'
      }}
    >
      <div>POSITION</div>
      <div>MAX WEIGHT</div>
      <div>ARM</div>
    </div>

    {selectedAdminAircraftFullData.cargoPositions
      .filter(position =>
        position.deck === 'MAIN'
      )
      .map(position => (

        <div
          key={position.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            padding: '9px 0',
            borderTop:
              '1px solid rgba(255,255,255,0.05)',
            fontSize: '12px'
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontWeight: '700'
            }}
          >
            {position.position_code}
          </div>

          <div>
            {Number(
              position.max_weight
            ).toLocaleString()} kg
          </div>

          <div>
            {position.arm}
          </div>
        </div>

      ))}

  </div>


  {/* LOWER DECK */}

  <div
    style={{
      padding: '20px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)'
    }}
  >

    <div
      style={{
        color: '#4f8cff',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1.3px',
        marginBottom: '18px'
      }}
    >
      LOWER DECK CARGO POSITIONS
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
        paddingBottom: '9px',
        color: '#7f8da0',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.7px'
      }}
    >
      <div>POSITION</div>
      <div>MAX WEIGHT</div>
      <div>ARM</div>
    </div>

    {selectedAdminAircraftFullData.cargoPositions
      .filter(position =>
        position.deck === 'LOWER'
      )
      .map(position => (

        <div
          key={position.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            padding: '9px 0',
            borderTop:
              '1px solid rgba(255,255,255,0.05)',
            fontSize: '12px'
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontWeight: '700'
            }}
          >
            {position.position_code}
          </div>

          <div>
            {Number(
              position.max_weight
            ).toLocaleString()} kg
          </div>

          <div>
            {position.arm}
          </div>
        </div>

      ))}

  </div>

</div>
    </div>

  </div>

)}

        </div>
      </div>

    </div>

  </div>

)}
</div>

  </div>

)}
{activeMenu === 'Fuel' && (

  <div

    style={{

      flex: 1,

      padding: '40px'

    }}

  >

    <h1

      style={{

        fontSize: '42px',

        margin: 0,

        marginBottom: '30px'

      }}

    >

      Fuel

    </h1>


    <div>

      <label>

        Ramp Fuel (kg)

      </label>

      <input

        type="number"

        value={fuel === 0 ? '' : fuel}

        onChange={(e) => {

          const value =
            parseInt(e.target.value) || 0

          setFuel(

            Math.min(
              value,
              20598
            )

          )

        }}

      />

    </div>


    <div

      style={{

        marginTop: '25px',

        marginBottom: '20px'

      }}

    >

      <label>

        Taxi Fuel (kg)

      </label>

      <input

        type="number"

        value={taxiFuel === 0 ? '' : taxiFuel}

        onChange={(e) => {

          setTaxiFuel(

            parseInt(e.target.value) || 0

          )

        }}

      />


      <div

        style={{

          marginTop: '20px',

          marginBottom: '20px'

        }}

      >

        <label>

          Takeoff Fuel (kg)

        </label>

        <input

          type="number"

          value={fuelData.takeoffFuel === 0 ? '' : fuelData.takeoffFuel}

          readOnly

        />

      </div>


      <label>

        Trip Fuel (kg)

      </label>

      <input

        type="number"

        value={tripFuel === 0 ? '' : tripFuel}

        onChange={(e) => {

          setTripFuel(

            parseInt(e.target.value) || 0

          )

        }}

      />

    </div>

  </div>

)}

</div>

)

}
function RevisionInput({
  label,
  field,
  value,
  setValue
}) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px'
      }}
    >
      <span
        style={{
          color: '#8fa0b7',
          fontSize: '9px',
          fontWeight: '700'
        }}
      >
        {label.toUpperCase()}
      </span>

      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) =>
          setValue(current => ({
            ...current,
            [field]: e.target.value
          }))
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '7px',
          border:
            '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.20)',
          color: '#ffffff',
          outline: 'none'
        }}
      />
    </label>
  )
}
export default App
import { supabase } from '../lib/supabase'

export async function getAircraft() {
  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .order('registration')

  if (error) {
    console.error('Error loading aircraft:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })

    throw error
  }

  return data
}

export function adaptSupabaseAircraft(fullData) {
  const {
    aircraft,
    configuration,
    envelopes,
    cargoPositions
  } = fullData

  const envelope = {}

  envelopes.forEach((item) => {
    envelope[item.phase.toLowerCase()] = {
      indexMin: Number(item.index_min),
      indexMax: Number(item.index_max),
      cgMin: Number(item.cg_min),
      cgMax: Number(item.cg_max)
    }
  })

const mapCargoPosition = (position) => ({
  id: position.position_code,
  max: Number(position.max_weight),
  arm: Number(position.arm)
})

const cargoConfig = {
  mainDeck: cargoPositions
    .filter((position) => position.deck === 'MAIN')
    .map(mapCargoPosition),

  lowerDeck: cargoPositions
    .filter((position) => position.deck === 'LOWER')
    .map(mapCargoPosition)
}

  return {
    registration: aircraft.registration,
    manufacturer: aircraft.manufacturer,
    model: aircraft.model,
    variant: aircraft.variant,
    type: aircraft.aircraft_type,

    basicWeight: Number(configuration.basic_weight),
    basicIndex: Number(configuration.basic_index),

    maxZFW: Number(aircraft.mzfw),
    maxTOW: Number(aircraft.mtow),
    maxRW: Number(aircraft.mrw),
    maxLW: Number(aircraft.mlw),

    datum: Number(configuration.datum),
    mac: Number(configuration.mac),
    lemac: Number(configuration.lemac),

    indexReferenceArm: Number(configuration.index_reference_arm),
    indexConstant: Number(configuration.index_constant),
    indexOffset: Number(configuration.index_offset),

    basicConfig: configuration.basic_config,
    basicCrew: configuration.basic_crew,

    seatArmFwd: Number(configuration.seat_arm_fwd),
    seatArmMid: Number(configuration.seat_arm_mid),
    seatArmAft: Number(configuration.seat_arm_aft),

    fuelArm: Number(configuration.fuel_arm),
    forwardCargoArm: Number(configuration.foward_cargo_arm),
    aftCargoArm: Number(configuration.aft_cargo_arm),

    envelope,
    cargoConfig
  }
}

export async function getAircraftFullData(aircraftId) {
  const { data: aircraft, error: aircraftError } = await supabase
    .from('aircraft')
    .select('*')
    .eq('id', aircraftId)
    .single()

  if (aircraftError) throw aircraftError

  const { data: configuration, error: configurationError } = await supabase
    .from('aircraft_configurations')
    .select('*')
    .eq('aircraft_id', aircraftId)
    .single()

  if (configurationError) throw configurationError

  const { data: envelopes, error: envelopesError } = await supabase
    .from('aircraft_envelopes')
    .select('*')
    .eq('aircraft_id', aircraftId)
    .order('id')

  if (envelopesError) throw envelopesError

  const { data: cargoPositions, error: cargoError } = await supabase
    .from('cargo_positions')
    .select('*')
    .eq('aircraft_id', aircraftId)
    .order('id')

  if (cargoError) throw cargoError

  return {
    aircraft,
    configuration,
    envelopes,
    cargoPositions,
  }
  
}
export async function getCargoAircraftFleet() {
  const aircraftList = await getAircraft()

  const cargoAircraft = aircraftList.filter(
    (item) => item.aircraft_type === 'B737-800CF'
  )

  const adaptedFleet = []

  for (const aircraft of cargoAircraft) {
    const fullData = await getAircraftFullData(aircraft.id)
    const adaptedAircraft = adaptSupabaseAircraft(fullData)

    adaptedFleet.push(adaptedAircraft)
  }

  return adaptedFleet
}
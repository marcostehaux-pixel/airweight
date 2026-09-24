import { supabase } from '../lib/supabase'

export async function getFreighterFlights() {
  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('FLIGHTS SUPABASE ERROR:', error)
    throw error
  }

  console.log('FLIGHTS FROM SUPABASE:', data)

  return data || []
}
export function adaptFreighterFlightToSupabase({
  flightData,
  currentUser,
  aircraftId
}) {
  return {
    organization_id: currentUser?.organizationId,
    aircraft_id: aircraftId,
    created_by: currentUser?.id,
    created_by_name:
      currentUser?.fullName ||
      currentUser?.email ||
      null,

    flight_number:
      flightData.flightNumber || '----',

    flight_date:
      new Date().toISOString().slice(0, 10),

    origin:
      flightData.from || '----',

    destination:
      flightData.to || '----',

    status:
      flightData.status || 'OPEN',

    zfw:
      flightData.zfw ?? null,

    tow:
      flightData.tow ?? null,

    lw:
      flightData.lw ?? null,

zf_index:
  flightData.zfwIndex ?? null,

tow_index:
  flightData.towIndex ?? null,

lw_index:
  flightData.lwIndex ?? null,

zf_cg:
  flightData.zfwCg ?? null,

tow_cg:
  flightData.towCg ?? null,

lw_cg:
  flightData.lwCg ?? null,

    ramp_fuel:
      flightData.rampFuel ?? null,

    taxi_fuel:
      flightData.taxiFuel ?? null,

    trip_fuel:
      flightData.tripFuel ?? null,

    payload:
      flightData.totalCargo ?? null,

    metar_from:
      flightData.cargoMetarFrom || null,

    metar_to:
      flightData.cargoMetarTo || null,

    flight_data: flightData
  }
}
export function adaptSupabaseFlightToOperdat(row) {
  const savedData = row.flight_data || {}

  return {
    ...savedData,

    // Supabase record identity
    id: row.id,

    createdAt: row.created_at,
    createdBy: row.created_by,
    createdByName: row.created_by_name,

    // Core flight information
    flightNumber:
      row.flight_number ||
      savedData.flightNumber ||
      '----',

    from:
      row.origin ||
      savedData.from ||
      '----',

    to:
      row.destination ||
      savedData.to ||
      '----',

    status:
      row.status ||
      savedData.status ||
      'OPEN',

    // Operational values
    zfw:
      row.zfw ?? savedData.zfw ?? 0,

    tow:
      row.tow ?? savedData.tow ?? 0,

    lw:
      row.lw ?? savedData.lw ?? 0,

    rampFuel:
      row.ramp_fuel ??
      savedData.rampFuel ??
      0,

    taxiFuel:
      row.taxi_fuel ??
      savedData.taxiFuel ??
      0,

    tripFuel:
      row.trip_fuel ??
      savedData.tripFuel ??
      0,

    zfwIndex:
      row.zf_index ??
      savedData.zfwIndex ??
      null,

    towIndex:
      row.tow_index ??
      savedData.towIndex ??
      null,

    lwIndex:
      row.lw_index ??
      savedData.lwIndex ??
      null,

    zfwCg:
      row.zf_cg ??
      savedData.zfwCg ??
      null,

    towCg:
      row.tow_cg ??
      savedData.towCg ??
      null,

    lwCg:
      row.lw_cg ??
      savedData.lwCg ??
      null,

    cargoMetarFrom:
      row.metar_from ??
      savedData.cargoMetarFrom ??
      '',

    cargoMetarTo:
      row.metar_to ??
      savedData.cargoMetarTo ??
      '',

    closedAt:
      row.closed_at ?? null,

    // Keep database identifiers available
    organizationId: row.organization_id,
    aircraftId: row.aircraft_id,

    // Important: identifies this as a DB record
    source: 'supabase'
  }
}
export async function createFreighterFlight(flight) {
  const { data, error } = await supabase
    .from('flights')
    .insert(flight)
    .select()
    .single()

  if (error) {
    console.error(
      'CREATE FLIGHT SUPABASE ERROR:',
      error
    )
    throw error
  }

  console.log(
    'FLIGHT CREATED IN SUPABASE:',
    data
  )

  return data
}
export async function updateFreighterFlight(
  flightId,
  flight
) {
  const { data, error } = await supabase
    .from('flights')
    .update(flight)
    .eq('id', flightId)
    .select()
    .single()

  if (error) {
    console.error(
      'UPDATE FLIGHT SUPABASE ERROR:',
      error
    )
    throw error
  }

  console.log(
    'FLIGHT UPDATED IN SUPABASE:',
    data
  )

  return data
}
export async function closeFreighterFlightInSupabase(
  flightId
) {
  const closedAt = new Date().toISOString()

  const { data, error } = await supabase
    .from('flights')
    .update({
      status: 'CLOSED',
      closed_at: closedAt
    })
    .eq('id', flightId)
    .select()
    .single()

  if (error) {
    console.error(
      'CLOSE FLIGHT SUPABASE ERROR:',
      error
    )
    throw error
  }

  console.log(
    'FLIGHT CLOSED IN SUPABASE:',
    data
  )

  return data
}
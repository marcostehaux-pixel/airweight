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
    id: aircraft.id,
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
    .maybeSingle()

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
export async function createAircraft({
  organizationId,
  registration,
  manufacturer,
  model,
  variant,
  aircraftType,
  dow,
  mzfw,
  mtow,
  mlw,
  mrw
}) {
  const { data, error } = await supabase
    .from('aircraft')
    .insert({
      organization_id: organizationId,
      registration: registration.trim().toUpperCase(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      variant: variant.trim(),
      aircraft_type: aircraftType.trim(),
      dow: Number(dow),
      mzfw: Number(mzfw),
      mtow: Number(mtow),
      mlw: Number(mlw),
      mrw: Number(mrw),
      status: 'active'
    })
    .select()
    .single()

  if (error) {
    console.error(
      'AIRCRAFT CREATE ERROR:',
      error
    )

    throw error
  }

  return data
}
export async function updateAircraft({
  aircraftId,
  registration,
  manufacturer,
  model,
  variant,
  aircraftType,
  status
}) {
  const { data, error } = await supabase
    .from('aircraft')
    .update({
      registration: registration.trim().toUpperCase(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      variant: variant.trim(),
      aircraft_type: aircraftType.trim(),
      status
    })
    .eq('id', aircraftId)
    .select()
    .single()

  if (error) {
    console.error(
      'AIRCRAFT UPDATE ERROR:',
      error
    )

    throw error
  }

  return data
}
export async function createAircraftConfiguration({
  aircraftId,
  datum,
  mac,
  lemac,
  basicWeight,
  basicIndex,
  indexReferenceArm,
  indexConstant,
  indexOffset,
  basicConfig,
  basicCrew,
  seatArmFwd,
  seatArmMid,
  seatArmAft,
  fuelArm,
  forwardCargoArm,
  aftCargoArm
}) {
  
  const { data, error } = await supabase
    .from('aircraft_configurations')
    .insert({
      aircraft_id: aircraftId,

      datum: Number(datum),
      mac: Number(mac),
      lemac: Number(lemac),

      basic_weight: Number(basicWeight),
      basic_index: Number(basicIndex),

      index_reference_arm:
        Number(indexReferenceArm),

      index_constant:
        Number(indexConstant),

      index_offset:
        Number(indexOffset),

      basic_config:
        basicConfig.trim(),

      basic_crew:
        basicCrew.trim(),

      seat_arm_fwd:
        Number(seatArmFwd),

      seat_arm_mid:
        Number(seatArmMid),

      seat_arm_aft:
        Number(seatArmAft),

      fuel_arm:
        Number(fuelArm),

      forward_cargo_arm:
        Number(forwardCargoArm),

      aft_cargo_arm:
        Number(aftCargoArm)
    })
    .select()
    .single()

  if (error) {
    console.error(
      'AIRCRAFT CONFIGURATION CREATE ERROR:',
      error
    )

    throw error
  }

  return data
}
export async function createAircraftEnvelopes({
  aircraftId,
  zfw,
  tow,
  ldw
}) {
  const rows = [
    {
      aircraft_id: aircraftId,
      phase: 'ZFW',
      index_min: Number(zfw.indexMin),
      index_max: Number(zfw.indexMax),
      cg_min: Number(zfw.cgMin),
      cg_max: Number(zfw.cgMax)
    },
    {
      aircraft_id: aircraftId,
      phase: 'TOW',
      index_min: Number(tow.indexMin),
      index_max: Number(tow.indexMax),
      cg_min: Number(tow.cgMin),
      cg_max: Number(tow.cgMax)
    },
    {
      aircraft_id: aircraftId,
      phase: 'LDW',
      index_min: Number(ldw.indexMin),
      index_max: Number(ldw.indexMax),
      cg_min: Number(ldw.cgMin),
      cg_max: Number(ldw.cgMax)
    }
  ]

  const { data, error } = await supabase
    .from('aircraft_envelopes')
    .insert(rows)
    .select()

  if (error) {
    console.error(
      'AIRCRAFT ENVELOPES CREATE ERROR:',
      error
    )

    throw error
  }

  return data
}
export async function createCargoPositions({
  aircraftId,
  mainDeck,
  lowerDeck
}) {
  const rows = [
    ...mainDeck.map(position => ({
      aircraft_id: aircraftId,
      deck: 'MAIN',
      position_code: position.positionCode.trim(),
      max_weight: Number(position.maxWeight),
      arm: Number(position.arm)
    })),

    ...lowerDeck.map(position => ({
      aircraft_id: aircraftId,
      deck: 'LOWER',
      position_code: position.positionCode.trim(),
      max_weight: Number(position.maxWeight),
      arm: Number(position.arm)
    }))
  ]

  if (rows.length === 0) {
    throw new Error(
      'At least one cargo position is required'
    )
  }

  const { data, error } = await supabase
    .from('cargo_positions')
    .insert(rows)
    .select()

  if (error) {
    console.error(
      'CARGO POSITIONS CREATE ERROR:',
      error
    )

    throw error
  }

  return data
}
export async function getCargoAircraftFleet() {
  const aircraftList = await getAircraft()

  // Only active aircraft are candidates for operational use
  const activeAircraft = aircraftList.filter(
    (item) => item.status === 'active'
  )

  const adaptedFleet = []

  for (const aircraft of activeAircraft) {
    try {
      const fullData =
        await getAircraftFullData(aircraft.id)

      // W&B configuration required
      if (!fullData?.configuration) {
        console.warn(
          `AIRCRAFT ${aircraft.registration} SKIPPED: W&B configuration missing`
        )
        continue
      }

      // Operational envelopes required
      if (
        !fullData?.envelopes ||
        fullData.envelopes.length === 0
      ) {
        console.warn(
          `AIRCRAFT ${aircraft.registration} SKIPPED: operational envelopes missing`
        )
        continue
      }

      // Cargo positions required
      if (
        !fullData?.cargoPositions ||
        fullData.cargoPositions.length === 0
      ) {
        console.warn(
          `AIRCRAFT ${aircraft.registration} SKIPPED: cargo positions missing`
        )
        continue
      }

      const adaptedAircraft =
        adaptSupabaseAircraft(fullData)

      adaptedFleet.push(adaptedAircraft)

    } catch (error) {
      console.warn(
        `AIRCRAFT ${aircraft.registration} SKIPPED: technical data incomplete`,
        error
      )
    }
  }

  return adaptedFleet
}
export async function getAircraftConfigurationStatus(
  aircraftList
) {
  const results = await Promise.all(
    aircraftList.map(async (aircraft) => {
      try {
        const fullData =
          await getAircraftFullData(aircraft.id)

        const hasConfiguration =
          Boolean(fullData?.configuration)

        const hasEnvelopes =
          (fullData?.envelopes || []).length > 0

        const hasCargoPositions =
          (fullData?.cargoPositions || []).length > 0

        const missing = []

        if (!hasConfiguration) {
          missing.push('W&B')
        }

        if (!hasEnvelopes) {
          missing.push('ENVELOPES')
        }

        if (!hasCargoPositions) {
          missing.push('CARGO')
        }

        return {
          ...aircraft,

          configurationStatus:
            missing.length === 0
              ? 'READY'
              : 'PENDING',

          configurationMissing: missing,

          hasConfiguration,
          hasEnvelopes,
          hasCargoPositions
        }

      } catch (error) {
        console.error(
          `AIRCRAFT ${aircraft.registration} STATUS ERROR:`,
          error
        )

        return {
          ...aircraft,
          configurationStatus: 'ERROR',
          configurationMissing: [],
          hasConfiguration: false,
          hasEnvelopes: false,
          hasCargoPositions: false
        }
      }
    })
  )

  return results
}
import { supabase } from '../lib/supabase'

export async function getOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name')

  if (error) {
    console.error('ORGANIZATIONS LOAD ERROR:', error)
    throw error
  }

  return data || []
}
export async function createOrganization({
  name,
  code
}) {
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      status: 'active'
    })
    .select()
    .single()

  if (error) {
    console.error(
      'ORGANIZATION CREATE ERROR:',
      error
    )

    throw error
  }

  return data
}
export async function updateOrganization(
  organizationId,
  updates
) {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', organizationId)
    .select()
    .single()

  if (error) {
    console.error(
      'ORGANIZATION UPDATE ERROR:',
      error
    )
    throw error
  }

  return data
}
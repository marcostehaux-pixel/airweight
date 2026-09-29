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
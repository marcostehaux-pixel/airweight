import { supabase } from '../lib/supabase'

export async function createPlatformUser({
  email,
  password,
  fullName,
  username,
  role,
  organizationId
}) {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if (sessionError) {
    throw sessionError
  }

  if (!session?.access_token) {
    throw new Error(
      'No active authenticated session'
    )
  }

  const response = await fetch(
    '/api/admin/users',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${session.access_token}`
      },

     body: JSON.stringify({
  email,
  password,
  fullName,
  username,
  role,
  organizationId
})
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result?.error ||
      'Could not create platform user'
    )
  }

  return result.user
}
export async function getPlatformUsers() {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if (sessionError) {
    throw sessionError
  }

  if (!session?.access_token) {
    throw new Error(
      'No active authenticated session'
    )
  }

  const response = await fetch(
    '/api/admin/users',
    {
      method: 'GET',
      headers: {
        Authorization:
          `Bearer ${session.access_token}`
      }
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result?.error ||
      'Could not load platform users'
    )
  }

  return result.users || []
}
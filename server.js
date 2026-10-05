import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({
  path: '.env.local'
})

const { supabaseAdmin } = await import(
  './src/services/supabaseAdmin.js'
)

const app = express()
app.use(express.json())
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ============================
// USERNAME LOGIN
// ============================

app.post('/api/auth/login', async (req, res) => {
  try {
    const username =
      String(req.body?.username || '')
        .trim()
        .toLowerCase()

    const password =
      String(req.body?.password || '')

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      })
    }

    // Find OPERDAT profile by username
    const {
      data: profile,
      error: profileError
    } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        full_name,
        username,
        role,
        status,
        organization_id
      `)
      .ilike('username', username)
      .single()

    if (
      profileError ||
      !profile ||
      profile.status !== 'active'
    ) {
      return res.status(401).json({
        error: 'Invalid credentials'
      })
    }

    // Obtain the corresponding Auth user
    const {
      data: authData,
      error: authError
    } = await supabaseAdmin.auth.admin.getUserById(
      profile.id
    )

    if (
      authError ||
      !authData?.user?.email
    ) {
      return res.status(401).json({
        error: 'Invalid credentials'
      })
    }

    // Password validation is still performed by Supabase Auth
    const loginClient = createClient(
      process.env.SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )

    const {
      data: loginData,
      error: loginError
    } = await loginClient.auth.signInWithPassword({
      email: authData.user.email,
      password
    })

    if (
      loginError ||
      !loginData?.session ||
      !loginData?.user
    ) {
      return res.status(401).json({
        error: 'Invalid credentials'
      })
    }

    return res.status(200).json({
      session: loginData.session,
      profile: {
        id: profile.id,
        fullName: profile.full_name,
        username: profile.username,
        role: profile.role,
        status: profile.status,
        organizationId:
          profile.organization_id
      }
    })

  } catch (error) {
    console.error(
      'USERNAME LOGIN ERROR:',
      error
    )

    return res.status(500).json({
      error: 'Unable to sign in'
    })
  }
})
// ============================
// ADMIN AUTHENTICATION
// ============================

async function requireSuperAdmin(req, res, next) {
  try {
    const authHeader =
      req.headers.authorization || ''

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required'
      })
    }

    const {
      data: { user },
      error: userError
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return res.status(401).json({
        error: 'Invalid or expired session'
      })
    }

    const {
      data: profile,
      error: profileError
    } = await supabaseAdmin
      .from('profiles')
      .select('id, role, status')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return res.status(403).json({
        error: 'User profile not found'
      })
    }

    if (
      profile.role !== 'super_admin' ||
      profile.status !== 'active'
    ) {
      return res.status(403).json({
        error: 'Super Admin access required'
      })
    }

    req.authUser = user
    req.authProfile = profile

    next()
  } catch (error) {
    console.error(
      'ADMIN AUTH ERROR:',
      error
    )

    return res.status(500).json({
      error: 'Authentication verification failed'
    })
  }
}
// ============================
// ADMIN AUTH TEST
// ============================

app.get(
  '/api/admin/test',
  requireSuperAdmin,
  async (req, res) => {
    return res.status(200).json({
      ok: true,
      message: 'Super Admin authenticated',
      userId: req.authUser.id
    })
  }
)
// ============================
// LIST PLATFORM USERS
// ============================

app.get(
  '/api/admin/users',
  requireSuperAdmin,
  async (req, res) => {
    try {
      const {
        data: profiles,
        error
      } = await supabaseAdmin
        .from('profiles')
        .select(`
          id,
          full_name,
          username,
          role,
          status,
          organization_id,
          organizations (
            id,
            name,
            code
          )
        `)
        .order('full_name')

      if (error) {
        console.error(
          'LIST PLATFORM USERS ERROR:',
          error
        )

        return res.status(500).json({
          error:
            'Could not load platform users'
        })
      }

      const users = (profiles || []).map(
        profile => ({
          id: profile.id,
          fullName: profile.full_name,
          username: profile.username,
          role: profile.role,
          status: profile.status,
          organizationId:
            profile.organization_id,
          organizationName:
            profile.organizations?.name ||
            'OPERDAT PLATFORM',
          organizationCode:
            profile.organizations?.code ||
            null
        })
      )

      return res.status(200).json({
        users
      })

    } catch (error) {
      console.error(
        'LIST PLATFORM USERS ERROR:',
        error
      )

      return res.status(500).json({
        error:
          'Could not load platform users'
      })
    }
  }
)
// ============================
// CREATE PLATFORM USER
// ============================

app.post(
  '/api/admin/users',
  requireSuperAdmin,
  async (req, res) => {
    try {
      const {
        email,
        password,
        fullName,
        username,
        role,
        organizationId
      } = req.body || {}

      const normalizedEmail =
        String(email || '')
          .trim()
          .toLowerCase()

      const normalizedFullName =
        String(fullName || '').trim()

      const normalizedUsername =
        String(username || '')
          .trim()
          .toLowerCase()

      const normalizedRole =
        String(role || '')
          .trim()
          .toLowerCase()

      const numericOrganizationId =
        Number(organizationId)

      const allowedRoles = [
        'admin',
        'freighter',
        'student'
      ]

      // ============================
      // REQUIRED FIELDS
      // ============================

      if (
        !normalizedEmail ||
        !normalizedFullName ||
        !normalizedUsername ||
        !password
      ) {
        return res.status(400).json({
          error:
            'Email, username, password and full name are required'
        })
      }

      // ============================
      // USERNAME FORMAT
      // ============================

      if (
        !/^[a-z0-9._-]{3,40}$/.test(
          normalizedUsername
        )
      ) {
        return res.status(400).json({
          error:
            'Username must contain 3-40 characters using letters, numbers, dots, hyphens or underscores'
        })
      }

      // ============================
      // ROLE
      // ============================

      if (
        !allowedRoles.includes(
          normalizedRole
        )
      ) {
        return res.status(400).json({
          error: 'Invalid user role'
        })
      }

      // ============================
      // ORGANIZATION
      // ============================

      if (
        !Number.isInteger(
          numericOrganizationId
        ) ||
        numericOrganizationId <= 0
      ) {
        return res.status(400).json({
          error:
            'Valid organization is required'
        })
      }

      // ============================
      // PASSWORD
      // ============================

      if (
        String(password).length < 8
      ) {
        return res.status(400).json({
          error:
            'Password must contain at least 8 characters'
        })
      }

      // ============================
      // CHECK ORGANIZATION
      // ============================

      const {
        data: organization,
        error: organizationError
      } = await supabaseAdmin
        .from('organizations')
        .select('id, name, status')
        .eq(
          'id',
          numericOrganizationId
        )
        .single()

      if (
        organizationError ||
        !organization ||
        organization.status !== 'active'
      ) {
        return res.status(400).json({
          error:
            'Organization does not exist or is not active'
        })
      }

      // ============================
      // CHECK USERNAME
      // ============================

      const {
        data: existingUsername,
        error: usernameCheckError
      } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .ilike(
          'username',
          normalizedUsername
        )
        .maybeSingle()

      if (usernameCheckError) {
        console.error(
          'USERNAME CHECK ERROR:',
          usernameCheckError
        )

        return res.status(500).json({
          error:
            'Could not validate username'
        })
      }

      if (existingUsername) {
        return res.status(409).json({
          error:
            'Username already exists'
        })
      }

      // ============================
      // CREATE SUPABASE AUTH USER
      // ============================

      const {
        data: authData,
        error: authError
      } =
        await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail,
          password: String(password),
          email_confirm: true
        })

      if (
        authError ||
        !authData?.user
      ) {
        console.error(
          'CREATE AUTH USER ERROR:',
          authError
        )

        return res.status(400).json({
          error:
            authError?.message ||
            'Could not create authentication user'
        })
      }

      const newUserId =
        authData.user.id

      // ============================
      // CREATE OPERDAT PROFILE
      // ============================

      const {
        data: profile,
        error: profileError
      } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: newUserId,
          full_name:
            normalizedFullName,
          username:
            normalizedUsername,
          role:
            normalizedRole,
          status: 'active',
          organization_id:
            numericOrganizationId
        })
        .select(`
          id,
          full_name,
          username,
          role,
          status,
          organization_id
        `)
        .single()

      // ============================
      // ROLLBACK AUTH IF PROFILE FAILS
      // ============================

      if (
        profileError ||
        !profile
      ) {
        console.error(
          'CREATE USER PROFILE ERROR:',
          profileError
        )

        const {
          error: rollbackError
        } =
          await supabaseAdmin.auth.admin.deleteUser(
            newUserId
          )

        if (rollbackError) {
          console.error(
            'CREATE USER ROLLBACK ERROR:',
            rollbackError
          )
        }

        return res.status(500).json({
          error:
            'Could not create user profile'
        })
      }

      // ============================
      // SUCCESS
      // ============================

      return res.status(201).json({
        ok: true,

        user: {
          id: profile.id,
          fullName:
            profile.full_name,
          username:
            profile.username,
          role:
            profile.role,
          status:
            profile.status,
          organizationId:
            profile.organization_id,
          organizationName:
            organization.name
        }
      })

    } catch (error) {
      console.error(
        'CREATE PLATFORM USER ERROR:',
        error
      )

      return res.status(500).json({
        error:
          'Could not create platform user'
      })
    }
  }
)
// ============================
// METAR API
// ============================
app.get('/api/metar', async (req, res) => {
  try {
    const icao = String(req.query.icao || '')
      .trim()
      .toUpperCase()

    if (icao.length !== 4) {
      return res.status(400).json({
        metar: null
      })
    }

    const response = await fetch(
      `https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icao}.TXT`
    )

    if (!response.ok) {
      return res.status(200).json({
        metar: null
      })
    }

    const text = await response.text()

    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    return res.status(200).json({
      metar: lines[1] || null
    })
  } catch (error) {
    console.error('METAR ERROR:', error)

    return res.status(500).json({
      metar: null
    })
  }
})

// ============================
// TAF API
// ============================

app.get('/api/taf', async (req, res) => {
  try {
    const icao = String(req.query.icao || '')
      .trim()
      .toUpperCase()

    if (icao.length !== 4) {
      return res.status(400).json({
        taf: null
      })
    }

    const response = await fetch(
      `https://tgftp.nws.noaa.gov/data/forecasts/taf/stations/${icao}.TXT`
    )

    if (!response.ok) {
      return res.status(200).json({
        taf: null
      })
    }

    const text = await response.text()

    return res.status(200).json({
      taf: text || null
    })
  } catch (error) {
    console.error('TAF ERROR:', error)

    return res.status(500).json({
      taf: null
    })
  }
})

// ============================
// VITE PRODUCTION BUILD
// ============================

app.use(express.static(path.join(__dirname, 'dist')))

// React fallback
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist', 'index.html')
  )
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`OPERDAT running on port ${PORT}`)
})
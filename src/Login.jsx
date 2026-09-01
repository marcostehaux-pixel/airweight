import { useState } from 'react'
import './Login.css'
import loginAircraft from './assets/login-aircraft.png'
import operdatLogo from './assets/airweight-Logo.png'

export default function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function login() {
    const expiration = new Date('2026-09-20')

    if (new Date() > expiration) {
      alert('Trial expired')
      return
    }

    if (user === 'Alumno2' && password === 'airweight20') {
      onLogin('freighter')
    } else if (user === 'Admin' && password === 'airweight20') {
      onLogin('admin')
    } else if (user === 'Alumno1' && password === 'airweight20') {
      onLogin('student')
    } else {
      alert('Invalid credentials')
    }
  }

  const featureItems = [
    'WEIGHT & BALANCE',
    'WEATHER',
    'FLIGHT PLANNING',
    'PERFORMANCE',
    'REPORTS',
  ]

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: '720px',
        display: 'flex',
        overflow: 'hidden',
        background: '#061426',
        fontFamily:
          'Inter, Montserrat, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* =====================================================
          LEFT / BRAND PANEL
      ===================================================== */}
      <div
        className="login-left-panel"
        style={{
          width: '64%',
          height: '100%',
          position: 'relative',
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(2, 12, 27, 0.90) 0%,
              rgba(3, 18, 38, 0.72) 45%,
              rgba(3, 18, 38, 0.20) 100%
            ),
            url(${loginAircraft})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.12) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            boxSizing: 'border-box',
            padding: '5.5vh 6vw 4.5vh 5vw',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* OPERDAT LOGO */}
          <div>
            <img
              src={operdatLogo}
              alt="OPERDAT - Flight Operations Platform"
              style={{
                width: 'min(470px, 78%)',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.25))',
              }}
            />
          </div>

          {/* HERO COPY */}
          <div
            style={{
              marginTop: '4.5vh',
              maxWidth: '650px',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '3px',
                background: '#1565ff',
                marginBottom: '22px',
                borderRadius: '999px',
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(34px, 3.1vw, 56px)',
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: '-1.2px',
              }}
            >
              All your flight operations.
              <br />
              <span style={{ color: '#1565ff' }}>
                One intelligent platform.
              </span>
            </h1>

            <p
              style={{
                marginTop: '22px',
                marginBottom: 0,
                maxWidth: '600px',
                fontSize: 'clamp(16px, 1.1vw, 19px)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              Powerful tools, accurate data and real-time information to
              support safe, efficient and reliable operations.
            </p>
          </div>

          {/* FEATURES */}
          <div
            style={{
              marginTop: 'auto',
              marginBottom: '9vh',
              display: 'flex',
              alignItems: 'stretch',
              gap: 0,
              maxWidth: '880px',
              borderTop: '1px solid rgba(255,255,255,0.16)',
              paddingTop: '24px',
            }}
          >
            {featureItems.map((item, index) => (
              <div
                key={item}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '0 18px',
                  borderLeft:
                    index === 0
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.35,
                    letterSpacing: '0.8px',
                    fontWeight: 700,
                    color: '#2d7dff',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div
            style={{
              position: 'absolute',
              left: '5vw',
              bottom: '3.5vh',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.58)',
            }}
          >
            <span>Developed by</span>
            <strong
              style={{
                color: 'rgba(255,255,255,0.82)',
                letterSpacing: '1.5px',
                fontWeight: 600,
              }}
            >
              NG ENTRENAMIENTO AERONÁUTICO
            </strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT / LOGIN PANEL
      ===================================================== */}
      <div
        className="login-right-panel"
        style={{
          width: '36%',
          height: '100%',
          background:
            'linear-gradient(160deg, #07172b 0%, #0b2039 55%, #0a1829 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          boxShadow: '-18px 0 60px rgba(0,0,0,0.22)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 85% 10%, rgba(21,101,255,0.15), transparent 36%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            width: '72%',
            maxWidth: '430px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: '15px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: '#6f9fe9',
              marginBottom: '10px',
              fontWeight: 600,
            }}
          >
            Welcome to
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(40px, 3.5vw, 58px)',
              letterSpacing: '5px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            <span style={{ color: '#ffffff' }}>OPER</span>
            <span style={{ color: '#1565ff' }}>DAT</span>
          </h1>

          <div
            style={{
              marginTop: '16px',
              fontSize: '13px',
              letterSpacing: '2.3px',
              color: 'rgba(255,255,255,0.58)',
            }}
          >
            FLIGHT OPERATIONS PLATFORM
          </div>

          <div
            style={{
              width: '58px',
              height: '3px',
              background: '#1565ff',
              marginTop: '28px',
              marginBottom: '25px',
              borderRadius: '999px',
            }}
          />

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.68)',
              marginBottom: '36px',
            }}
          >
            Access your operational workspace
          </p>

          {/* USER */}
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            EMAIL OR USERNAME
          </label>

          <input
            placeholder="Enter your email or username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '15px 16px',
              marginBottom: '22px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.055)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 500,
              outline: 'none',
            }}
          />

          {/* PASSWORD */}
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            PASSWORD
          </label>

          <div
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '15px 48px 15px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.055)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 500,
                outline: 'none',
              }}
            />

            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                display: 'grid',
                placeItems: 'center',
                border: 'none',
                borderRadius: '6px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.70)',
                cursor: 'pointer',
                fontSize: '17px',
              }}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          {/* ACCESS BUTTON */}
          <button
            onClick={login}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '28px',
              border: '1px solid rgba(93,153,255,0.55)',
              borderRadius: '8px',
              background:
                'linear-gradient(90deg, #0d5be9 0%, #1671ff 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '2px',
              cursor: 'pointer',
              boxShadow: '0 10px 28px rgba(21,101,255,0.22)',
            }}
          >
            SIGN IN
          </button>

          <div
            style={{
              marginTop: '30px',
              paddingTop: '22px',
              borderTop: '1px solid rgba(255,255,255,0.10)',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.48)',
              fontSize: '12px',
              letterSpacing: '0.4px',
            }}
          >
            Secure access to OPERDAT
          </div>
        </div>
      </div>
    </div>
  )
}


import { useState } from 'react'
import './Login.css'
import loginAircraft from './assets/login-aircraft.png'
import airweightLogo from './assets/airweight-Logo.png'

export default function Login({ onLogin }) {

  const [user, setUser] = useState('')

  const [password, setPassword] = useState('')
const [

showPassword,

setShowPassword

] = useState(false)
  function login() {

    const expiration = new Date('2026-07-30')

    if (new Date() > expiration) {

      alert('Trial expired')

      return

    }

    if (
      user === 'Alumno2' &&
      password === 'airweight20'
    ) {

      onLogin()

    } else {

      alert('Invalid credentials')

    }

  }


  return (

    <div

      style={{

        width: '100vw',

        height: '100vh',

        display: 'flex',

        overflow: 'hidden',

        background: '#111827'

      }}

    >


      {/* =====================================================
          LEFT PANEL
      ===================================================== */}

      <div
 className="login-left-panel"
        style={{

          width: '64%',

          height: '100%',

          position: 'relative',

          backgroundImage:
            `linear-gradient(
              rgba(5,15,25,0.15),
              rgba(5,15,25,0.35)
            ),
            url(${loginAircraft})`,

          backgroundSize: 'cover',

          backgroundPosition: 'center',

          color: 'white'

        }}

      >


        <div

          style={{

            position: 'absolute',

            top: '7%',

            left: '8%'

          }}

        >

          <div

            style={{

              display: 'flex',

              alignItems: 'center',

              gap: '22px'

            }}

          >

            <img

              src={airweightLogo}

              alt="AirWeight"

              style={{

                width: '95px',

                height: 'auto'

              }}

            />


            <h1

              style={{

                margin: 0,

                fontSize: '56px',

                letterSpacing: '16px',

                fontWeight: '600'

              }}

            >

              AIRWEIGHT

            </h1>

          </div>


          <div

            style={{

              marginLeft: '120px',

              marginTop: '8px',

              fontSize: '20px',

              letterSpacing: '3px',

              color: '#c7a77a'

            }}

          >

            AIRCRAFT WEIGHT & BALANCE PLATFORM

          </div>


          <div

            style={{

              width: '80px',

              height: '2px',

              marginLeft: '120px',

              marginTop: '28px',

              background: '#c7a77a'

            }}

          />


          <p

            style={{

              marginLeft: '120px',

              marginTop: '28px',

              width: '430px',

              fontSize: '18px',

              lineHeight: '1.6',

              color: 'rgba(255,255,255,0.88)'

            }}

          >

            Professional load control, weight & balance
            calculation and operational training in a
            modern digital environment.

          </p>
<div
  style={{
    marginLeft: '120px',
    marginTop: '300px',
    display: 'flex',
    alignItems: 'center',
    gap: '28px'
  }}
>

  <div
    style={{
      textAlign: 'center'
    }}
  >
    <div
      style={{
        fontSize: '13px',
        letterSpacing: '1px',
        color: '#c7a77a'
      }}
    >
      LOAD CONTROL
    </div>
  </div>


  <div
    style={{
      width: '1px',
      height: '45px',
      background: 'rgba(255,255,255,0.25)'
    }}
  />


  <div
    style={{
      textAlign: 'center'
    }}
  >
    <div
      style={{
        fontSize: '13px',
        letterSpacing: '1px',
        color: '#c7a77a'
      }}
    >
      WEIGHT & BALANCE
    </div>
  </div>


  <div
    style={{
      width: '1px',
      height: '45px',
      background: 'rgba(255,255,255,0.25)'
    }}
  />


  <div
    style={{
      textAlign: 'center'
    }}
  >
    <div
      style={{
        fontSize: '13px',
        letterSpacing: '1px',
        color: '#c7a77a'
      }}
    >
      OPERATIONAL TRAINING
    </div>
  </div>

</div>
        </div>


        {/* FOOTER */}

        <div

          style={{

            position: 'absolute',

            bottom: '5%',

            left: '8%',

            display: 'flex',

            alignItems: 'center',

            gap: '18px'

          }}

        >

          <span

            style={{

              fontSize: '14px',

              opacity: 0.7

            }}

          >

            Developed by

          </span>


          <strong

            style={{

              letterSpacing: '3px',

              fontSize: '16px'

            }}

          >

            NG ENTRENAMIENTO AERONÁUTICO

          </strong>

        </div>

      </div>



      {/* =====================================================
          RIGHT LOGIN PANEL
      ===================================================== */}

      <div
className="login-right-panel"
        style={{

          width: '36%',

          height: '100%',

          background: '#f4f1ed',

          display: 'flex',

          justifyContent: 'center',

          alignItems: 'center',

          color: '#242424'

        }}

      >


        <div

          style={{

            width: '70%',

            maxWidth: '430px'

          }}

        >

          <div

            style={{

              fontSize: '38px',

              marginBottom: '4px'

            }}

          >

            Welcome to

          </div>


          <h1

            style={{

              margin: 0,

              fontSize: '48px',

              letterSpacing: '8px',

              fontWeight: '600'

            }}

          >

            AIRWEIGHT

          </h1>


          <div

            style={{

              width: '75px',

              height: '2px',

              background: '#b8996b',

              marginTop: '25px',

              marginBottom: '28px'

            }}

          />


          <p

            style={{

              fontSize: '18px',

              color: '#666',

              marginBottom: '40px'

            }}

          >

            Access your operational workspace

          </p>


          {/* USER */}

          <label

            style={{

              display: 'block',

              marginBottom: '8px',

              fontSize: '14px',

              fontWeight: '600'

            }}

          >

            Email or Username

          </label>


          <input

            placeholder="Enter your email or username"

            value={user}

            onChange={(e) =>
              setUser(e.target.value)
            }

            style={{

              width: '100%',

              boxSizing: 'border-box',

              padding: '16px',

              marginBottom: '25px',

              borderRadius: '5px',

              border: '1px solid #aaa',

              background: 'transparent',

              fontSize: '15px',

              outline: 'none'

            }}
style={{
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500'
}}
          />


          {/* PASSWORD */}

          <label

            style={{

              display: 'block',

              marginBottom: '8px',

              fontSize: '14px',

              fontWeight: '600'

            }}

          >

            Password

          </label>


          <div

style={{

position:'relative',

width:'100%'

}}

>

<input

type={

showPassword

? 'text'

: 'password'

}

placeholder="Password"

value={password}

onChange={(e)=>

setPassword(

e.target.value

)

}

style={{

width:'100%',

paddingRight:'45px'

}}
style={{
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500'
}}
 />

<button

type="button"

onClick={()=>

setShowPassword(

!showPassword

)

}

style={{

position:'absolute',

right:'12px',

top:'50%',

transform:'translateY(-50%)',

border:'none',

background:'transparent',

cursor:'pointer',

fontSize:'18px'

}}

>

{

showPassword

? '🙈'

: '👁'

}

</button>

</div>


          {/* ACCESS BUTTON */}

          <button

            onClick={login}

            style={{

              width: '100%',

              padding: '18px',

              border: 'none',

              borderRadius: '5px',

              background: '#252525',

              color: 'white',

              fontSize: '15px',

              letterSpacing: '2px',

              cursor: 'pointer'

            }}

          >

            SIGN IN

          </button>


          <div

            style={{

              marginTop: '35px',

              paddingTop: '25px',

              borderTop: '1px solid rgba(0,0,0,0.12)',

              textAlign: 'center',

              color: '#777',

              fontSize: '14px'

            }}

          >

            Secure access to AirWeight Platform

          </div>

        </div>

      </div>

    </div>

  )

}
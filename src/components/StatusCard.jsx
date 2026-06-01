import { useState } from 'react'

function StatusCard(props) {

  const [hovered, setHovered] =
    useState(false)

  const styles = `

    @keyframes pulseGreen {

      0% {
        box-shadow:
          0 0 20px rgba(0,255,140,0.10);
      }

      50% {
        box-shadow:
          0 0 35px rgba(0,255,140,0.22);
      }

      100% {
        box-shadow:
          0 0 20px rgba(0,255,140,0.10);
      }

    }

    @keyframes pulseRed {

      0% {
        box-shadow:
          0 0 20px rgba(255,70,70,0.10);
      }

      50% {
        box-shadow:
          0 0 35px rgba(255,70,70,0.22);
      }

      100% {
        box-shadow:
          0 0 20px rgba(255,70,70,0.10);
      }

    }

  `

  return (

    <>

      <style>{styles}</style>

      <div

        onMouseEnter={() =>
          setHovered(true)
        }

        onMouseLeave={() =>
          setHovered(false)
        }

        style={{

          minWidth: '180px',

          padding: '28px',

          borderRadius: '22px',

          background:
            'rgba(255,255,255,0.06)',

          backdropFilter:
            'blur(18px)',

          border:
            props.status
              ? '1px solid rgba(0,255,140,0.25)'
              : '1px solid rgba(255,70,70,0.25)',

          boxShadow:
            hovered

              ? (
                  props.status
                    ? '0 0 45px rgba(0,255,140,0.22)'
                    : '0 0 45px rgba(255,70,70,0.22)'
                )

              : (
                  props.status
                    ? '0 0 25px rgba(0,255,140,0.10)'
                    : '0 0 25px rgba(255,70,70,0.10)'
                ),

          transition:
            'all 0.35s ease',

          animation:
            props.status
              ? 'pulseGreen 2.5s infinite'
              : 'pulseRed 2.5s infinite',

          transform:

            hovered

              ? 'translateY(-6px) scale(1.02)'

              : 'translateY(0px) scale(1)',

          cursor:
            'pointer'

        }}

      >

        <h3

          style={{

            fontSize: '14px',

            letterSpacing: '2px',

            color: '#b8c0cc',

            marginBottom: '12px'

          }}

        >

          {props.title}

        </h3>

        <h2

          style={{

            fontSize: '34px',

            fontWeight: '700',

            marginBottom: '10px'

          }}

        >

          {props.value}

{

  props.unit &&

  ` ${props.unit}`

}

        </h2>

        <div>

<p

style={{

color:

props.status

?

'#00ff99'

:

'#ff5c5c',

fontSize:'13px',

letterSpacing:'1px',

marginBottom:'6px'

}}

>

{

props.status

?

'NORMAL'

:

'LIMIT EXCEEDED'

}

</p>

{

props.limit && (

<p

style={{

fontSize:'11px',

color:'#9aa6b2',

margin:0

}}

>

MAX

{

props.limit

}

kg

</p>

)

}

</div>
      </div>
    </>
  )
}

export default StatusCard
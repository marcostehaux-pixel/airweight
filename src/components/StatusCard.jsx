import { useState } from 'react'

function StatusCard(props) {

  const [hovered, setHovered] =
    useState(false)

  const isNormal =
    props.status !== false

  return (

    <div

      onMouseEnter={() =>
        setHovered(true)
      }

      onMouseLeave={() =>
        setHovered(false)
      }

      style={{

        minWidth: '165px',

        padding: '20px',

        borderRadius: '16px',

        background:
          'linear-gradient(145deg, rgba(10,28,50,0.95), rgba(5,17,32,0.95))',

        backdropFilter:
          'blur(18px)',

        border:
          isNormal
            ? '1px solid rgba(21,101,255,0.30)'
            : '1px solid rgba(255,80,80,0.35)',

        boxShadow:
          hovered

            ? (
                isNormal
                  ? '0 14px 35px rgba(21,101,255,0.18)'
                  : '0 14px 35px rgba(255,70,70,0.18)'
              )

            : '0 8px 24px rgba(0,0,0,0.22)',

        transition:
          'all 0.25s ease',

        transform:
          hovered
            ? 'translateY(-4px)'
            : 'translateY(0px)',

        cursor:
          'default',

        position:
          'relative',

        overflow:
          'hidden'

      }}

    >

      {/* STATUS BAR */}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',

          background:
            isNormal
              ? '#1565ff'
              : '#ff5050',

          boxShadow:
            isNormal
              ? '0 0 12px rgba(21,101,255,0.55)'
              : '0 0 12px rgba(255,80,80,0.55)'
        }}
      />


      {/* TITLE */}

      <div

        style={{

          fontSize: '12px',

          fontWeight: '600',

          letterSpacing: '1.7px',

          color: '#8fa0b7',

          marginBottom: '12px',

          textTransform: 'uppercase'

        }}

      >

        {props.title}

      </div>


      {/* VALUE */}

      <div

        style={{

          display: 'flex',

          alignItems: 'baseline',

          gap: '6px',

          marginBottom: '12px'

        }}

      >

        <div

          style={{

            fontSize: '31px',

            lineHeight: '1',

            fontWeight: '700',

            color: '#f4f7fb',

            letterSpacing: '-0.5px'

          }}

        >

          {props.value}

        </div>


        {

          props.unit && (

            <span

              style={{

                fontSize: '12px',

                color: '#8696aa',

                fontWeight: '600',

                textTransform: 'uppercase'

              }}

            >

              {props.unit}

            </span>

          )

        }

      </div>


      {/* STATUS */}

      <div

        style={{

          display: 'flex',

          alignItems: 'center',

          gap: '7px',

          marginBottom:
            props.subtitle || props.limit
              ? '8px'
              : '0'

        }}

      >

        <div

          style={{

            width: '7px',

            height: '7px',

            borderRadius: '50%',

            background:
              isNormal
                ? '#4f8cff'
                : '#ff5757',

            boxShadow:
              isNormal
                ? '0 0 8px rgba(79,140,255,0.65)'
                : '0 0 8px rgba(255,87,87,0.65)'

          }}

        />

        <span

          style={{

            fontSize: '10px',

            letterSpacing: '1.3px',

            fontWeight: '700',

            color:
              isNormal
                ? '#6ea0ff'
                : '#ff7070'

          }}

        >

          {
            isNormal
              ? 'NORMAL'
              : 'LIMIT EXCEEDED'
          }

        </span>

      </div>


      {/* SUBTITLE */}

      {

        props.subtitle && (

          <div

            style={{

              fontSize: '10px',

              color: '#aeb9c8',

              letterSpacing: '1px',

              marginTop: '6px',

              lineHeight: '1.4'

            }}

          >

            {props.subtitle}

          </div>

        )

      }


      {/* LIMIT */}

      {

        props.limit && (

          <div

            style={{

              marginTop: '7px',

              paddingTop: '7px',

              borderTop:
                '1px solid rgba(255,255,255,0.06)',

              fontSize: '10px',

              color: '#7f8da0',

              letterSpacing: '0.8px'

            }}

          >

            MAX&nbsp;

            <span
              style={{
                color: '#b9c4d3',
                fontWeight: '600'
              }}
            >

              {props.limit} kg

            </span>

          </div>

        )

      }

    </div>

  )

}

export default StatusCard
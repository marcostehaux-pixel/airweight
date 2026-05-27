function StatusCard(props) {
const [hovered, setHovered] =
  useState(false)
  import { useState } from 'react'
  return (

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
    status
      ? '1px solid rgba(0,255,140,0.25)'
      : '1px solid rgba(255,70,70,0.25)',

  boxShadow:
    status
      ? '0 0 35px rgba(0,255,140,0.10)'
      : '0 0 35px rgba(255,70,70,0.12)',

  transition:
    'all 0.35s ease',

  transform:
  hovered
    ? 'translateY(-6px)'
    : 'translateY(0px)',

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

  {props.value} kg

</h2>

      <p>
        {props.status ? 'OK' : 'OVERLIMIT'}
      </p>

    </div>

  )
}

export default StatusCard
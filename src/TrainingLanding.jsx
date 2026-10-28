import flightPlanningImage from './assets/planingmiss4.png'
import ofpImage from './assets/planingmiss6.png'
import takeoffFieldClimbImage from './assets/takeoff-field-climb.png'
import takeoffObstacleImage from './assets/takeoff-obstacle.png'
export default function TrainingLanding({ onBack }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#081a30',
        color: '#ffffff',
        fontFamily: 'Inter, Arial, sans-serif'
      }}
    >
      <header
        style={{
          padding: '22px 6%',
          borderBottom: '1px solid #28486c',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <strong style={{ fontSize: 22 }}>
          OPERDAT TRAINING
        </strong>

        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid #75b4ff',
            borderRadius: 8,
            color: '#ffffff',
            padding: '11px 18px',
            cursor: 'pointer'
          }}
        >
          Volver a OPERDAT
        </button>
      </header>

      <section
        style={{
          padding: '75px 6%',
          maxWidth: 1150,
          margin: '0 auto'
        }}
      >
        <p
          style={{
            color: '#75b4ff',
            fontWeight: 700,
            letterSpacing: 2
          }}
        >
          FLIGHT OPERATIONS TRAINING
        </p>

        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            lineHeight: 1.2
          }}
        >
          Entrenamiento aeronáutico
          en un entorno digital
        </h1>

        <p
          style={{
            color: '#c8d7e8',
            fontSize: 18,
            lineHeight: 1.8,
            maxWidth: 850
          }}
        >
          OPERDAT Training permite desarrollar
          ejercicios de planificación de vuelo,
          peso y balance y control de carga
          mediante herramientas de simulación
          orientadas a pilotos, despachantes
          y centros de instrucción aeronáutica.
        </p>

        <div
          style={{
            marginTop: 45,
            padding: 25,
            background: '#102c4d',
            border: '1px solid #35628d',
            borderRadius: 16
          }}
        >
          <h2>Flight Planning Simulator</h2>

          <p
            style={{
              color: '#d2dfef',
              lineHeight: 1.8
            }}
          >
            Planificá vuelos simulados con Boeing
            737-800, analizá rutas, viento,
            distancias, tiempos, combustible,
            alternados y reservas, y generá
            un Operational Flight Plan (OFP).
          </p>

          <img
            src={flightPlanningImage}
            alt="OPERDAT Flight Planning Simulator"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 12,
              marginTop: 20
            }}
          />
        </div>
        <section style={{
  marginTop: 55,
  padding: 28,
  background: '#102c4d',
  border: '1px solid #35628d',
  borderRadius: 16
}}>
  <p style={{
    color: '#82bcff',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2
  }}>
    FLIGHT PLANNING DOCUMENTATION
  </p>

  <h2 style={{ fontSize: 30 }}>
    Operational Flight Plan (OFP)
  </h2>

  <p style={{
    color: '#d2dfef',
    fontSize: 16,
    lineHeight: 1.8,
    maxWidth: 850
  }}>
    Completá tus ejercicios de planificación
    generando un OFP simulado con el resumen
    de la ruta, estimaciones de combustible,
    alternados y datos de planificación.
    Consultá posteriormente tus planes
    guardados para continuar practicando.
  </p>

  <img
    src={ofpImage}
    alt="Ejemplo de Operational Flight Plan generado por OPERDAT Training"
    loading="lazy"
    style={{
      display: 'block',
      width: '100%',
      maxWidth: 950,
      height: 'auto',
      margin: '28px auto 0',
      borderRadius: 12,
      border: '1px solid #35628d'
    }}
  />

  <p style={{
    color: '#a9bdd4',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center'
  }}>
    Ejemplo de documentación generada para entrenamiento.
    No válida para operaciones reales.
  </p>
</section>
<section style={{
  marginTop: 55,
  padding: 28,
  background: '#102c4d',
  border: '1px solid #35628d',
  borderRadius: 16
}}>
  <p style={{
    color: '#82bcff',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2
  }}>
    BOEING 737-800W · TAKEOFF PERFORMANCE
  </p>

  <h2 style={{ fontSize: 30 }}>
    Takeoff Performance Simulator
  </h2>

  <p style={{
    color: '#d2dfef',
    fontSize: 16,
    lineHeight: 1.8
  }}>
    Practicá la evaluación de performance de despegue
    con el Boeing 737-800W mediante un entorno
    de simulación diseñado para pilotos,
    despachantes y centros de instrucción.
  </p>

  <ul style={{
    color: '#c8d7e8',
    lineHeight: 2,
    paddingLeft: 24
  }}>
    <li>FIELD LIMIT: condiciones DRY y WET.</li>
    <li>CLIMB LIMIT: evaluación de limitaciones de ascenso.</li>
    <li>OBSTACLE LIMIT: análisis de limitaciones por obstáculos.</li>
    <li>Configuraciones FLAPS 1, 5, 10, 15 y 25.</li>
    <li>Correcciones por condiciones y configuración de despegue.</li>
    <li>Comparación de los pesos limitantes para el ejercicio.</li>
  </ul>

  <p style={{
    color: '#82bcff',
    fontSize: 16,
    fontWeight: 700,
    marginTop: 22
  }}>
    Del Flight Planning al análisis de performance,
    en un mismo entorno de entrenamiento.
  </p>
<div style={{ marginTop: 35 }}>
  <h3 style={{ color: '#82bcff', fontSize: 21 }}>
    Field Limit & Climb Limit
  </h3>

  <p style={{ color: '#c8d7e8', lineHeight: 1.7 }}>
    Evaluación de los pesos limitantes de despegue
    según las condiciones de pista, configuración
    de la aeronave y performance de ascenso.
  </p>

  <img
    src={takeoffFieldClimbImage}
    alt="OPERDAT Training - Field Limit y Climb Limit"
    loading="lazy"
    style={{
      display: 'block',
      width: '100%',
      height: 'auto',
      marginTop: 20,
      borderRadius: 12,
      border: '1px solid #35628d'
    }}
  />
</div>

<div style={{ marginTop: 45 }}>
  <h3 style={{ color: '#82bcff', fontSize: 21 }}>
    Obstacle Limit
  </h3>

  <p style={{ color: '#c8d7e8', lineHeight: 1.7 }}>
    Simulación de limitaciones de peso al despegue
    por obstáculos, considerando las condiciones
    y parámetros del ejercicio.
  </p>

  <img
    src={takeoffObstacleImage}
    alt="OPERDAT Training - Obstacle Limit"
    loading="lazy"
    style={{
      display: 'block',
      width: '100%',
      height: 'auto',
      marginTop: 20,
      borderRadius: 12,
      border: '1px solid #35628d'
    }}
  />
</div>
  <p style={{
    color: '#a9bdd4',
    fontSize: 12,
    marginTop: 18
  }}>
    Simulación didáctica con datos y modelos
    de entrenamiento. No válida para operaciones reales.
  </p>
</section>
<section style={{ marginTop: 65 }}>
  <h2 style={{ fontSize: 30, marginBottom: 12 }}>
    Planes de acceso
  </h2>

  <p style={{
    color: '#c8d7e8',
    marginBottom: 30,
    lineHeight: 1.7
  }}>
    Elegí la modalidad de entrenamiento que
    mejor se adapte a tus necesidades.
  </p>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24
  }}>
    <div style={{
      background: '#102c4d',
      border: '1px solid #35628d',
      borderRadius: 16,
      padding: 28
    }}>
      <h3>Training Student</h3>

      <p style={{ color: '#82bcff', fontSize: 28, fontWeight: 700 }}>
        ARS 10.000 / mes
      </p>

      <p style={{ color: '#c8d7e8', lineHeight: 1.8 }}>
        Acceso individual a las herramientas
        de simulación y entrenamiento de OPERDAT.
      </p>

      <a
        href="https://wa.me/5492236000305?text=Hola%2C%20quiero%20contratar%20OPERDAT%20Training%20Student."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: 15,
          padding: '13px 20px',
          background: '#1769e8',
          color: '#fff',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700
        }}
      >
        Solicitar acceso
      </a>
    </div>

    <div style={{
      background: '#102c4d',
      border: '1px solid #35628d',
      borderRadius: 16,
      padding: 28
    }}>
      <h3>Training Academy</h3>

      <p style={{ color: '#82bcff', fontSize: 23, fontWeight: 700 }}>
        Licencia institucional
      </p>

      <p style={{ color: '#c8d7e8', lineHeight: 1.8 }}>
        Modalidad destinada a escuelas y centros
        de instrucción, con contratación según
        la cantidad de usuarios.
      </p>

      <a
  href="https://wa.me/5492236000305?text=Hola%2C%20represento%20una%20escuela%20o%20centro%20de%20instrucci%C3%B3n%20aeron%C3%A1utica%20y%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20las%20licencias%20institucionales%20de%20OPERDAT%20Training%20Academy."
  target="_blank"
  rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: 15,
          padding: '13px 20px',
          background: '#1769e8',
          color: '#fff',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700
        }}
      >
        Consultar licencia
      </a>
    </div>
  </div>

  <p style={{
    marginTop: 25,
    color: '#a9bdd4',
    fontSize: 14
  }}>
    ¿Estás fuera de Argentina? Consultanos por
    las opciones de contratación internacional.
  </p>
</section>
        <p
          style={{
            marginTop: 35,
            color: '#a9bdd4',
            fontSize: 13
          }}
        >
          Herramienta destinada exclusivamente
          a instrucción y simulación.
          No apta para planificación de vuelos reales.
        </p>
      </section>
    </main>
  )
}
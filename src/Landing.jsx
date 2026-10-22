
import loginAircraft from './assets/login-aircraft.png'
import operdatLogo from './assets/airweight-Logo.png'
import passengerImage from './assets/passenger2026.png'
import freighterImage from './assets/freighter2026.png'
import flightPlanningImage from './assets/planingmiss4.png'
import weatherImage from './assets/weather2026.png'
export default function Landing({ onSignIn, onOpenTraining }) {
  const buttonStyle = {
    background: '#1769e8',
    color: '#fff',
    border: 0,
    borderRadius: 8,
    padding: '13px 22px',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  }

  return (
    <main
  lang="es"
  translate="yes"
  style={{
    minHeight: '100vh',
    background: '#071629',
    color: '#fff',
    fontFamily: 'Inter, Arial, sans-serif'
  }}
>
        
<nav style={{
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  background: 'rgba(8, 26, 48, 0.96)',
  padding: '13px 20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 22,
  borderBottom: '1px solid #28486c',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
}}>
 {[
  ['Inicio', '#inicio'],
  ['Beneficios', '#beneficios'],
  ['Cómo funciona', '#funcionamiento'],
  ['Meteorología', '#meteorologia'],
  ['Plataforma', '#plataforma'],
  ['Training', '#training'],
  ['Nosotros', '#nosotros'],
  ['Contacto', '#contacto']
].map(([label, link]) => (
    <a
      key={link}
      href={link}
      onClick={(e) => {
        if (label === 'Training') {
          e.preventDefault()
          onOpenTraining()
        }
      }}
      style={{
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </a>
  ))}
</nav>

      <header style={{
        padding: '18px 6%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
      }}>
        <img
          src={operdatLogo}
          alt="OPERDAT"
          style={{ width: 190, maxWidth: '50%' }}
        />
        <button onClick={onSignIn} style={buttonStyle}>
          Iniciar sesión
        </button>
      </header>

      <section id="inicio" style={{
        padding: '85px 6%',
        backgroundImage: `linear-gradient(90deg, #071629 12%, rgba(7,22,41,.86) 58%, rgba(7,22,41,.45)), url(${loginAircraft})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ maxWidth: 740 }}>
          <p style={{
            color: '#6faaff',
            fontWeight: 700,
            letterSpacing: 2
          }}>
            FLIGHT OPERATIONS PLATFORM
          </p>
          <h1 style={{
            fontSize: 'clamp(34px, 5vw, 64px)',
            lineHeight: 1.12
          }}>
            Tecnología inteligente para
            operaciones aeronáuticas
          </h1>
          <p style={{
            fontSize: 19,
            lineHeight: 1.7,
            color: '#d2dfef'
          }}>
            OPERDAT es una plataforma web de peso y balance
            para aeronaves de pasajeros y carga, diseñada
            para apoyar la gestión operativa y el
            entrenamiento aeronáutico.
          </p>
          <a
            href="mailto:info@operdat.com?subject=Solicitar%20demostracion%20OPERDAT"
            style={buttonStyle}
          >
            Solicitar demostración
          </a>
        </div>
      </section>

<section style={{
  padding: '65px 6%',
  background: '#0b2039',
  color: '#ffffff'
}}>
  <div style={{
    maxWidth: 1100,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 45,
    alignItems: 'center'
  }}>
    <div>
      <p style={{
        color: '#6faaff',
        fontWeight: 700,
        letterSpacing: 2,
        fontSize: 12
      }}>
        THE CHALLENGE
      </p>

      <h2 style={{
        fontSize: 'clamp(28px, 3vw, 42px)',
        lineHeight: 1.2
      }}>
        En aviación, no alcanza con
        conocer el peso de un avión.
      </h2>

      <p style={{
        color: '#c5d4e6',
        fontSize: 17,
        lineHeight: 1.8
      }}>
        La distribución de pasajeros,
        equipaje, carga y combustible
        modifica el centro de gravedad
        de una aeronave.
      </p>

      <p style={{
        color: '#c5d4e6',
        fontSize: 17,
        lineHeight: 1.8
      }}>
        Una operación segura requiere
        comprobar que los pesos y el
        centro de gravedad permanezcan
        dentro de los límites establecidos
        para cada aeronave.
      </p>
    </div>

    <div style={{
      background: '#122e4e',
      border: '1px solid #28486c',
      borderRadius: 16,
      padding: 32
    }}>
      <h3 style={{
        fontSize: 23,
        marginTop: 0
      }}>
        La solución OPERDAT
      </h3>

      <p style={{
        color: '#d2dfef',
        lineHeight: 1.8
      }}>
        Una plataforma que reúne datos
        técnicos de aeronaves, cálculos
        de peso y balance, verificación
        de límites y generación de
        documentación en un mismo entorno.
      </p>

      <p style={{
        color: '#75b4ff',
        fontWeight: 700,
        marginBottom: 0
      }}>
        From aircraft data to loadsheet.
      </p>
    </div>
  </div>
</section>

      <section style={{
        padding: '70px 6%',
        background: '#f4f7fb',
        color: '#15253a'
      }}>
        <h2 style={{ fontSize: 32 }}>
          Una plataforma. Dos soluciones.
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 22
        }}>
          {[
            {
              title: 'OPERDAT Training',
              description:
                'Herramientas de práctica para escuelas, academias y centros de instrucción aeronáutica.'
            },
            {
              title: 'OPERDAT Operations',
              description:
                'Soluciones de peso y balance para operadores de aeronaves de pasajeros y carga.'
            }
          ].map(item => (
            <article key={item.title} style={{
              background: '#fff',
              padding: 30,
              borderRadius: 14,
              boxShadow: '0 8px 25px rgba(0,0,0,.06)'
            }}>
              <h3>{item.title}</h3>
              <p style={{ lineHeight: 1.7 }}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
        <section
  id="training"
  style={{
    padding: '65px 6%',
    background: '#081a30',
    color: '#ffffff',
    textAlign: 'center'
  }}
>
  <div style={{
    maxWidth: 850,
    margin: '0 auto'
  }}>
    <p style={{
      color: '#75b4ff',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 2
    }}>
      OPERDAT TRAINING
    </p>

    <h2 style={{
      fontSize: 'clamp(28px, 4vw, 42px)',
      marginBottom: 18
    }}>
      Entrenamiento en operaciones de vuelo
    </h2>

   <p style={{
  color: '#c8d7e8',
  fontSize: 17,
  lineHeight: 1.8,
  marginBottom: 30
}}>
  Una plataforma de simulación para pilotos,
  despachantes y centros de instrucción aeronáutica.
  Practicá Flight Planning, Takeoff Performance
  para Boeing 737-800W y peso y balance
  de aeronaves Passenger y Freighter.
  Generá OFP y loadsheets para desarrollar
  ejercicios integrales de operaciones de vuelo.
</p>

    <button
      type="button"
      onClick={onOpenTraining}
      style={buttonStyle}
    >
      Conocer OPERDAT Training →
    </button>
  </div>
</section>
<section id="beneficios" style={{
  padding: '75px 6%',
  background: '#ffffff',
  color: '#15253a'
}}>
  <div style={{
    maxWidth: 1150,
    margin: '0 auto'
  }}>
    <p style={{
      color: '#1769e8',
      fontWeight: 700,
      letterSpacing: 2,
      fontSize: 12
    }}>
      WHO WE SERVE
    </p>

    <h2 style={{
      fontSize: 'clamp(28px, 3vw, 40px)',
      marginBottom: 15
    }}>
      Una plataforma. Diferentes necesidades.
    </h2>

    <p style={{
      color: '#53657a',
      fontSize: 17,
      lineHeight: 1.7,
      maxWidth: 800,
      marginBottom: 35
    }}>
      OPERDAT combina herramientas de formación
      y gestión de peso y balance para distintos
      entornos de la actividad aeronáutica.
    </p>

    <div style={{
      display: 'grid',
      gridTemplateColumns:
        'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 22
    }}>
      {[
        {
          title: 'Escuelas y centros de instrucción',
          subtitle: 'OPERDAT TRAINING',
          benefits: [
            'Prácticas con configuraciones de aeronaves.',
            'Ejercicios de peso y balance de pasajeros y carga.',
            'Visualización de límites y centro de gravedad.',
            'Formación con herramientas digitales.'
          ]
        },
        {
          title: 'Operadores y empresas aeronáuticas',
          subtitle: 'OPERDAT OPERATIONS',
          benefits: [
            'Configuración según datos técnicos de cada aeronave.',
            'Cálculo y verificación de peso y balance.',
            'Generación de documentación en PDF.',
            'Apoyo a la estandarización de procesos.'
          ]
        },
        {
          title: 'Pilotos y despachantes',
          subtitle: 'FLIGHT OPERATIONS',
          benefits: [
            'Consulta de datos de aeronaves.',
            'Preparación y análisis de cargas.',
            'Acceso integrado a METAR y TAF.',
            'Práctica y consulta desde un entorno web.'
          ]
        }
      ].map(client => (
        <article key={client.title} style={{
          background: '#f2f6fb',
          border: '1px solid #dbe5f1',
          borderRadius: 16,
          padding: 28
        }}>
          <p style={{
            color: '#1769e8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.5
          }}>
            {client.subtitle}
          </p>

          <h3 style={{
            fontSize: 22,
            lineHeight: 1.3,
            minHeight: 58
          }}>
            {client.title}
          </h3>

          <ul style={{
            paddingLeft: 20,
            color: '#53657a',
            lineHeight: 1.9
          }}>
            {client.benefits.map(benefit => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>

    <p style={{
      marginTop: 25,
      color: '#65758a',
      fontSize: 13,
      lineHeight: 1.6
    }}>
      La utilización operacional requiere
      configuración y validación conforme
      a la documentación aprobada y los
      procedimientos aplicables de cada operador.
    </p>
  </div>
      </section>
<section id="funcionamiento" style={{
  padding: '75px 6%',
  background: '#eaf0f7',
  color: '#15253a',
  textAlign: 'center',
  scrollMarginTop: 80
}}>
  <div style={{
  maxWidth: 1150,
  margin: '0 auto',
  textAlign: 'center'
}}>
    <p style={{
      color: '#1769e8',
      fontWeight: 700,
      letterSpacing: 2,
      fontSize: 12
    }}>
      HOW IT WORKS
    </p>

    <h2 style={{
      fontSize: 'clamp(28px, 3vw, 40px)',
      marginBottom: 15
    }}>
      De los datos de la aeronave
      a la documentación de vuelo
    </h2>

    <p style={{
      fontSize: 17,
      lineHeight: 1.7,
      maxWidth: 750,
color: '#53657a',
margin: '0 auto 40px'
    }}>
      OPERDAT organiza el proceso de peso y balance
      en un entorno digital, facilitando la preparación,
      verificación y documentación de cada operación.
    </p>

    <div style={{
      display: 'grid',
      gridTemplateColumns:
        'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 20
    }}>
      {[
        {
          number: '01',
          title: 'Seleccionar aeronave',
          text: 'Accedé a los datos técnicos y límites correspondientes a la matrícula seleccionada.'
        },
        {
          number: '02',
          title: 'Ingresar la carga',
          text: 'Registrá pasajeros, equipaje, carga y combustible según la configuración de la aeronave.'
        },
        {
          number: '03',
          title: 'Verificar resultados',
          text: 'Consultá los pesos calculados, el centro de gravedad y las alertas de límites.'
        },
       {
  number: '04',
  title: 'Generar documentación',
  text: 'Obtené una loadsheet PDF con los resultados de peso y balance.'
},
{
  number: '05',
  title: 'Flight Planning Simulator',
  text: 'En OPERDAT Training, practicá planificación de vuelos con el Boeing 737-800: rutas, viento, tiempos, combustible, alternados y reservas. Generá un OFP simulado para analizar los resultados.'
},
{
  number: '06',
  title: 'Takeoff Performance Simulator',
  text: 'En OPERDAT Training, practicá cálculos de performance de despegue con el Boeing 737-800W. Evaluá FIELD LIMIT en condiciones DRY/WET, CLIMB LIMIT y OBSTACLE LIMIT, considerando distintas configuraciones de FLAPS y condiciones de despegue.'
}
      ].map(step => (
        <article key={step.number} style={{
          background: '#ffffff',
          padding: 26,
          borderRadius: 14,
          boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            color: '#1769e8',
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 18
          }}>
            {step.number}
          </div>

          <h3 style={{
            fontSize: 19,
            marginBottom: 12
          }}>
            {step.title}
          </h3>

          <p style={{
            color: '#53657a',
            lineHeight: 1.7,
            fontSize: 14
          }}>
            {step.text}
          </p>
        </article>
      ))}
    </div>
  </div>
</section>
<section id="meteorologia" style={{
  padding: '70px 6%',
  background: '#102c4d',
  color: '#ffffff'
}}>
  <div style={{
    maxWidth: 1100,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 40,
    alignItems: 'center'
  }}>
    <div>
      <p style={{
        color: '#7bb8ff',
        fontWeight: 700,
        letterSpacing: 2,
        fontSize: 12
      }}>
        INTEGRATED WEATHER CENTER
      </p>

      <h2 style={{
        fontSize: 'clamp(28px, 3vw, 40px)',
        lineHeight: 1.2
      }}>
        Meteorología aeronáutica
        integrada en OPERDAT
      </h2>

      <p style={{
        fontSize: 17,
        lineHeight: 1.8,
        color: '#d1dfef'
      }}>
        Consultá información meteorológica
        actualizada de aeródromos de todo
        el mundo, directamente desde la
        plataforma.
      </p>

      <p style={{
        fontSize: 16,
        lineHeight: 1.8,
        color: '#d1dfef'
      }}>
        Accedé a reportes METAR y pronósticos
        TAF sin abandonar tu entorno de
        trabajo ni recurrir a sitios externos.
      </p>
    </div>

    <div style={{
      background: '#193c63',
      border: '1px solid #35628d',
      borderRadius: 16,
      padding: 30
    }}>
      <div style={{
        color: '#82bcff',
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 20
      }}>
        WEATHER CENTER
      </div>

      <div style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 22
      }}>
        {['METAR', 'TAF', 'ICAO'].map(item => (
          <span key={item} style={{
            padding: '9px 16px',
            background: '#285782',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13
          }}>
            {item}
          </span>
        ))}
      </div>

      <h3 style={{ fontSize: 21 }}>
        Todo en un mismo lugar
      </h3>

      <p style={{
        color: '#c5d9ec',
        lineHeight: 1.8,
        marginBottom: 0
      }}>
        Preparación de vuelos, peso y balance,
        documentación y consulta meteorológica
        en una única plataforma digital.
      </p>
    </div>
  </div>
</section>

<section id="plataforma" style={{
  padding: '80px 6%',
  background: '#f4f7fb',
  color: '#15253a'
}}>
 <div style={{
  maxWidth: 1200,
  margin: '0 auto',
  textAlign: 'center'
}}>
    <p style={{
      color: '#1769e8',
      fontWeight: 700,
      letterSpacing: 2,
      fontSize: 12
    }}>
      EXPLORE THE PLATFORM
    </p>

    <h2 style={{
      fontSize: 'clamp(28px, 3vw, 42px)',
      marginBottom: 15
    }}>
      Conocé OPERDAT por dentro
    </h2>

    <p style={{
      color: '#53657a',
      fontSize: 17,
      lineHeight: 1.8,
      maxWidth: 800,
margin: '0 auto 45px'
    }}>
      Explorá las herramientas que integran
      nuestra plataforma. Desde el cálculo
      de peso y balance hasta la gestión de
      carga y la consulta meteorológica.
    </p>

    {[
      {
        title: 'Passenger Weight & Balance',
        subtitle: 'PASSENGER OPERATIONS',
        description:
          'Gestión de pasajeros, carga y combustible. ' +
          'Cálculo de pesos, índices y centro de gravedad, ' +
          'con visualización de límites operacionales.',
        image: passengerImage
      },
      {
        title: 'Freighter Loadsheet',
        subtitle: 'CARGO OPERATIONS',
        description:
          'Distribución de carga en posiciones específicas, ' +
          'control de límites por posición y cálculo ' +
          'de peso y balance para aeronaves cargueras.',
        image: freighterImage
      },
      {
  title: 'Weather Center',
  subtitle: 'AVIATION WEATHER',
  description:
    'Consulta de METAR y TAF de múltiples aeródromos ' +
    'desde la misma plataforma, sin necesidad ' +
    'de utilizar sitios externos.',
  image: weatherImage
},
{
  title: 'Flight Planning Simulator',
  subtitle: 'OPERDAT TRAINING',
  description:
    'Simulación de planificación de vuelo con Boeing 737-800. ' +
    'Cálculo de distancias, viento, tiempos, combustible, ' +
    'alternados y reservas, con generación de OFP para entrenamiento.',
  image: flightPlanningImage
}
    ].map((module, index) => (
      <article key={module.title} style={{
        background: '#ffffff',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 30,
        border: '1px solid #dce6f2',
        boxShadow: '0 8px 28px rgba(15,35,65,0.06)'
      }}>
        <div style={{
          padding: '30px 32px 20px'
        }}>
          <p style={{
            color: '#1769e8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.5,
            marginBottom: 8
          }}>
            {String(index + 1).padStart(2, '0')}
            {' · '}
            {module.subtitle}
          </p>

          <h3 style={{
            fontSize: 25,
            margin: '0 0 12px'
          }}>
            {module.title}
          </h3>

          <p style={{
  color: '#53657a',
  lineHeight: 1.8,
  fontSize: 16,
  maxWidth: 850,
  margin: '0 auto',
  textAlign: 'center'
}}>
  {module.description}
</p>
        </div>

        <div style={{
          padding: '0 20px 25px'
        }}>
          <img
            src={module.image}
            alt={`Captura real de OPERDAT - ${module.title}`}
            loading="lazy"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: 12,
              border: '1px solid #263c59',
              background: '#07182d'
            }}
          />
        </div>
      </article>
    ))}
  </div>
</section>

      <section id="nosotros"  style={{
  padding: '85px 6%',
  background: '#081a30',
  color: '#ffffff'
}}>
  <div style={{
    maxWidth: 1100,
    margin: '0 auto',
    textAlign: 'center'
  }}>
    <p style={{
      color: '#75b4ff',
      fontWeight: 700,
      letterSpacing: 2,
      fontSize: 12
    }}>
      ABOUT US
    </p>

    <h2 style={{
      fontSize: 'clamp(28px, 3vw, 42px)',
      marginBottom: 24
    }}>
      Tecnología desarrollada
      desde la experiencia aeronáutica
    </h2>

    <p style={{
      color: '#c8d7e8',
      fontSize: 18,
      lineHeight: 1.9,
      maxWidth: 850,
      margin: '0 auto 22px'
    }}>
      OPERDAT es una plataforma desarrollada
      por NG Entrenamiento Aeronáutico,
      una iniciativa especializada en
      instrucción, performance, peso y balance
      y operaciones de vuelo.
    </p>

    <p style={{
      color: '#c8d7e8',
      fontSize: 17,
      lineHeight: 1.9,
      maxWidth: 850,
      margin: '0 auto 22px'
    }}>
      Nuestro objetivo es acercar herramientas
      digitales a la formación y a la gestión
      aeronáutica, combinando conocimientos
      técnicos, experiencia operacional
      y desarrollo tecnológico.
    </p>

   <p style={{
  color: '#75b4ff',
  fontSize: 19,
  fontWeight: 700,
  marginTop: 35
}}>
  <span translate="no" className="notranslate">
    OPERDAT
  </span>
  {' — Flight Operations Platform'}
</p>
  </div>
</section>

<section id="contacto" style={{
  padding: '85px 6%',
  background: 'linear-gradient(135deg, #1051a5, #071e3b)',
  color: '#ffffff',
  textAlign: 'center'
}}>
  <div style={{
    maxWidth: 850,
    margin: '0 auto'
  }}>
    <p style={{
      color: '#b7d5ff',
      fontWeight: 700,
      letterSpacing: 2,
      fontSize: 12
    }}>
      GET IN TOUCH
    </p>

    <h2 style={{
      fontSize: 'clamp(28px, 3vw, 42px)',
      marginBottom: 20
    }}>
      Descubrí cómo OPERDAT puede
      integrarse a tu organización
    </h2>

    <p style={{
      color: '#d9e8fa',
      fontSize: 18,
      lineHeight: 1.8,
      marginBottom: 35
    }}>
      Si representás una escuela de aviación,
      un centro de instrucción o una empresa
      aeronáutica, contactanos para conocer
      las funcionalidades de la plataforma
      y solicitar una demostración.
    </p>

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 16
    }}>
      <a
        href="mailto:info@operdat.com?subject=Solicitud%20de%20demostraci%C3%B3n%20OPERDAT"
        style={{
          background: '#ffffff',
          color: '#0a3772',
          padding: '15px 26px',
          borderRadius: 9,
          textDecoration: 'none',
          fontWeight: 700,
          display: 'inline-block'
        }}
      >
        Solicitar demostración
      </a>

      <a
        href="https://wa.me/5492233497378?text=Hola%2C%20quisiera%20conocer%20m%C3%A1s%20sobre%20OPERDAT."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: 'transparent',
          color: '#ffffff',
          padding: '15px 26px',
          borderRadius: 9,
          textDecoration: 'none',
          fontWeight: 700,
          border: '1px solid #a5c8f3',
          display: 'inline-block'
        }}
      >
        Contactar por WhatsApp
      </a>
    </div>

    <p style={{
      color: '#b9cce4',
      fontSize: 14,
      marginTop: 30
    }}>
      info@operdat.com
    </p>
  </div>
</section>

<footer style={{
  padding: '25px 6%',
  borderTop: '1px solid #263a53',
  background: '#071629',
  color: '#a8bbd2',
  textAlign: 'center',
  fontSize: 13
}}>
  OPERDAT — Developed by NG Entrenamiento Aeronáutico
  <p>info@operdat.com</p>
</footer>

    </main>
  )
}


/**
 * B787-9 — Weight & Balance Training
 *
 * CG envelopes específicos del B787-9.
 * Fuente de referencia: B787-9 Load & Trim Sheet.
 *
 * NOT FOR OPERATIONAL USE
 *
 * Pendiente:
 * - Convertir límites de índice a %MAC.
 * - Definir los puntos forward/aft de cada fase.
 * - Validar continuidad de los polígonos.
 */

export const B787_CG_ENVELOPES = {
  ZFW: {
    forward: [],
    aft: []
  },

  TAKEOFF: {
    forward: [],
    aft: []
  },

  LANDING: {
    forward: [],
    aft: []
  }
};

/**
 * B787-9 — Generic Training
 * Conversión de Balance Index a CG %MAC.
 *
 * NOT FOR OPERATIONAL USE
 */

export const B787_WB_PARAMETERS = {
  indexReferenceArm: 1199.2,
  indexConstant: 200000,
  indexOffset: 50,
  lemac: 1149.8,
  mac: 246.9
};

export function b787IndexToCg(index, weightKg) {
  const {
    indexReferenceArm,
    indexConstant,
    indexOffset,
    lemac,
    mac
  } = B787_WB_PARAMETERS;

  const indexValue = Number(index);
  const weight = Number(weightKg);

  if (
    !Number.isFinite(indexValue) ||
    !Number.isFinite(weight) ||
    weight <= 0
  ) {
    return NaN;
  }

  const arm =
    indexReferenceArm +
    ((indexValue - indexOffset) *
      indexConstant) / weight;

  return ((arm - lemac) / mac) * 100;
}

export function b787CgToIndex(cgPercent, weightKg) {
  const {
    indexReferenceArm,
    indexConstant,
    indexOffset,
    lemac,
    mac
  } = B787_WB_PARAMETERS;

  const arm =
    lemac + (Number(cgPercent) / 100) * mac;

  return indexOffset +
    ((arm - indexReferenceArm) *
      Number(weightKg)) / indexConstant;
}

/**
 * Convierte puntos del gráfico original B787-9
 * desde [pesoKg, balanceIndex]
 * hacia [pesoKg, cgPercentMac].
 *
 * NOT FOR OPERATIONAL USE
 */
export function b787ConvertEnvelopePoints(points) {
  return points.map(([weightKg, index]) => [
    weightKg,
    b787IndexToCg(index, weightKg)
  ]);
}

/**
 * B787-9 — Líneas adicionales de comprobación.
 *
 * Cada línea se expresará mediante puntos:
 * [pesoKg, balanceIndex]
 *
 * Los puntos se completarán a partir del
 * Load & Trim Sheet de referencia.
 *
 * NOT FOR OPERATIONAL USE
 */

export const B787_CG_CHECK_LINES = {
  A: {
    label: 'Forward CG Check',
    points: []
  },

  B: {
    label: 'Aft Takeoff Check',
    points: []
  },

  C: {
    label: 'Aft Zero Fuel / Takeoff Check',
    points: []
  },

  D: {
    label: 'Lateral Imbalance CG Limit',
    points: []
  }
};

/**
 * B787-9 — Vértices originales del gráfico.
 *
 * Formato: [pesoKg, balanceIndex]
 *
 * Los puntos se incorporarán después de
 * digitalizar el Load & Trim Sheet.
 *
 * No utilizar para validación hasta completar
 * y verificar ambos contornos.
 */


export const B787_ENVELOPE_INDEX_POINTS = {
  ZFW: {
    // [pesoKg, balanceIndex]
    // Aproximaciones visuales del contorno rojo
    // del Load & Trim Sheet B787-9.
    forward: [
      [110000, 40],
      [130000, 36],
      [150000, 33],
      [181436, 30]
    ],

    aft: [
      [110000, 54],
      [130000, 61],
      [150000, 69],
      [181436, 79]
    ]
  },

  

TAKEOFF: {
  // [pesoKg, balanceIndex]
  // Aproximación gráfica para entrenamiento.
  // No utilizar para validación operacional.

  forward: [
    [110000, 36],
    [130000, 34],
    [150000, 32],
    [170000, 30],
    [190000, 28],
    [210000, 25],
    [230000, 23],
    [245000, 21],
    [250000, 22],
    [252650, 35]
  ],

  aft: [
    [110000, 50],
    [130000, 56],
    [150000, 63],
    [170000, 70],
    [190000, 78],
    [210000, 85],
    [230000, 90],
    [245000, 79],
    [250000, 72],
    [252650, 70]
  ]
}


};

/**
 * Construye un envelope de entrenamiento
 * a partir de coordenadas [pesoKg, índice].
 *
 * Devuelve los límites en [pesoKg, CG %MAC].
 *
 * Los puntos provisionales no deben utilizarse
 * para validar condiciones operacionales.
 */
export function buildB787TrainingEnvelope(phase) {
  const source = B787_ENVELOPE_INDEX_POINTS[phase];

  if (
    !source ||
    source.forward.length < 2 ||
    source.aft.length < 2
  ) {
    return null;
  }

  return {
    forward: b787ConvertEnvelopePoints(source.forward),
    aft: b787ConvertEnvelopePoints(source.aft)
  };
}

/**
 * B787-9 — Envelope gráfico de entrenamiento.
 *
 * Convierte una secuencia de vértices
 * [pesoKg, balanceIndex] en coordenadas
 * [cgPercent, pesoKg].
 *
 * El orden original de los vértices se conserva
 * para representar segmentos horizontales,
 * verticales y diagonales.
 *
 * No utilizar para validación operacional.
 */
export function buildB787GraphicPolygon(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return [];
  }

  return points
    .filter(
      ([weightKg, index]) =>
        Number.isFinite(weightKg) &&
        Number.isFinite(index) &&
        weightKg > 0
    )
    .map(([weightKg, index]) => [
      b787IndexToCg(index, weightKg),
      weightKg
    ]);
}

/**
 * B787-9 — Contornos gráficos preliminares.
 *
 * Coordenadas: [pesoKg, balanceIndex]
 * Los vértices recorren el perímetro:
 * límite delantero de abajo hacia arriba,
 * seguido del límite trasero de arriba hacia abajo.
 *
 * Datos aproximados para visualización.
 * NO utilizar para validar CG.
 */
export const B787_GRAPHIC_INDEX_POLYGONS = {
  ZFW: [
    [110000, 40],
    [130000, 36],
    [150000, 33],
    [181436, 30],

    [181436, 79],
    [150000, 69],
    [130000, 61],
    [110000, 54]
  ],

  TAKEOFF: [
    [110000, 36],
    [130000, 34],
    [150000, 32],
    [170000, 30],
    [190000, 28],
    [210000, 25],
    [230000, 23],
    [245000, 21],
    [250000, 22],
    [252650, 35],

    [252650, 70],
    [250000, 72],
    [245000, 79],
    [230000, 90],
    [210000, 85],
    [190000, 78],
    [170000, 70],
    [150000, 63],
    [130000, 56],
    [110000, 50]
  ]
};

/**
 * Polígonos listos para el componente SVG.
 * Formato: [CG %MAC, pesoKg].
 */
export const B787_GRAPHIC_POLYGONS = {
  ZFW: buildB787GraphicPolygon(
    B787_GRAPHIC_INDEX_POLYGONS.ZFW
  ),

  TAKEOFF: buildB787GraphicPolygon(
    B787_GRAPHIC_INDEX_POLYGONS.TAKEOFF
  )
};

/**
 * B787-9 — Preliminary training envelope validation.
 * NOT FOR OPERATIONAL USE.
 *
 * Point coordinates: [CG %MAC, weight kg].
 */
export function validateB787TrainingEnvelope({
  phase,
  weightKg,
  cgMacPercent
}) {
  const polygon = B787_GRAPHIC_POLYGONS[phase];

  const x = Number(cgMacPercent);
  const y = Number(weightKg);

  if (
    !Array.isArray(polygon) ||
    polygon.length < 3 ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    y <= 0
  ) {
    return {
      ok: false,
      status: 'INVALID_INPUT'
    };
  }

  // Check whether the point lies on a polygon edge.
  const onSegment = (px, py, ax, ay, bx, by) => {
    const cross = (px - ax) * (by - ay) -
                  (py - ay) * (bx - ax);

    const tolerance = 0.001;

    if (Math.abs(cross) > tolerance) {
      return false;
    }

    return (
      px >= Math.min(ax, bx) - tolerance &&
      px <= Math.max(ax, bx) + tolerance &&
      py >= Math.min(ay, by) - tolerance &&
      py <= Math.max(ay, by) + tolerance
    );
  };

  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (onSegment(x, y, xi, yi, xj, yj)) {
      return {
        ok: true,
        status: 'INSIDE_TRAINING_ENVELOPE'
      };
    }

    const intersects =
      (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return {
    ok: inside,
    status: inside
      ? 'INSIDE_TRAINING_ENVELOPE'
      : 'OUTSIDE_TRAINING_ENVELOPE'
  };
}

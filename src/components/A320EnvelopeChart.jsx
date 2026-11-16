
import { a320Envelope } from '../envelopes/a320Envelopes';
import { validateA320CGEnvelope } from "../utilit/a320WeightBalanceEngine";
export default function A320EnvelopeChart({
  zfw,
  tow,
  zfi,
  toi,
  zfCg,
  toCg,
  indexReferenceArm,
  indexConstant,
  indexOffset,
  lemac,
  mac
}) {
   
  const { chartScale, zfwPolygon, towPolygon } = a320Envelope;
// Escala horizontal del índice de balance A320.
// Valores provisionales hasta verificar el rango completo.

const mapIndex = index =>
  left +
  ((index - minIndex) / (maxIndex - minIndex)) *
    (right - left);
  const left = 75;
  const right = 850;
  const top = 35;
  const bottom = 345;

  const mapCg = cg =>
    left +
    ((cg - chartScale.minCg) /
      (chartScale.maxCg - chartScale.minCg)) *
      (right - left);
// Coordenadas de los puntos según índice y peso reales
const mapBalancePoint = (index, weight) => ({
  x: mapIndex(index),
  y: mapWeight(weight)
});
// Convierte un CG expresado en %MAC a índice de balance,
// utilizando el peso y los parámetros de la aeronave.
const cgToIndex = (cgPercent, weight) => {
    
  const referenceArm = Number(indexReferenceArm);
  const constant = Number(indexConstant);
  const offset = Number(indexOffset);
  const lemacValue = Number(lemac);
  const macValue = Number(mac);

  if (
    !Number.isFinite(referenceArm) ||
    !Number.isFinite(constant) ||
    constant === 0 ||
    !Number.isFinite(offset) ||
    !Number.isFinite(lemacValue) ||
    !Number.isFinite(macValue) ||
    !Number.isFinite(Number(cgPercent)) ||
    !Number.isFinite(Number(weight))
  ) {
    return NaN;
  }

  const arm =
    lemacValue + (Number(cgPercent) / 100) * macValue;

  return offset +
    ((arm - referenceArm) * Number(weight)) / constant;
};
// Convierte los límites del envelope A320
// desde [CG %MAC, peso] a [índice, peso].
const envelopeToIndex = polygon =>
  polygon.map(([cgPercent, weight]) => [
    cgToIndex(cgPercent, weight),
    weight
  ]);

const zfwIndexPolygon = envelopeToIndex(zfwPolygon);
const towIndexPolygon = envelopeToIndex(towPolygon);
// Rango horizontal calculado con los límites del A320
const envelopeIndices = [
  ...zfwIndexPolygon.map(([index]) => index),
  ...towIndexPolygon.map(([index]) => index)
].filter(Number.isFinite);

const minIndex = envelopeIndices.length
  ? Math.floor(Math.min(...envelopeIndices) / 5) * 5 - 5
  : 0;

const maxIndex = envelopeIndices.length
  ? Math.ceil(Math.max(...envelopeIndices) / 5) * 5 + 5
  : 100;
// Verificación temporal de coherencia entre CG e índice
const calculatedZfwIndex = cgToIndex(zfCg, zfw);
const calculatedTowIndex = cgToIndex(toCg, tow);


  const mapWeight = weight =>
    bottom -
    ((weight - chartScale.minWeight) /
      (chartScale.maxWeight - chartScale.minWeight)) *
      (bottom - top);

  const polygonPoints = polygon =>
  polygon
    .map(([index, weight]) =>
      `${mapIndex(index)},${mapWeight(weight)}`
    )
    .join(' ');

  const insideEnvelope = (cg, weight, polygon) => {
    if (!Number.isFinite(cg) || !Number.isFinite(weight)) {
      return false;
    }

    let inside = false;

    for (let i = 0, j = polygon.length - 1;
      i < polygon.length;
      j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      if (
        (yi > weight) !== (yj > weight) &&
        cg < ((xj - xi) * (weight - yi)) / (yj - yi) + xi
      ) {
        inside = !inside;
      }
    }

    return inside;
  };

  // Validación específica del A320 por fase de vuelo
const zfwValidation = validateA320CGEnvelope({
  phase: 'ZFW',
  weightKg: Number(zfw),
  cgMacPercent: Number(zfCg)
});

const towValidation = validateA320CGEnvelope({
  phase: 'TAKEOFF',
  weightKg: Number(tow),
  cgMacPercent: Number(toCg)
});

// Se respetan también los límites estructurales
const zfwInside =
  zfwValidation.ok === true &&
  Number(zfw) <= a320Envelope.weightLimits.mzfw;

const towInside =
  towValidation.ok === true &&
  Number(tow) <= a320Envelope.weightLimits.mtow;

  const weightTicks = [
    40000, 45000, 50000, 55000,
    60000, 65000, 70000, 75000, 80000
  ];

  const indexTicks = Array.from(
  { length: Math.floor((maxIndex - minIndex) / 5) + 1 },
  (_, i) => minIndex + i * 5
);
// Diagonales de CG constante (%MAC)
const cgReferenceValues = [20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45]

const cgReferenceLines = cgReferenceValues.map(cgPercent => ({
  cgPercent,
  x1: mapIndex(cgToIndex(cgPercent, chartScale.minWeight)),
  y1: mapWeight(chartScale.minWeight),
  x2: mapIndex(cgToIndex(cgPercent, chartScale.maxWeight)),
  y2: mapWeight(chartScale.maxWeight)
}));
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '30px',
      marginTop: '30px',
      width: '920px',
      boxSizing: 'border-box'
    }}>
    

      <svg
        viewBox="0 0 920 400"
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.18)',
          borderRadius: '14px'
        }}
      >
        {weightTicks.map(weight => (
          <g key={weight}>
            <line
              x1={left}
              x2={right}
              y1={mapWeight(weight)}
              y2={mapWeight(weight)}
              stroke="rgba(255,255,255,0.12)"
            />
            <text
              x={left - 12}
              y={mapWeight(weight) + 4}
              textAnchor="end"
              fill="#b8c0cc"
              fontSize="11"
            >
              {weight / 1000}
            </text>
          </g>
        ))}

        {indexTicks.map(index => (
  <g key={index}>
    <line
      x1={mapIndex(index)}
      x2={mapIndex(index)}
      y1={top}
      y2={bottom}
      stroke="rgba(255,255,255,0.10)"
    />
    <text
      x={mapIndex(index)}
      y={bottom + 20}
      textAnchor="middle"
      fill="#b8c0cc"
      fontSize="11"
    >
      {index}
    </text>
  </g>
))}
{/* Referencias diagonales de CG %MAC */}
<g>
  {cgReferenceLines.map(line => (
    <g key={line.cgPercent}>
      <line
  x1={line.x1}
  y1={line.y1}
  x2={line.x2}
  y2={line.y2}
  stroke="#94a3b8"
  strokeWidth="1"
  opacity="0.55"
/>
      {line.cgPercent % 5 === 0 && (
  <text
    x={Math.max(left + 20, Math.min(line.x2, right - 15))}
    y={line.y2 - 7}
    fill="#e5b567"
    fontSize="11"
    textAnchor="middle"
  >
    {line.cgPercent}%
  </text>
)}
    </g>
  ))}
</g>
        <polygon
          points={polygonPoints(towIndexPolygon)}
          fill="rgba(0,255,136,0.07)"
          stroke="#00ff88"
          strokeWidth="2"
        />

        <polygon
          points={polygonPoints(zfwIndexPolygon)}
          fill="rgba(0,153,255,0.07)"
          stroke="#0099ff"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {[
          {
  label: 'ZFW',
  index: Number(zfi),
  weight: Number(zfw),
  inside: zfwInside,
  color: '#00c8ff'
},
{
  label: 'TOW',
  index: Number(toi),
  weight: Number(tow),
  inside: towInside,
  color: '#00ff88'
}
       ].filter(point =>
  Number.isFinite(point.index) &&
  Number.isFinite(point.weight)
).map(point => (
          <g key={point.label}>
            {point.label === 'ZFW' ? (
  <circle
    cx={mapIndex(point.index)}
    cy={mapWeight(point.weight)}
    r="6"
    fill={point.inside ? point.color : '#ff4444'}
    stroke="#ffffff"
    strokeWidth="2"
  />
) : (
  <rect
    x={mapIndex(point.index) - 5}
    y={mapWeight(point.weight) - 5}
    width="10"
    height="10"
    transform={`rotate(45 ${mapIndex(point.index)} ${mapWeight(point.weight)})`}
    fill={point.inside ? point.color : '#ff4444'}
    stroke="#ffffff"
    strokeWidth="2"
  />
)}
            <text
  x={mapIndex(point.index) + 10}
  y={mapWeight(point.weight) - 10}
  fill={point.inside ? point.color : '#ff4444'}
  fontSize="12"
  fontWeight="700"
>
  {point.label}
</text>
          </g>
        ))}

        <text x="10" y="20" fill="#ffffff" fontSize="12">
          Weight (t)
        </text>

        <text
          x="460"
          y="390"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="13"
        >
          Balance Index
        </text>
      </svg>

      <div style={{
        display: 'flex',
        gap: '25px',
        marginTop: '15px',
        fontSize: '13px'
      }}>
        <span style={{ color: zfwInside ? '#00c8ff' : '#ff6666' }}>
          ZFW: {zfwInside ? 'INSIDE' : 'OUTSIDE'}
        </span>
        <span style={{ color: towInside ? '#00ff88' : '#ff6666' }}>
          TOW: {towInside ? 'INSIDE' : 'OUTSIDE'}
        </span>
      </div>

      <p style={{
        color: '#8fa0b7',
        fontSize: '11px',
        marginTop: '12px'
      }}>
        GENERIC TRAINING DATA — NOT FOR OPERATIONAL USE
      </p>
    </div>
  );
}

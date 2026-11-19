
import React from "react";
import {
  B787_GRAPHIC_POLYGONS,
  b787IndexToCg
} from "../utilit/b787WeightBalanceEngine";

export default function B787EnvelopeChart({
  zfw,
  tow,
  zfi,
  toi
}) {
  const width = 920;
  const height = 450;

  const margin = {
    top: 35,
    right: 65,
    bottom: 55,
    left: 75
  };

  const minIndex = 0;
  const maxIndex = 100;
  const minWeight = 110000;
  const maxWeight = 270000;

  const plotWidth =
    width - margin.left - margin.right;

  const plotHeight =
    height - margin.top - margin.bottom;

  const x = (index) =>
    margin.left +
    ((index - minIndex) / (maxIndex - minIndex)) *
      plotWidth;

  const y = (weight) =>
    margin.top +
    ((maxWeight - weight) /
      (maxWeight - minWeight)) *
      plotHeight;

  const cgToIndex = (cgPercent, weight) => {
    const arm = 1149.8 + (cgPercent / 100) * 246.9;

    return (
      50 +
      ((arm - 1199.2) * weight) / 200000
    );
  };

  const polygonPoints = (points) =>
    points
      .map(([cg, weight]) => {
        const index = cgToIndex(cg, weight);
        return `${x(index)},${y(weight)}`;
      })
      .join(" ");

  const cgLines = [10, 15, 20, 25, 30, 35, 40];

  const zfwValid =
    Number.isFinite(Number(zfw)) &&
    Number(zfw) > 0 &&
    Number.isFinite(Number(zfi));

  const towValid =
    Number.isFinite(Number(tow)) &&
    Number(tow) > 0 &&
    Number.isFinite(Number(toi));

  const zfwCg = zfwValid
    ? b787IndexToCg(Number(zfi), Number(zfw))
    : null;

  const towCg = towValid
    ? b787IndexToCg(Number(toi), Number(tow))
    : null;

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        background: "#111e30",
        borderRadius: 12,
        padding: 12
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "100%",
          minWidth: 650,
          height: "auto"
        }}
      >
        <rect
  width={width}
  height={height}
  fill="#111e30"
/>

        <text
          x={width / 2}
          y={22}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="#f1f5f9"
        >
          B787-9 — WEIGHT & BALANCE ENVELOPE
        </text>

        {Array.from({ length: 11 }, (_, i) => i * 10).map(
          (index) => (
            <g key={`index-${index}`}>
              <line
                x1={x(index)}
                x2={x(index)}
                y1={margin.top}
                y2={height - margin.bottom}
                stroke="#334155"
              />

              <text
                x={x(index)}
                y={height - margin.bottom + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#cbd5e1"
              >
                {index}
              </text>
            </g>
          )
        )}

        {Array.from(
          { length: 9 },
          (_, i) => 110000 + i * 20000
        ).map((weight) => (
          <g key={`weight-${weight}`}>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={y(weight)}
              y2={y(weight)}
              stroke="#e5e7eb"
            />

            <text
              x={margin.left - 12}
              y={y(weight) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#cbd5e1"
            >
              {Math.round(weight / 1000)}
            </text>
          </g>
        ))}

        {cgLines.map((cg) => (
          <g key={`cg-${cg}`}>
            <line
              x1={x(cgToIndex(cg, minWeight))}
              y1={y(minWeight)}
              x2={x(cgToIndex(cg, maxWeight))}
              y2={y(maxWeight)}
              stroke="#64748b"
              strokeDasharray="5 5"
              strokeWidth="1"
            />

            <text
              x={x(cgToIndex(cg, maxWeight))}
              y={margin.top - 7}
              textAnchor="middle"
              fontSize="10"
              fill="#93c5fd"
            >
              {cg}%
            </text>
          </g>
        ))}

        <polygon
          points={polygonPoints(
            B787_GRAPHIC_POLYGONS.TAKEOFF
          )}
          fill="#2563eb"
          fillOpacity="0.07"
          stroke="#2563eb"
          strokeWidth="2.5"
        />

        <polygon
          points={polygonPoints(
            B787_GRAPHIC_POLYGONS.ZFW
          )}
          fill="#dc2626"
          fillOpacity="0.05"
          stroke="#dc2626"
          strokeWidth="2.5"
        />

        {zfwValid && (
          <g>
            <circle
              cx={x(Number(zfi))}
              cy={y(Number(zfw))}
              r="6"
              fill="#dc2626"
              stroke="#ffffff"
              strokeWidth="2"
            />

            <text
              x={x(Number(zfi)) + 10}
              y={y(Number(zfw)) - 8}
              fontSize="12"
              fontWeight="bold"
              fill="#dc2626"
            >
              ZFW
            </text>
          </g>
        )}

        {towValid && (
          <g>
            <rect
              x={x(Number(toi)) - 5}
              y={y(Number(tow)) - 5}
              width="10"
              height="10"
              transform={`rotate(45 ${x(Number(toi))} ${y(Number(tow))})`}
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
            />

            <text
              x={x(Number(toi)) + 12}
              y={y(Number(tow)) - 10}
              fontSize="12"
              fontWeight="bold"
              fill="#2563eb"
            >
              TOW
            </text>
          </g>
        )}

        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fill="#cbd5e1"
        >
          BALANCE INDEX
        </text>

        <text
          x={20}
          y={height / 2}
          transform={`rotate(-90 20 ${height / 2})`}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fill="#cbd5e1"
        >
          AIRCRAFT WEIGHT (1000 KG)
        </text>
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          flexWrap: "wrap",
          fontSize: 12,
          marginTop: 8,
          color: "#cbd5e1"
        }}
      >
        <span style={{ color: "#dc2626" }}>
          ● ZFW:{" "}
          {zfwValid
            ? `${zfwCg.toFixed(1)}% MAC`
            : "—"}
        </span>

        <span style={{ color: "#2563eb" }}>
          ◆ TAKEOFF:{" "}
          {towValid
            ? `${towCg.toFixed(1)}% MAC`
            : "—"}
        </span>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#94a3b8",
          marginTop: 8
        }}
      >
        GENERIC TRAINING MODEL — PRELIMINARY
        ENVELOPE — NOT FOR OPERATIONAL USE
      </p>
    </div>
  );
}

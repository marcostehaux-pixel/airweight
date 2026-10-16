import React from "react";

export default function TrainingOFP({
  generatedAtUTC = null,
  flightNumber = "—",
  registration = "—",
  origin = "—",
  destination = "—",
  alternate = "—",
  ezfw = null,
  cruiseLevel = "—",
  averageWind = null,
  groundDistance = null,
  alternateDistance = null,

  tripFuel = null,
  contingencyFuel = null,
  alternateFuel = null,
  holdingFuel = null,
  taxiFuel = null,
  extraFuel = null,
  tankeringFuel = null,

  requiredFuel = null,
  totalFuel = null,
  takeoffFuel = null,
  airDistance = null,
estimatedTimeHours = null
}) {
  const nowUTC = generatedAtUTC
  ? new Date(generatedAtUTC)
  : new Date();

  const dateUTC = nowUTC.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timeUTC = nowUTC.toLocaleTimeString("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
  <section
    id="operdat-training-ofp"
    style={{
      background: "#ffffff",
        color: "#17212b",
        padding: "24px",
        border: "1px solid #d5dbe3",
        borderRadius: "6px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "2px solid #233b58",
          paddingBottom: "12px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>OPERDAT OFP</h2>
          <small>Operational Flight Plan — Training</small>
        </div>

        <div style={{ textAlign: "right", fontSize: "12px" }}>
          <div>DATE UTC: {dateUTC}</div>
<div>TIME UTC: {timeUTC}</div>
        </div>
      </header>

      <div style={{ marginTop: "18px", marginBottom: "16px" }}>
        <h3
          style={{
            background: "#233b58",
            color: "#ffffff",
            padding: "7px 10px",
            fontSize: "13px",
            margin: "0 0 12px 0",
          }}
        >
          FLIGHT INFORMATION
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            fontSize: "12px",
          }}
        >
          <div><strong>FROM:</strong> {origin}</div>
<div><strong>TO:</strong> {destination}</div>
<div><strong>ALTERNATE:</strong> {alternate}</div>
<div>
  <strong>FLIGHT:</strong> {flightNumber || "—"}
</div>
<div>
  <strong>REGISTRATION:</strong> {registration || "—"}
</div>
<div>
  <strong>EZFW:</strong>{" "}
  {ezfw != null ? `${Number(ezfw).toLocaleString()} KG` : "—"}
</div>

<div>
  <strong>CRUISE LEVEL:</strong> {cruiseLevel}
</div>

<div>
  <strong>AVG WIND:</strong>{" "}
  {averageWind != null ? `${averageWind} KT` : "—"}
</div>
        </div>
      </div>

      {/* ROUTE INFORMATION */}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <h3
          style={{
            background: "#233b58",
            color: "#ffffff",
            padding: "7px 10px",
            fontSize: "13px",
            margin: "0 0 12px 0",
          }}
        >
          ROUTE INFORMATION
        </h3>

        <div style={{ fontSize: "12px", lineHeight: "1.9" }}>
  <div>
    <strong>MAIN ROUTE:</strong> {origin} → {destination}
  </div>

  <div>
    <strong>PLANNED DISTANCE:</strong>{" "}
    {groundDistance != null
      ? `${Number(groundDistance).toLocaleString()} NM`
      : "—"}
  </div>

  <div>
    <strong>ALTERNATE ROUTE:</strong> {destination} → {alternate}
  </div>

  <div>
    <strong>ALTERNATE DISTANCE:</strong>{" "}
    {alternateDistance != null
      ? `${Number(alternateDistance).toLocaleString()} NM`
      : "—"}
  </div>
</div>
      </div>

      {/* FUEL PLANNING */}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <h3
          style={{
            background: "#233b58",
            color: "#ffffff",
            padding: "7px 10px",
            fontSize: "13px",
            margin: "0 0 12px 0",
          }}
        >
          FUEL PLANNING
        </h3>

        <div style={{ fontSize: "12px", lineHeight: "1.9" }}>
         {[
  ["TRIP FUEL", tripFuel],
  ["CONTINGENCY FUEL", contingencyFuel],
  ["ALTERNATE FUEL", alternateFuel],
  ["HOLDING FUEL", holdingFuel],
  ["TAXI / APU FUEL", taxiFuel],
  ["EXTRA FUEL", extraFuel],
  ["TANKERING FUEL", tankeringFuel],
].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #e2e6eb",
                padding: "3px 8px",
              }}
            >
              <span>{label}</span>
              <strong>
  {value != null && Number.isFinite(Number(value))
    ? `${Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })} KG`
    : "—"}
</strong>
            </div>
                   ))}
        </div>
      </div>

      {/* FUEL SUMMARY */}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <h3
          style={{
            background: "#233b58",
            color: "#ffffff",
            padding: "7px 10px",
            fontSize: "13px",
            margin: "0 0 12px 0",
          }}
        >
          FUEL SUMMARY
        </h3>

        {[
  ["REQUIRED FUEL", requiredFuel],
  ["TOTAL FUEL", totalFuel],
  ["TAKEOFF FUEL", takeoffFuel],
].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 12px",
              marginBottom: "4px",
              background:
                label === "TOTAL FUEL" ? "#e9eef5" : "#ffffff",
              borderBottom: "1px solid #d5dbe3",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            <span>{label}</span>
            <span>
  {value != null && Number.isFinite(Number(value))
    ? `${Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })} KG`
    : "—"}
</span>
          </div>
        ))}
      </div>

      {/* FLIGHT PERFORMANCE */}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <h3
          style={{
            background: "#233b58",
            color: "#ffffff",
            padding: "7px 10px",
            fontSize: "13px",
            margin: "0 0 12px 0",
          }}
        >
          FLIGHT PERFORMANCE
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            fontSize: "12px",
          }}
        >
         <div>
  <strong>EZFW:</strong>{" "}
  {ezfw != null ? `${Number(ezfw).toLocaleString("en-US")} KG` : "—"}
</div>

<div>
  <strong>CRUISE LEVEL:</strong> {cruiseLevel || "—"}
</div>

<div>
  <strong>AVG WIND:</strong>{" "}
  {averageWind != null ? `${averageWind} KT` : "—"}
</div>

<div>
  <strong>AIR DISTANCE:</strong>{" "}
  {airDistance != null
    ? `${Number(airDistance).toLocaleString("en-US")} NM`
    : "—"}
</div>

<div>
  <strong>GROUND DISTANCE:</strong>{" "}
  {groundDistance != null
    ? `${Number(groundDistance).toLocaleString("en-US")} NM`
    : "—"}
</div>

<div>
  <strong>EST. FLIGHT TIME:</strong>{" "}
  {estimatedTimeHours != null
    ? `${Math.floor(estimatedTimeHours)} h ${String(
        Math.round((estimatedTimeHours % 1) * 60)
      ).padStart(2, "0")} min`
    : "—"}
</div>
        </div>
      </div>

      {/* TRAINING NOTES */}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <h3
          style={{
            background: "#233b58",
            color: "#ffffff",
            padding: "7px 10px",
            fontSize: "13px",
            margin: "0 0 12px 0",
          }}
        >
          TRAINING NOTES
        </h3>

        <div
          style={{
            fontSize: "11px",
            lineHeight: "1.7",
            color: "#344054",
          }}
        >
          <div>Aircraft: B737-800 — Training configuration</div>
          <div>Fuel and performance figures: Simulated estimates</div>
          <div>Holding reference: 1500 FT pressure altitude</div>
          <div>Holding time: As selected in the exercise</div>
          <div>
            Navigation data: Training route catalog
          </div>
        </div>
      </div>

      {/* DOCUMENT FOOTER */}
      <footer
        style={{
          marginTop: "24px",
          paddingTop: "10px",
          borderTop: "1px solid #cbd5e1",
          textAlign: "center",
          fontSize: "10px",
          color: "#475569",
        }}
      >
        <div style={{ fontWeight: "bold" }}>
          OPERDAT TRAINING — SIMULATED DOCUMENT
        </div>
        <div>NOT VALID FOR FLIGHT OPERATIONS</div>
           </footer>

      <p
        style={{
          fontSize: "11px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "10px",
          background: "#edf1f5",
        }}
      >
        SIMULATED FLIGHT PLAN — FOR TRAINING PURPOSES ONLY —
        NOT FOR OPERATIONAL USE
      </p>
    </section>
  );
}

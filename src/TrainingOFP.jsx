
import React from "react";

export default function TrainingOFP() {
  return (
    <section
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
          <div>DATE UTC: --/--/----</div>
          <div>TIME UTC: --:--</div>
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
          <div><strong>FLIGHT:</strong> —</div>
          <div><strong>AIRCRAFT:</strong> B737-800</div>
          <div><strong>REGISTRATION:</strong> —</div>

          <div><strong>FROM:</strong> SAAR</div>
          <div><strong>TO:</strong> SBGL</div>
          <div><strong>ALTERNATE:</strong> SBKP</div>

          <div><strong>EZFW:</strong> 56000 KG</div>
          <div><strong>CRUISE LEVEL:</strong> FL370</div>
          <div><strong>AVG WIND:</strong> 0 KT</div>
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
            <strong>MAIN ROUTE:</strong> SAAR → SBGL
          </div>

          <div>
            <strong>PLANNED DISTANCE:</strong> 1195 NM
          </div>

          <div>
            <strong>ALTERNATE ROUTE:</strong> SBGL → SBKP
          </div>

          <div>
            <strong>ALTERNATE DISTANCE:</strong> 319 NM
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
            ["TRIP FUEL", "—"],
            ["CONTINGENCY FUEL", "—"],
            ["ALTERNATE FUEL", "—"],
            ["HOLDING FUEL", "—"],
            ["TAXI / APU FUEL", "—"],
            ["EXTRA FUEL", "—"],
            ["TANKERING FUEL", "—"],
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
              <strong>{value}</strong>
            </div>
          ))}
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
          ["REQUIRED FUEL", "—"],
          ["TOTAL FUEL", "—"],
          ["TAKEOFF FUEL", "—"],
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
            <span>{value}</span>
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
          <div><strong>EZFW:</strong> — KG</div>
          <div><strong>CRUISE LEVEL:</strong> —</div>
          <div><strong>AVG WIND:</strong> — KT</div>

          <div><strong>AIR DISTANCE:</strong> — NM</div>
          <div><strong>GROUND DISTANCE:</strong> — NM</div>
          <div><strong>EST. FLIGHT TIME:</strong> —</div>
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

      </div>

      </div>

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

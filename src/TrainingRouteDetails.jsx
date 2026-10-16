import React from "react";

export default function TrainingRouteDetails({
  origin = "—",
  destination = "—",
  cruiseLevel = "—",
  route = "ROUTE NOT ASSIGNED",
}) {
  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        padding: "16px",
        backgroundColor: "#ffffff",
        color: "#1e293b",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1769aa" }}>
        ROUTE & NAVIGATION
      </h3>

      <div style={{ marginBottom: "10px" }}>
        <strong>FROM:</strong> {origin}
        {" | "}
        <strong>TO:</strong> {destination}
        {" | "}
        <strong>CRUISE:</strong> {cruiseLevel}
      </div>

      <div
        style={{
          padding: "12px",
          backgroundColor: "#f1f5f9",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "13px",
          overflowWrap: "anywhere",
        }}
      >
        {route}
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "#64748b",
        }}
      >
        SIMULATED ROUTE — FOR TRAINING PURPOSES ONLY
      </div>
    </div>
  );
}
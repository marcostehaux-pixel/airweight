import React from 'react';

import {
  calculateAirDistance,
  calculateTripFuel,
  calculateLRCTrip,
  calculateAlternateFuel,
  calculateContingencyFuel,
  calculateIterativeHoldingFuel,
  calculateFuelDistribution
} from './flightPlanningEngine.js';
import FuelPlanningSummary from './FuelPlanningSummary.jsx';
import TrainingMissionGenerator from './TrainingMissionGenerator';
import TrainingOFP from './TrainingOFP.jsx';
import {
  findTrainingRoute,
  getAvailableDestinations,
  getAvailableOrigins,
} from './trainingRoutes';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { supabase } from './lib/supabase';
import TrainingRouteDetails from './TrainingRouteDetails';
export default function FlightPlanning({
  
  passengerAircraft = [],
  cargoAircraft = []
}) {
  
  const [selectedRegistration, setSelectedRegistration] =
    React.useState('');
    // OPERDAT TRAINING — GENERATED OFP
const [generatedOFP, setGeneratedOFP] = React.useState(null);
const [ofpInputsChanged, setOfpInputsChanged] = React.useState(false);
const [savingOFP, setSavingOFP] = React.useState(false);
const [ofpSaveError, setOfpSaveError] = React.useState("");
const [pendingOFPSave, setPendingOFPSave] = React.useState(false);
const [flightNumber, setFlightNumber] = React.useState('');
const [departure, setDeparture] = React.useState('');
const [destination, setDestination] = React.useState('');
const [alternate, setAlternate] = React.useState('');
const [zfw, setZfw] = React.useState('');
const [cruiseLevel, setCruiseLevel] = React.useState('');
const [averageWind, setAverageWind] = React.useState('');
const [routeDistance, setRouteDistance] = React.useState('');
const [alternateDistance, setAlternateDistance] = React.useState('');
const [alternateGroundSpeed, setAlternateGroundSpeed] =
  React.useState('');

const [alternateFuelFlow, setAlternateFuelFlow] =
  React.useState('');
  // OPERDAT TRAINING
// Alternate Holding Configuration

const [alternateHoldingTime, setAlternateHoldingTime] =
  React.useState('30');
// OPERDAT TRAINING
// Taxi / APU Fuel (kg)

const [taxiFuel, setTaxiFuel] = React.useState('');
// OPERDAT TRAINING
// Extra / Tankering Fuel (kg)

const [extraFuel, setExtraFuel] = React.useState('');
// OPERDAT TRAINING
// Tankering Fuel (kg)

const [tankeringFuel, setTankeringFuel] = React.useState('');
// OPERDAT TRAINING — OPTIONAL FUEL
const [etopsFuel, setEtopsFuel] = React.useState('');
const [ballastFuel, setBallastFuel] = React.useState('');
const [policyFuel, setPolicyFuel] = React.useState('');
const [alternateHoldingAltitude, setAlternateHoldingAltitude] =
  React.useState('1500');
  const [savedTrainingOFPs, setSavedTrainingOFPs] =
  React.useState([]);

const [loadingTrainingOFPs, setLoadingTrainingOFPs] =
  React.useState(false);
const loadTrainingOFPs = async () => {
  setLoadingTrainingOFPs(true);

  try {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setSavedTrainingOFPs([]);
      return;
    }

    const { data, error } = await supabase
      .from("training_ofps")
      .select(
        "id, flight_number, departure, destination, file_name, file_path, created_at"
      )
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Training OFP history load error:", error);
      return;
    }

    setSavedTrainingOFPs(data || []);
  } catch (error) {
    console.error("Unable to load Training OFPs:", error);
    } finally {
    setLoadingTrainingOFPs(false);
  }
};

const viewTrainingOFP = async (filePath) => {
  const pdfWindow = window.open("", "_blank");

  if (!pdfWindow) {
    alert("Please allow pop-ups to view the OFP.");
    return;
  }

  try {
    const { data, error } = await supabase.storage
      .from("training-ofps")
      .createSignedUrl(filePath, 60);

    if (error || !data?.signedUrl) {
      throw error || new Error("Signed URL unavailable");
    }

    pdfWindow.location.href = data.signedUrl;
  } catch (error) {
    console.error("Training OFP view error:", error);
    pdfWindow.close();
    alert("Unable to open the saved OFP.");
  }
};
React.useEffect(() => {
  loadTrainingOFPs();
}, []);
const selectedTrainingRoute = findTrainingRoute(
  departure,
  destination,
  "B738"
);



const airDistanceResult =
  selectedTrainingRoute?.distanceNM != null &&
  averageWind !== ''
    ? calculateAirDistance({
        groundDistance: selectedTrainingRoute.distanceNM,
        averageWind: Number(averageWind)
      })
    : null;

    const tripFuelResult = airDistanceResult
  ? calculateTripFuel({
      estimatedTimeHours:
        airDistanceResult.estimatedTimeHours
    })
  : null;
  const lrcTripResult =
  airDistanceResult && cruiseLevel !== ''
    ? calculateLRCTrip({
        airDistance: airDistanceResult.airDistance,
        cruiseLevel
      })
    : null;
    // OPERDAT TRAINING
// Preliminary alternate fuel estimate
// NOT FOR OPERATIONAL USE



const selectedAlternateRoute = findTrainingRoute(
  destination,
  alternate,
  "B738"
);



const alternateFuelResult =
  selectedAlternateRoute?.distanceNM != null &&
  alternateGroundSpeed !== ''
    ? calculateAlternateFuel({
        alternateDistance: selectedAlternateRoute.distanceNM,
        averageGroundSpeed: Number(alternateGroundSpeed),
        alternateFuelFlow: 2500
      })
    : null;


    // Preliminary contingency fuel
// Percentage only — holding comparison pending

const preliminaryContingencyResult =
  lrcTripResult
    ? calculateContingencyFuel({
        tripFuel: lrcTripResult.referenceTripFuel,
        contingencyPercent: 5
      })
    : null;
    const preliminaryHoldingResult =
  zfw !== '' &&
  preliminaryContingencyResult?.contingencyFuel != null
    ? calculateIterativeHoldingFuel({
        zeroFuelWeight: Number(zfw),
        remainingReserveFuel:
  preliminaryContingencyResult.contingencyFuel +
  (extraFuel !== '' && Number(extraFuel) >= 0
    ? Number(extraFuel)
    : 0) +
  (tankeringFuel !== '' && Number(tankeringFuel) >= 0
    ? Number(tankeringFuel)
    : 0),
        holdingMinutes: Number(alternateHoldingTime),
        pressureAltitude: 1500
      })
    : null;
    // OPERDAT TRAINING
// Preliminary Fuel Distribution

const preliminaryFuelDistribution =
  lrcTripResult?.referenceTripFuel != null &&
  preliminaryContingencyResult?.contingencyFuel != null &&
  alternateFuelResult?.alternateFuel != null &&
  preliminaryHoldingResult?.holdingFuel != null &&
  taxiFuel !== '' &&
  extraFuel !== '' &&
  tankeringFuel !== ''
    ? calculateFuelDistribution({
        tripFuel: lrcTripResult.referenceTripFuel,
        contingencyFuel:
          preliminaryContingencyResult.contingencyFuel,
        alternateFuel: alternateFuelResult.alternateFuel,
                holdingFuel: preliminaryHoldingResult.holdingFuel,

        etopsFuel: etopsFuel === '' ? 0 : Number(etopsFuel),
        ballastFuel: ballastFuel === '' ? 0 : Number(ballastFuel),
        policyFuel: policyFuel === '' ? 0 : Number(policyFuel),

        taxiFuel: Number(taxiFuel),
        extraFuel:
          Number(extraFuel) + Number(tankeringFuel)
      })
    : null;
  const aircraftOptions = [
    ...passengerAircraft.map(aircraft => ({
      ...aircraft,
      operationType: 'PASSENGER'
    })),
    ...cargoAircraft.map(aircraft => ({
      ...aircraft,
      operationType: 'FREIGHTER'
    }))
  ]
    .filter(aircraft =>
      /^B737-800/i.test(aircraft.type || '')
    )
    .filter((aircraft, index, array) =>
      array.findIndex(item =>
        item.registration === aircraft.registration
      ) === index
    );

  const selectedAircraft = aircraftOptions.find(
    aircraft =>
      aircraft.registration === selectedRegistration
  );
  
const currentOFPInputs = JSON.stringify({
  flightNumber,
  selectedRegistration,
  departure,
  destination,
  alternate,
  zfw,
  cruiseLevel,
  averageWind,
  alternateGroundSpeed,
  alternateHoldingTime,
  taxiFuel,
  extraFuel,
  tankeringFuel,
  etopsFuel,
  ballastFuel,
  policyFuel,
});

const generatedOFPInputsRef = React.useRef(null);

React.useEffect(() => {
  if (!generatedOFP || !generatedOFPInputsRef.current) return;

  setOfpInputsChanged(
    currentOFPInputs !== generatedOFPInputsRef.current
  );
}, [currentOFPInputs, generatedOFP]);

  // OPERDAT TRAINING — OFP DISPLAY DATA
const ofpDisplayData = generatedOFP ?? {
  flightNumber,
  registration: selectedRegistration,
  origin: departure,
  destination,
  alternate,
    routeText:
    selectedTrainingRoute?.routeText ?? "ROUTE NOT ASSIGNED",
  ezfw: zfw === '' ? null : Number(zfw),
  cruiseLevel,
  averageWind: averageWind === '' ? null : Number(averageWind),

  groundDistance: airDistanceResult?.groundDistance ?? null,
  alternateDistance: alternateFuelResult?.alternateDistance ?? null,
  airDistance: airDistanceResult?.airDistance ?? null,
  estimatedTimeHours: airDistanceResult?.estimatedTimeHours ?? null,

  tripFuel: lrcTripResult?.referenceTripFuel ?? null,
  contingencyFuel: preliminaryContingencyResult?.contingencyFuel ?? null,
  alternateFuel: alternateFuelResult?.alternateFuel ?? null,
  holdingFuel: preliminaryHoldingResult?.holdingFuel ?? null,
  holdingTimeMinutes: preliminaryHoldingResult
  ? Number(alternateHoldingTime)
  : null,
  taxiFuel: taxiFuel === '' ? null : Number(taxiFuel),
  extraFuel: extraFuel === '' ? null : Number(extraFuel),
  tankeringFuel: tankeringFuel === '' ? null : Number(tankeringFuel),
etopsFuel: etopsFuel === '' ? 0 : Number(etopsFuel),
ballastFuel: ballastFuel === '' ? 0 : Number(ballastFuel),
policyFuel: policyFuel === '' ? 0 : Number(policyFuel),
  requiredFuel: preliminaryFuelDistribution?.requiredFuel ?? null,
  totalFuel: preliminaryFuelDistribution?.totalFuel ?? null,
  takeoffFuel: preliminaryFuelDistribution?.takeoffFuel ?? null,
  destinationRemainingFuel:
  preliminaryFuelDistribution?.destinationRemainingFuel ?? null,

alternateRemainingFuel:
  preliminaryFuelDistribution?.alternateRemainingFuel ?? null,

afterHoldingFuel:
  preliminaryFuelDistribution?.afterHoldingFuel ?? null,
};
// OPERDAT TRAINING — NEW FLIGHT
const startNewFlight = () => {
  // Clear generated OFP
  
setGeneratedOFP(null);
setOfpInputsChanged(false);
generatedOFPInputsRef.current = null;

  // Flight identification
  setFlightNumber('');
  setSelectedRegistration('');

  // Route
  setDeparture('');
  setDestination('');
  setAlternate('');

  // Flight planning
  setZfw('');
  setCruiseLevel('');
  setAverageWind('');
  setRouteDistance('');

  // Alternate planning
  setAlternateDistance('');
  setAlternateGroundSpeed('');
  setAlternateFuelFlow('');

  // Holding configuration
  setAlternateHoldingTime('30');
  setAlternateHoldingAltitude('1500');

  // Fuel configuration
  setTaxiFuel('');
  setExtraFuel('');
  setTankeringFuel('');
};
  
// OPERDAT TRAINING — GENERATE OFP
const generateOFP = () => {
  const requiredFields = [
    ["Flight Number", flightNumber],
    ["Aircraft Registration", selectedRegistration],
    ["Departure ICAO", departure],
    ["Destination ICAO", destination],
    ["Alternate ICAO", alternate],
    ["Estimated Zero Fuel Weight", zfw],
    ["Cruise Flight Level", cruiseLevel],
    ["Average Wind Component", averageWind],
    ["Alternate Average Ground Speed", alternateGroundSpeed],
    ["Alternate Holding Time", alternateHoldingTime],
    ["Taxi / APU Fuel", taxiFuel],
    ["Extra Fuel", extraFuel],
    ["Tankering Fuel", tankeringFuel],
    ["ETOPS Fuel", etopsFuel],
    ["Ballast Fuel", ballastFuel],
    ["Policy Fuel", policyFuel],
  ];

  const missingFields = requiredFields
    .filter(([, value]) => value == null || String(value).trim() === "")
    .map(([label]) => label);

  if (missingFields.length > 0) {
    alert(
      "INCOMPLETE FLIGHT PLANNING DATA\n\n" +
      "Please complete the following fields:\n\n" +
      missingFields.map((field) => "• " + field).join("\n") +
      "\n\nEnter 0 where applicable."
    );
    return;
  }

  const invalidFuelFields = [
    ["Taxi / APU Fuel", taxiFuel],
    ["Extra Fuel", extraFuel],
    ["Tankering Fuel", tankeringFuel],
    ["ETOPS Fuel", etopsFuel],
    ["Ballast Fuel", ballastFuel],
    ["Policy Fuel", policyFuel],
  ].filter(([, value]) => !Number.isFinite(Number(value)) || Number(value) < 0);

  if (invalidFuelFields.length > 0) {
    alert("INVALID FUEL VALUES\n\nFuel quantities must be zero or greater.");
    return;
  }

  if (
    !selectedTrainingRoute ||
    !selectedAlternateRoute ||
    !lrcTripResult ||
    !alternateFuelResult ||
    !preliminaryHoldingResult ||
    !preliminaryFuelDistribution
  ) {
    alert(
      "OFP CALCULATION INCOMPLETE\n\n" +
      "Verify the selected routes, cruise level, air distance " +
      "and fuel calculations before generating the OFP."
    );
    return;
  }

  const generatedAtUTC = new Date().toISOString();


  const ofpData = {
    generatedAtUTC,

    flightNumber,
    registration: selectedRegistration,
    origin: departure,
    destination,
    alternate,
        routeText:
      selectedTrainingRoute?.routeText ?? "ROUTE NOT ASSIGNED",
    ezfw: zfw === '' ? null : Number(zfw),
    cruiseLevel,
    averageWind:
      averageWind === '' ? null : Number(averageWind),

    groundDistance:
      airDistanceResult?.groundDistance ?? null,
    alternateDistance:
      alternateFuelResult?.alternateDistance ?? null,
    airDistance:
      airDistanceResult?.airDistance ?? null,
    estimatedTimeHours:
      airDistanceResult?.estimatedTimeHours ?? null,

    tripFuel:
      lrcTripResult?.referenceTripFuel ?? null,
    contingencyFuel:
      preliminaryContingencyResult?.contingencyFuel ?? null,
    alternateFuel:
      alternateFuelResult?.alternateFuel ?? null,
    holdingFuel:
      preliminaryHoldingResult?.holdingFuel ?? null,
      holdingTimeMinutes: preliminaryHoldingResult
  ? Number(alternateHoldingTime)
  : null,
    taxiFuel:
      taxiFuel === '' ? null : Number(taxiFuel),
    extraFuel:
      extraFuel === '' ? null : Number(extraFuel),
    tankeringFuel:
      tankeringFuel === '' ? null : Number(tankeringFuel),
etopsFuel: etopsFuel === '' ? 0 : Number(etopsFuel),
ballastFuel: ballastFuel === '' ? 0 : Number(ballastFuel),
policyFuel: policyFuel === '' ? 0 : Number(policyFuel),
        requiredFuel:
      preliminaryFuelDistribution?.requiredFuel ?? null,
    totalFuel:
      preliminaryFuelDistribution?.totalFuel ?? null,
    takeoffFuel:
      preliminaryFuelDistribution?.takeoffFuel ?? null,

    destinationRemainingFuel:
      preliminaryFuelDistribution?.destinationRemainingFuel ?? null,
    alternateRemainingFuel:
      preliminaryFuelDistribution?.alternateRemainingFuel ?? null,
    afterHoldingFuel:
      preliminaryFuelDistribution?.afterHoldingFuel ?? null,
  };

  


generatedOFPInputsRef.current = currentOFPInputs;
setOfpSaveError("");
setOfpInputsChanged(false);
setPendingOFPSave(true);
setGeneratedOFP(ofpData);


};

const saveGeneratedOFP = async (ofpData) => {
  setSavingOFP(true);
  setOfpSaveError("");

  let storagePath = null;

  try {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new Error("Unable to identify the authenticated user.");
    }

    const pdf = await createOFPDocument();
    const pdfBlob = pdf.output("blob");

    const safeFlightNumber =
      String(ofpData.flightNumber || "TRAINING")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "") || "TRAINING";

    const pdfFileName = `OPERDAT_OFP_${safeFlightNumber}.pdf`;

    storagePath =
      `${userData.user.id}/${crypto.randomUUID()}_${pdfFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("training-ofps")
      .upload(storagePath, pdfBlob, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { error: recordError } = await supabase
      .from("training_ofps")
      .insert({
        user_id: userData.user.id,
        flight_number: ofpData.flightNumber,
        departure: ofpData.origin,
        destination: ofpData.destination,
        file_name: pdfFileName,
        file_path: storagePath,
      });

    if (recordError) throw recordError;

    await loadTrainingOFPs();

    return true;
  } catch (error) {
    console.error("Automatic OFP save error:", error);

    if (storagePath) {
      // Avoid leaving a PDF without a history record.
      // A removal attempt is harmless if the upload failed.
      await supabase.storage
        .from("training-ofps")
        .remove([storagePath]);
    }

    setOfpSaveError(
      "Unable to save the OFP. Please try again."
    );

    return false;
  } finally {
    setSavingOFP(false);
  }
};

const createOFPDocument = async () => {
  const element = document.getElementById("operdat-training-ofp");

  if (!element) {
    throw new Error("OPERDAT OFP document not found.");
  }

  const canvas = await html2canvas(element, {
    scale: 1,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  const imageHeight = (canvas.height * usableWidth) / canvas.width;

  let remainingHeight = imageHeight;
  let offset = 0;

  while (remainingHeight > 0) {
    if (offset > 0) {
      pdf.addPage();
    }

    pdf.addImage(
      imageData,
      "PNG",
      margin,
      margin - offset,
      usableWidth,
      imageHeight
    );

    remainingHeight -= usableHeight;
    offset += usableHeight;
  }

  return pdf;
};

React.useEffect(() => {
  if (!pendingOFPSave || !generatedOFP) return;

  let cancelled = false;

  const saveAfterRender = async () => {
    // Wait until React has rendered the generated OFP.
    await new Promise((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(resolve)
      )
    );

    if (cancelled) return;

    setPendingOFPSave(false);
    await saveGeneratedOFP(generatedOFP);
  };

  saveAfterRender();

  return () => {
    cancelled = true;
  };
}, [pendingOFPSave, generatedOFP]);


const generateOFPPDF = async () => {
  if (!generatedOFP) {
    alert("Generate the OFP before downloading the PDF.");
    return;
  }

if (
  ofpInputsChanged ||
  (generatedOFPInputsRef.current !== null &&
    currentOFPInputs !== generatedOFPInputsRef.current)
) {
  alert(
    "OFP PARAMETERS MODIFIED\n\n" +
    "Flight planning parameters have changed since the OFP was generated.\n\n" +
    "Please generate a new OFP before downloading the PDF."
  );
  return;
}

  if (savingOFP || pendingOFPSave) {
    alert("Please wait until the OFP saving process finishes.");
    return;
  }

  try {
    const pdf = await createOFPDocument();

    const safeFlightNumber =
      String(generatedOFP.flightNumber || "TRAINING")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "") || "TRAINING";

    const pdfFileName = `OPERDAT_OFP_${safeFlightNumber}.pdf`;

    pdf.save(pdfFileName);

    console.log("OFP PDF downloaded:", pdfFileName);
  } catch (error) {
    console.error("OFP PDF download error:", error);
    alert("Unable to download OPERDAT OFP PDF.");
  }
};

  return (
    <div
      style={{
        padding: '28px',
        color: '#ffffff',
        maxWidth: '1100px',
        margin: '0 auto'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            color: '#8ca9d8',
            fontSize: '12px',
            letterSpacing: '2px',
            fontWeight: '700'
          }}
        >
          <TrainingMissionGenerator
  passengerAircraft={passengerAircraft}
  cargoAircraft={cargoAircraft}
/>
          OPERDAT TRAINING
        </div>

        <h1 style={{ marginBottom: '8px' }}>
          Flight Planning Simulator
        </h1>

        <p style={{ color: '#b9c4d3' }}>
          Boeing 737-800 — Flight Dispatch Training
        </p>
      </div>

      <div
        style={{
          padding: '18px',
          marginBottom: '26px',
          borderRadius: '10px',
          background: 'rgba(21,101,255,0.12)',
          border: '1px solid rgba(21,101,255,0.4)',
          textAlign: 'center'
        }}
      >
        <strong>SIMULATED FLIGHT PLAN</strong>

        <div
          style={{
            marginTop: '6px',
            color: '#b9c4d3',
            fontSize: '13px'
          }}
        >
          FOR TRAINING PURPOSES ONLY — NOT FOR OPERATIONAL USE
        </div>
      </div>

      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'rgba(15,23,42,0.75)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Flight Configuration
        </h2>

<div style={{ marginBottom: '20px' }}>
  <label
    htmlFor="training-aircraft"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Aircraft Registration
  </label>

  <select
    id="training-aircraft"
    value={selectedRegistration}
    onChange={e =>
      setSelectedRegistration(e.target.value)
    }
    style={{
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  >
    <option value="">Select aircraft</option>

    {aircraftOptions.map(aircraft => (
      <option
        key={aircraft.registration}
        value={aircraft.registration}
      >
        {aircraft.registration} — {aircraft.type}
        {' — '}{aircraft.operationType}
      </option>
    ))}
  </select>
</div>

{selectedAircraft && (
  <div
    style={{
      padding: '15px',
      borderRadius: '8px',
      background: 'rgba(21,101,255,0.10)',
      color: '#dbe7ff',
      marginBottom: '20px'
    }}
  >
    <strong>
      {selectedAircraft.registration}
      {' — '}
      {selectedAircraft.type}
    </strong>

    <p>
      Configuration: {selectedAircraft.operationType}
    </p>

    <p>
      Maximum Takeoff Weight:{' '}
      {selectedAircraft.maxTOW?.toLocaleString()} kg
    </p>

    <p>
      Performance Model: B737-800 Training
    </p>
  </div>
)}

{/* FLIGHT ROUTE CONFIGURATION */}

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  }}
>
  {[
    {
      label: 'Flight Number',
      value: flightNumber,
      setter: setFlightNumber,
      maxLength: 10
    },
    {
      label: 'Departure ICAO',
      value: departure,
      setter: setDeparture,
      maxLength: 4
    },
    {
      label: 'Destination ICAO',
      value: destination,
      setter: setDestination,
      maxLength: 4
    },
    {
      label: 'Alternate ICAO',
      value: alternate,
      setter: setAlternate,
      maxLength: 4
    }
  ].map(field => (
    <div key={field.label}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: '#b9c4d3'
        }}
      >
        {field.label}
      </label>
      {field.label === 'Departure ICAO' ? (
        <select
          value={departure}
          onChange={(e) => {
            setDeparture(e.target.value);
            setDestination('');
            setAlternate('');
            setGeneratedOFP(null);
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px',
            borderRadius: '8px',
            background: '#17243a',
            color: '#ffffff',
            border: '1px solid #43536b'
          }}
        >
          <option value="">Select departure airport</option>
          {getAvailableOrigins('B738').map((icao) => (
            <option key={icao} value={icao}>
              {icao}
            </option>
          ))}
        </select>
            ) : field.label === 'Destination ICAO' ? (
        <select
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setAlternate('');
            setGeneratedOFP(null);
          }}
          disabled={!departure}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px',
            borderRadius: '8px',
            background: '#17243a',
            color: '#ffffff',
            border: '1px solid #43536b',
            cursor: departure ? 'pointer' : 'not-allowed'
          }}
        >
          <option value="">Select destination airport</option>

          {getAvailableDestinations(departure, 'B738').map((icao) => (
            <option key={icao} value={icao}>
              {icao}
            </option>
          ))}
        </select>
            ) : field.label === 'Alternate ICAO' ? (
        <select
          value={alternate}
          onChange={(e) => {
            setAlternate(e.target.value);
            setGeneratedOFP(null);
          }}
          disabled={!destination}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px',
            borderRadius: '8px',
            background: '#17243a',
            color: '#ffffff',
            border: '1px solid #43536b',
            cursor: destination ? 'pointer' : 'not-allowed'
          }}
        >
          <option value="">Select alternate airport</option>

          {getAvailableDestinations(destination, 'B738').map((icao) => (
            <option key={icao} value={icao}>
              {icao}
            </option>
          ))}
        </select>
      ) : (
      <input
        type="text"
        value={field.value}
        maxLength={field.maxLength}
        onChange={e =>
          field.setter(
            e.target.value.toUpperCase()
          )
        }
        placeholder={
          field.maxLength === 4
            ? 'ICAO'
            : 'NG4521'
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px',
          borderRadius: '8px',
          background: '#17243a',
          color: '#ffffff',
          border: '1px solid #43536b'
        }}
      />
            )}
    </div>
  ))}
</div>

{/* FLIGHT PERFORMANCE CONFIGURATION */}

{/* PLANNED ROUTE DISTANCE */}

<div style={{ marginBottom: '24px' }}>
  <label
    htmlFor="training-route-distance"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Planned Route Distance (NM)
  </label>

  <input
    id="training-route-distance"
    type="number"
    min="1"
    step="1"
value={selectedTrainingRoute?.distanceNM ?? ''}
readOnly
    placeholder="Select departure and destination"
    style={{
      width: '100%',
      maxWidth: '260px',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  />
</div>
{/* OPERDAT TRAINING — ALTERNATE AVAILABILITY WARNING */}

{destination &&
  getAvailableDestinations(destination, 'B738').length === 0 && (
    <div
      role="alert"
      style={{
        padding: '14px 18px',
        marginBottom: '20px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid #f59e0b',
        color: '#fbbf24',
        fontSize: '13px',
        lineHeight: '1.6'
      }}
    >
      <strong>ALTERNATE ROUTE NOT AVAILABLE</strong>

      <div style={{ marginTop: '6px' }}>
        No alternate route is currently configured for
        destination {destination}.
        Alternate distance and fuel calculations
        cannot be completed.
      </div>
    </div>
)}
{/* ALTERNATE ROUTE DISTANCE */}

<div style={{ marginBottom: '24px' }}>
  <label
    htmlFor="training-alternate-distance"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Alternate Route Distance (NM)
  </label>

  <input
    id="training-alternate-distance"
    type="number"
    min="1"
    step="1"
    
value={selectedAlternateRoute?.distanceNM ?? ''}
readOnly

    placeholder="Select destination and alternate"
    style={{
      width: '100%',
      maxWidth: '260px',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  />
</div>
{/* ALTERNATE FLIGHT PARAMETERS */}

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  }}
>
  {[
    {
      label: 'Alternate Average Ground Speed (kt)',
      value: alternateGroundSpeed,
      setter: setAlternateGroundSpeed
    },
    
  ].map(field => (
    <div key={field.label}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: '#b9c4d3'
        }}
      >
        {field.label}
      </label>

      
{field.label === 'Alternate Average Ground Speed (kt)' ? (
  <select
    value={field.value}
    onChange={e => field.setter(e.target.value)}
    style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  >
    <option value="">Select Ground Speed</option>
    <option value="350">350 KT</option>
    <option value="400">400 KT</option>
  </select>
) : (
  <input
    type="number"
    min="1"
    step="1"
    value={field.value}
    onChange={e => field.setter(e.target.value)}
    placeholder="Training estimate"
    style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  />
)}

    </div>
  ))}
</div>

{/* ALTERNATE HOLDING CONFIGURATION */}

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  }}
>
  <div>
    <label
      htmlFor="alternate-holding-time"
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      Alternate Holding Time (min)
    </label>

    <select
      id="alternate-holding-time"
      value={alternateHoldingTime}
      onChange={e =>
        setAlternateHoldingTime(e.target.value)
      }
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    >
      <option value="">Select Holding Time</option>
      <option value="15">15 minutes</option>
      <option value="30">30 minutes</option>
    </select>
  </div>
</div>

  {/* OPERDAT TRAINING — TAXI / APU FUEL */}

<div>
  <label
    htmlFor="taxi-fuel"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Taxi / APU Fuel (kg)
  </label>

  <input
    id="taxi-fuel"
    type="number"
    min="0"
    step="1"
    value={taxiFuel}
    onChange={e => setTaxiFuel(e.target.value)}
    placeholder="Enter Taxi / APU Fuel"
    style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  />
</div>
{/* OPERDAT TRAINING — EXTRA FUEL */}

<div>
  <label
    htmlFor="extra-fuel"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Extra Fuel (kg)
  </label>

  <input
    id="extra-fuel"
    type="number"
    min="0"
    step="1"
    value={extraFuel}
    onChange={e => setExtraFuel(e.target.value)}
    placeholder="Enter Extra Fuel"
    style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  />
</div>
{/* OPERDAT TRAINING — TANKERING FUEL */}

<div>
  <label
    htmlFor="tankering-fuel"
    style={{
      display: 'block',
      marginBottom: '8px',
      color: '#b9c4d3'
    }}
  >
    Tankering Fuel (kg)
  </label>

  <input
    id="tankering-fuel"
    type="number"
    min="0"
    step="1"
    value={tankeringFuel}
    onChange={e => setTankeringFuel(e.target.value)}
    placeholder="Enter Tankering Fuel"
    style={{
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px',
      borderRadius: '8px',
      background: '#17243a',
      color: '#ffffff',
      border: '1px solid #43536b'
    }}
  />
</div>

{/* OPERDAT TRAINING — OPTIONAL FUEL */}

{[
  {
    id: 'etops-fuel',
    label: 'ETOPS Fuel (kg)',
    value: etopsFuel,
    setter: setEtopsFuel
  },
  {
    id: 'ballast-fuel',
    label: 'Ballast Fuel (kg)',
    value: ballastFuel,
    setter: setBallastFuel
  },
  {
    id: 'policy-fuel',
    label: 'Policy Fuel (kg)',
    value: policyFuel,
    setter: setPolicyFuel
  }
].map(field => (
  <div key={field.id}>
    <label
      htmlFor={field.id}
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      {field.label}
    </label>

    <input
      id={field.id}
      type="number"
      min="0"
      step="1"
      value={field.value}
      onChange={e => field.setter(e.target.value)}
      placeholder="Optional — default 0 kg"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    />
  </div>
))}

<h3 style={{ marginTop: '26px', marginBottom: '16px' }}>
  Flight Performance
</h3>

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  }}
>
  <div>
    <label
      htmlFor="training-zfw"
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      Estimated Zero Fuel Weight — EZFW (kg)
    </label>

    <input
      id="training-zfw"
      type="number"
      min="0"
      step="100"
      value={zfw}
      onChange={e => setZfw(e.target.value)}
      placeholder="56000"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    />
  </div>

  <div>
    <label
      htmlFor="training-flight-level"
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      Cruise Flight Level
    </label>

    <input
      id="training-flight-level"
      type="number"
      min="0"
      max="450"
      step="10"
      value={cruiseLevel}
      onChange={e => setCruiseLevel(e.target.value)}
      placeholder="350"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    />
  </div>

  <div>
    <label
      htmlFor="training-wind"
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#b9c4d3'
      }}
    >
      Average Wind Component (kt)
    </label>

    <input
      id="training-wind"
      type="number"
      min="-150"
      max="150"
      step="5"
      value={averageWind}
      onChange={e => setAverageWind(e.target.value)}
      placeholder="-30"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px',
        borderRadius: '8px',
        background: '#17243a',
        color: '#ffffff',
        border: '1px solid #43536b'
      }}
    />

    <div
      style={{
        fontSize: '12px',
        color: '#8ca9d8',
        marginTop: '6px'
      }}
    >
      Positive = Tailwind / Negative = Headwind
    </div>
  </div>
</div>
{/* SIMULATED AIR DISTANCE */}

{/* FIRST ROW — FLIGHT AND ALTERNATE ESTIMATES */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(2, minmax(0, 1fr))',
    gap: '20px',
    alignItems: 'start',
    marginTop: '20px'
  }}
>
{airDistanceResult && (
  <div
    style={{
      marginTop: '12px',
      marginBottom: '24px',
      padding: '20px',
      borderRadius: '10px',
      background: 'rgba(21,101,255,0.10)',
      border: '1px solid rgba(21,101,255,0.35)'
    }}
  >
    <h3 style={{ marginTop: 0 }}>
      Preliminary Flight Estimates
    </h3>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px'
      }}
    >
      <div>
        <div style={{ color: '#b9c4d3' }}>
          Ground Distance
        </div>
        <strong>
          {airDistanceResult.groundDistance.toLocaleString()} NM
        </strong>
      </div>

      <div>
        <div style={{ color: '#b9c4d3' }}>
          Average Wind
        </div>
        <strong>
          {airDistanceResult.averageWind} kt
        </strong>
      </div>

      <div>
        <div style={{ color: '#b9c4d3' }}>
          Estimated Air Distance
        </div>
        <strong>
          {airDistanceResult.airDistance.toLocaleString()} NM
        </strong>
      </div>
      <div>
  <div style={{ color: '#b9c4d3' }}>
    Estimated Ground Speed
  </div>
  <strong>
    {airDistanceResult.estimatedGroundSpeed.toFixed(0)} kt
  </strong>
</div>

<div>
  <div style={{ color: '#b9c4d3' }}>
    Estimated Trip Time
  </div>
  <strong>
    {Math.floor(airDistanceResult.estimatedTimeHours)} h{' '}
    {String(
      Math.round(
        (airDistanceResult.estimatedTimeHours % 1) * 60
      )
    ).padStart(2, '0')} min
  </strong>
</div> 
{tripFuelResult && (
  <div>
    <div style={{ color: '#b9c4d3' }}>
      Estimated Trip Fuel
    </div>
    <strong>
      {tripFuelResult.tripFuel.toLocaleString()} kg
    </strong>
  </div>
  
)}
{lrcTripResult && (
  <>
    <div>
      <div style={{ color: '#b9c4d3' }}>
        LRC Reference Trip Fuel
      </div>
      <strong>
        {lrcTripResult.referenceTripFuel.toLocaleString()} kg
      </strong>
    </div>

    <div>
      <div style={{ color: '#b9c4d3' }}>
        LRC Reference Trip Time
      </div>
      <strong>
        {Math.floor(lrcTripResult.referenceTripTimeMinutes / 60)} h{' '}
        {String(
          lrcTripResult.referenceTripTimeMinutes % 60
        ).padStart(2, '0')} min
      </strong>
    </div>
    
  </>
  
)}
    </div>

    <p
      style={{
        marginBottom: 0,
        marginTop: '16px',
        fontSize: '12px',
        color: '#8ca9d8'
      }}
    >
      Preliminary training estimate using a reference
      TAS of 450 kt. Not an operational calculation.
    </p>
  </div>
)}
{/* ALTERNATE FUEL ESTIMATES */}

{alternateFuelResult && (
  <div
    style={{
      marginTop: '12px',
      marginBottom: '24px',
      padding: '20px',
      borderRadius: '10px',
      background: 'rgba(21,101,255,0.10)',
      border: '1px solid rgba(21,101,255,0.35)'
    }}
  >
    <h3 style={{ marginTop: 0 }}>
      Alternate Fuel Estimates
    </h3>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px'
      }}
    >
      <div>
        <div style={{ color: '#b9c4d3' }}>
          Alternate Distance
        </div>
        <strong>
          {alternateFuelResult.alternateDistance.toLocaleString()} NM
        </strong>
      </div>

      <div>
        <div style={{ color: '#b9c4d3' }}>
          Average Ground Speed
        </div>
        <strong>
          {Number(alternateGroundSpeed).toLocaleString()} kt
        </strong>
      </div>

      <div>
        <div style={{ color: '#b9c4d3' }}>
          Alternate Flight Time
        </div>
        <strong>
          {alternateFuelResult.alternateTimeMinutes} min
        </strong>
      </div>

      <div>
        <div style={{ color: '#b9c4d3' }}>
          ALTN FUEL
        </div>
        <strong>
          {alternateFuelResult.alternateFuel.toLocaleString()} kg
        </strong>
      </div>
      
    </div>

    <p
      style={{
        marginBottom: 0,
        marginTop: '16px',
        fontSize: '12px',
        color: '#8ca9d8'
      }}
    >
      Preliminary alternate fuel estimate.
      Simplified training model — not for operational use.
    </p>
   </div>

)}

{/* END FIRST ROW */}
</div>

{/* OPERDAT TRAINING — DISPATCH FUEL SUMMARY */}
{/* LRC AIR DISTANCE RANGE WARNING */}

{airDistanceResult &&
  (airDistanceResult.airDistance < 200 ||
    airDistanceResult.airDistance > 5000) && (
    <div
      role="alert"
      style={{
        padding: '14px 18px',
        marginBottom: '20px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid #f59e0b',
        color: '#fbbf24',
        fontSize: '13px',
        lineHeight: '1.6'
      }}
    >
      <strong>LRC AIR DISTANCE LIMITATION</strong>

      <div style={{ marginTop: '6px' }}>
        The current B737-800 LRC training model supports
        air distances between 200 and 5,000 NM only.
        The selected route is outside the supported range.
        LRC fuel calculations are unavailable.
      </div>
    </div>
)}
{/* LRC PERFORMANCE RANGE WARNING */}

{cruiseLevel !== '' &&
  (Number(cruiseLevel) < 290 ||
    Number(cruiseLevel) > 370) && (
    <div
      role="alert"
      style={{
        padding: '14px 18px',
        marginBottom: '20px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid #f59e0b',
        color: '#fbbf24',
        fontSize: '13px',
        lineHeight: '1.6'
      }}
    >
      <strong>LRC PERFORMANCE LIMITATION</strong>

      <div style={{ marginTop: '6px' }}>
        The current B737-800 LRC training model supports
        cruise levels FL290 through FL370 only.
        Select a level within this range to enable
        LRC fuel calculations.
      </div>
    </div>
)}
<FuelPlanningSummary
  tripFuel={lrcTripResult?.referenceTripFuel ?? null}
  tripTimeMinutes={lrcTripResult?.referenceTripTimeMinutes ?? null}
  contingencyFuel={
    preliminaryContingencyResult?.contingencyFuel ?? null
  }
  alternateFuel={alternateFuelResult?.alternateFuel ?? null}
  alternateTimeMinutes={
    alternateFuelResult?.alternateTimeMinutes ?? null
  }
  holdingFuel={preliminaryHoldingResult?.holdingFuel ?? null}
  holdingTimeMinutes={
  preliminaryHoldingResult
    ? Number(alternateHoldingTime)
    : null
}
taxiFuel={
  taxiFuel !== '' && Number.isFinite(Number(taxiFuel))
    && Number(taxiFuel) >= 0
    ? Number(taxiFuel)
    : null
}
extraFuel={
  extraFuel !== '' &&
  Number.isFinite(Number(extraFuel)) &&
  Number(extraFuel) >= 0
    ? Number(extraFuel)
    : null
}
etopsFuel={Number(etopsFuel || 0)}
ballastFuel={Number(ballastFuel || 0)}
policyFuel={Number(policyFuel || 0)}
tankeringFuel={
  tankeringFuel !== '' &&
  Number.isFinite(Number(tankeringFuel)) &&
  Number(tankeringFuel) >= 0
    ? Number(tankeringFuel)
    : null
}
requiredFuel={
  preliminaryFuelDistribution?.requiredFuel ?? null
}

totalFuel={
  preliminaryFuelDistribution?.totalFuel ?? null
}
takeoffFuel={
  preliminaryFuelDistribution?.takeoffFuel ?? null
}
/>

{/* OPERDAT TRAINING — ROUTE DETAILS */}
{selectedTrainingRoute && (
  <div style={{ marginTop: '24px' }}>
    <TrainingRouteDetails
      origin={departure}
      destination={destination}
      cruiseLevel={cruiseLevel}
      route={selectedTrainingRoute.routeText}
    />
  </div>
)}
{/* OPERDAT TRAINING — OFP PREVIEW */}

<div style={{ marginTop: '30px' }}>
  
 <TrainingOFP
  {...ofpDisplayData}
/>
{/* OPERDAT TRAINING — OFP STATUS */}
<div
  style={{
    marginTop: '24px',
    marginBottom: '10px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: generatedOFP ? '#167347' : '#a66a00',
  }}
>
  {generatedOFP
    ? 'OFP GENERATED — SNAPSHOT SAVED'
    : 'OFP PREVIEW — NOT YET GENERATED'}
</div>
</div>
{/* OPERDAT TRAINING — GENERATE OFP */}
<div style={{ marginTop: '20px' }}>
  
<button
  type="button"
  onClick={generateOFP}
  disabled={savingOFP || pendingOFPSave}

    style={{
      padding: '12px 24px',
      
backgroundColor: savingOFP || pendingOFPSave
  ? '#64748b'
  : '#1769aa',

      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
    }}
  >
    
{savingOFP || pendingOFPSave
  ? 'Saving OFP...'
  : 'Generate OFP'}

  </button>
</div>
{/* OPERDAT TRAINING — PDF EXPORT */}
<div style={{ marginTop: '20px', marginBottom: '24px' }}>
  
  <button
    type="button"
    onClick={generateOFPPDF}
    disabled={!generatedOFP}
    style={{
      padding: '14px 24px',
      background: '#1565ff',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      opacity: generatedOFP ? 1 : 0.5,
cursor: generatedOFP ? 'pointer' : 'not-allowed',
      cursor: 'pointer'
    }}
  >
    Generate OFP PDF
  </button>
</div>

<p style={{ color: '#b9c4d3' }}>
  Status: Simulator under development
</p>

<p style={{ color: '#8ca9d8' }}>
  Route selection, weather conditions,
  fuel planning and simulated flight plan
  generation will be added progressively.
</p>
{/* OPERDAT TRAINING — NEW FLIGHT */}
{generatedOFP && (
  <div style={{ marginTop: '10px' }}>
    <button
      type="button"
      onClick={startNewFlight}
      disabled={savingOFP || pendingOFPSave}
      style={{
        padding: '10px 20px',
        backgroundColor: '#64748b',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: savingOFP || pendingOFPSave
  ? 'not-allowed'
  : 'pointer',
opacity: savingOFP || pendingOFPSave ? 0.5 : 1,
      }}
    >
      New Flight
    </button>
  </div>
)}
<div
  style={{
    marginTop: 24,
    padding: 20,
    border: "1px solid #34445a",
    borderRadius: 10,
    backgroundColor: "#172235",
  }}
>
  <h3 style={{ color: "#ffffff", marginTop: 0 }}>
    Saved Training OFPs
  </h3>

  {loadingTrainingOFPs ? (
    <p style={{ color: "#b9c4d3" }}>
      Loading saved OFPs...
    </p>
  ) : savedTrainingOFPs.length === 0 ? (
    <p style={{ color: "#b9c4d3" }}>
      No saved OFPs yet.
    </p>
  ) : (
    <div>
      {savedTrainingOFPs.map((ofp, index) => (
        <div
          key={ofp.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
            borderBottom: "1px solid #34445a",
          }}
        >
          <div>
            <strong style={{ color: "#ffffff" }}>
              {String(index + 1).padStart(3, "0")} —{" "}
              {ofp.flight_number || "TRAINING"}
            </strong>

            <div style={{ color: "#8ca9d8", marginTop: 4 }}>
              {ofp.departure || "----"} →{" "}
              {ofp.destination || "----"}
            </div>

            <small style={{ color: "#b9c4d3" }}>
              {new Date(ofp.created_at).toLocaleString()}
            </small>
          </div>

          <button
  type="button"
  onClick={() => viewTrainingOFP(ofp.file_path)}
  style={{
    padding: "8px 14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  }}
>
  View OFP
</button>
        </div>
      ))}
    </div>
  )}
</div>
</div>

</div>
);
}

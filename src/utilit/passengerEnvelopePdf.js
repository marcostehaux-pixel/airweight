import {
  B787_GRAPHIC_POLYGONS
} from './b787WeightBalanceEngine'
import {
  A320_CG_ENVELOPES
} from './a320WeightBalanceEngine'
import {
  passengerEnvelope,
  passengerZfwEnvelope,
  passengerMapIndex,
  passengerMapWeight
} from '../envelopeValidation'
export function addPassengerEnvelopePage(doc, {
  selectedAircraft,
  flightNumber,
  flightFrom,
  flightTo,
  zfw,
  tow,
  zfCg,
  toCg,
  zfi,
  toi
}) {
  doc.addPage();

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);

  doc.text(
    'PASSENGER WEIGHT & BALANCE ENVELOPE',
    105,
    18,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  doc.text(
    `REGISTRATION: ${selectedAircraft?.registration || '----'}`,
    20,
    30
  );

  doc.text(
    `FLIGHT: ${flightNumber || '----'}`,
    80,
    30
  );

  doc.text(
    `${flightFrom || '----'} - ${flightTo || '----'}`,
    145,
    30
  );

  doc.setDrawColor(180);
  doc.line(20, 36, 190, 36);

  // B737 - PASSENGER ENVELOPE
  if (String(selectedAircraft?.type || '').startsWith('B737')) {
    const chart = {
      x: 25,
      y: 48,
      width: 160,
      height: 205
    };

    // Original B737 graphical coordinates
    const minX = 60;
    const maxX = 750;
    const minY = 50;
    const maxY = 310;

    const mapX = (x) =>
      chart.x +
      ((x - minX) / (maxX - minX)) * chart.width;

    const mapY = (y) =>
      chart.y +
      ((y - minY) / (maxY - minY)) * chart.height;

    // Axes
    doc.setDrawColor(110, 120, 135);
    doc.setLineWidth(0.3);

    doc.line(
      chart.x,
      chart.y,
      chart.x,
      chart.y + chart.height
    );

    doc.line(
      chart.x,
      chart.y + chart.height,
      chart.x + chart.width,
      chart.y + chart.height
    );

    // Weight grid
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    for (let weight = 40000; weight <= 85000; weight += 5000) {
      const y = mapY(passengerMapWeight(weight));

      doc.setDrawColor(225, 230, 235);
      doc.line(chart.x, y, chart.x + chart.width, y);

      doc.setTextColor(70);
      doc.text(
        String(weight / 1000),
        chart.x - 3,
        y + 1,
        { align: 'right' }
      );
    }

    // Index grid
    for (let index = 35; index <= 90; index += 5) {
      const x = mapX(passengerMapIndex(index));

      doc.setDrawColor(225, 230, 235);
      doc.line(x, chart.y, x, chart.y + chart.height);

      doc.setTextColor(70);
      doc.text(
        String(index),
        x,
        chart.y + chart.height + 5,
        { align: 'center' }
      );
    }

    // Draw original envelope polygons
    const drawPolygon = (polygon, color) => {
      if (!Array.isArray(polygon) || polygon.length < 3) {
        return;
      }

      doc.setDrawColor(...color);
      doc.setLineWidth(0.8);

      polygon.forEach(([x, y], index) => {
        const [nextX, nextY] =
          polygon[(index + 1) % polygon.length];

        doc.line(
          mapX(x),
          mapY(y),
          mapX(nextX),
          mapY(nextY)
        );
      });
    };

    drawPolygon(
      passengerZfwEnvelope,
      [220, 60, 60]
    );

    drawPolygon(
      passengerEnvelope,
      [40, 100, 210]
    );

    // B737 - Calculated ZFW and TAKEOFF points
    const drawPoint = (index, weight, color, label, offsetX = 0) => {
      const indexValue = Number(index);
      const weightValue = Number(weight);

      if (
        !Number.isFinite(indexValue) ||
        !Number.isFinite(weightValue)
      ) {
        return;
      }

      const x = mapX(passengerMapIndex(indexValue) + offsetX);
      const y = mapY(passengerMapWeight(weightValue));

      doc.setFillColor(...color);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.circle(x, y, 2.2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...color);
      doc.text(label, x + 3, y - 3);
    };

    // Same ZFW offset used by the existing validation
    drawPoint(zfi, zfw, [220, 60, 60], 'ZFW', -15);

    drawPoint(toi, tow, [40, 100, 210], 'TOW');

    // Legend
    doc.setFontSize(9);

    doc.setTextColor(220, 60, 60);
    doc.text('ZFW ENVELOPE', 35, 265);

    doc.setTextColor(40, 100, 210);
    doc.text('TAKEOFF ENVELOPE', 110, 265);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);

    doc.text(
      'INDEX',
      105,
      273,
      { align: 'center' }
    );

    doc.text(
      'WEIGHT (x1000 KG)',
      25,
      43
    );
  }

  // A320 - TRAINING ENVELOPE
  if (selectedAircraft?.type === 'A320-232') {
    const chart = {
      x: 25,
      y: 48,
      width: 160,
      height: 205
    };

    const minCg = 15;
    const maxCg = 50;
    const minWeight = 35000;
    const maxWeight = 80000;

    const mapX = (cg) =>
      chart.x +
      ((Number(cg) - minCg) / (maxCg - minCg)) *
        chart.width;

    const mapY = (weight) =>
      chart.y +
      chart.height -
      ((Number(weight) - minWeight) /
        (maxWeight - minWeight)) *
        chart.height;

    // Axes and grid
    doc.setDrawColor(110, 120, 135);
    doc.setLineWidth(0.3);

    doc.line(chart.x, chart.y, chart.x, chart.y + chart.height);
    doc.line(
      chart.x,
      chart.y + chart.height,
      chart.x + chart.width,
      chart.y + chart.height
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    for (let weight = 35000; weight <= 80000; weight += 5000) {
      const y = mapY(weight);

      doc.setDrawColor(225, 230, 235);
      doc.line(chart.x, y, chart.x + chart.width, y);

      doc.setTextColor(70);
      doc.text(
        String(weight / 1000),
        chart.x - 3,
        y + 1,
        { align: 'right' }
      );
    }

    for (let cg = 15; cg <= 50; cg += 5) {
      const x = mapX(cg);

      doc.setDrawColor(225, 230, 235);
      doc.line(x, chart.y, x, chart.y + chart.height);

      doc.setTextColor(70);
      doc.text(
        String(cg),
        x,
        chart.y + chart.height + 5,
        { align: 'center' }
      );
    }

    // Build polygon from forward and aft limits
    const buildPolygon = (envelope) => {
      const forward = envelope.forward.map(
        ([weight, cg]) => [cg, weight]
      );

      const aft = [...envelope.aft]
        .reverse()
        .map(([weight, cg]) => [cg, weight]);

      return [...forward, ...aft];
    };

    const drawPolygon = (polygon, color) => {
      if (!Array.isArray(polygon) || polygon.length < 3) {
        return;
      }

      doc.setDrawColor(...color);
      doc.setLineWidth(0.8);

      polygon.forEach(([cg, weight], index) => {
        const [nextCg, nextWeight] =
          polygon[(index + 1) % polygon.length];

        doc.line(
          mapX(cg),
          mapY(weight),
          mapX(nextCg),
          mapY(nextWeight)
        );
      });
    };

    drawPolygon(
      buildPolygon(A320_CG_ENVELOPES.ZFW),
      [220, 60, 60]
    );

    drawPolygon(
      buildPolygon(A320_CG_ENVELOPES.TAKEOFF),
      [40, 100, 210]
    );

    // Calculated CG points
    const drawPoint = (cg, weight, color, label) => {
      const x = mapX(cg);
      const y = mapY(weight);

      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return;
      }

      doc.setFillColor(...color);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.2);
      doc.circle(x, y, 2.2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...color);
      doc.text(label, x + 3, y - 3);
    };

    drawPoint(zfCg, zfw, [220, 60, 60], 'ZFW');
    drawPoint(toCg, tow, [40, 100, 210], 'TOW');

    // Legend
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    doc.setTextColor(220, 60, 60);
    doc.text('ZFW ENVELOPE', 35, 265);

    doc.setTextColor(40, 100, 210);
    doc.text('TAKEOFF ENVELOPE', 110, 265);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);

    doc.text('CG (%MAC)', 105, 273, {
      align: 'center'
    });

    doc.text('WEIGHT (x1000 KG)', 25, 43);
  }

  // B787-9 - TRAINING ENVELOPE
  if (selectedAircraft?.type === 'B787-9') {
    const chart = {
      x: 25,
      y: 48,
      width: 160,
      height: 205
    };

    const minCg = 0;
    const maxCg = 50;
    const minWeight = 100000;
    const maxWeight = 260000;

    const mapX = (cg) =>
      chart.x +
      ((cg - minCg) / (maxCg - minCg)) * chart.width;

    const mapY = (weight) =>
      chart.y +
      chart.height -
      ((weight - minWeight) / (maxWeight - minWeight)) *
        chart.height;

    // Axes
    doc.setDrawColor(110, 120, 135);
    doc.setLineWidth(0.3);

    doc.line(
      chart.x,
      chart.y,
      chart.x,
      chart.y + chart.height
    );

    doc.line(
      chart.x,
      chart.y + chart.height,
      chart.x + chart.width,
      chart.y + chart.height
    );

    // Weight grid
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    for (let weight = 100000; weight <= 260000; weight += 20000) {
      const y = mapY(weight);

      doc.setDrawColor(225, 230, 235);
      doc.line(chart.x, y, chart.x + chart.width, y);

      doc.setTextColor(70);
      doc.text(
        String(weight / 1000),
        chart.x - 3,
        y + 1,
        { align: 'right' }
      );
    }

    // CG grid
    for (let cg = 0; cg <= 50; cg += 5) {
      const x = mapX(cg);

      doc.setDrawColor(225, 230, 235);
      doc.line(x, chart.y, x, chart.y + chart.height);

      doc.setTextColor(70);
      doc.text(
        String(cg),
        x,
        chart.y + chart.height + 5,
        { align: 'center' }
      );
    }

    // Draw envelope polygons
    const drawPolygon = (polygon, color) => {
      if (!Array.isArray(polygon) || polygon.length < 3) {
        return;
      }

      doc.setDrawColor(...color);
      doc.setLineWidth(0.8);

      polygon.forEach(([cg, weight], index) => {
        const [nextCg, nextWeight] =
          polygon[(index + 1) % polygon.length];

        doc.line(
          mapX(cg),
          mapY(weight),
          mapX(nextCg),
          mapY(nextWeight)
        );
      });
    };

    drawPolygon(
      B787_GRAPHIC_POLYGONS.ZFW,
      [220, 60, 60]
    );

    drawPolygon(
      B787_GRAPHIC_POLYGONS.TAKEOFF,
      [40, 100, 210]
    );
// ZFW and TAKEOFF calculated points
const drawPoint = (cg, weight, color, label) => {
  const x = mapX(Number(cg));
  const y = mapY(Number(weight));

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return;
  }

  doc.setFillColor(...color);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);

  doc.circle(x, y, 2.2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...color);

  doc.text(label, x + 3, y - 3);
};

drawPoint(zfCg, zfw, [220, 60, 60], 'ZFW');
drawPoint(toCg, tow, [40, 100, 210], 'TOW');
    // Legend
    doc.setFontSize(9);

    doc.setTextColor(220, 60, 60);
    doc.text('ZFW ENVELOPE', 35, 265);

    doc.setTextColor(40, 100, 210);
    doc.text('TAKEOFF ENVELOPE', 110, 265);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);

    doc.text(
      'CG (%MAC)',
      105,
      273,
      { align: 'center' }
    );

    doc.text(
      'WEIGHT (x1000 KG)',
      25,
      43
    );
  }

  doc.setFontSize(8);
  doc.setTextColor(100);

  doc.text(
    'OPERDAT TRAINING - NOT FOR OPERATIONAL USE',
    105,
    285,
    { align: 'center' }
  );
}

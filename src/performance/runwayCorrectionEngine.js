import { RUNWAY_CORRECTIONS_DRY as T } from './runwayCorrectionData.js';

function interpolate(x, x1, x2, y1, y2) {
  return y1 + (x-x1)*(y2-y1)/(x2-x1);
}
function bracket(values,x,label) {
  if (!Number.isFinite(x) || x<values[0] || x>values[values.length-1]) {
    throw new RangeError(`${label} outside tabulated range ${values[0]} to ${values.at(-1)}`);
  }
  const exact=values.indexOf(x);
  if(exact>=0) return [exact,exact];
  const hi=values.findIndex(v=>v>x);
  return [hi-1,hi];
}
function lookup(rows, columns, lengthM, colValue, label) {
  const lengths=rows.map(row=>row[0]);
  const [loL,hiL]=bracket(lengths,lengthM,'Length');
  const [loC,hiC]=bracket(columns,colValue,label);
  const atRow=(r)=>{
    const a=rows[r][loC+1];
    if(loC===hiC) return a;
    return interpolate(colValue,columns[loC],columns[hiC],a,rows[r][hiC+1]);
  };
  const v1=atRow(loL);
  return loL===hiL?v1:interpolate(lengthM,lengths[loL],lengths[hiL],v1,atRow(hiL));
}

export function calculateDryCorrectedFieldLength({toraM,slopePercent,windComponentKt}) {
  const slopeCorrectedM=lookup(T.slopeRows,T.slopePercent,toraM,slopePercent,'Slope %');
  const correctedFieldLengthM=lookup(T.windRows,T.windKt,slopeCorrectedM,windComponentKt,'Wind kt');
  return {slopeCorrectedM,correctedFieldLengthM};
}

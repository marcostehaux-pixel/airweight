
// OPERDAT Training
// Airport catalog
// FOR TRAINING PURPOSES ONLY

export const trainingAirports = [
  {
    icao: "SAAR",
    name: "Rosario",
    country: "Argentina"
  },
  {
    icao: "SAEZ",
    name: "Ezeiza",
    country: "Argentina"
  },
  {
    icao: "SABE",
    name: "Aeroparque",
    country: "Argentina"
  },
  {
    icao: "SACO",
    name: "Cordoba",
    country: "Argentina"
  },
  {
    icao: "SBGL",
    name: "Rio de Janeiro / Galeao",
    country: "Brasil"
  },
  {
    icao: "SBGR",
    name: "Sao Paulo / Guarulhos",
    country: "Brasil"
  },
  
{
  icao: "SBKP",
  name: "Campinas / Viracopos",
  country: "Brasil"
}

];

export function findTrainingAirport(icao) {
  return trainingAirports.find(
    (airport) => airport.icao === icao
  ) ?? null;
}

const cargoFuelTable = [
  { kg: 500, index: 0.0 },
  { kg: 1000, index: 0.0 },
  { kg: 1500, index: 0.0 },
  { kg: 2000, index: 0.1 },
  { kg: 2500, index: 0.2 },
  { kg: 3000, index: 0.4 },
  { kg: 3500, index: 0.6 },
  { kg: 4000, index: 1.0 },
  { kg: 4500, index: 1.5 },
  { kg: 5000, index: 2.1 },
  { kg: 5500, index: 2.9 },
  { kg: 6000, index: 3.8 },
  { kg: 6500, index: 5.0 },
  { kg: 7000, index: 6.3 },
  { kg: 7500, index: 7.9 },
  { kg: 7801, index: 9.0 },
  { kg: 8000, index: 8.8 },
  { kg: 8500, index: 8.1 },
  { kg: 9000, index: 7.3 },
  { kg: 9500, index: 6.6 },
  { kg: 10000, index: 5.8 },
  { kg: 10500, index: 5.0 },
  { kg: 11000, index: 4.3 },
  { kg: 11500, index: 3.6 },
  { kg: 12000, index: 2.8 },
  { kg: 12500, index: 2.1 },
  { kg: 13000, index: 1.4 },
  { kg: 13500, index: 0.7 },
  { kg: 14000, index: 0.0 },
  { kg: 14500, index: -0.7 },
  { kg: 15000, index: -1.4 },
  { kg: 15500, index: -2.0 },
  { kg: 16000, index: -2.7 },
  { kg: 16500, index: -3.4 },
  { kg: 17000, index: -4.1 },
  { kg: 17500, index: -4.8 },
  { kg: 18000, index: -5.5 },
  { kg: 18500, index: -6.2 },
  { kg: 19000, index: -6.9 },
  { kg: 19500, index: -7.7 },
  { kg: 20000, index: -8.5 },
  { kg: 20500, index: -9.4 },
  { kg: 20820, index: -9.9 }
]

export default cargoFuelTable

export function getCargoFuelIndex(weight) {

  if (!weight || weight <= 0) return 0

  const row = cargoFuelTable.find(
    entry => weight <= entry.kg
  )

  return row ? row.index : cargoFuelTable[cargoFuelTable.length - 1].index

}
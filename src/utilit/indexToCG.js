import { cargoCgTables } from './cargoCgTables'


function interpolate(x, x1, y1, x2, y2) {

  if (x1 === x2) return y1

  return (
    y1 +
    ((x - x1) * (y2 - y1)) /
    (x2 - x1)
  )

}


function getCgAtWeight(table, index) {

  const data = table.data

  if (index <= data[0].index) {
    return data[0].cg
  }

  if (index >= data[data.length - 1].index) {
    return data[data.length - 1].cg
  }

  for (let i = 0; i < data.length - 1; i++) {

    const lower = data[i]
    const upper = data[i + 1]

    if (
      index >= lower.index &&
      index <= upper.index
    ) {

      return interpolate(
        index,
        lower.index,
        lower.cg,
        upper.index,
        upper.cg
      )

    }

  }

  return 0

}


export function getCgFromIndex(index, weight) {

  if (!index || !weight) return 0

  if (weight <= cargoCgTables[0].weight) {

    return getCgAtWeight(
      cargoCgTables[0],
      index
    )

  }

  if (
    weight >=
    cargoCgTables[cargoCgTables.length - 1].weight
  ) {

    return getCgAtWeight(
      cargoCgTables[cargoCgTables.length - 1],
      index
    )

  }

  for (
    let i = 0;
    i < cargoCgTables.length - 1;
    i++
  ) {

    const lowerTable = cargoCgTables[i]

    const upperTable = cargoCgTables[i + 1]

    if (
      weight >= lowerTable.weight &&
      weight <= upperTable.weight
    ) {

      const lowerCg = getCgAtWeight(
        lowerTable,
        index
      )

      const upperCg = getCgAtWeight(
        upperTable,
        index
      )

      return interpolate(
        weight,
        lowerTable.weight,
        lowerCg,
        upperTable.weight,
        upperCg
      )

    }

  }

  return 0

}
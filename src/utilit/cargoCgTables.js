const LEMAC = 627.1
const MAC = 155.8

const INDEX_REFERENCE_ARM = 658.0
const INDEX_CONSTANT = 35000
const INDEX_OFFSET = 45

const weights = [
  35000,
  40000,
  45000,
  50000,
  55000,
  60000,
  65000,
  70000,
  75000,
  80000
]

const cgValues = [
  5,
  10,
  15,
  20,
  25,
  30,
  35
]

function cgToIndex(cg, weight) {

  const arm =
    LEMAC +
    (cg / 100) * MAC

  return (
    INDEX_OFFSET +
    (
      weight *
      (arm - INDEX_REFERENCE_ARM)
    ) /
    INDEX_CONSTANT
  )
}

const cargoCgTables =
  weights.map(weight => ({

    weight,

    data:
      cgValues.map(cg => ({

        index: cgToIndex(
          cg,
          weight
        ),

        cg

      }))

  }))

export { cargoCgTables }
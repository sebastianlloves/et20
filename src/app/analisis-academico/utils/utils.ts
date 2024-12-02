import { AGENDA_ANIO_ACTUAL, ANIO_ACTUAL } from "@/lib/constants"
import { PERIODOS } from "../components/filters/inputs/calif-parciales/calif-parciales-filter"

export function getSliderFilterData(
  paramValue: string | null,
  stringGeneratorFn: (filterValue: number[], extra?: any) => string,
  uniqueValues?: Array<[string, number]>,
  extraData?: any
) {
  const filterValue = paramValue
    ?.split('_')
    .map((value) => Number(value))
    .sort((a, b) => a - b)

  const formatedUniqueValues = uniqueValues?.map(([key, value]) => [
    Number(key.split('_')[1]),
    value,
  ])
  const quantity = formatedUniqueValues?.reduce(
    (acc, [key, value]) =>
      filterValue && key >= filterValue[0] && key <= filterValue[1]
        ? acc + value
        : acc,
    0,
  )
  return {
    filterValue,
    filterTag: filterValue && {
      value: stringGeneratorFn(filterValue, extraData),
      quantity,
    },
  }
}

export function getCantRepitenciasString([min, max]: number[]) {
  if (min === 0) {
    if (max === 0) return `Nunca repitió`
    return `Repitió hasta ${max} ve${max > 1 ? 'ces' : 'z'}`
  }
  if (min === max) return `Repitió ${max} ve${max > 1 ? 'ces' : 'z'}`
  return `Repitió entre ${min} y ${max} ve${max > 1 ? 'ces' : 'z'}`
}

export function getCantMateriasString(
  [min, max]: number[],
  materiaType: { singular: string; plural: string },
) {
  if (min === 0) {
    if (max === 0) return `No adeuda materias ${materiaType.plural}`
    return `Hasta ${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
  }
  if (min === max)
    return `${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
  return `Entre ${min} y ${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
}


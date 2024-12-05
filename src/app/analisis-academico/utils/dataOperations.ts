import 'server-only'
import { Student } from '@/lib/definitions'
import { columnsIds } from './constants'
import { ANIO_ACTUAL, CARACTER_GRADO } from '@/lib/constants'
import {
  fetchCalificacionesActuales,
  fetchCalificacionesHistoricas,
} from '@/lib/data'
import { isValidInstancia } from '@/lib/utils'
import { projectCalifActuales } from '@/lib/dataOperations'
import { FiltersValues } from './definitions'
import { FILTERS_FNS } from './filtersOperations'

export const getAllData = async (
  anioParam?: string,
  califParcialesParam?: string,
) => {
  const anio = anioParam || `${ANIO_ACTUAL}`
  const isActiveCalifParciales =
    califParcialesParam && isValidInstancia(califParcialesParam)
  const califHistoricas = await fetchCalificacionesHistoricas(anio)

  if (!isActiveCalifParciales) return califHistoricas

  const califActuales = await fetchCalificacionesActuales(anio)
  return projectCalifActuales(
    califHistoricas,
    califActuales,
    califParcialesParam,
  )
}

export const getFilteredStudents = (
  data: Student[],
  filtersValues: FiltersValues = {},
  omitedKeys?: string[],
) => {
  const filtersValuesKeys = Object.keys(filtersValues) as Array<
    keyof FiltersValues
  >
  const filtersFnsKeys = (
    Object.keys(FILTERS_FNS) as Array<keyof typeof FILTERS_FNS>
  ).filter(
    (filterFnKey) =>
      filtersValuesKeys.some((key) => key === filterFnKey) &&
      !omitedKeys?.includes(filterFnKey),
  )
  const filteredStudents = data.filter((student) =>
    filtersFnsKeys.every((filterFnKey) => {
      const filterFn = FILTERS_FNS[filterFnKey].filterFn
      return filterFn(student, filtersValues)
    }),
  )
  return filteredStudents
}

export const getUniqueValuesModel = (
  filtersValues: FiltersValues = {},
  allData?: Student[],
) => {
  if (!allData) return undefined
  const cursos = getUniqueValues(filtersValues, 'cursos', allData)
  const materias = getUniqueValues(
    filtersValues,
    'materias',
    allData,
    filtersValues.inclusionEstricta === 'true',
  )
  const cantidadesTroncales = getUniqueValues(
    {},
    'cantidadesTroncales',
    allData,
  )
  const cantidadesGenerales = getUniqueValues(
    {},
    'cantidadesGenerales',
    allData,
  )
  const cantidadesEnProceso2020 = getUniqueValues(
    {},
    'cantidadesEnProceso2020',
    allData,
  )
  const proyeccion = getUniqueValues(filtersValues, 'proyeccion', allData)
  const repitenciaAnios = getUniqueValues(
    filtersValues,
    'repitenciaAnios',
    allData,
  )
  const repitenciaCant = getUniqueValues({}, 'repitenciaCant', allData)
  return {
    cursos,
    materias,
    cantidadesTroncales,
    cantidadesGenerales,
    cantidadesEnProceso2020,
    proyeccion,
    repitenciaAnios,
    repitenciaCant,
  }
}

const getUniqueValues = (
  filtersValues: FiltersValues = {},
  filterKey: keyof typeof FILTERS_FNS,
  allData: Student[],
  omitKeyInFiltering?: boolean,
) => {
  const uniqueValues = new Map<any, number>()
  if (!allData) return uniqueValues
  const partialFilteredData = getFilteredStudents(
    allData,
    filtersValues,
    omitKeyInFiltering ? undefined : [filterKey],
  )
  const uniqueValuesFn = FILTERS_FNS[filterKey].uniqueValuesFn
  if (uniqueValuesFn) {
    uniqueValuesFn(partialFilteredData, uniqueValues, filtersValues)
  }
  return uniqueValues
}

export const getSortedData = (filteredData: Student[], sortParam?: string) => {
  if (!sortParam) return filteredData
  const validatedValues = sortParam
    .split('_')
    .map((value) => {
      const [columnIdParam, order] = value.split('-')
      const validValues =
        columnsIds.includes(columnIdParam) &&
        (order === 'asc' || order === 'desc')
      return validValues ? `${columnIdParam}-${order}` : null
    })
    .filter((value) => value !== null)
  const sortData = validatedValues
    .map((sortValue) => {
      const [columnIdParam, order] = sortValue.split('-')
      const sortObj = SORTING_FNS.find(
        ({ columnId }) => columnId === columnIdParam,
      )
      return sortObj ? { ...sortObj, order } : null
    })
    .filter((value) => value !== null)

  const sortedData = filteredData.sort((a, b) => {
    for (const sortingData of sortData) {
      const { fn, order } = sortingData
      const firstEl = order === 'desc' ? b : a
      const secondEl = order === 'desc' ? a : b
      const sortResult = fn(firstEl, secondEl)
      if (sortResult !== 0) return sortResult
    }
    return 0
  })

  return sortedData
}

const getMinMaxValues = (uniqueValues: Map<any, number>) => {
  const values = Array.from(uniqueValues.keys()).map((value) => Number(value))
  const min = Math.min(...values)
  const max = Math.max(...values)
  return { min, max }
}

export const getCantFilterData = (
  uniqueValues?: Map<any, number>,
  filterValue?: number[],
) => {
  if (uniqueValues) {
    const cantMinMax = getMinMaxValues(uniqueValues)
    if (filterValue === undefined) return { cantMinMax, filterValue }

    const minFilterValue = Math.max(filterValue[0], cantMinMax.min)
    const maxFilterValue = Math.min(filterValue[1], cantMinMax.max)
    return {
      cantMinMax,
      filterValue:
        minFilterValue === cantMinMax.min && maxFilterValue === cantMinMax.max
          ? undefined
          : {
              min: minFilterValue,
              max: maxFilterValue,
            },
    }
  } else {
    return {
      cantMinMax: undefined,
      filterValue: filterValue
        ? {
            min: filterValue[0],
            max: filterValue[1],
          }
        : undefined,
    }
  }
}

export const SORTING_FNS = [
  {
    columnId: 'curso',
    fn: (a: Student, b: Student) => {
      const cursoA = `${a.anio}${CARACTER_GRADO} ${a.division}${CARACTER_GRADO}`
      const cursoB = `${b.anio}${CARACTER_GRADO} ${b.division}${CARACTER_GRADO}`
      return cursoA.localeCompare(cursoB)
    },
  },
  {
    columnId: 'estudiante',
    fn: (a: Student, b: Student) => {
      const estudianteA = `${a.apellido} ${a.nombre}`
      const estudianteB = `${b.apellido} ${b.nombre}`
      return estudianteA.localeCompare(estudianteB)
    },
  },
  {
    columnId: 'dni',
    fn: (a: Student, b: Student) => {
      if (a.dni === null || b.dni === null) return -1
      return a.dni - b.dni
    },
  },
  {
    columnId: 'troncales',
    fn: (a: Student, b: Student) => {
      const { cantidad: cantidadA, error: errorA } = a.troncales
      const { cantidad: cantidadB, error: errorB } = b.troncales
      if (cantidadA === null || (errorA && !errorB)) return 1
      if (cantidadB === null || (errorB && !errorA)) return -1
      return cantidadA - cantidadB
    },
  },
  {
    columnId: 'generales',
    fn: (a: Student, b: Student) => {
      const { cantidad: cantidadA, error: errorA } = a.generales
      const { cantidad: cantidadB, error: errorB } = b.generales
      if (cantidadA === null || (errorA && !errorB)) return 1
      if (cantidadB === null || (errorB && !errorA)) return -1
      return cantidadA - cantidadB
    },
  },
  {
    columnId: 'enProceso2020',
    fn: (a: Student, b: Student) => {
      const { cantidad: cantidadA, detalle: detalleA } = a.enProceso2020
      const { cantidad: cantidadB, detalle: detalleB } = b.enProceso2020
      if (cantidadA === null || detalleB === 'No corresponde') return 1
      if (cantidadB === null || detalleA === 'No corresponde') return -1
      return cantidadA - cantidadB
    },
  },
  {
    columnId: 'repitencia',
    fn: (a: Student, b: Student) => {
      const repA = a.repitencia
      const repB = b.repitencia
      if (repA.length !== repB.length) return repA.length - repB.length
      for (const [index, anioRepetidoA] of repA.entries()) {
        const anioRepA = Number(anioRepetidoA[0])
        const anioRepB = Number(repB[index][0])
        if (anioRepA !== anioRepB) return anioRepA - anioRepB
      }
      return 0
    },
  },
  {
    columnId: 'proyeccion',
    fn: (a: Student, b: Student) => {
      const proyeccionA = a.proyeccion
      const proyeccionB = b.proyeccion
      return proyeccionB.localeCompare(proyeccionA)
    },
  },
]



import { Student } from '@/lib/definitions'
import { ANIOS_REPETIBLES, columnsIds, CURSOS_ITEMS_DATA, MATERIAS_ANIOS_ITEMS_DATA, PROYECCION_DATA } from './constants'
import {
  ANIO_ACTUAL,
  CARACTER_GRADO,
} from '@/lib/constants'
import {
  fetchCalificacionesActuales,
  fetchCalificacionesHistoricas,
} from '@/lib/data'
import { isValidInstancia } from '@/lib/utils'
import { projectCalifActuales } from '@/lib/dataOperations'
import { FiltersValues, SearchParams } from './definitions'
import { formatArrValues, formatCantValues } from './urlParamsOperations'

export const getAllData = async (
  anioParam?: string | string[],
  califParcialesParam?: string | string[],
) => {
  const anio = (typeof anioParam === 'string' && anioParam) || `${ANIO_ACTUAL}`
  const califHistoricas = await fetchCalificacionesHistoricas(anio)

  const isActiveCalifParciales =
    typeof califParcialesParam === 'string' &&
    isValidInstancia(califParcialesParam)
  if (!isActiveCalifParciales) return califHistoricas

  const califActuales = await fetchCalificacionesActuales(anio)
  return projectCalifActuales(
    califHistoricas,
    califActuales,
    califParcialesParam,
  )
}

export const FILTERS_FNS = {
  search: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.search
      return param
        ? param.split(' ').map((string) =>
            string
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          )
        : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const filterValue = paramsValues.search
      if (filterValue === undefined) return true
      const { apellido, nombre, dni } = student
      return filterValue.every(
        (string: string) =>
          apellido?.toLowerCase().includes(string) ||
          nombre?.toLowerCase().includes(string) ||
          `${dni}`.includes(string),
      )
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => undefined,
  },
  cursos: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cursos
      return param
        ? formatArrValues(
            param,
            CURSOS_ITEMS_DATA.flatMap(({ todos }) => todos),
          )
        : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const filterValue = paramsValues.cursos
      const { anio, division } = student
      if (anio === null || division === null || filterValue === undefined)
        return true
      return filterValue.includes(`${anio[0]}° ${division[0]}°`)
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const { anio, division } = student
        if (anio !== null && division !== null) {
          const value = `${anio?.[0]}° ${division?.[0]}°`
          facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1)
        }
      })
    },
  },
  materias: {
    sortParam: (materiaA: string, materiaB: string) => {
      const anioA = Number(materiaA.split('(')?.[1]?.[0])
      const anioB = Number(materiaB.split('(')?.[1]?.[0])
      if (anioA !== anioB) return anioA - anioB
      return materiaA.localeCompare(materiaB)
    },
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.materias
      return param
        ? formatArrValues(
            param,
            MATERIAS_ANIOS_ITEMS_DATA.flatMap(({ todas }) => todas),
            FILTERS_FNS.materias.sortParam,
          )
        : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const filterValue = paramsValues.materias
      if (filterValue === undefined) return true
      const hideEnProceso2020 = paramsValues.enProceso2020 === 'false'
      const studentMaterias = [
        ...student.troncales.detalle,
        ...student.generales.detalle,
      ]
      if (
        !hideEnProceso2020 &&
        student.enProceso2020.detalle !== 'No corresponde'
      )
        studentMaterias.push(...student.enProceso2020.detalle)

      const inclusionEstrictaValue = paramsValues.inclusionEstricta === 'true'
      return inclusionEstrictaValue
        ? filterValue.every((materia) => studentMaterias.includes(materia))
        : filterValue.some((materia) => studentMaterias.includes(materia))
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
      filtersValues: FiltersValues,
    ) => {
      filteredData.forEach((student) => {
        const values = [
          ...student.troncales.detalle,
          ...student.generales.detalle,
        ]
        if (
          filtersValues.enProceso2020 !== 'false' &&
          student.enProceso2020.detalle !== 'No corresponde'
        )
          values.push(...student.enProceso2020.detalle)
        values.forEach((value) =>
          facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1),
        )
      })
    },
  },
  cantidadesTroncales: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cantidadesTroncales
      return param ? formatCantValues(param) : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const cantStudent = student.troncales.cantidad
      const filterValue = paramsValues.cantidadesTroncales
      if (cantStudent === null || filterValue === undefined) return true
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const cant = student.troncales.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
  },
  cantidadesGenerales: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cantidadesGenerales
      return param ? formatCantValues(param) : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const cantStudent = student.generales.cantidad
      const filterValue = paramsValues.cantidadesGenerales
      if (cantStudent === null || filterValue === undefined) return true
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const cant = student.generales.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
  },
  cantidadesEnProceso2020: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cantidadesEnProceso2020
      return param ? formatCantValues(param) : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const cantStudent = student.enProceso2020.cantidad
      const filterValue = paramsValues.cantidadesEnProceso2020
      const hideEnProceso2020 = paramsValues.enProceso2020 === 'false'
      if (
        cantStudent === null ||
        filterValue === undefined ||
        hideEnProceso2020
      )
        return true
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const cant = student.enProceso2020.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
  },
  proyeccion: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.proyeccion
      console.log(param)
      if (param === undefined) return param
      const califParcialesParam = searchParams.califParciales
      const comparedData = califParcialesParam
        ? PROYECCION_DATA.filter(({ value }) => value !== 'Egresa')
        : PROYECCION_DATA.filter(
            ({ value }) =>
              value !== 'Egresa (titula)' && value !== 'Egresa (NO titula)',
          )
      console.log(comparedData)
      return formatArrValues(
        param,
        comparedData.map(({ value }) => value),
      )
    },
    filterFn(student: Student, paramsValues: FiltersValues) {
      const filterValue = paramsValues.proyeccion
      if (filterValue === undefined) return true
      return filterValue.some((value) => student.proyeccion === value)
    },
    uniqueValuesFn(filteredData: Student[], facetedModel: Map<string, number>) {
      filteredData.forEach((student) => {
        const { proyeccion } = student
        facetedModel.set(proyeccion, (facetedModel.get(proyeccion) ?? 0) + 1)
      })
    },
  },
  repitenciaAnios: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.repitenciaAnios
      return param ? formatArrValues(param, ANIOS_REPETIBLES) : undefined
    },
    filterFn(student: Student, paramsValues: FiltersValues) {
      const filterValue = paramsValues.repitenciaAnios
      if (filterValue === undefined) return true
      return student.repitencia.some((anioRepetido) =>
        filterValue.includes(anioRepetido),
      )
    },
    uniqueValuesFn(filteredData: Student[], facetedModel: Map<string, number>) {
      filteredData.forEach(({ repitencia }) => {
        const aniosRepetidos = [...new Set(repitencia)]
        aniosRepetidos.forEach((anioRepetido) =>
          facetedModel.set(
            anioRepetido,
            (facetedModel.get(anioRepetido) ?? 0) + 1,
          ),
        )
      })
    },
  },
  repitenciaCant: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.repitenciaCant
      return param ? formatCantValues(param) : undefined
    },
    filterFn(student: Student, paramsValues: FiltersValues) {
      const filterValue = paramsValues.repitenciaCant
      if (filterValue === undefined) return true
      const cantRep = student.repitencia.length
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantRep >= minValue && cantRep <= maxValue
    },
    uniqueValuesFn(filteredData: Student[], facetedModel: Map<string, number>) {
      filteredData.forEach(({ repitencia }) => {
        const catRepitencias = repitencia.length
        facetedModel.set(
          `${catRepitencias}`,
          (facetedModel.get(`${catRepitencias}`) ?? 0) + 1,
        )
      })
    },
  },
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

export const getGrupalItemData = (
  valuesItem: string[],
  filterValue?: string[],
  uniqueValues?: Map<string, number>,
) => {
  const arraysAreEquals =
    JSON.stringify(valuesItem.toSorted()) ===
    JSON.stringify((filterValue || []).toSorted())
  const isSelected = valuesItem.length ? arraysAreEquals : undefined
  const quantity = getQuantity(valuesItem, uniqueValues)
  return { isSelected, quantity }
}

export const getQuantity = (
  value?: string | string[],
  uniqueValues?: Map<string, number>,
) => {
  if (!value) return undefined
  if (typeof value === 'string')
    return uniqueValues && (uniqueValues.get(value) ?? 0)
  return (
    uniqueValues &&
    value.reduce(
      (prevValue, newValue) => prevValue + (uniqueValues.get(newValue) ?? 0),
      0,
    )
  )
}

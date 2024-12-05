import { Student } from '@/lib/definitions'
import { columnsIds, FILTERS_FNS } from './constants'
import { ANIO_ACTUAL, CARACTER_GRADO } from '@/lib/constants'
import {
  fetchCalificacionesActuales,
  fetchCalificacionesHistoricas,
} from '@/lib/data'
import { isValidInstancia } from '@/lib/utils'
import { projectCalifActuales } from '@/lib/dataOperations'
import { FiltersValues } from './definitions'

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

/* export function getFilteredStudentData(
  data: Student[],
  filterParams: SearchParams = {},
  omitedKey?: string,
) {
  const paramsWithValue = JSON.parse(JSON.stringify(filterParams))
  const activeFiltersKeys = (
    Object.keys(FILTERS_FNS) as Array<keyof typeof FILTERS_FNS>
  ).filter(
    (filterFnKey) =>
      Object.keys(paramsWithValue).some((key) => key.includes(filterFnKey)) &&
      filterFnKey !== omitedKey,
  )
  const filteredData = data.filter((student) => {
    return activeFiltersKeys.every((filterFnKey) =>
      FILTERS_FNS[filterFnKey].filterFn(student, filterParams),
    )
  })
  return filteredData
} */

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

/* export function getStudentsUniqueValues(
  data: Student[],
  filterParams: Omit<SearchParams, 'anio'>,
  filterKey: keyof typeof FILTERS_FNS,
  omitKeyInFiltering?: boolean,
) {
  const partialFilteredData = getFilteredStudentData(
    data,
    filterParams,
    omitKeyInFiltering ? undefined : filterKey,
  )
  const facetedModel = new Map<any, number>()
  FILTERS_FNS[filterKey].uniqueValuesFn(
    partialFilteredData,
    facetedModel,
    filterParams,
  )

  return facetedModel
} */

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

/* export const FILTERS_FNS = {
  search: {
    formatParam: (param?: string) => {
      const searchParam = param || ''
      const filterValue = searchParam.split(' ').map((string) =>
        string
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      )
      return filterValue
    },
    filterFn: (student: Student, searchParams: SearchParams) => {
      const searchParam = searchParams.search || ''
      const filterValue = searchParam.split(' ').map((string) =>
        string
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      )
      const { apellido, nombre, dni } = student
      return filterValue.every(
        (string: string) =>
          apellido?.toLowerCase().includes(string) ||
          nombre?.toLowerCase().includes(string) ||
          `${dni}`.includes(string),
      )
    },
    uniqueValuesFn: (
      _filteredData: Student[],
      _facetedModel: Map<string, number>,
    ) => undefined,
  },
  cursos: {
    formatParam: (param?: string) =>
      formatArrValuesParam(
        param,
        CURSOS_ITEMS_DATA.flatMap(({ todos }) => todos),
      ),
    filterFn: (student: Student, searchParams: SearchParams) => {
      if (student.anio === null || student.division === null) return true
      const filterValue = formatArrValuesParam(
        searchParams.cursos,
        CURSOS_ITEMS_DATA.flatMap(({ todos }) => todos),
      )
      return filterValue.includes(`${student.anio[0]}° ${student.division[0]}°`)
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const value = `${student.anio?.[0]}° ${student.division?.[0]}°`
        facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1)
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
    formatParam: (param?: string) =>
      formatArrValuesParam(
        param,
        MATERIAS_ITEMS_DATA.flatMap(({ todas }) => todas),
        FILTERS_FNS.materias.sortParam,
      ),
    filterFn: (student: Student, searchParams: SearchParams) => {
      const enProceso2020Param = !(searchParams.enProceso2020 === 'false')
      const inclusionEstrictaParam = searchParams.inclusionEstricta === 'true'
      const filterValue = formatArrValuesParam(
        searchParams.materias,
        MATERIAS_ITEMS_DATA.flatMap(({ todas }) => todas),
        FILTERS_FNS.materias.sortParam,
      )
      const studentMaterias = [
        ...student.troncales.detalle,
        ...student.generales.detalle,
      ]
      if (
        enProceso2020Param &&
        student.enProceso2020.detalle !== 'No corresponde'
      )
        studentMaterias.push(...student.enProceso2020.detalle)
      return inclusionEstrictaParam
        ? filterValue.every((materia) => studentMaterias.includes(materia))
        : filterValue.some((materia) => studentMaterias.includes(materia))
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
      filterParams: Omit<SearchParams, 'anio'>,
    ) => {
      filteredData.forEach((student) => {
        const values = [
          ...student.troncales.detalle,
          ...student.generales.detalle,
        ]
        if (
          filterParams?.enProceso2020 !== 'false' &&
          student.enProceso2020.detalle !== 'No corresponde'
        )
          values.push(...student.enProceso2020.detalle)
        values.forEach((value) =>
          facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1),
        )
      })
    },
  },
  cantidades: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      const {
        cantidadesTroncales,
        cantidadesGenerales,
        cantidadesEnProceso2020,
        enProceso2020,
      } = searchParams
      const criterioOptativo = searchParams.cantOptativo === 'true'
      const [troncalesValue, generalesValue, enProceso2020Value] = [
        cantidadesTroncales,
        cantidadesGenerales,
        cantidadesEnProceso2020,
      ].map((filterParam) => formatCantValuesParam(filterParam))

      const isTroncalesValid =
        troncalesValue && student.troncales.cantidad !== null
          ? student.troncales.cantidad >= troncalesValue[0] &&
            student.troncales.cantidad <= troncalesValue[1]
          : true
      const isGeneralesValid =
        generalesValue && student.generales.cantidad !== null
          ? student.generales.cantidad >= generalesValue[0] &&
            student.generales.cantidad <= generalesValue[1]
          : true
      const isEnProceso2020Valid =
        enProceso2020Value &&
        enProceso2020 !== 'false' &&
        student.enProceso2020.cantidad !== null
          ? student.enProceso2020.cantidad >= enProceso2020Value[0] &&
            student.enProceso2020.cantidad <= enProceso2020Value[1]
          : true

      return criterioOptativo
        ? isTroncalesValid || isGeneralesValid || isEnProceso2020Valid
        : isTroncalesValid && isGeneralesValid && isEnProceso2020Valid
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const {
          troncales: { cantidad: cantTroncales },
          generales: { cantidad: cantGenerales },
          enProceso2020: { cantidad: cantEnProceso2020 },
        } = student
        facetedModel.set(
          `troncales_${cantTroncales}`,
          (facetedModel.get(`troncales_${cantTroncales}`) ?? 0) + 1,
        )
        facetedModel.set(
          `generales_${cantGenerales}`,
          (facetedModel.get(`generales_${cantGenerales}`) ?? 0) + 1,
        )
        facetedModel.set(
          `enProceso2020_${cantEnProceso2020}`,
          (facetedModel.get(`enProceso2020_${cantEnProceso2020}`) ?? 0) + 1,
        )
      })
    },
    getMinMaxCant: (data: Student[]) => {
      const uniqueValues = getStudentsUniqueValues(data, {}, 'cantidades')
      const troncalesUniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.split('_')[0] === 'troncales')
        .map(([key]) => Number(key.split('_')[1]))
      const generalesUniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.split('_')[0] === 'generales')
        .map(([key]) => Number(key.split('_')[1]))
      const enProceso2020UniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.split('_')[0] === 'enProceso2020')
        .map(([key]) => Number(key.split('_')[1]))
      const troncalesMinMax = [
        Math.min(...troncalesUniqueValues),
        Math.max(...troncalesUniqueValues),
      ]
      const generalesMinMax = [
        Math.min(...generalesUniqueValues),
        Math.max(...generalesUniqueValues),
      ]
      const enProceso2020MinMax = [
        Math.min(...enProceso2020UniqueValues),
        Math.max(...enProceso2020UniqueValues),
      ]
      return { troncalesMinMax, generalesMinMax, enProceso2020MinMax }
    },
  },
  proyeccion: {
    formatParam: (param?: string) =>
      formatArrValuesParam(
        param,
        PROYECCION_DATA.map(({ value }) => value),
      ),
    filterFn: (student: Student, searchParams: SearchParams) => {
      const proyeccionParam = searchParams.proyeccion
      if (!proyeccionParam) return true
      return proyeccionParam
        .split('_')
        .some((value) => student.proyeccion === value)
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const { proyeccion } = student
        facetedModel.set(proyeccion, (facetedModel.get(proyeccion) ?? 0) + 1)
      })
    },
  },
  repitencia: {
    formatParam: (
      paramAnios?: string,
      paramCant?: string,
      minMax?: number[],
    ) => {
      const aniosParamArr = paramAnios?.split('_') || []
      const aniosValue = aniosParamArr
        .filter((anioRepetido) => ANIOS_REPETIBLES.includes(anioRepetido))
        .sort()

      const cantValue = formatCantValuesParam(paramCant, minMax)
      return { aniosValue, cantValue }
    },
    filterFn: (student: Student, searchParams: SearchParams) => {
      const studentRepitencia = student.repitencia
      const repitenciaAniosParam = searchParams.repitenciaAnios?.split('_')
      const repitenciaCantParam = searchParams.repitenciaCant
        ?.split('_')
        .map((value) => Number(value))
        .sort((a, b) => a - b)

      const isAniosOk = repitenciaAniosParam
        ? studentRepitencia.some((anioRepetido) =>
            repitenciaAniosParam.includes(anioRepetido),
          )
        : true
      const isCantOk = repitenciaCantParam
        ? studentRepitencia.length >= repitenciaCantParam[0] &&
          studentRepitencia.length <= repitenciaCantParam[1]
        : true

      return isAniosOk && isCantOk
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach(({ repitencia }) => {
        const aniosRepetidos = Array.from(new Set(repitencia))
        aniosRepetidos.forEach((anioRepetido) =>
          facetedModel.set(
            anioRepetido,
            (facetedModel.get(anioRepetido) ?? 0) + 1,
          ),
        )
        facetedModel.set(
          `cant_${repitencia.length}`,
          (facetedModel.get(`cant_${repitencia.length}`) ?? 0) + 1,
        )
      })
    },
    getMinMaxCant: (data: Student[]) => {
      const uniqueValues = getStudentsUniqueValues(data, {}, 'repitencia')
      const repitenciaCantUniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.includes('cant'))
        .map(([key]) => Number(key.split('_')[1]))
      const repitenciaCantMinMax = [
        Math.min(...repitenciaCantUniqueValues),
        Math.max(...repitenciaCantUniqueValues),
      ]
      return repitenciaCantMinMax
    },
  },
} as const */

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

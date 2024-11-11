import { Student } from '@/lib/definitions'
import { SearchParams } from '../page'
import { CURSOS_ITEMS_DATA, MATERIAS_ITEMS_DATA } from './constants'
import { CARACTER_GRADO } from '@/lib/constants'

export function getFilteredStudentData(
  data: Student[],
  filterParams: Omit<SearchParams, 'anio'> = {},
  omitedKey?: string,
) {
  const paramsWithValue = JSON.parse(JSON.stringify(filterParams))
  const filteredData = data.filter((student) => {
    const activeFiltersKeys = (
      Object.keys(FILTERS_FNS) as Array<keyof typeof FILTERS_FNS>
    ).filter(
      (filterFnKey) =>
        Object.keys(paramsWithValue).some((key) => key.includes(filterFnKey)) &&
        filterFnKey !== omitedKey,
    )
    return activeFiltersKeys.every((filterFnKey) =>
      FILTERS_FNS[filterFnKey].filterFn(student, filterParams),
    )
  })
  return filteredData
}

export function getStudentsUniqueValues(
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
}

export const getSortedData = (filteredData: Student[], sortParam: string) => {
  const columnsParams = sortParam.split('_').map((value) => {
    const [columnIdParam, order] = value.split('-')
    return { columnIdParam, order }
  })
  const sortData = columnsParams
    .map(({ columnIdParam, order }) => {
      const sortObj = SORTING_FNS.find(
        ({ columnId }) => columnId === columnIdParam,
      )
      return sortObj ? { ...sortObj, order } : null
    })
    .filter((value) => value !== null)
  console.log(sortData)

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

export const FILTERS_FNS = {
  search: {
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
    formatParam: (cursosParam?: string | null) => {
      const cursosValue = cursosParam?.split('_') || []
      const filterValue = cursosValue
        .filter((curso) =>
          CURSOS_ITEMS_DATA.flatMap(({ todos }) => todos).includes(curso),
        )
        .sort()
      return filterValue
    },
    filterFn: (student: Student, searchParams: SearchParams) => {
      if (student.anio === null || student.division === null) return true
      const filterValue = FILTERS_FNS.cursos.formatParam(searchParams.cursos)
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
    formatParam: (materiasParam?: string | null) => {
      const materiasValue = materiasParam?.split('_') || []
      const filterValue = materiasValue
        .filter((materia) =>
          MATERIAS_ITEMS_DATA.flatMap(({ todas }) => todas).includes(materia),
        )
        .sort(FILTERS_FNS.materias.sortParam)
      return filterValue
    },
    filterFn: (student: Student, searchParams: SearchParams) => {
      const materiasParam = searchParams.materias || ''
      const enProceso2020Param = !(searchParams.enProceso2020 === 'false')
      const inclusionEstrictaParam = searchParams.inclusionEstricta === 'true'
      const filterValue = materiasParam.split('_')
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
      ].map(
        (filterParam) =>
          filterParam !== undefined &&
          filterParam
            .split('_')
            .map((value) => Number(value))
            .sort((a, b) => a - b),
      )

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
} as const

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

import { CURSOS, MATERIAS_POR_CURSO } from '@/lib/constants'
import { ParamsValues } from '../page'
import { Student } from '@/lib/definitions'
import { formatArrValues, formatCantValues } from './urlParamsOperations'
import { getUniqueValues } from './dataOperations'

export const SEARCH_PARAMS_KEYS = [
  'anio',
  'search',
  'cursos',
  'materias',
  'califParciales',
  'inclusionEstricta',
  'cantidadesTroncales',
  'cantidadesGenerales',
  'cantidadesEnProceso2020',
  'enProceso2020',
  'cantOptativo',
  'repitenciaAnios',
  'repitenciaCant',
  'proyeccion',
  'page',
  'sort',
] as const

export const ROWS_COUNT = 30
export const MAX_BUTTONS_PAGINATION = 7

export const CURSOS_ITEMS_DATA = (
  Object.keys(CURSOS) as Array<keyof typeof CURSOS>
).map((anio) => {
  const todos = CURSOS[anio].map(({ curso }) => curso)
  const turnoManiana = CURSOS[anio]
    .filter(({ turno }) => turno === 'Mañana')
    .map(({ curso }) => curso)
  const turnoTarde = CURSOS[anio]
    .filter(({ turno }) => turno === 'Tarde')
    .map(({ curso }) => curso)
  const cursosCB = CURSOS[anio]
    .filter(({ orientacion }) => orientacion === 'Ciclo Básico')
    .map(({ curso }) => curso)
  const cursosTICs = CURSOS[anio]
    .filter(({ orientacion }) => orientacion === 'TICs')
    .map(({ curso }) => curso)
  const cursosPM = CURSOS[anio]
    .filter(({ orientacion }) => orientacion === 'Producción Multimedial')
    .map(({ curso }) => curso)

  return {
    anio,
    todos,
    turnoManiana,
    turnoTarde,
    cursosCB,
    cursosTICs,
    cursosPM,
  }
})

export const MATERIAS_ITEMS_DATA = (
  Object.keys(MATERIAS_POR_CURSO) as Array<keyof typeof MATERIAS_POR_CURSO>
).map((anio) => {
  const formatFn = (obj: (typeof MATERIAS_POR_CURSO)[typeof anio][number]) =>
    `${obj.nombre} (${anio.split(' ')[0]})`
  const todas = MATERIAS_POR_CURSO[anio].map(formatFn)
  const materiasCB = MATERIAS_POR_CURSO[anio]
    .filter(({ orientacion }) => orientacion === 'Ciclo Básico')
    .map(formatFn)
  const materiasTICs = MATERIAS_POR_CURSO[anio]
    .filter(
      ({ orientacion }) =>
        orientacion === 'TICs' || orientacion === 'Ciclo Superior',
    )
    .map(formatFn)
  const materiasPM = MATERIAS_POR_CURSO[anio]
    .filter(
      ({ orientacion }) =>
        orientacion === 'Producción Multimedial' ||
        orientacion === 'Ciclo Superior',
    )
    .map(formatFn)

  return {
    anio,
    todas,
    materiasCB,
    materiasTICs,
    materiasPM,
  }
})

export const ANIOS_REPETIBLES = Object.keys(CURSOS)
  .sort(
    (a, b) =>
      Number(a.split(' ')[0].slice(0, -1)) -
      Number(b.split(' ')[0].slice(0, -1)),
  )
  .slice(0, -1)

export const PROYECCION_DATA = [
  { value: 'Promociona' },
  { value: 'Permanece' },
  {
    value: 'Egresa',
    show: (califParcialesFilter?: string) => !califParcialesFilter,
  },
  {
    value: 'Egresa (titula)',
    show: (califParcialesFilter?: string) => Boolean(califParcialesFilter),
  },
  {
    value: 'Egresa (NO titula)',
    show: (califParcialesFilter?: string) => Boolean(califParcialesFilter),
  },
  { value: 'Faltan datos' },
]

export const FORMAT_PARAMS_FNS: Partial<
  Record<(typeof SEARCH_PARAMS_KEYS)[number], (param: string) => string[]>
> = {
  search: (param) => {
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
  cursos: (param) =>
    formatArrValues(
      param,
      CURSOS_ITEMS_DATA.flatMap(({ todos }) => todos),
    ),
  materias: (param) =>
    formatArrValues(
      param,
      MATERIAS_ITEMS_DATA.flatMap(({ todas }) => todas),
      FILTERS_FNS.materias?.sortParam,
    ),
  cantidadesTroncales: (param) =>
    formatCantValues(param).map((value) => `${value}`),
  cantidadesGenerales: (param) =>
    formatCantValues(param).map((value) => `${value}`),
  cantidadesEnProceso2020: (param) =>
    formatCantValues(param).map((value) => `${value}`),
  proyeccion: (param) =>
    formatArrValues(
      param,
      PROYECCION_DATA.map(({ value }) => value),
    ),
  repitenciaAnios: (param) => formatArrValues(param, ANIOS_REPETIBLES),
  repitenciaCant: (param) => formatCantValues(param).map((value) => `${value}`),
}

export const FILTERS_FNS: Partial<
  Record<
    (typeof SEARCH_PARAMS_KEYS)[number],
    {
      sortParam?: (valueA: string, valueB: string) => number
      filterFn: (student: Student, paramsValues: ParamsValues) => boolean
      uniqueValuesFn?: (
        filteredData: Student[],
        facetedModel: Map<string, number>,
        paramsValues: ParamsValues,
      ) => void
      getMinMaxCant?: (data: Student[]) => number[]
    }
  >
> = {
  search: {
    filterFn: (student, paramsValues) => {
      const filterValue = paramsValues.search
      if (filterValue === undefined || typeof filterValue === 'string')
        return true
      const { apellido, nombre, dni } = student
      return filterValue.every(
        (string: string) =>
          apellido?.toLowerCase().includes(string) ||
          nombre?.toLowerCase().includes(string) ||
          `${dni}`.includes(string),
      )
    },
  },
  cursos: {
    filterFn: (student, paramsValues) => {
      const { anio, division } = student
      const filterValue = paramsValues.cursos
      if (
        anio === null ||
        division === null ||
        !filterValue ||
        typeof filterValue === 'string'
      )
        return true
      return filterValue.includes(`${anio[0]}° ${division[0]}°`)
    },
    uniqueValuesFn: (filteredData, facetedModel) => {
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
    sortParam: (materiaA, materiaB) => {
      const anioA = Number(materiaA.split('(')?.[1]?.[0])
      const anioB = Number(materiaB.split('(')?.[1]?.[0])
      if (anioA !== anioB) return anioA - anioB
      return materiaA.localeCompare(materiaB)
    },
    filterFn: (student, paramsValues) => {
      const filterValue = paramsValues.materias
      if (filterValue === undefined || typeof filterValue === 'string')
        return true
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
    uniqueValuesFn: (filteredData, facetedModel, paramsValues) => {
      filteredData.forEach((student) => {
        const values = [
          ...student.troncales.detalle,
          ...student.generales.detalle,
        ]
        if (
          paramsValues?.enProceso2020 !== 'false' &&
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
    filterFn: (student, paramsValues) => {
      const cantStudent = student.troncales.cantidad
      const filterValue = paramsValues.cantidadesTroncales
      if (
        cantStudent === null ||
        filterValue === undefined ||
        typeof filterValue === 'string'
      )
        return true
      const minValue = Number(filterValue[0])
      const maxValue = Number(filterValue[1])
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (filteredData, facetedModel) => {
      filteredData.forEach((student) => {
        const cant = student.troncales.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
    getMinMaxCant: (data) => {
      const uniqueValues = getUniqueValues(data, {}, 'cantidadesTroncales')
      const values = Array.from(uniqueValues.entries()).map((value) =>
        Number(value),
      )
      const min = Math.min(...values)
      const max = Math.max(...values)
      return [min, max]
    },
  },
  cantidadesGenerales: {
    filterFn: (student, paramsValues) => {
      const cantStudent = student.generales.cantidad
      const filterValue = paramsValues.cantidadesGenerales
      if (
        cantStudent === null ||
        filterValue === undefined ||
        typeof filterValue === 'string'
      )
        return true
      const minValue = Number(filterValue[0])
      const maxValue = Number(filterValue[1])
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (filteredData, facetedModel) => {
      filteredData.forEach((student) => {
        const cant = student.generales.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
    getMinMaxCant: (data) => {
      const uniqueValues = getUniqueValues(data, {}, 'cantidadesGenerales')
      const values = Array.from(uniqueValues.entries()).map((value) =>
        Number(value),
      )
      const min = Math.min(...values)
      const max = Math.max(...values)
      return [min, max]
    },
  },
  cantidadesEnProceso2020: {
    filterFn: (student, paramsValues) => {
      const cantStudent = student.enProceso2020.cantidad
      const filterValue = paramsValues.cantidadesEnProceso2020
      const hideEnProceso2020 = paramsValues.enProceso2020 === 'false'
      if (
        cantStudent === null ||
        filterValue === undefined ||
        typeof filterValue === 'string' ||
        hideEnProceso2020
      )
        return true
      const minValue = Number(filterValue[0])
      const maxValue = Number(filterValue[1])
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (filteredData, facetedModel) => {
      filteredData.forEach((student) => {
        const cant = student.enProceso2020.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
    getMinMaxCant: (data) => {
      const uniqueValues = getUniqueValues(data, {}, 'cantidadesEnProceso2020')
      const values = Array.from(uniqueValues.entries()).map((value) =>
        Number(value),
      )
      const min = Math.min(...values)
      const max = Math.max(...values)
      return [min, max]
    },
  },
  proyeccion: {
    filterFn(student, paramsValues) {
      const filterValue = paramsValues.proyeccion
      if (filterValue === undefined || typeof filterValue === 'string')
        return true
      return filterValue.some((value) => student.proyeccion === value)
    },
    uniqueValuesFn(filteredData, facetedModel) {
      filteredData.forEach((student) => {
        const { proyeccion } = student
        facetedModel.set(proyeccion, (facetedModel.get(proyeccion) ?? 0) + 1)
      })
    },
  },
  repitenciaAnios: {
    filterFn(student, paramsValues) {
      const filterValue = paramsValues.repitenciaAnios
      if (filterValue === undefined || typeof filterValue === 'string')
        return true
      return student.repitencia.some((anioRepetido) =>
        filterValue.includes(anioRepetido),
      )
    },
    uniqueValuesFn(filteredData, facetedModel) {
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
    filterFn(student, paramsValues) {
      const filterValue = paramsValues.repitenciaCant
      if (filterValue === undefined || typeof filterValue === 'string')
        return true
      const min = Number(filterValue[0])
      const max = Number(filterValue[1])
      return (
        student.repitencia.length >= min && student.repitencia.length <= max
      )
    },
    uniqueValuesFn(filteredData, facetedModel) {
      filteredData.forEach(({ repitencia }) => {
        const catRepitencias = repitencia.length
        facetedModel.set(
          `${catRepitencias}`,
          (facetedModel.get(`${catRepitencias}`) ?? 0) + 1,
        )
      })
    },
    getMinMaxCant(data) {
      const uniqueValues = getUniqueValues(data, {}, 'repitenciaCant')
      const values = Array.from(uniqueValues.entries()).map((value) =>
        Number(value),
      )
      const min = Math.min(...values)
      const max = Math.max(...values)
      return [min, max]
    },
  },
} as const

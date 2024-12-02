import { CURSOS, MATERIAS_POR_CURSO } from '@/lib/constants'
import { Student } from '@/lib/definitions'
import { formatArrValues, formatCantValues } from './urlParamsOperations'
import { FiltersValues, SearchParams } from './definitions'

export const SEARCH_PARAMS_KEYS = [
  'anio',
  'page',
  'sort',
  'califParciales',
  'search',
  'cursos',
  'materias',
  'inclusionEstricta',
  'cantidadesTroncales',
  'cantidadesGenerales',
  'cantidadesEnProceso2020',
  'enProceso2020',
  'cantOptativo',
  'repitenciaAnios',
  'repitenciaCant',
  'proyeccion',
] as const

export const ROWS_COUNT = 30
export const MAX_BUTTONS_PAGINATION = 7

export const CURSOS_ITEMS_DATA = (
  Object.keys(CURSOS) as Array<keyof typeof CURSOS>
).map((anio) => {
  const todos = CURSOS[anio].map(({ curso }) => curso)
  const maniana = CURSOS[anio]
    .filter(({ turno }) => turno === 'Mañana')
    .map(({ curso }) => curso)
  const tarde = CURSOS[anio]
    .filter(({ turno }) => turno === 'Tarde')
    .map(({ curso }) => curso)
  const cb = CURSOS[anio]
    .filter(({ orientacion }) => orientacion === 'Ciclo Básico')
    .map(({ curso }) => curso)
  const tics = CURSOS[anio]
    .filter(({ orientacion }) => orientacion === 'TICs')
    .map(({ curso }) => curso)
  const pm = CURSOS[anio]
    .filter(({ orientacion }) => orientacion === 'Producción Multimedial')
    .map(({ curso }) => curso)

  return {
    anio,
    todos,
    maniana,
    tarde,
    cb,
    tics,
    pm,
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

export const columnsIds = [
  'expand',
  'curso',
  'estudiante',
  'dni',
  'troncales',
  'generales',
  'enProceso2020',
  'repitencia',
  'proyeccion',
]

/* export const FORMAT_PARAMS_FNS: {
  [key in keyof AllFiltersValues]?: (param: string) => AllFiltersValues[key]
} = {
  sort: (param) => {
    const validatedValues = param.split('_').map((value) => {
      const [columnIdParam, order] = value.split('-')
      const validValues =
        columnsIds.includes(columnIdParam) &&
        (order === 'asc' || order === 'desc')
      return validValues ? `${columnIdParam}-${order}` : null
    })
    return validatedValues.filter((value) => value !== null)
  },
  search: (param) => {
    const filterValue = param.split(' ').map((string) =>
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
  cantidadesTroncales: (param) => formatCantValues(param),
  cantidadesGenerales: (param) => formatCantValues(param),
  cantidadesEnProceso2020: (param) => formatCantValues(param),
  proyeccion: (param) =>
    formatArrValues(
      param,
      PROYECCION_DATA.map(({ value }) => value),
    ),
  repitenciaAnios: (param) => formatArrValues(param, ANIOS_REPETIBLES),
  repitenciaCant: (param) => formatCantValues(param),
}
 */
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
            MATERIAS_ITEMS_DATA.flatMap(({ todas }) => todas),
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

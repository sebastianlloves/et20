import 'server-only'
import { CURSOS, MATERIAS_POR_CURSO } from '@/lib/constants'

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

export const MATERIAS_ANIOS_ITEMS_DATA = (
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

export const MATERIAS_ITEMS_DATA = {
  aniosEspecificos: MATERIAS_ANIOS_ITEMS_DATA,
  todosAnios: [
    {
      value: MATERIAS_ANIOS_ITEMS_DATA.flatMap(({ materiasCB }) => materiasCB),
      itemText: 'Ciclo Básico',
    },
    {
      value: MATERIAS_ANIOS_ITEMS_DATA.flatMap(
        ({ materiasTICs }) => materiasTICs,
      ),
      itemText: 'TICs',
    },
    {
      value: MATERIAS_ANIOS_ITEMS_DATA.flatMap(({ materiasPM }) => materiasPM),
      itemText: 'Prod. Multimedial',
    },
  ],
}

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

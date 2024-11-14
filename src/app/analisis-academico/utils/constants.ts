import { CURSOS, MATERIAS_POR_CURSO } from "@/lib/constants"


export const ROWS_COUNT = 50
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

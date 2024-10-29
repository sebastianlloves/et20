import { SearchParams } from '@/app/analisis-academico/page'
import { CURSOS, DB_CALIFICACIONES, MATERIAS_POR_CURSO } from './constants'
import { Student, StudentCalifActuales } from './definitions'
import {
  evaluarCalificacion,
  FILTERS_FNS,
  formatCalifActualesResponse,
  formatStudentsResponse,
} from './utils'

export async function fetchStudentsData(anio: string = '2024') {
  if (!(anio in DB_CALIFICACIONES))
    throw new Error(`No hay datos para el año ${anio}`)
  try {
    const { url, tags } = DB_CALIFICACIONES[anio].historico
    const response = await fetch(url, {
      next: { tags: [...tags] },
      cache: 'force-cache',
    })
    const textData = await response.text()
    // await new Promise((resolve) => setTimeout(resolve, 5000))
    return formatStudentsResponse(textData, Number(anio))
  } catch (error) {
    throw new Error(`Error al obtener los datos histórico para el año ${anio}`)
  }
}

export async function fetchCalificacionesActuales(
  data: Student[],
  anio: string = '2024',
  cursosFilter?: string[],
) {
  console.time('depuracion')
  if (!(anio in DB_CALIFICACIONES))
    throw new Error(`No hay datos para el año ${anio}`)
  // Si hay aplicado filtro de cursos, una optimización posible es sólo fetchear las db de esos cursos
  /* const uniqueValuesCursos = new Set<string>(
    data.map(({ anio, division }) => `${anio} ${division}`),
  )
  const cursos = [...uniqueValuesCursos]
  const fetchingData = Object.keys(DB_CALIFICACIONES_ACTUALES)
    .filter((key) =>
      cursos.some((curso) => {
        const [anio, division] = curso
          .split('')
          .filter((char: string) => parseInt(char) > 0)
        const tagCurso = `califActuales_${anio}-${division}`
        return DB_CALIFICACIONES_ACTUALES[key].tags.includes(tagCurso)
      }),
    )
    .map((key) => {
      const anioCurso = key[0]
      return { ...DB_CALIFICACIONES_ACTUALES[key], anioCurso }
    }) */
  const anioData = DB_CALIFICACIONES[anio].calificacionesEnCurso
  if (!anioData)
    throw new Error(
      `No hay datos de las calificaciones en curso para el año ${anio}`,
    )

  const fetchingData = Object.entries(anioData).map(
    ([anioKey, { url, tags }]) => {
      return { url, tags, anioCurso: anioKey[0] }
    },
  )
  console.timeEnd('depuracion')

  console.time('Tiempo Promise all')
  const califActuales = await Promise.all(
    fetchingData.map(async ({ url, tags, anioCurso }) => {
      console.time(`fetch + procesamiento tags: ${JSON.stringify(tags)}`)
      console.time(`fetch tags: ${JSON.stringify(tags)}`)
      const response = await fetch(url, {
        next: {
          tags: [...tags],
        },
        cache: 'force-cache',
      })
      const text = await response.text()
      console.timeEnd(`fetch tags: ${JSON.stringify(tags)}`)

      console.time(`procesamiento tags: ${JSON.stringify(tags)}`)
      const formatedResponse = formatCalifActualesResponse(text, anioCurso)
      console.timeEnd(`procesamiento tags: ${JSON.stringify(tags)}`)
      console.timeEnd(`fetch + procesamiento tags: ${JSON.stringify(tags)}`)

      return formatedResponse
    }),
  )
  console.timeEnd('Tiempo Promise all')
  return califActuales.flat()
}

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

export const getSortedData = (filteredData: Student[], sortParam?: string) => {
  return { filteredData, sortParam }
}

export const projectCalifActuales = (
  students: Student[],
  califActuales: StudentCalifActuales[],
  instancia: keyof StudentCalifActuales['materias'][number] | 'acreditacion',
) => {
  console.time('Proceso de populación')

  const projectedStudents = students.map((student) => {
    const { anio, division, dni } = student
    const califActual = califActuales.find(
      ({ dni: dniValue }) => dni === dniValue,
    )
    if (!califActual) {
      const error = {
        type: 'Error al obtener las calificaciones actuales del estudiante',
      }
      return {
        ...student,
        troncales: { ...student.troncales, error },
        generales: { ...student.generales, error },
      }
    }

    const dataCursos = (
      Object.keys(CURSOS) as Array<keyof typeof CURSOS>
    ).flatMap((key) => CURSOS[key])
    const anioValue = anio?.[0]
    const divisionValue = division?.[0]
    const orientacionCurso = dataCursos.find(
      ({ curso }) => curso === `${anioValue}° ${divisionValue}°`,
    )?.orientacion

    if (!orientacionCurso || !anioValue || !divisionValue) {
      const error = {
        type: 'Error al obtener información del curso del estudiante',
      }
      return {
        ...student,
        troncales: { ...student.troncales, error },
        generales: { ...student.generales, error },
      }
    }

    if (!Object.keys(MATERIAS_POR_CURSO).includes(`${anioValue}° año`)) {
      const error = {
        type: 'Error al obtener información de las materias del curso del estudiante',
      }
      return {
        ...student,
        troncales: { ...student.troncales, error },
        generales: { ...student.generales, error },
      }
    }

    const troncalesSet = new Set(student.troncales.detalle)
    const generalesSet = new Set(student.generales.detalle)
    const troncalesSinCalificar = new Set<string>([])
    const generalesSinCalificar = new Set<string>([])

    const materiasCurso =
      MATERIAS_POR_CURSO[`${anioValue}° año` as keyof typeof MATERIAS_POR_CURSO]

    materiasCurso.forEach(({ nombre, esTroncal, orientacion }) => {
      const isValidOrientacion =
        orientacion === orientacionCurso ||
        (orientacionCurso !== 'Ciclo Básico' &&
          orientacion === 'Ciclo Superior')
      if (!isValidOrientacion) return

      const formatedMateriaName = `${nombre} (${anioValue}°)`
      const calificacion =
        instancia !== 'acreditacion'
          ? califActual.materias.find(
              (calif) => calif.nombre.split('_')[0] === nombre,
            )?.[instancia]
          : undefined

      const evaluacion = evaluarCalificacion(calificacion)
      if (evaluacion === 'desaprueba')
        esTroncal
          ? troncalesSet.add(formatedMateriaName)
          : generalesSet.add(formatedMateriaName)
      if (evaluacion === 'sin calificar')
        esTroncal
          ? troncalesSinCalificar.add(formatedMateriaName)
          : generalesSinCalificar.add(formatedMateriaName)
    })

    return {
      ...student,
      troncales: {
        cantidad: troncalesSet.size,
        detalle: [...troncalesSet],
        error:
          troncalesSinCalificar.size > 0
            ? {
                type: 'Materia/s troncal/es sin calificación',
                details: [...troncalesSinCalificar],
              }
            : undefined,
      },
      generales: {
        cantidad: generalesSet.size,
        detalle: [...generalesSet],
        error:
          generalesSinCalificar.size > 0
            ? {
                type: 'Materia/s general/es sin calificación',
                details: [...generalesSinCalificar],
              }
            : undefined,
      },
    }
  })

  console.timeEnd('Proceso de populación')

  return projectedStudents
}

export const getPagination = (
  filteredData: Student[],
  rowsCount: number,
  pageParam?: string,
) => {
  const firstPage = 1
  const lastPage = Math.ceil((filteredData.length || 1) / rowsCount)
  const currentPageParam = Number(pageParam?.split('_')[0])
  const currentPage =
    currentPageParam >= firstPage && currentPageParam <= lastPage
      ? currentPageParam
      : 1
  const pageIndex = currentPage - 1
  const data = filteredData.slice(
    pageIndex * rowsCount,
    pageIndex * rowsCount + rowsCount,
  )
  const indexFirstElement =
    filteredData.findIndex(({ dni }) => dni === data.at(0)?.dni) + 1
  const indexLastElement =
    filteredData.findIndex(({ dni }) => dni === data.at(-1)?.dni) + 1

  return {
    paginatedData: data,
    currentPage,
    lastPage,
    indexFirstElement,
    indexLastElement,
    totalSize: filteredData.length,
  }
}

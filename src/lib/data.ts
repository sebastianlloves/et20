import { SearchParams } from '@/app/analisis-academico/page'
import {
  CURSOS,
  DB_CALIFICACIONES_ACTUALES,
  DB_CALIFICACIONES_HISTORICO,
  MATERIAS_POR_CURSO,
} from './constants'
import { Student, StudentCalifActuales } from './definitions'
import {
  FILTERS_FNS,
  formatCalifActualesResponse,
  formatStudentsResponse,
} from './utils'

export async function fetchStudentsData(anio: string = '2024') {
  const { url, tags } = DB_CALIFICACIONES_HISTORICO[anio]
  const response = await fetch(url, {
    next: { tags: [...tags] },
    cache: 'force-cache',
  })
  const textData = await response.text()
  // await new Promise((resolve) => setTimeout(resolve, 5000))

  return formatStudentsResponse(textData).slice(400, 450)
}

export async function fetchCalificacionesActuales(filteredData: Student[]) {
  console.time('depuracion')
  const uniqueValuesCursos = new Map<any, number>()
  FILTERS_FNS.cursos.uniqueValuesFn(filteredData, uniqueValuesCursos)
  const cursos = Array.from(uniqueValuesCursos.keys())
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
      const anio = key[0]
      return { ...DB_CALIFICACIONES_ACTUALES[key], anio }
    })
  console.timeEnd('depuracion')

  console.time('Tiempo Promise all')
  const califActuales = await Promise.all(
    fetchingData.map(async ({ url, tags, anio }) => {
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
      const formatedResponse = formatCalifActualesResponse(text, anio)
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

export const projectCalifActuales = (
  students: Student[],
  califActuales: StudentCalifActuales[],
  instancia: keyof StudentCalifActuales['materias'][number],
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
    const anioValue = anio && anio[0]
    const divisionValue = division && division[0]
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

    const interpretacion = new Map([
      ['troncales', student.troncales.detalle],
      ['generales', student.generales.detalle],
    ])
    const materiasCurso =
      MATERIAS_POR_CURSO[`${anioValue}° año` as keyof typeof MATERIAS_POR_CURSO]

    materiasCurso.forEach(
      ({ nombre, es_troncal: esTroncal, orientacion: orientacionMateria }) => {
        const isValidOrientacion =
          orientacionMateria === orientacionCurso ||
          (orientacionCurso !== 'Ciclo Básico' &&
            orientacionMateria === 'Ciclo Superior')

        if (isValidOrientacion) {
          const formatedMateriaName = `${nombre} (${anioValue}°)`
          const calificacion = califActual.materias.find(
            (calif) => calif.nombre.split('_')[0] === nombre,
          )?.[instancia]
          if (!calificacion) {
            const prevSinCalificacion =
              interpretacion.get('sin calificación') || []
            if (!prevSinCalificacion.includes(formatedMateriaName))
              interpretacion.set('sin calificación', [
                ...prevSinCalificacion,
                formatedMateriaName,
              ])
          } else if (esTroncal) {
            const prevTroncales = interpretacion.get('troncales') || []
            if (!prevTroncales.includes(formatedMateriaName))
              interpretacion.set('troncales', [
                ...prevTroncales,
                formatedMateriaName,
              ])
          } else {
            const prevGenerales = interpretacion.get('generales') || []
            if (!prevGenerales.includes(formatedMateriaName))
              interpretacion.set('generales', [
                ...prevGenerales,
                formatedMateriaName,
              ])
          }
        }
      },
    )

    return interpretacion
  })

  // Proceso de popular e interpretar la data histórica con las calif actuales
  console.timeEnd('Proceso de populación')
  return projectedStudents
}

/* 
{
    dni: 49006375,
    materias: '[
      {"nombre":"Historia_3","primerBimestre":"Suficiente","segundoBimestre":"Suficiente","primerCuatrimeste":6,"tercerBimestre":"Avanzado","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Geografía_3","primerBimestre":"En Proceso","segundoBimestre":"En Proceso","primerCuatrimeste":4,"tercerBimestre":"Suficiente","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Educación Física_3","primerBimestre":"Avanzado","segundoBimestre":"Avanzado","primerCuatrimeste":9,"tercerBimestre":"Avanzado","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Educación Ciudadana_3","primerBimestre":"Avanzado","segundoBimestre":"Avanzado","primerCuatrimeste":8,"tercerBimestre":"Avanzado","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Inglés_3","primerBimestre":"Suficiente","segundoBimestre":"Suficiente","primerCuatrimeste":7,"tercerBimestre":"Suficiente","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Lengua y Literatura_3","primerBimestre":"Suficiente","segundoBimestre":"Suficiente","primerCuatrimeste":7,"tercerBimestre":"En Proceso","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Matemática_3","primerBimestre":"En Proceso","segundoBimestre":"Suficiente","primerCuatrimeste":6,"tercerBimestre":"Suficiente","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Física_3","primerBimestre":"En Proceso","segundoBimestre":"Suficiente","primerCuatrimeste":5,"tercerBimestre":"En Proceso","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Rep. Mediales, Comunicación y Lenguajes_3","primerBimestre":"Avanzado","segundoBimestre":"Suficiente","primerCuatrimeste":7,"tercerBimestre":"En Proceso","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Química_3","primerBimestre":"Suficiente","segundoBimestre":"Suficiente","primerCuatrimeste":6,"tercerBimestre":"En Proceso","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Taller de Tecnol. y del Control_3","primerBimestre":"Avanzado","segundoBimestre":"Suficiente","primerCuatrimeste":7,"tercerBimestre":"Suficiente","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null},
      {"nombre":"Taller de Prod. Multimedial_3","primerBimestre":"Suficiente","segundoBimestre":"Suficiente","primerCuatrimeste":6,"tercerBimestre":"En Proceso","cuartoBimestre":null,"segundoCuatrimestre":null,"anual":null,"diciembre":null,"febrero":null,"definitiva":null}
    ]'
  }
*/

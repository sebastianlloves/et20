import { SearchParams } from '@/app/analisis-academico/page'
import {
  DB_CALIFICACIONES_ACTUALES,
  DB_CALIFICACIONES_HISTORICO,
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

  return formatStudentsResponse(textData)/* .slice(400, 450) */
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
    .map((key) => DB_CALIFICACIONES_ACTUALES[key])
  console.timeEnd('depuracion')

  console.time('Tiempo Promise all')
  const califActuales = await Promise.all(
    fetchingData.map(async ({ url, tags }) => {
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
      const formatedResponse = formatCalifActualesResponse(text)
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
  instancia: string,
) => {
  // Proceso de popular e interpretar la data histórica con las calif actuales
  return undefined
}

/* 
={
{
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Educación Física!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Inglés!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Ciudadanía y Trabajo!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Lengua y Literatura!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Ciencia y Tecnología!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Matemática!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Representación Sonora!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Representación Visual!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Diseño Web!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Lab. de Postprod. de la Imagen y del Sonido!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Taller de Tecnol. de la Imagen!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/18bfqSrVsvGir15u38f7VSbNzhg5mhIAW1MZm3jkOdSE/";"Taller de Tecnol. del Sonido!C8:O");"SELECT * WHERE Col3 is not null ";0)
};
{
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Educación Física!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Inglés!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Ciudadanía y Trabajo!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Lengua y Literatura!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Ciencia y Tecnología!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Matemática!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Representación Sonora!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Representación Visual!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Diseño Web!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Lab. de Postprod. de la Imagen y del Sonido!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Taller de Tecnol. de la Imagen!C8:O");"SELECT * WHERE Col3 is not null ";0)\
Query(IMPORTRANGE("https://docs.google.com/spreadsheets/d/1Whxwu-QutWiPA5oEtW5e01sSE-YE-iw2G7mH5SyFHBc/";"Taller de Tecnol. del Sonido!C8:O");"SELECT * WHERE Col3 is not null ";0)
}
}
*/

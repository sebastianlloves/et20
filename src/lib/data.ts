import { DB_CALIFICACIONES } from './constants'
import {
  formatCalifActualesResponse,
  formatStudentsResponse,
} from './formatData'

export async function fetchCalificacionesHistoricas(anio: string) {
  if (!(anio in DB_CALIFICACIONES))
    throw new Error(`No hay datos para el año ${anio}`)
  try {
    const { url, tags } = DB_CALIFICACIONES[anio].historico
    const response = await fetch(url, {
      next: { tags: [...tags] },
      cache: 'force-cache',
    })
    const textData = await response.text()
    // console.time('formatStudentsResponse')
    const studentsResponse = formatStudentsResponse(textData, Number(anio))
    // console.timeEnd('formatStudentsResponse')
    return studentsResponse
  } catch (error) {
    throw new Error(`Error al obtener los datos histórico para el año ${anio}`)
  }
}

export async function fetchCalificacionesActuales(
  anio: string,
  // data: Student[],
  // cursosFilter?: string[],
) {
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

  const califActuales = await Promise.all(
    fetchingData.map(async ({ url, tags, anioCurso }) => {
      const response = await fetch(url, {
        next: {
          tags: [...tags],
        },
        cache: 'force-cache',
      })
      const text = await response.text()
      const formatedResponse = formatCalifActualesResponse(text, anioCurso)

      return formatedResponse
    }),
  )
  return califActuales.flat()
}

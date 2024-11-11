import { CALIFICACIONES_STRINGS, CARACTER_GRADO, CURSOS } from './constants'
import { Calificacion, Student, StudentCalifActuales } from './definitions'

export function formatStudentsResponse(
  textResponse: string,
  anioDB: number,
): Student[] {
  const [, ...data] = textResponse.split('\r\n').map((row) => row.split('\t'))
  const ultimoAnio =
    Object.keys(CURSOS)
      .map((key) => Number(key[0]))
      .sort()
      .at(-1) || 0
  return data.map(
    ([
      anioValue,
      divisionValue,
      apellidoValue,
      nombreValue,
      dniValue,
      troncalesCantValue,
      troncalesDetalleValue,
      generalesCantValue,
      generalesDetalleValue,
      enProceso2020CantidadValue,
      enProceso2020DetalleValue,
      repitencia1Value,
      repitencia2Value,
      repitencia3Value,
    ]) => {
      const anio = anioValue.length ? `${anioValue[0]}º` : null
      const repitencia = defineRepitencia([
        repitencia1Value,
        repitencia2Value,
        repitencia3Value,
      ])
      const troncales = {
        cantidad: !Number.isNaN(parseInt(troncalesCantValue))
          ? parseInt(troncalesCantValue)
          : null,
        detalle: formatDetalleMaterias(troncalesDetalleValue.trim()),
      }
      const generales = {
        cantidad: !Number.isNaN(parseInt(generalesCantValue))
          ? parseInt(generalesCantValue)
          : null,
        detalle: formatDetalleMaterias(generalesDetalleValue.trim()),
      }
      const curso2020enSecundaria = anio
        ? anioDB + 1 - Number(anio[0]) - repitencia.length <= 2020
        : true
      const enProceso2020 = {
        cantidad: !Number.isNaN(parseInt(enProceso2020CantidadValue))
          ? parseInt(enProceso2020CantidadValue)
          : null,
        detalle: curso2020enSecundaria
          ? formatDetalleMaterias(enProceso2020DetalleValue.trim())
          : 'No corresponde',
      } as const
      const proyeccion = defineProyeccion(
        anio,
        ultimoAnio,
        troncales,
        generales,
        enProceso2020,
      )

      return {
        anio,
        division: divisionValue.length ? `${divisionValue[0]}º` : null,
        apellido: apellidoValue.length
          ? capitalizeWords(apellidoValue)
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
          : null,
        nombre: nombreValue.length
          ? capitalizeWords(nombreValue)
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
          : null,
        dni: parseInt(dniValue) || null,
        repitencia,
        troncales,
        generales,
        enProceso2020,
        proyeccion,
      }
    },
  )
}


export function formatCalifActualesResponse(
  response: string,
  anio: string,
): Pick<StudentCalifActuales, 'dni' | 'materias'>[] {
  const [, encabezadoMaterias, , ...data] = response
    .split('\r\n')
    .map((row) => {
      const [, ...data] = row.split('\t')
      return data
    })
  const formatedDatada = data.flatMap((row) =>
    Array.from(row, (_, index) => {
      const arrIndex = index / 13
      if (Number.isInteger(arrIndex)) {
        const [
          apellido,
          nombre,
          dniValue,
          primerBimestreValue,
          segundoBimestreValue,
          primerCuatrimestreValue,
          tercerBimestreValue,
          cuartoBimestreValue,
          segundoCuatrimestreValue,
          anualValue,
          diciembreValue,
          febreroValue,
          definitivaValue,
        ] = row.slice(index, index + 13)
        return {
          apellido,
          nombre,
          dni: Number(dniValue),
          materia: `${encabezadoMaterias[index]}_${anio}`,
          primerBimestre: defineCalificacion(primerBimestreValue),
          segundoBimestre: defineCalificacion(segundoBimestreValue),
          primerCuatrimestre: defineCalificacion(primerCuatrimestreValue),
          tercerBimestre: defineCalificacion(tercerBimestreValue),
          cuartoBimestre: defineCalificacion(cuartoBimestreValue),
          segundoCuatrimestre: defineCalificacion(segundoCuatrimestreValue),
          anual: defineCalificacion(anualValue),
          diciembre: defineCalificacion(diciembreValue),
          febrero: defineCalificacion(febreroValue),
          definitiva: defineCalificacion(definitivaValue),
        }
      }
      return null
    }).filter((value) => value !== null),
  )

  const uniqueValuesDNI = new Set(formatedDatada.map(({ dni }) => dni))
  const groupedData = [...uniqueValuesDNI].map((uniqueDNI) => {
    const formatedObjs = formatedDatada.filter(({ dni }) => uniqueDNI === dni)
    const materias = formatedObjs.map(
      ({
        materia,
        primerBimestre,
        segundoBimestre,
        primerCuatrimestre,
        tercerBimestre,
        cuartoBimestre,
        segundoCuatrimestre,
        anual,
        diciembre,
        febrero,
        definitiva,
      }) => {
        return {
          nombre: materia,
          primerBimestre,
          segundoBimestre,
          primerCuatrimestre,
          tercerBimestre,
          cuartoBimestre,
          segundoCuatrimestre,
          anual,
          diciembre,
          febrero,
          definitiva,
        }
      },
    )
    return { dni: uniqueDNI, materias }
  })
  return groupedData
}

export const capitalizeWords = (words: string) =>
  words
    .toLowerCase()
    .trim()
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')

const defineRepitencia = (repitenciaArr: string[]): Student['repitencia'] =>
  repitenciaArr
    .filter((repValue) => !Number.isNaN(parseInt(repValue[0])))
    .map((value) => `${value[0]}° año`)
    .sort()

const formatDetalleMaterias = (detalle: string): string[] => {
  const partialString = (
    detalle.endsWith('.') ? detalle.slice(0, detalle.length - 1) : detalle
  ).replaceAll('º', CARACTER_GRADO)
  const splitedString =
    partialString.includes('Rep. Mediales, Comunicación y Lenguajes') ||
    partialString.includes('Arte, Tecnol. y Comunicación')
      ? partialString
          .split('), ')
          .map((string) => (string.endsWith(')') ? string : `${string})`))
      : partialString.split(', ')
  return splitedString.filter((value) => value !== 'No adeuda')
}

export const defineProyeccion = (
  anioString: string | null,
  ultimoAnio: number,
  troncales: Student['troncales'],
  generales: Student['generales'],
  enProceso2020: Student['enProceso2020'],
  includeCalifActuales: boolean = false,
): Student['proyeccion'] => {
  const { cantidad: cantTroncales, error: errorTroncales } = troncales
  const { cantidad: cantGenerales, error: errorGenerales } = generales
  const { cantidad: cantEnProceso2020 } = enProceso2020
  if (
    anioString === null ||
    cantTroncales === null ||
    cantGenerales === null ||
    errorTroncales ||
    errorGenerales
  )
    return 'Faltan datos'
  const anioActual = Number(anioString[0])
  if (anioActual === ultimoAnio) {
    if (!includeCalifActuales) return 'Egresa'
    if (cantEnProceso2020 === null || cantEnProceso2020 === undefined)
      return 'Faltan datos'
    return cantTroncales + cantGenerales + cantEnProceso2020 === 0
      ? 'Egresa (titula)'
      : 'Egresa (NO titula)'
  }
  return cantTroncales <= 2 && cantTroncales + cantGenerales <= 4
    ? 'Promociona'
    : 'Permanece'
}


const defineCalificacion = (string: string) => {
  if (!Number.isNaN(parseInt(string))) {
    const numberCalif = Number(string)
    if (numberCalif > 0 && numberCalif <= 10) return numberCalif
  }
  const califStringsValidas = Object.values(CALIFICACIONES_STRINGS).flat()
  if (califStringsValidas.some((califString) => califString === string))
    return string
  return null
}



export const evaluarCalificacion = (calificacion?: Calificacion) => {
  if (CALIFICACIONES_STRINGS.desaprueba.some((value) => value === calificacion))
    return 'desaprueba'
  if (CALIFICACIONES_STRINGS.aprueba.some((value) => value === calificacion))
    return 'aprueba'
  if (Number(calificacion) > 0) {
    return Number(calificacion) >= 6 ? 'aprueba' : 'desaprueba'
  }
  return 'sin calificar'
}

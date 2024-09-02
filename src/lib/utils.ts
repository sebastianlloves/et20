import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Student } from './definitions'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const capitalizeWords = (words: string) =>
  words
    .toLowerCase()
    .trim()
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')

const defineRepitencia = (repitenciaArr: string[]): Student['repitencia'] =>
  repitenciaArr
    .filter((repValue) => !Number.isNaN(parseInt(repValue[0])))
    .map((value) => `${value[0]}º año`)
    .sort()

const formatDetalleMaterias = (detalle: string): string[] => {
  const partialString = (
    detalle.endsWith('.') ? detalle.slice(0, detalle.length - 1) : detalle
  ).replaceAll('º', '°')
  const splitedString =
    partialString.includes('Rep. Mediales, Comunicación y Lenguajes') ||
    partialString.includes('Arte, Tecnol. y Comunicación')
      ? partialString
          .split('), ')
          .map((string) => (string.endsWith(')') ? string : `${string})`))
      : partialString.split(', ')
  return splitedString.filter((value) => value !== 'No adeuda')
}

export function formatStudentsResponse(textResponse: string): Student[] {
  const [, ...data] = textResponse.split('\r\n').map((row) => row.split('\t'))
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
      return {
        anio: anioValue.length ? `${anioValue[0]}º` : null,
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
        repitencia: defineRepitencia([
          repitencia1Value,
          repitencia2Value,
          repitencia3Value,
        ]),
        cantTroncales: !Number.isNaN(parseInt(troncalesCantValue))
          ? parseInt(troncalesCantValue)
          : null,
        detalleTroncales: formatDetalleMaterias(troncalesDetalleValue.trim()),
        cantGenerales: !Number.isNaN(parseInt(generalesCantValue))
          ? parseInt(generalesCantValue)
          : null,
        detalleGenerales: formatDetalleMaterias(generalesDetalleValue.trim()),
        cantEnProceso2020: !Number.isNaN(parseInt(enProceso2020CantidadValue))
          ? parseInt(enProceso2020CantidadValue)
          : null,
        detalleEnProceso2020: formatDetalleMaterias(
          enProceso2020DetalleValue.trim(),
        ),
      }
    },
  )
}


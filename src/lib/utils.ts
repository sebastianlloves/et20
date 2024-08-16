import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Student } from './definitions'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStudentsResponse (textResponse : string)/* : Student[] */ {
  const [, ...data] = textResponse.split('\r\n').map((row) => row.split('\t'))
  const studentsData = data.map(([
    anioValue,
    divisionValue,
    apellidoValue,
    nombreValue,
    dniValue,
    materiasPendientesCantTroncalesValue,
    detalleTroncalesValue,
    materiasPendientesCantGeneralesValue,
    detalleGeneralesValue,
    materiasEnProceso2020CantidadValue,
    detalleEnProceso2020Value,
    repitencia1Value,
    repitencia2Value,
    repitencia3Value
  ]): Student => {
    return {
      
    }
  })
}

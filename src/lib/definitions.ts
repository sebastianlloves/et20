import { INSTANCIAS_ANIO } from './constants'

export type MateriasPendientes = {
  cantidad: number | null
  detalle: string[]
  error?: {
    type: string
    details?: string[]
  }
}

export type Student = {
  anio: string | null
  division: string | null
  apellido: string | null
  nombre: string | null
  dni: number | null
  repitencia: string[]
  troncales: MateriasPendientes
  generales: MateriasPendientes
  enProceso2020: Omit<MateriasPendientes, 'detalle' | 'error'> & {
    detalle: string[] | 'No corresponde'
  }
  proyeccion: 'Promociona' | 'Permanece' | 'Egresa' | 'Egresa (titula)' | 'Egresa (NO titula)' | 'Faltan datos'
}

export type StudentsTableFilters = {
  anio: string
  search?: string[]
  cursos?: string[]
  promocion?: string[]
}

export type Calificacion = string | number | null

export type StudentCalifActuales = {
  apellido?: string
  nombre?: string
  dni: number
  materias: ({
    nombre: string
  } & Record<(typeof INSTANCIAS_ANIO)[number], Calificacion>)[]
}

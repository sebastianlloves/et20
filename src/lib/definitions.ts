export type MateriasPendientes = {
  cantidad: number | null
  detalle: string[]
  error?: {
    type: string,
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
  enProceso2020: MateriasPendientes
}

export type StudentsTableFilters = {
  anio: string
  search?: string[]
  cursos?: string[]
  promocion?: string[]
}

type Calificacion = string | number | null

export type StudentCalifActuales = {
  apellido?: string
  nombre?: string
  dni: number
  materias: {
    nombre: string
    primerBimestre: Calificacion
    segundoBimestre: Calificacion
    primerCuatrimeste: Calificacion
    tercerBimestre: Calificacion
    cuartoBimestre: Calificacion
    segundoCuatrimestre: Calificacion
    anual: Calificacion
    diciembre: Calificacion
    febrero: Calificacion
    definitiva: Calificacion
  }[]
}

export type Student = {
  anio: string | null
  division: string | null
  apellido: string | null
  nombre: string | null
  dni: number | null
  repitencia: string[]
  cantTroncales: number | null
  detalleTroncales: string[]
  cantGenerales: number | null
  detalleGenerales: string[]
  cantEnProceso2020: number | null
  detalleEnProceso2020: string[]
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

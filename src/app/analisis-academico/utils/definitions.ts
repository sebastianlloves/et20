import { Student } from '@/lib/definitions'

export type AllFiltersValues = {
  anio?: string
  search?: string[]
  cursos?: string[]
  materias?: string[]
  califParciales?: string
  inclusionEstricta?: string
  cantidadesTroncales?: number[]
  cantidadesGenerales?: number[]
  cantidadesEnProceso2020?: number[]
  cantOptativo?: string
  enProceso2020?: string
  repitenciaAnios?: string[]
  repitenciaCant?: number[]
  proyeccion?: string[]
  page?: number[]
  sort?: string[]
}

export type SearchParams = Partial<Record<keyof AllFiltersValues, string>>

export interface TableFilterProps {
  searchParams: SearchParams
  data?: Student[]
}

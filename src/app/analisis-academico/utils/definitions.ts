import {  SEARCH_PARAMS_KEYS } from './constants'
import { FILTERS_FNS } from './dataOperations'

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

export type SearchParams = Partial<
  Record<(typeof SEARCH_PARAMS_KEYS)[number], string>
>

type FormatReturnType = {
  [key in keyof typeof FILTERS_FNS]?: ReturnType<
    (typeof FILTERS_FNS)[key]['formatParam']
  >
}

export type FiltersValues = {
  [key in (typeof SEARCH_PARAMS_KEYS)[number]]?: key extends keyof FormatReturnType
    ? FormatReturnType[key]
    : string
}

export type ItemData = {
  value: string[] | string
  itemText: string
  quantity?: number
  isSelected?: boolean
  isDisabled?: boolean
}

export type TagData = {
  value?: string
  tagText: string
  newFilterState?: FiltersValues[keyof FiltersValues]
  keyParam: keyof SearchParams
  quantity?: number | null
  className?: string
}

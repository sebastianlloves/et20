import { ParamsValues, SearchParams } from '../page'
import { FORMAT_PARAMS_FNS, SEARCH_PARAMS_KEYS } from './constants'

/* import { SearchParams } from '../page'
import { CURSOS_ITEMS_DATA, MATERIAS_ITEMS_DATA } from './constants'
import { FILTERS_FNS } from './dataOperations'

export const FORMAT_PARAMS_FNS: Record<
  keyof SearchParams,
  (param?: string) => any
> = {
  cursos: (param?: string) =>
    formatArrValuesParam(
      param,
      CURSOS_ITEMS_DATA.flatMap(({ todos }) => todos),
    ),
  materias: (param?: string) =>
    formatArrValuesParam(
      param,
      MATERIAS_ITEMS_DATA.flatMap(({ todas }) => todas),
      FILTERS_FNS.materias.sortParam,
    ),
}

export const getFormatedValues = (
  key: keyof SearchParams,
  searchParams: SearchParams,
) => {
  const param = searchParams[key]
  return FORMAT_PARAMS_FNS[key] ? FORMAT_PARAMS_FNS[key](param) : param
} */
export function formatParamsValues(searchParams: SearchParams) {
  const paramsValues: ParamsValues = {}
  const paramsKeys = Object.keys(searchParams) as Array<keyof SearchParams>
  paramsKeys.forEach((key) => {
    const paramValue = searchParams[key]
    if (SEARCH_PARAMS_KEYS.includes(key) && paramValue) {
      const formatFn = FORMAT_PARAMS_FNS?.[key]
      const formatedParam = formatFn ? formatFn(paramValue) : paramValue
      paramsValues[key] = formatedParam
    }
  })
  return paramsValues
}

export const updateArrParamState = (
  itemValue: string | string[],
  filterValue?: string | string[],
  partialAlterableArr?: string[],
  sortingFn?: (a: string, b: string) => number,
) => {
  if (!filterValue || typeof filterValue === 'string') return filterValue
  let newState: string[]
  if (typeof itemValue === 'string') {
    const alreadyIsInFilter = filterValue.includes(itemValue)
    newState = alreadyIsInFilter
      ? filterValue.filter((prevValue) => prevValue !== itemValue)
      : [...filterValue, itemValue]
  } else if (!partialAlterableArr) {
    const itemIsSelected =
      itemValue.every((value) => filterValue.includes(value)) &&
      itemValue.length === filterValue.length
    newState = itemIsSelected ? [] : itemValue
  } else {
    const unalterablePartialArr = filterValue.filter(
      (value) => !partialAlterableArr.includes(value),
    )
    const modifiablePartialArr = filterValue.filter((value) =>
      partialAlterableArr.includes(value),
    )
    const alreadyIsInFilter =
      itemValue.every((value) => modifiablePartialArr.includes(value)) &&
      itemValue.length === modifiablePartialArr.length
    newState = alreadyIsInFilter
      ? filterValue.filter((value) => !itemValue.includes(value))
      : [...unalterablePartialArr, ...itemValue]
  }
  const sortedNewState = sortingFn ? newState.sort(sortingFn) : newState.sort()
  return sortedNewState.length ? sortedNewState.join('_') : undefined
}

export const formatArrValuesParam = (
  param?: string,
  validatingArr?: unknown[],
  sortingFn?: (a: string, b: string) => number,
) => {
  const paramValues = param?.split('_') || []
  const filterValues = validatingArr
    ? paramValues.filter((value) => validatingArr.includes(value))
    : paramValues
  const sortedValues = sortingFn
    ? filterValues.sort(sortingFn)
    : filterValues.sort()

  return sortedValues
}

export const formatArrValues = (
  param: string,
  validatingArr?: unknown[],
  sortingFn?: (a: string, b: string) => number,
) => {
  const paramValues = param.split('_')
  const filterValues = validatingArr
    ? paramValues.filter((value) => validatingArr.includes(value))
    : paramValues
  const sortedValues = sortingFn
    ? filterValues.sort(sortingFn)
    : filterValues.sort()

  return sortedValues
}

export const formatCantValuesParam = (
  param?: string,
  minMaxValidation?: number[],
) => {
  const paramValues = param?.split('_').map((value) => Number(value))
  if (paramValues === undefined || paramValues.length !== 2) return undefined

  let minValue = Math.min(...paramValues)
  let maxValue = Math.max(...paramValues)
  if (minMaxValidation) {
    const minValid = Math.min(...minMaxValidation)
    const maxValid = Math.max(...minMaxValidation)
    if (minValue < minValid) minValue = minValid
    if (maxValue > maxValid) maxValue = maxValid
  }
  return [minValue, maxValue]
}

export const formatCantValues = (
  param: string,
  minMaxValidation?: number[],
) => {
  const paramValues = param.split('_').map((value) => Number(value))
  let minValue = Math.min(...paramValues)
  let maxValue = Math.max(...paramValues)
  if (minMaxValidation) {
    const minValid = Math.min(...minMaxValidation)
    const maxValid = Math.max(...minMaxValidation)
    if (minValue < minValid) minValue = minValid
    if (maxValue > maxValid) maxValue = maxValid
  }
  return [minValue, maxValue]
}

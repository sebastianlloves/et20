import { isKeyOfObject } from '@/lib/typeGuards'
import { FiltersValues, SearchParams } from './definitions'
import { FILTERS_FNS } from './dataOperations'

export function getFiltersValues(searchParams: SearchParams) {
  const allFiltersValues: FiltersValues = {}
  const paramsKeys = Object.keys(searchParams) as Array<keyof SearchParams>
  paramsKeys.forEach((key) => {
    const formatFn =
      isKeyOfObject(key, FILTERS_FNS) && FILTERS_FNS[key].formatParam
    const formatedParam = formatFn ? formatFn(searchParams) : searchParams[key]
    if (
      (Array.isArray(formatedParam) && formatedParam.length) ||
      typeof formatedParam === 'string'
    )
      allFiltersValues[key] = formatedParam as string & string[] & number[]
  })
  return allFiltersValues
}

export const updateArrFilterState = (
  itemValue: string | string[],
  filterValues?: string[],
  partialAlterableArr?: string[],
  sortingFn?: (a: string, b: string) => number,
) => {
  const filterValue = filterValues || []
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
  return sortedNewState.length ? sortedNewState : undefined
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

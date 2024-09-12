import { SearchParams } from '@/app/analisis-academico/page'
import { DB, FILTERS_FNS } from './constants'
import { Student } from './definitions'
import { formatStudentsResponse } from './utils'

export async function fetchStudentsData(anio: string = '2024') {
  const response = await fetch(DB[anio], {
    cache: 'force-cache',
    next: { tags: ['db2023'] },
  })
  const textData = await response.text()
  // await new Promise((resolve) => setTimeout(resolve, 2000))

  return formatStudentsResponse(textData)
}

export function getFilteredStudentData(
  data: Student[],
  filterParams: Omit<SearchParams, 'anio'> = {},
  omitedKey?: string,
) {
  const filteredData = data.filter((student) =>
    Object.keys(filterParams)
      .filter((key) => key !== 'enProceso2020' && key !== omitedKey)
      .every((filterName) =>
        isValidKey(filterName)
          ? FILTERS_FNS[filterName].filterFn(student, filterParams)
          : true,
      ),
  )
  return filteredData
}

export function getStudentsUniqueValues(
  data: Student[],
  filterParams: Omit<SearchParams, 'anio'>,
  filterKey: keyof typeof FILTERS_FNS,
) {
  const partialFilteredData = getFilteredStudentData(
    data,
    filterParams,
    filterKey,
  )
  const facetedModel = new Map<string, number>()
  FILTERS_FNS[filterKey].uniqueValuesFn(
    partialFilteredData,
    facetedModel,
    filterParams,
  )

  return facetedModel
}

const isValidKey = (key: string): key is keyof typeof FILTERS_FNS => {
  return FILTERS_FNS[key as keyof typeof FILTERS_FNS] !== undefined
}

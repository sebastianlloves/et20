import { SearchParams } from '@/app/analisis-academico/page'
import { DB_CALIFICACIONES_HISTORICO } from './constants'
import { Student } from './definitions'
import { FILTERS_FNS, formatStudentsResponse } from './utils'

const tags: { [key: string]: string } = {
  '2023': 'dbHistorico2023',
  '2024': 'dbHistorico2024',
}

export async function fetchStudentsData(anio: string = '2024') {
  const response = await fetch(DB_CALIFICACIONES_HISTORICO[anio], {
    next: { tags: [tags[anio]] },
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
  const paramsWithValue = JSON.parse(JSON.stringify(filterParams))
  const filteredData = data.filter((student) =>
    (Object.keys(FILTERS_FNS) as Array<keyof typeof FILTERS_FNS>)
      .filter(
        (filterFnKey) =>
          Object.keys(paramsWithValue).some((key) =>
            key.includes(filterFnKey),
          ) && filterFnKey !== omitedKey,
      )
      .every((filterFnKey) =>
        FILTERS_FNS[filterFnKey].filterFn(student, filterParams),
      ),
  )
  return filteredData
}

export function getStudentsUniqueValues(
  data: Student[],
  filterParams: Omit<SearchParams, 'anio'>,
  filterKey: keyof typeof FILTERS_FNS,
  omitKeyInFiltering?: boolean,
) {
  const partialFilteredData = getFilteredStudentData(
    data,
    filterParams,
    omitKeyInFiltering ? undefined : filterKey,
  )
  const facetedModel = new Map<any, number>()
  FILTERS_FNS[filterKey].uniqueValuesFn(
    partialFilteredData,
    facetedModel,
    filterParams,
  )

  return facetedModel
}

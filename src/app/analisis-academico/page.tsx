import { Suspense } from 'react'
import ToggleDB from './components/filters/inputs/toggle-db'
import SearchBar from './components/filters/inputs/search-bar'
import SkeletonStudentsTable from './components/skeletons/skeleton-students-table'
import StudentsTable from './components/students-table'
import {
  SEARCH_PARAMS_KEYS,
  FORMAT_PARAMS_FNS,
} from './utils/constants'

export type SearchParams = {
  // eslint-disable-next-line no-unused-vars
  [key in (typeof SEARCH_PARAMS_KEYS)[number]]?: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const awaitedSearchParams = await searchParams
  const paramsValues = getParamsValues(awaitedSearchParams)
  console.log(paramsValues)
  return (
    <div className="grid w-full grid-rows-[auto_auto_auto] gap-x-6 gap-y-3 px-0 lg:grid-cols-[minmax(230px,1fr)_7fr] lg:px-4 xl:gap-x-8 xl:gap-y-4 2xl:px-8">
      <ToggleDB className="hidden lg:block" />
      <SearchBar className="hidden lg:block" />
      <Suspense
        key={JSON.stringify(awaitedSearchParams)}
        fallback={<SkeletonStudentsTable searchParams={awaitedSearchParams} />}
      >
        <StudentsTable
          searchParams={awaitedSearchParams}
          paramsValues={paramsValues}
        />
      </Suspense>
    </div>
  )
}

export type ParamsValues = Partial<
  Record<keyof SearchParams, string | string[]>
>

function getParamsValues(searchParams: SearchParams) {
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

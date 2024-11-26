import { Suspense } from 'react'
import ToggleDB from './components/filters/inputs/toggle-db'
import SearchBar from './components/filters/inputs/search-bar'
import SkeletonStudentsTable from './components/skeletons/skeleton-students-table'
import StudentsTable from './components/students-table'
import { SEARCH_PARAMS_KEYS } from './utils/constants'
import { formatParamsValues } from './utils/urlParamsOperations'

export type SearchParams = {
  [key in (typeof SEARCH_PARAMS_KEYS)[number]]?: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const awaitedSearchParams = await searchParams
  const paramsValues = formatParamsValues(awaitedSearchParams)
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

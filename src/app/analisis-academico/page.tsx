import { Suspense } from 'react'
import ToggleDB from './components/filters/toggle-db'
import SearchBar from './components/filters/search/search-bar'
import SkeletonStudentsTable from './components/skeletons/skeleton-students-table'
import StudentsTable from './components/students-table'
import { SearchParams } from './utils/definitions'
import { getFiltersValues } from './utils/filtersOperations'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const awaitedSearchParams = await searchParams
  const filtersValues = getFiltersValues(awaitedSearchParams)
  return (
    <div className="grid w-full grid-rows-[auto_auto_auto] gap-x-6 gap-y-3 px-0 lg:grid-cols-[minmax(230px,1fr)_7fr] lg:px-4 xl:gap-x-8 xl:gap-y-4 2xl:px-8">
      <ToggleDB className="hidden lg:block" />
      <SearchBar allFiltersValues={filtersValues} className="hidden lg:block" />
      <Suspense
        key={JSON.stringify(awaitedSearchParams)}
        fallback={<SkeletonStudentsTable filtersValues={filtersValues} />}
      >
        <StudentsTable filtersValues={filtersValues} />
      </Suspense>
    </div>
  )
}

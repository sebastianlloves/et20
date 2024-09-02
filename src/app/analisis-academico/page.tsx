import StudentsTable from './components/students-table'
import SkeletonStudentsTable from './components/skeleton/skeleton-students-table'
import ToggleDB from './components/toggle-db'
import { Suspense } from 'react'
import SearchBar from './components/filters/search-bar'
import FiltersPanel from './components/filters/filters-panel'

export interface SearchParams {
  anio?: string
  search?: string
  cursos?: string
  promocion?: string
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {

  return (
    <div className="grid w-full grid-cols-7 gap-x-8 gap-y-4 px-8">
      <ToggleDB />
      <div className="col-span-full col-start-2">
        <SearchBar />
      </div>
      <FiltersPanel searchParams={searchParams} />
      <div className="col-span-full col-start-2">
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<SkeletonStudentsTable />}
        >
          <StudentsTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

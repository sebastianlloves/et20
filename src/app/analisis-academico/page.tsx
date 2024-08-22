import StudentsTable from './components/students-table'
import SkeletonStudentsTable from './components/skeleton/skeleton-students-table'
import ToggleDB from './components/toggle-db'
import { Suspense } from 'react'
import SearchBar from './components/filters/search-bar'
import FiltersPanel from './components/filters/filters-panel'

export type PageProps = {
  searchParams?: {
    anio?: string
    query?: string
    cursos?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  const filters = {
    anio: searchParams?.anio,
    query: searchParams?.query,
    cursos: searchParams?.cursos?.split(','),
  }
  console.log(Object.entries(filters).toString())

  return (
    <div className="grid w-full grid-cols-7 gap-x-8 gap-y-4 px-8">
      <ToggleDB />
      <div className="col-span-full col-start-2">
        <SearchBar />
      </div>
      <FiltersPanel />
      <div className="col-span-full col-start-2">
        <Suspense
          key={Object.entries(filters).toString()}
          fallback={<SkeletonStudentsTable />}
        >
          <StudentsTable filters={filters} />
        </Suspense>
      </div>
    </div>
  )
}

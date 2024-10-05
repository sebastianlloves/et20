import StudentsTable from './components/students-table'
import ToggleDB from './components/toggle-db'
import { Suspense } from 'react'
import SearchBar from './components/filters/search-bar'
import SkeletonStudentsTable from './components/skeleton-students-table'

export interface SearchParams {
  anio?: string
  search?: string
  cursos?: string
  materias?: string
  promocion?: string
  enProceso2020?: string
  inclusionEstricta?: string
  cantidadesTroncales?: string
  cantidadesGenerales?: string
  cantidadesEnProceso2020?: string
  cantOptativo?: string
  repitenciaAnios?: string
  repitenciaCant?: string
}

// eslint-disable-next-line camelcase
export const experimental_ppr = true

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="grid w-full gap-x-8 gap-y-4 px-0 lg:grid-cols-[minmax(230px,1fr)_7fr] lg:px-4 2xl:px-8 ">
      <div className="hidden lg:block">
        <ToggleDB />
      </div>
      <div className="hidden lg:block">
        <SearchBar />
      </div>
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={<SkeletonStudentsTable />}
      >
        <StudentsTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

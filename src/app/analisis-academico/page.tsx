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

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="grid w-full grid-cols-[minmax(230px,1fr)_7fr] gap-x-8 gap-y-4 px-8">
      <ToggleDB />
      <SearchBar />
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={<SkeletonStudentsTable />}
      >
        <StudentsTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

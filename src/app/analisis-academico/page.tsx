import StudentsTable from './components/students-table'
import ToggleDB from './components/filters/toggle-db'
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
  proyeccion?: string
  page?: string
  sort?: string
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="grid w-full gap-x-6 gap-y-3 xl:gap-x-8 xl:gap-y-4 px-0 lg:grid-cols-[minmax(230px,1fr)_7fr] lg:px-4 2xl:px-8">
      <div className="hidden lg:block">
        <ToggleDB />
      </div>
      <div className="hidden lg:block">
        <SearchBar />
      </div>
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={<SkeletonStudentsTable searchParams={searchParams} />}
      >
        <StudentsTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

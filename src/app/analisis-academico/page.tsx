import StudentsTable from '../../components/analisis-academico/students-table'
import ToggleDB from '../../components/analisis-academico/filters/viejo/toggle-db'
import { Suspense } from 'react'
import SearchBar from '../../components/analisis-academico/filters/viejo/search-bar'
import SkeletonStudentsTable from '../../components/analisis-academico/skeletons/skeleton-students-table'

export interface SearchParams {
  anio?: string
  search?: string
  cursos?: string
  materias?: string
  proyeccion?: string
  enProceso2020?: string
  inclusionEstricta?: string
  cantidadesTroncales?: string
  cantidadesGenerales?: string
  cantidadesEnProceso2020?: string
  cantOptativo?: string
  repitenciaAnios?: string
  repitenciaCant?: string
  califParciales?: string
  page?: string
  sort?: string
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="grid w-full grid-rows-[auto_auto_auto] gap-x-6 gap-y-3 px-0 lg:grid-cols-[minmax(230px,1fr)_7fr] lg:px-4 xl:gap-x-8 xl:gap-y-4 2xl:px-8">
      <ToggleDB className="hidden lg:block" />
      <SearchBar className="hidden lg:block" />
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={<SkeletonStudentsTable searchParams={searchParams} />}
      >
        <StudentsTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

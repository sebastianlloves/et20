import { ScrollArea } from '@/components/ui/scroll-area'
import { ListFilter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Student } from '@/lib/definitions'
// import MateriasFilter from './inputs/materias-filter'
// import CantidadesFilter from './inputs/cantidades-filter'
// import RepitenciaFiltering from './inputs/repitencia-filter'
// import CalifParcialesFilter from './inputs/calif-parciales'
// import CursosFilter from './inputs/cursos-filter'
// import ProyeccionFilter from './inputs/proyeccion-filter'
import { CursosFilter as CursosFilter2 } from './inputs/cursos/cursos-filter'
import { AllFiltersValues /* , SearchParams */ } from '../../utils/definitions'

function FiltersPanel({
  // searchParams = {},
  allFiltersValues,
  allData,
  className,
}: {
  // searchParams?: SearchParams
  allFiltersValues: AllFiltersValues
  allData?: Student[]
  className?: string
}) {
  return (
    <ScrollArea
      className={cn(
        'h-full rounded-md bg-card lg:h-[75vh] lg:border lg:shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col items-start justify-start gap-y-4 p-1 text-xs lg:px-3 lg:py-4 lg:text-sm">
        <div className="mb-6 hidden w-1/2 items-center justify-start gap-6 px-2 lg:flex">
          <ListFilter size={16} className="min-w-6" />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Filtros
          </h4>
        </div>
        {/* <CalifParcialesFilter searchParams={searchParams} /> */}
        {/* <CursosFilter searchParams={searchParams} data={allData} /> */}
        {/* <MateriasFilter searchParams={searchParams} data={allData} /> */}
        {/* <CantidadesFilter searchParams={searchParams} data={allData} /> */}
        {/* <RepitenciaFiltering searchParams={searchParams} data={allData} /> */}
        {/* <ProyeccionFilter searchParams={searchParams} data={allData} /> */}
        <CursosFilter2 allFiltersValues={allFiltersValues} allData={allData} />
      </div>
    </ScrollArea>
  )
}

export default FiltersPanel

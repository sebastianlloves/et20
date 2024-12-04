import { ScrollArea } from '@/components/ui/scroll-area'
import { ListFilter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Student } from '@/lib/definitions'
import { CursosFilter } from './cursos/cursos-filter'
import { FiltersValues } from '../../utils/definitions'
import { getUniqueValuesModel } from '../../utils/dataOperations'
import ProyeccionFilter from './proyeccion/proyeccion-filter'
import CalifParcialesFilter from './calif-parciales/calif-parciales-filter'
import RepitenciaFilter from './repitencia/repitencia-filter'
import CantidadesFilter from './cantidades/cantidades-filter'
import MateriasFilter from './materias/materias-filter'

function FiltersPanel({
  allFiltersValues,
  uniqueValuesModel,
  className,
  allData,
}: {
  allFiltersValues: FiltersValues
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
  className?: string
  allData?: Student[]
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
        <CalifParcialesFilter allFiltersValues={allFiltersValues} />
        <CursosFilter
          allFiltersValues={allFiltersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
        <MateriasFilter
          allFiltersValues={allFiltersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
        <CantidadesFilter
          allFiltersValues={allFiltersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
        <RepitenciaFilter
          allFiltersValues={allFiltersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
        <ProyeccionFilter
          allFiltersValues={allFiltersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
      </div>
    </ScrollArea>
  )
}

export default FiltersPanel

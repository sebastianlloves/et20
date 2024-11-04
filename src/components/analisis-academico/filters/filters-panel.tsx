import { ScrollArea } from '@/components/ui/scroll-area'
import { ListFilter } from 'lucide-react'
import { SearchParams } from '../../../app/analisis-academico/page'
import CursosFilter from './cursos-filter'
import MateriasFilter from './materias-filter'
import { Student } from '@/lib/definitions'
import { getStudentsUniqueValues } from '@/lib/data'
import CantidadesFilter from './cantidades-filter'
import { cn, FILTERS_FNS } from '@/lib/utils'
import RepitenciaFilter from './repitencia-filter'
import CalifParcialesFilter from './calif-parciales-filter'
import ProyeccionFilter from './proyeccion-filter'
// import Filter from './filter'

function FiltersPanel({
  filterParams = {},
  data,
  className,
}: {
  filterParams?: Omit<SearchParams, 'anio'>
  data?: Student[]
  className?: string
}) {
  const cursosUniqueValues =
    data && getStudentsUniqueValues(data, filterParams, 'cursos')
  const materiasUniqueValues =
    data &&
    getStudentsUniqueValues(
      data,
      filterParams,
      'materias',
      filterParams.inclusionEstricta === 'true',
    )
  const proyeccionUniqueValues =
    data && getStudentsUniqueValues(data, filterParams, 'proyeccion')
  const cantidadesUniqueValues =
    data && getStudentsUniqueValues(data, filterParams, 'cantidades', true)
  const cantidadesMinMaxValues =
    data && FILTERS_FNS.cantidades.getMinMaxCant(data)
  const repitenciaAniosUniqueValues =
    data &&
    getStudentsUniqueValues(
      data,
      {
        ...filterParams,
        repitenciaAnios: undefined,
      },
      'repitencia',
      true,
    )
  const repitenciaCantUniqueValues =
    data &&
    getStudentsUniqueValues(
      data,
      {
        ...filterParams,
        repitenciaCant: undefined,
      },
      'repitencia',
      true,
    )
  const repitenciaCantMinMaxValues =
    data && FILTERS_FNS.repitencia.getMinMaxCant(data)

  return (
    <ScrollArea
      className={cn(
        'h-full rounded-md bg-card lg:h-[75vh] lg:border lg:shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col items-start justify-start gap-y-4 p-1 text-xs lg:px-2 lg:py-4 lg:text-sm">
        <div className="mb-6 hidden w-1/2 items-center justify-start gap-6 px-2 lg:flex">
          <ListFilter size={16} className="min-w-6" />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Filtros
          </h4>
        </div>
        <CalifParcialesFilter />
        <CursosFilter uniqueValues={cursosUniqueValues} />
        <MateriasFilter materiasUniqueValues={materiasUniqueValues} />
        <CantidadesFilter
          cantidadesUniqueValues={cantidadesUniqueValues}
          cantidadesMinMaxValues={cantidadesMinMaxValues}
        />
        <RepitenciaFilter
          repitenciaAniosUniqueValues={repitenciaAniosUniqueValues}
          repitenciaCantUniqueValues={repitenciaCantUniqueValues}
          repitenciaCantMinMaxValues={repitenciaCantMinMaxValues}
        />
        <ProyeccionFilter uniqueValues={proyeccionUniqueValues} />
      </div>
    </ScrollArea>
  )
}

export default FiltersPanel

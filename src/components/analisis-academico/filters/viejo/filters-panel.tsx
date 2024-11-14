import { ScrollArea } from '@/components/ui/scroll-area'
import { ListFilter } from 'lucide-react'
import { SearchParams } from '../../../../app/analisis-academico/page'
import MateriasFilter from '../inputs/materias-filter'
import { Student } from '@/lib/definitions'
import CantidadesFilter from './cantidades-filter'
import CantidadesFiltering from '../inputs/cantidades-filter'
import { cn } from '@/lib/utils'
import RepitenciaFilter from './repitencia-filter'
import CalifParcialesFilter from '../inputs/calif-parciales'

import ProyeccionFilter from './proyeccion-filter'
import {
  FILTERS_FNS,
  getStudentsUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import CursosFilter from '../inputs/cursos-filter'

function FiltersPanel({
  searchParams = {},
  data,
  className,
}: {
  searchParams?: SearchParams
  data?: Student[]
  className?: string
}) {
  const proyeccionUniqueValues =
    data && getStudentsUniqueValues(data, searchParams, 'proyeccion')
  const cantidadesUniqueValues =
    data && getStudentsUniqueValues(data, searchParams, 'cantidades', true)
  const cantidadesMinMaxValues =
    data && FILTERS_FNS.cantidades.getMinMaxCant(data)
  const repitenciaAniosUniqueValues =
    data &&
    getStudentsUniqueValues(
      data,
      {
        ...searchParams,
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
        ...searchParams,
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
      <div className="flex flex-col items-start justify-start gap-y-4 p-1 text-xs lg:px-3 lg:py-4 lg:text-sm">
        <div className="mb-6 hidden w-1/2 items-center justify-start gap-6 px-2 lg:flex">
          <ListFilter size={16} className="min-w-6" />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Filtros
          </h4>
        </div>
        <CalifParcialesFilter searchParams={searchParams} />
        <CursosFilter searchParams={searchParams} data={data} />
        <MateriasFilter searchParams={searchParams} data={data} />
        <CantidadesFilter
          cantidadesUniqueValues={cantidadesUniqueValues}
          cantidadesMinMaxValues={cantidadesMinMaxValues}
        />
        <CantidadesFiltering searchParams={searchParams} data={data} />
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

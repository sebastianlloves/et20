import { ScrollArea } from '@/components/ui/scroll-area'
import { ListFilter } from 'lucide-react'
import { SearchParams } from '../../page'
import CursosFilter from './cursos-filter'
import PromocionFilter from './promocion-filter'
import MateriasFilter from './materias-filter'
import { Student } from '@/lib/definitions'
import { getStudentsUniqueValues } from '@/lib/data'
import CantidadesFilter from './cantidades-filter'
import { FILTERS_FNS } from '@/lib/utils'
import RepitenciaFilter from './repitencia-filter'

function FiltersPanel({
  filterParams = {},
  data,
}: {
  filterParams?: Omit<SearchParams, 'anio'>
  data?: Student[]
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
  const promocionUniqueValues =
    data && getStudentsUniqueValues(data, filterParams, 'promocion')
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
    <ScrollArea className="h-[80vh] rounded-md border bg-card shadow-sm">
      <div className="flex flex-col items-start justify-start gap-y-4 px-2 py-4">
        <div className="mb-6 flex w-1/2 items-center justify-start gap-6 px-2">
          <ListFilter size={16} className="min-w-6" />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Filtros
          </h4>
        </div>
        <CursosFilter uniqueValues={cursosUniqueValues} />
        <MateriasFilter materiasUniqueValues={materiasUniqueValues} />
        <CantidadesFilter
          cantidadesUniqueValues={cantidadesUniqueValues}
          cantidadesMinMaxValues={cantidadesMinMaxValues}
        />
        <PromocionFilter uniqueValues={promocionUniqueValues} />
        <RepitenciaFilter
          repitenciaAniosUniqueValues={repitenciaAniosUniqueValues}
          repitenciaCantUniqueValues={repitenciaCantUniqueValues}
          repitenciaCantMinMaxValues={repitenciaCantMinMaxValues}
        />
      </div>
    </ScrollArea>
  )
}

export default FiltersPanel

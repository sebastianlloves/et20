import {
  fetchCalificacionesActuales,
  fetchCalificacionesHistoricas,
} from '@/lib/data'
import FiltersPanel from './filters/filters-panel'
import FiltersPanelMobile from './filters/filters-panel-mobile'
import { getPagination, isValidInstancia } from '@/lib/utils'
import TablePagination from './table-pagination'
import { ANIO_ACTUAL } from '@/lib/constants'
import {
  getFilteredStudents,
  getSortedData,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  MAX_BUTTONS_PAGINATION,
  ROWS_COUNT,
} from '@/app/analisis-academico/utils/constants'
import { projectCalifActuales } from '@/lib/dataOperations'
import { columns } from '@/app/analisis-academico/columns'
import { ParamsValues, SearchParams } from '../page'
import DataTable from '@/components/ui/data-table'

export default async function StudentsTable({
  searchParams,
  paramsValues,
}: {
  searchParams: SearchParams
  paramsValues: ParamsValues
}) {
  console.time('fetching + paginación en students-table')
  const {
    anio: anioParam,
    califParciales: califParcialesParam,
    page,
    sort: sortParam,
  } = paramsValues
  const anio = (typeof anioParam === 'string' && anioParam) || `${ANIO_ACTUAL}`
  const califHistoricas = await fetchCalificacionesHistoricas(anio)
  let allData

  if (
    typeof califParcialesParam === 'string' &&
    isValidInstancia(califParcialesParam)
  ) {
    const califActuales = await fetchCalificacionesActuales(anio)
    allData = projectCalifActuales(
      califHistoricas,
      califActuales,
      califParcialesParam,
    )
  } else allData = califHistoricas

  console.time('Tiempo de filtrado')
  const filteredData = getFilteredStudents(allData, paramsValues)
  console.timeEnd('Tiempo de filtrado')
  const sortedData =
    typeof sortParam === 'string'
      ? getSortedData(filteredData, sortParam)
      : filteredData

  const { paginatedData, ...paginationUtils } = getPagination(
    ROWS_COUNT,
    MAX_BUTTONS_PAGINATION,
    typeof page === 'string' ? page : undefined,
    sortedData,
  )
  console.timeEnd('fetching + paginación en students-table')

  return (
    <>
      <FiltersPanelMobile
        searchParams={searchParams}
        data={allData}
        className="block lg:hidden"
      />
      <FiltersPanel
        searchParams={searchParams}
        data={allData}
        className="hidden lg:block"
      />
      <DataTable columns={columns} data={paginatedData} />
      <TablePagination
        paginationUtils={paginationUtils}
        searchParams={searchParams}
      />
    </>
  )
}

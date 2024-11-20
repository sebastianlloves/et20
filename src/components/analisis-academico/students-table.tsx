import {
  fetchCalificacionesActuales,
  fetchCalificacionesHistoricas,
} from '@/lib/data'
import DataTable from '../ui/data-table'
import { columns } from '../../app/analisis-academico/columns'
import { SearchParams } from '../../app/analisis-academico/page'
import FiltersPanel from './filters/filters-panel'
import FiltersPanelMobile from './filters/viejo/filters-panel-mobile'
import { getPagination, isValidInstancia } from '@/lib/utils'
import TablePagination from './table-pagination'
import { ANIO_ACTUAL } from '@/lib/constants'
import {
  getFilteredStudentData,
  getSortedData,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  MAX_BUTTONS_PAGINATION,
  ROWS_COUNT,
} from '@/app/analisis-academico/utils/constants'
import { projectCalifActuales } from '@/lib/dataOperations'

export default async function StudentsTable({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  console.time('fetching + paginación en students-table')
  const {
    anio: anioParam,
    califParciales: califParcialesParam,
    page,
    sort: sortParam,
    ...filterParams
  } = searchParams
  const anio = anioParam || `${ANIO_ACTUAL}`
  const califHistoricas = await fetchCalificacionesHistoricas(anio)
  let allData

  if (califParcialesParam && isValidInstancia(califParcialesParam)) {
    // console.time('Tiempo proyeción')
    const califActuales = await fetchCalificacionesActuales(anio)
    allData = projectCalifActuales(
      califHistoricas,
      califActuales,
      califParcialesParam,
    )
    // console.timeEnd('Tiempo proyeción')
  } else allData = califHistoricas

  console.time('Tiempo de filtrado')
  const filteredData = getFilteredStudentData(allData, filterParams)
  console.timeEnd('Tiempo de filtrado')
  const sortedData = sortParam
    ? getSortedData(filteredData, sortParam)
    : filteredData

  const { paginatedData, ...paginationUtils } = getPagination(
    ROWS_COUNT,
    MAX_BUTTONS_PAGINATION,
    page,
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

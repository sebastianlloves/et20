import {
  fetchCalificacionesActuales,
  fetchCalificacionesHistoricas,
  getFilteredStudentData,
  getPagination,
  getSortedData,
  projectCalifActuales,
} from '@/lib/data'
import DataTable from '../ui/data-table'
import { columns } from '../../app/analisis-academico/columns'
import { SearchParams } from '../../app/analisis-academico/page'
import FiltersPanel from './filters/filters-panel'
import FiltersPanelMobile from './filters/filters-panel-mobile'
import { isValidInstancia } from '@/lib/utils'
import TablePagination from './table-pagination'

const ROWS_COUNT = 50

export default async function StudentsTable({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  console.time('fetching + paginación en students-table')
  const {
    anio,
    califParciales: califParcialesParam,
    page,
    sort,
    ...filterParams
  } = searchParams
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

  const filteredData = getFilteredStudentData(allData, filterParams)
  const sortedData = sort ? getSortedData(filteredData, sort) : filteredData

  const { paginatedData, ...paginationUtils } = getPagination(
    sortedData,
    ROWS_COUNT,
    page,
  )
  console.timeEnd('fetching + paginación en students-table')

  return (
    <>
      <FiltersPanelMobile
        filterParams={filterParams}
        data={allData}
        className="block lg:hidden"
      />
      <FiltersPanel
        filterParams={filterParams}
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

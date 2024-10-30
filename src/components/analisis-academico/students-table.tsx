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
  const { anio, proyeccion, page, sort, ...filterParams } = searchParams
  const califHistoricas = await fetchCalificacionesHistoricas(anio)
  let data

  if (proyeccion && isValidInstancia(proyeccion)) {
    console.time('Tiempo proyeción')
    const califActuales = await fetchCalificacionesActuales(anio)
    data = projectCalifActuales(califHistoricas, califActuales, proyeccion)
    console.timeEnd('Tiempo proyeción')
  } else data = califHistoricas

  const filteredData = getFilteredStudentData(data, filterParams)
  if (sort) data = getSortedData(filteredData, sort)

  const { paginatedData, ...paginationUtils } = getPagination(
    filteredData,
    ROWS_COUNT,
    page,
  )

  return (
    <>
      <FiltersPanelMobile
        filterParams={filterParams}
        data={data}
        className="block lg:hidden"
      />
      <FiltersPanel
        filterParams={filterParams}
        data={data}
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

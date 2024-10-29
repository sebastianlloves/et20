import {
  fetchCalificacionesActuales,
  fetchStudentsData,
  getFilteredStudentData,
  getPagination,
  getSortedData,
  projectCalifActuales,
} from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { SearchParams } from '../page'
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
  const { anio, proyeccion, page, ...filterParams } = searchParams
  let data = await fetchStudentsData(anio)

  if (proyeccion && isValidInstancia(proyeccion)) {
    console.time('Tiempo proyeción')
    const califActuales = await fetchCalificacionesActuales(data, anio)
    data = projectCalifActuales(data, califActuales, proyeccion)
    console.timeEnd('Tiempo proyeción')
  }
  const filteredData = getFilteredStudentData(data, filterParams)
  const sortedData = getSortedData(filteredData, searchParams.sort)
  // console.log(sortedData)

  const { paginatedData, ...paginationUtils } = getPagination(
    filteredData,
    ROWS_COUNT,
    page,
  )

  return (
    <>
      <FiltersPanelMobile>
        <FiltersPanel filterParams={filterParams} data={data} />
      </FiltersPanelMobile>
      <div className="hidden lg:block">
        <FiltersPanel filterParams={filterParams} data={data} />
      </div>
      <DataTable columns={columns} data={paginatedData} />
      <TablePagination
        paginationUtils={paginationUtils}
        searchParams={searchParams}
      />
    </>
  )
}

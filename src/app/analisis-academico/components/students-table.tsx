import FiltersPanel from './filters/filters-panel'
import FiltersResponsiveWrapper from './filters/filters-responsive-wrapper'
import { getPagination } from '@/lib/utils'
import TablePagination from './table-pagination'
import {
  getAllData,
  getFilteredStudents,
  getSortedData,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  MAX_BUTTONS_PAGINATION,
  ROWS_COUNT,
} from '@/app/analisis-academico/utils/constants'
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
  console.time('fetching + filtrado + sorting + paginación en students-table')

  console.time('Tiempo getAllData en students-table')
  const allData = await getAllData(
    paramsValues.anio,
    paramsValues.califParciales,
  )
  console.timeEnd('Tiempo getAllData en students-table')

  console.time('Tiempo de filtrado')
  const filteredData = getFilteredStudents(allData, paramsValues)
  console.timeEnd('Tiempo de filtrado')

  const sortedData = Array.isArray(paramsValues.sort)
    ? getSortedData(filteredData, paramsValues.sort)
    : filteredData

  const { paginatedData, ...paginationUtils } = getPagination(
    ROWS_COUNT,
    MAX_BUTTONS_PAGINATION,
    typeof paramsValues.page === 'string' ? paramsValues.page : undefined,
    sortedData,
  )
  console.timeEnd(
    'fetching + filtrado + sorting + paginación en students-table',
  )

  return (
    <>
      <FiltersResponsiveWrapper className="block lg:hidden">
        <FiltersPanel
          paramsValues={paramsValues}
          searchParams={searchParams}
          allData={allData}
        />
      </FiltersResponsiveWrapper>
      <FiltersPanel
        paramsValues={paramsValues}
        searchParams={searchParams}
        allData={allData}
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

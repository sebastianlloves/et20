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
import DataTable from '@/components/ui/data-table'
import { AllFiltersValues, SearchParams } from '../utils/definitions'

export default async function StudentsTable({
  searchParams,
  allFiltersValues,
}: {
  searchParams: SearchParams
  allFiltersValues: AllFiltersValues
}) {
  console.time('fetching + filtrado + sorting + paginación en students-table')

  console.time('Tiempo getAllData en students-table')
  const allData = await getAllData(
    allFiltersValues.anio,
    allFiltersValues.califParciales,
  )
  console.timeEnd('Tiempo getAllData en students-table')

  console.time('Tiempo de filtrado')
  const filteredData = getFilteredStudents(allData, allFiltersValues)
  console.timeEnd('Tiempo de filtrado')

  const sortedData = Array.isArray(allFiltersValues.sort)
    ? getSortedData(filteredData, allFiltersValues.sort)
    : filteredData

  const { paginatedData, ...paginationUtils } = getPagination(
    ROWS_COUNT,
    MAX_BUTTONS_PAGINATION,
    typeof allFiltersValues.page === 'string' ? allFiltersValues.page : undefined,
    sortedData,
  )
  console.timeEnd(
    'fetching + filtrado + sorting + paginación en students-table',
  )

  return (
    <>
      <FiltersResponsiveWrapper className="block lg:hidden">
        <FiltersPanel
          allFiltersValues={allFiltersValues}
          searchParams={searchParams}
          allData={allData}
        />
      </FiltersResponsiveWrapper>
      <FiltersPanel
        allFiltersValues={allFiltersValues}
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

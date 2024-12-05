import 'server-only'
import FiltersPanel from './filters-panel'
import FiltersResponsiveWrapper from './filters-responsive-wrapper'
import { getPagination } from '@/lib/utils'
import TablePagination from './table-pagination'
import {
  getAllData,
  getFilteredStudents,
  getSortedData,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  MAX_BUTTONS_PAGINATION,
  ROWS_COUNT,
} from '@/app/analisis-academico/utils/constants'
import { columns } from '@/app/analisis-academico/columns'
import DataTable from '@/components/ui/data-table'
import { FiltersValues } from '../utils/definitions'

export default async function StudentsTable({
  filtersValues,
}: {
  filtersValues: FiltersValues
}) {
  const allData = await getAllData(
    filtersValues.anio,
    filtersValues.califParciales,
  )
  const uniqueValuesModel = getUniqueValuesModel(filtersValues, allData)
  const filteredData = getFilteredStudents(allData, filtersValues)
  const sortedData = getSortedData(filteredData, filtersValues.sort)

  const { paginatedData, ...paginationUtils } = getPagination(
    ROWS_COUNT,
    MAX_BUTTONS_PAGINATION,
    filtersValues.page,
    sortedData,
  )

  return (
    <>
      <FiltersResponsiveWrapper
        allFiltersValues={filtersValues}
        className="block lg:hidden"
      >
        <FiltersPanel
          allFiltersValues={filtersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
      </FiltersResponsiveWrapper>
      <FiltersPanel
        allFiltersValues={filtersValues}
        uniqueValuesModel={uniqueValuesModel}
        className="hidden lg:block"
      />
      <DataTable columns={columns} data={paginatedData} />
      <TablePagination paginationUtils={paginationUtils} />
    </>
  )
}

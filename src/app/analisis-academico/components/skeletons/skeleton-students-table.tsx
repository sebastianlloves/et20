import 'server-only'
import DataTable from '@/components/ui/data-table'
import { getPagination } from '@/lib/utils'
import {
  MAX_BUTTONS_PAGINATION,
  ROWS_COUNT,
} from '@/app/analisis-academico/utils/constants'
import skeletonColumns from './skeleton-columns'
import { FiltersValues } from '../../utils/definitions'
import FiltersResponsiveWrapper from '../filters-responsive-wrapper'
import FiltersPanel from '../filters-panel'
import TablePagination from '../table-pagination'

function SkeletonStudentsTable({
  filtersValues,
}: {
  filtersValues: FiltersValues
}) {
  const { paginatedData: paginatedSkeletonData, ...paginationUtils } =
    getPagination(ROWS_COUNT, MAX_BUTTONS_PAGINATION, filtersValues.page)
  return (
    <>
      <FiltersResponsiveWrapper
        allFiltersValues={filtersValues}
        className="block lg:hidden"
      >
        <FiltersPanel allFiltersValues={filtersValues} />
      </FiltersResponsiveWrapper>
      <FiltersPanel
        allFiltersValues={filtersValues}
        className="hidden lg:block"
      />
      <DataTable columns={skeletonColumns} data={paginatedSkeletonData} />
      <TablePagination paginationUtils={paginationUtils} />
    </>
  )
}

export default SkeletonStudentsTable

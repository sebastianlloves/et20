import FiltersPanel from '../filters/filters-panel'
import DataTable from '@/components/ui/data-table'
import TablePagination from '../table-pagination'
import { getPagination } from '@/lib/utils'
import {
  MAX_BUTTONS_PAGINATION,
  ROWS_COUNT,
} from '@/app/analisis-academico/utils/constants'
import skeletonColumns from './skeleton-columns'
import { AllFiltersValues, SearchParams } from '../../utils/definitions'
import FiltersResponsiveWrapper from '../filters/filters-responsive-wrapper'

interface SkeletonStudentsTableProps {
  searchParams: SearchParams
  allFiltersValues: AllFiltersValues
}

function SkeletonStudentsTable({
  searchParams,
  allFiltersValues,
}: SkeletonStudentsTableProps) {
  const pageParam = searchParams.page
  const { paginatedData: paginatedSkeletonData, ...paginationUtils } =
    getPagination(ROWS_COUNT, MAX_BUTTONS_PAGINATION, pageParam)
  return (
    <>
      <FiltersResponsiveWrapper className="block lg:hidden">
        <FiltersPanel
          allFiltersValues={allFiltersValues}
          searchParams={searchParams}
        />
      </FiltersResponsiveWrapper>
      <FiltersPanel
        allFiltersValues={allFiltersValues}
        searchParams={searchParams}
        className="hidden lg:block"
      />
      <DataTable columns={skeletonColumns} data={paginatedSkeletonData} />
      <TablePagination
        paginationUtils={paginationUtils}
        searchParams={searchParams}
      />
    </>
  )
}

export default SkeletonStudentsTable

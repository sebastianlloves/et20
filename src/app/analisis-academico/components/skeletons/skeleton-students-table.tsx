import FiltersPanel from '../filters/filters-panel'
import DataTable from '@/components/ui/data-table'
import FiltersPanelMobile from '../filters/filters-panel-mobile'
import TablePagination from '../table-pagination'
import { getPagination } from '@/lib/utils'
import {
  MAX_BUTTONS_PAGINATION,
  ROWS_COUNT,
} from '@/app/analisis-academico/utils/constants'
import skeletonColumns from './skeleton-columns'
import { SearchParams } from '../../page'

interface SkeletonStudentsTableProps {
  searchParams: SearchParams
}

function SkeletonStudentsTable({ searchParams }: SkeletonStudentsTableProps) {
  const pageParam = searchParams.page
  const { paginatedData: paginatedSkeletonData, ...paginationUtils } =
    getPagination(ROWS_COUNT, MAX_BUTTONS_PAGINATION, pageParam)
  return (
    <>
      <FiltersPanelMobile
        searchParams={searchParams}
        className="block lg:hidden"
      />
      <FiltersPanel searchParams={searchParams} className="hidden lg:block" />
      <DataTable columns={skeletonColumns} data={paginatedSkeletonData} />
      <TablePagination
        paginationUtils={paginationUtils}
        searchParams={searchParams}
      />
    </>
  )
}

export default SkeletonStudentsTable

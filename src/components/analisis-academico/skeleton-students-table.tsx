'use client'

import { Column } from '@tanstack/react-table'
import { Student } from '@/lib/definitions'
import { Skeleton } from '@/components/ui/skeleton'
import { columns } from '../../app/analisis-academico/columns'
import FiltersPanel from './filters/filters-panel'
import DataTable from '@/components/ui/data-table'
import FiltersPanelMobile from './filters/filters-panel-mobile'
import TablePagination from './table-pagination'
import { SearchParams } from '../../app/analisis-academico/page'
import { getPagination } from '@/lib/utils'
import { MAX_BUTTONS_PAGINATION, ROWS_COUNT } from '@/app/analisis-academico/utils/constants'

interface SkeletonStudentsTableProps {
  searchParams: SearchParams
}

function SkeletonStudentsTable({ searchParams }: SkeletonStudentsTableProps) {
  const skeletonColumns = columns.map((column) => {
    return {
      ...column,
      cell: ({ column }: { column: Column<Student> }) => (
        <div
          className={`flex h-10 items-center ${column.columnDef.meta?.align === 'right' ? 'justify-end' : 'justify-start'}`}
        >
          <Skeleton className="h-2 w-full rounded-full bg-primary/30" />
        </div>
      ),
    }
  })
  const pageParam = searchParams.page
  const { paginatedData: paginatedSkeletonData, ...paginationUtils } = getPagination(
    ROWS_COUNT,
    MAX_BUTTONS_PAGINATION,
    pageParam,
  )
  return (
    <>
      <FiltersPanelMobile className="block lg:hidden" />
      <FiltersPanel className="hidden lg:block" />
      <DataTable columns={skeletonColumns} data={paginatedSkeletonData} />
      <TablePagination
        paginationUtils={paginationUtils}
        searchParams={searchParams}
      />
    </>
  )
}

export default SkeletonStudentsTable

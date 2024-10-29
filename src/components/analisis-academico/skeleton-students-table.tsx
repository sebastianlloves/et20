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

interface SkeletonStudentsTableProps {
  searchParams: SearchParams
}

function SkeletonStudentsTable({ searchParams }: SkeletonStudentsTableProps) {
  const skeletonData = Array(30).fill({})
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
  const [currentPage, lastPage] =
    searchParams?.page?.split('_').map((value) => Number(value)) || []

  return (
    <>
      <FiltersPanelMobile className="block lg:hidden" />
      <FiltersPanel className="hidden lg:block" />
      <DataTable columns={skeletonColumns} data={skeletonData} />
      <TablePagination
        paginationUtils={{ currentPage, lastPage, totalSize: undefined }}
        searchParams={searchParams}
      />
    </>
  )
}

export default SkeletonStudentsTable

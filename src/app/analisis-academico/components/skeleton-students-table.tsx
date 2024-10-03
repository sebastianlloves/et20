'use client'

import { Column } from '@tanstack/react-table'
import { Student } from '@/lib/definitions'
import { Skeleton } from '@/components/ui/skeleton'
import { columns } from './columns'
import FiltersPanel from './filters/filters-panel'
import DataTable from '@/components/ui/data-table'
import FiltersPanelMobile from './filters/filters-panel-mobile'

function SkeletonStudentsTable() {
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

  return (
    <>
      <FiltersPanelMobile>
        <FiltersPanel />
      </FiltersPanelMobile>
      <div className="hidden lg:block">
        <FiltersPanel />
      </div>
      <DataTable columns={skeletonColumns} data={skeletonData} />
    </>
  )
}

export default SkeletonStudentsTable

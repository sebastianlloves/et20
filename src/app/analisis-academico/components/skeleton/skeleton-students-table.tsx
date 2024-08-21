'use client'

import { columns } from '../columns'
import DataTable from '../../../../components/ui/data-table'
import { Column } from '@tanstack/react-table'
import { Student } from '@/lib/definitions'
import { Skeleton } from '@/components/ui/skeleton'

function SkeletonStudentsTable() {
  const skeletonData = Array(30).fill({})
  const skeletonColumns = columns.map((column) => {
    return {
      ...column,
      cell: ({ column }: { column: Column<Student> }) => (
        <div
          className={`flex h-10 items-center ${column.columnDef.meta?.align === 'right' ? 'justify-end' : 'justify-start'}`}
        >
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ),
    }
  })

  return <DataTable columns={skeletonColumns} data={skeletonData} />
}

export default SkeletonStudentsTable

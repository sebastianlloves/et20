'use client'

import { Column } from '@tanstack/react-table'
import { columns } from '../columns'
import { Student } from '@/lib/definitions'
import { Skeleton } from '@/components/ui/skeleton'

export const skeletonColumns = columns.map((column) => {
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

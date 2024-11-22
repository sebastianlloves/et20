'use client'

import { columns } from '@/app/analisis-academico/columns'
import { Skeleton } from '@/components/ui/skeleton'
import { Student } from '@/lib/definitions'
import { Column } from '@tanstack/react-table'

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

export default skeletonColumns

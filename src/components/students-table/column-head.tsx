import { Column } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'

interface ColumnHeadProps<TData, TValue> {
  column: Column<TData, TValue>
  className?: string
}

function ColumnHead<TData, TValue> ({ column, className } : ColumnHeadProps<TData, TValue>) {
  return (
    <Button
      variant='link'
      className={cn('border font-medium text-foreground hover:no-underline px-0', className)}
      onClick={() => column.toggleSorting(undefined, true)}
    >
      {column.columnDef.meta?.title}
      <div className={`mx-2 w-4 h-4 flex justify-center items-center ${column.columnDef.meta?.align === 'right' && 'order-first'}`}>
        {column.getIsSorted() && (
          <ArrowUp className={`w-3 h-4 opacity-50 ${column.getIsSorted() === 'asc' ? '' : 'rotate-180'}`} />
        )}
      </div>
    </Button>
  )
}

export default ColumnHead

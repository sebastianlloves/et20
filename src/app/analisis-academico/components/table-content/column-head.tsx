import { Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ColumnHeadProps<TData, TValue> {
  column: Column<TData, TValue>
  className?: string
}

function ColumnHead<TData, TValue>({
  column,
  className,
}: ColumnHeadProps<TData, TValue>) {
  return (
    <Button
      variant="link"
      className={cn(
        'px-0 font-medium text-foreground hover:no-underline',
        className,
      )}
      onClick={() => column.toggleSorting(undefined, true)}
    >
      {column.columnDef.meta?.title}
      <div
        className={`mx-2 flex h-4 w-4 items-center justify-center ${column.columnDef.meta?.align === 'right' && 'order-first'}`}
      >
        {column.getIsSorted() && (
          <ArrowUp
            className={`h-4 w-3 opacity-50 ${column.getIsSorted() === 'asc' ? '' : 'rotate-180'}`}
          />
        )}
      </div>
    </Button>
  )
}

export default ColumnHead

import { Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useParamsState from '@/hooks/useParamsState'

interface ColumnHeadProps<TData, TValue> {
  column: Column<TData, TValue>
  className?: string
}

function ColumnHead<TData, TValue>({
  column,
  className,
}: ColumnHeadProps<TData, TValue>) {
  const { pathname, searchParams, replace } = useParamsState()
  const allSortingValues =
    searchParams
      .get('sort')
      ?.split('_')
      .map((value) => {
        const [columnId, order] = value.split('-')
        return { columnId, order: order === 'desc' ? order : 'asc' }
      }) || []
  const sortingValue = allSortingValues.find(
    ({ columnId }) => columnId === column.id,
  )

  const updateSortParam = (id: string) => {
    let newSortingValue: {
      columnId: string
      order: string
    }[]
    if (!sortingValue) {
      newSortingValue = [...allSortingValues, { columnId: id, order: 'asc' }]
    } else {
      newSortingValue =
        sortingValue.order === 'desc'
          ? allSortingValues.filter(({ columnId }) => columnId !== id)
          : allSortingValues.map(({ columnId, order }) => {
              return columnId === id
                ? { columnId, order: order === 'asc' ? 'desc' : 'asc' }
                : { columnId, order }
            })
    }
    const formattedValues = newSortingValue
      .map(({ columnId, order }) => `${columnId}-${order}`)
      .join('_')
    formattedValues.length
      ? searchParams.set('sort', formattedValues)
      : searchParams.delete('sort')
    if (searchParams.has('page')) searchParams.delete('page')

    replace(`${pathname}?${searchParams}`)
  }
  // console.log(`sortingValue: ${JSON.stringify(sortingValue)}`)

  return (
    <Button
      variant="link"
      className={cn(
        'px-0 text-[length:inherit] font-medium text-foreground hover:no-underline',
        className,
      )}
      onClick={() => updateSortParam(column.id)}
    >
      {column.columnDef.meta?.title}
      <div
        className={`mx-2 flex h-4 w-4 items-center justify-center ${column.columnDef.meta?.align === 'right' && 'order-first'}`}
      >
        {sortingValue && (
          <ArrowUp
            className={`h-4 w-3 opacity-50 mt-0.5 ${sortingValue.order === 'asc' ? '' : 'rotate-180'}`}
          />
        )}
      </div>
    </Button>
  )
}

export default ColumnHead

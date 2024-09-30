'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
  })

  return (
    <ScrollArea className="scrollArea h-[80vh] w-full rounded-lg border bg-card shadow-sm">
      <Table className="flex w-full flex-col bg-card text-xs lg:text-sm">
        <TableHeader className="sticky top-0 z-20 border-b border-primary/70 shadow-sm shadow-primary/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="flex w-full items-center bg-popover p-0 hover:bg-popover"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    align={header.column.columnDef.meta?.align || 'left'}
                    className={cn(
                      'h-fit bg-inherit px-2.5 py-1 md:px-3.5 lg:px-4 lg:py-2 2xl:px-7',
                      header.column.columnDef.meta?.width,
                      header.column.columnDef.meta?.stickyProperties,
                      header.column.id === 'estudiante' &&
                        'border-r-[0.5px] border-border/80',
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="w-full bg-popover">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="flex bg-inherit px-0 hover:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'bg-inherit px-2.5 md:px-3.5 lg:px-4 lg:py-4 2xl:px-7 border',
                      cell.column.columnDef.meta?.width,
                      cell.column.columnDef.meta?.stickyProperties,
                      cell.column.id === 'estudiante' &&
                        'border-r-[0.5px] border-border/80',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="flex items-center justify-center">
              <TableCell
                colSpan={columns.length}
                className="h-24 py-6 text-center italic text-muted-foreground"
              >
                No hay resultados para la búsqueda realizada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar className="p-0" orientation="vertical" />
      <ScrollBar className="p-0" orientation="horizontal" />
    </ScrollArea>
  )
}

export default DataTable

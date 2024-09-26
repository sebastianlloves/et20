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
    <ScrollArea className="h-[80vh] w-full rounded-lg border bg-card shadow-sm">
      <Table className="flex w-full flex-col bg-card text-xs lg:text-sm">
        <TableHeader className="sticky top-0 z-10 border-b border-primary/70 shadow-sm shadow-primary/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="flex w-full items-center bg-popover p-1 hover:bg-popover lg:p-2"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    align={header.column.columnDef.meta?.align || 'left'}
                    className={cn(
                      'mx-1 h-fit px-0 sm:mx-2 lg:mx-3.5',
                      header.column.columnDef.meta?.width,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="w-full">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="flex px-1.5 lg:px-2"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'mx-1 px-0 sm:mx-2 lg:mx-3.5',
                      cell.column.columnDef.meta?.width,
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

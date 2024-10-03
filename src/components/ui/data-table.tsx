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
import { useState } from 'react'

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

  const [border] = useState(false)

  return (
    <ScrollArea className="scrollArea bg-table-body h-[80vh] w-full rounded-lg border shadow-sm">
      <Table className="bg-table-body flex w-full flex-col text-xs lg:text-sm">
        <TableHeader className="sticky top-0 z-20 border-b border-primary/70 shadow-sm shadow-primary/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="flex w-full items-center bg-table-header p-0 hover:bg-table-header"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    align={header.column.columnDef.meta?.align || 'left'}
                    className={cn(
                      'h-fit bg-inherit p-0',
                      header.column.columnDef.meta?.stickyProperties /* 
                      header.column.id === 'estudiante' &&
                        'border-r-[0.5px] border-border/80', */,
                      border && 'border',
                    )}
                  >
                    <div
                      className={cn(
                        'mx-2 my-1 md:mx-3.5 lg:mx-6 lg:my-2 2xl:mx-7',
                        header.column.columnDef.meta?.width,
                        border && 'border',
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="w-full bg-table-body">
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
                      'bg-inherit p-0',
                      cell.column.columnDef.meta?.stickyProperties /* 
                      cell.column.id === 'estudiante' &&
                        'border-r-[0.5px] border-border/80', */,
                      border && 'border',
                    )}
                  >
                    <div
                      className={cn(
                        'mx-2 my-4 md:mx-3.5 lg:mx-6 lg:my-5 2xl:mx-7',
                        cell.column.columnDef.meta?.width,
                        border && 'border',
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="flex items-center bg-table-body justify-center">
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

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
    manualFiltering: true
  })

  return (
    <div className="h-[80vh] w-full rounded-lg border shadow-sm">
      <ScrollArea className="h-full bg-card">
        <Table className="flex w-full flex-col bg-card">
          <TableHeader className="sticky top-0 z-10 w-full border-b border-primary/70 shadow-sm shadow-primary/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="flex items-center bg-popover p-2 hover:bg-popover"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      align={header.column.columnDef.meta?.align || 'left'}
                      className="h-fit px-0"
                      style={{
                        width: `${header.column.getSize()}px`,
                        marginInline: header.column.getIsPinned()
                          ? '0px'
                          : '15px',
                      }}
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
                  className="flex px-2"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-0"
                      style={{
                        width: `${cell.column.getSize()}px`,
                        marginInline: cell.column.getIsPinned()
                          ? '0px'
                          : '15px',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
    </div>
  )
}

export default DataTable

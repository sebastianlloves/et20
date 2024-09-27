'use client'

import ColumnHead from './table-content/column-head'
import ExpandButton from './table-content/expand-button'
import ExpandableRow from './table-content/expandable-row'
import PromocionContent from './table-content/promocion-content'
import RepitenciaContent from './table-content/repitencia-content'
import { Badge } from '@/components/ui/badge'
import { Student } from '@/lib/definitions'
import { ColumnDef, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string
    width: string
    stickyProperties?: string
    align?: 'right'
  }
}

export const columns: ColumnDef<Student>[] = [
  {
    id: 'expand',
    accessorFn: (row) => [
      ...row.detalleTroncales,
      ...row.detalleGenerales,
      ...row.detalleEnProceso2020,
    ],
    header: ({ table }) => (
      <ExpandButton
        handleClick={() =>
          table.toggleAllRowsExpanded(!table.getIsSomeRowsExpanded())
        }
        isOpen={table.getIsSomeRowsExpanded()}
        className="text-foreground"
      />
    ),
    cell: ({ row, getValue }) => (
      <ExpandButton
        handleClick={() => row.toggleExpanded()}
        isOpen={row.getIsExpanded() && getValue<string[]>().length > 0}
        disabled={getValue<string[]>().length === 0}
        className="text-foreground/80"
      />
    ),
    enableSorting: false,
    meta: {
      title: 'Expandir',
      width: 'w-[40px] lg:w-[52px]',
      stickyProperties: 'left-0 sticky z-10',
    },
  },
  {
    id: 'curso',
    accessorFn: ({ anio, division }) => `${anio} ${division}`,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ getValue }) => (
      <Badge
        variant="outline"
        className="text-nowrap rounded-md px-2 py-[5px] text-[length:inherit] font-medium lg:px-3 lg:py-1.5"
      >
        {getValue<string>()}
      </Badge>
    ),
    sortingFn: 'alphanumeric',
    meta: {
      title: 'Curso',
      width: 'w-[66px] lg:w-[92px]',
      stickyProperties: 'left-[40px] lg:left-[52px] sticky z-10',
    },
  },
  {
    id: 'estudiante',
    accessorFn: (row) => `${row.apellido}, ${row.nombre}`,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row }) => {
      const { apellido, nombre } = row.original
      return (
        <div className="h-full text-pretty">
          <p className="font-medium">{apellido}</p>
          <p className="font-normal text-muted-foreground">{nombre}</p>
        </div>
      )
    },
    meta: {
      title: 'Estudiante',
      width: 'w-24 lg:w-32',
      stickyProperties: 'left-[106px] lg:left-[144px] sticky z-10',
    },
    sortingFn: 'text',
  },
  {
    id: 'dni',
    accessorKey: 'dni',
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row }) => (
      <p className="text-[length:inherit] leading-relaxed text-muted-foreground">
        {row.original.dni}
      </p>
    ),
    meta: {
      title: 'DNI',
      width: 'w-14 lg:w-20',
    },
  },
  {
    id: 'troncales',
    accessorFn: (row) => row.cantTroncales,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row, table }) => (
      <ExpandableRow
        subjects={row.original.detalleTroncales}
        open={table.getIsAllRowsExpanded() || row.getIsExpanded()}
        iconColor="text-destructive dark:text-red-600/80"
      />
    ),
    sortingFn: 'basic',
    meta: {
      title: 'Troncales',
      width: 'w-32 lg:w-44',
    },
  },
  {
    id: 'generales',
    accessorFn: (row) => row.cantGenerales,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row, table }) => (
      <ExpandableRow
        subjects={row.original.detalleGenerales}
        open={table.getIsAllRowsExpanded() || row.getIsExpanded()}
        iconColor="text-amber-600 dark:text-amber-700"
      />
    ),
    sortingFn: 'basic',
    size: 190,
    meta: {
      title: 'Generales',
      width: 'w-32 lg:w-44',
    },
  },
  {
    id: 'enProceso2020',
    accessorFn: (row) => row.cantEnProceso2020,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row, table }) => (
      <ExpandableRow
        subjects={row.original.detalleEnProceso2020}
        open={table.getIsAllRowsExpanded() || row.getIsExpanded()}
        iconColor="text-slate-500 dark:text-slate-500"
      />
    ),
    sortingFn: 'basic',
    size: 190,
    meta: {
      title: 'En Proceso (2020)',
      width: 'w-32 lg:w-44',
    },
  },
  {
    id: 'repitencia',
    accessorKey: 'repitencia',
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ getValue }) => (
      <RepitenciaContent repArray={getValue<string[]>()} />
    ),
    meta: {
      title: 'Repitencia',
      width: 'w-[84px] lg:w-[105px]',
    },
  },
  {
    id: 'promocion',
    accessorFn: (row) => {
      const { cantTroncales, cantGenerales } = row
      if (cantTroncales === null || cantGenerales === null)
        return 'faltan datos'
      return cantTroncales <= 2 && cantTroncales + cantGenerales <= 4
        ? 'promociona'
        : 'permanece'
    },
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ getValue }) => (
      <PromocionContent
        value={getValue<'faltan datos' | 'promociona' | 'permanece'>()}
      />
    ),
    size: 150,
    meta: {
      title: 'Promoción',
      width: 'w-28 lg:w-32',
    },
    sortingFn: 'text',
  },
]

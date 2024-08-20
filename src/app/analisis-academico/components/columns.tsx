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
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string
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
        className="-mt-1.5 text-foreground/80"
      />
    ),
    size: 35,
    enableSorting: false,
    meta: {
      title: 'Expandir',
    },
    enableHiding: false,
  },
  {
    id: 'curso',
    accessorFn: ({ anio, division }) => `${anio} ${division}`,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ getValue }) => (
      <Badge variant="outline" className="text-nowrap rounded-md px-3 py-1.5">
        {getValue<string>()}
      </Badge>
    ),
    size: 100,
    sortingFn: 'alphanumeric',
    filterFn: 'arrIncludes',
    meta: {
      title: 'Curso',
    },
    enableHiding: false,
  },
  {
    id: 'estudiante',
    accessorFn: (row) => `${row.apellido}, ${row.nombre}`,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row }) => {
      const { apellido, nombre } = row.original
      return (
        <div className="h-full text-nowrap">
          <p className="font-medium">{apellido}</p>
          <p className="font-normal text-muted-foreground">{nombre}</p>
        </div>
      )
    },
    meta: {
      title: 'Estudiante',
    },
    sortingFn: 'text',
    size: 180,
    enableHiding: false,
  },
  {
    id: 'dni',
    accessorKey: 'dni',
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row }) => (
      <p className="text-xs leading-relaxed text-muted-foreground">
        {row.original.dni}
      </p>
    ),
    meta: {
      title: 'DNI',
    },
    size: 70,
  },
  {
    id: 'troncales',
    accessorFn: (row) => row.cantTroncales,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row, table }) => (
      <ExpandableRow
        subjects={row.original.detalleTroncales}
        open={table.getIsAllRowsExpanded() || row.getIsExpanded()}
      />
    ),
    sortingFn: 'basic',
    size: 190,
    meta: {
      title: 'Troncales',
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
      />
    ),
    sortingFn: 'basic',
    size: 190,
    meta: {
      title: 'Generales',
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
      />
    ),
    sortingFn: 'basic',
    size: 190,
    meta: {
      title: 'En Proceso (2020)',
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
    },
    sortingFn: 'text',
  },
]

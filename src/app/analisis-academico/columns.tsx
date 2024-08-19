'use client'

import ColumnHead from '@/components/students-table/column-head'
import { Badge } from '@/components/ui/badge'
import { Student } from '@/lib/definitions'
import { ColumnDef, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string,
    align?: 'right'
  }
}

export const columns: ColumnDef<Student>[] = [
  {
    id: 'curso',
    accessorFn: ({ anio, division }) => `${anio} ${division}`,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ cell }) => <Badge variant='outline' className='text-nowrap px-3 py-1 rounded-md'>{cell.getValue<string>()}</Badge>,
    meta: {
      title: 'Curso'
    },
    size: 100,
    sortingFn: 'alphanumeric',
    enableHiding: false
  },
  {
    id: 'estudiante',
    accessorFn: (row) => `${row.apellido}, ${row.nombre}`,
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row }) => {
      const { apellido, nombre } = row.original
      return (
        <div className='h-full text-nowrap'>
          <p className='font-medium'>{apellido}</p>
          <p className='font-normal text-muted-foreground'>{nombre}</p>
        </div>
      )
    },
    meta: {
      title: 'Estudiante'
    },
    sortingFn: 'text',
    size: 180,
    enableHiding: false
  },
  {
    id: 'dni',
    accessorKey: 'dni',
    header: ({ column }) => <ColumnHead column={column} />,
    cell: ({ row }) => <p className='text-xs  text-muted-foreground px-0 mx-0'>{row.original.dni}</p>,
    meta: {
      title: 'DNI'
    }
  }
]

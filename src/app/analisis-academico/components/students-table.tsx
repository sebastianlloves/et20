import { fetchStudentsData } from '@/lib/data'
import DataTable from './data-table'
import { columns } from './columns'

interface StudentsTableProps {
  anio: string
}

export default async function StudentsTable({ anio }: StudentsTableProps) {
  const data = await fetchStudentsData(anio)

  return <DataTable columns={columns} data={data} />
}

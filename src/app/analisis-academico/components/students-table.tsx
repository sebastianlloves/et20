import { fetchStudentsData } from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'

interface StudentsTableProps {
  anio: string
  query?: string
}

export default async function StudentsTable({
  anio,
  query,
}: StudentsTableProps) {
  const data = await fetchStudentsData(anio)
  const filteredData = data.filter((student) => {
    if (query === undefined) return true
    const querys = query.split(' ')
    return querys.every((query) => {
      const formatedQuery = query
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      const formatedApellido = student.apellido?.trim().toLowerCase()
      const formatedNombre = student.nombre?.trim().toLowerCase()
      const formatedDNI = `${student.dni}`.trim().toLowerCase()
      return (
        formatedApellido?.includes(formatedQuery) ||
        formatedNombre?.includes(formatedQuery) ||
        formatedDNI?.includes(formatedQuery)
      )
    })
  })

  return <DataTable columns={columns} data={filteredData} />
}

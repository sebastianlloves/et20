import { fetchStudentsData } from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'

type StudentsTableProps = {
  filters: {
    anio?: string
    query?: string
    cursos?: string[]
  }
}

export default async function StudentsTable({ filters }: StudentsTableProps) {
  const data = await fetchStudentsData(filters?.anio)
  const filteredData = data
    .filter((student) => {
      const query = filters?.query
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
    .filter((student) => {
      if (!filters?.cursos) return true
      return filters.cursos.includes(
        `${student?.anio?.[0]}° ${student?.division?.[0]}°`,
      )
    })

  return <DataTable columns={columns} data={filteredData} />
}

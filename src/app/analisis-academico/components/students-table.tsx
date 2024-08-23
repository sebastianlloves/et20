import { fetchStudentsData } from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { StudentsTableFilters } from '@/lib/definitions'
import { FILTERS_FNS } from '@/lib/constants'

type StudentsTableProps = {
  filters: StudentsTableFilters
}

export default async function StudentsTable({ filters }: StudentsTableProps) {
  const { anio, ...columnsFilters } = filters
  const filterData = Object.entries(columnsFilters).map(([id, value]) => [
    FILTERS_FNS[id as keyof typeof FILTERS_FNS].filterFn,
    value,
  ])
  console.log(filterData)
  const data = await fetchStudentsData(anio)
  const filteredData = data.filter((student) =>
    filterData.every(([fn, value]) => {
      console.log(fn(student, value))
      return fn(student, value)
    }),
  )

  return <DataTable columns={columns} data={filteredData} />
}

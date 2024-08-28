import { fetchStudentsData } from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { StudentsTableFilters } from '@/lib/definitions'
import { FILTERS_FNS } from '@/lib/constants'

export default async function StudentsTable({
  filters,
}: {
  filters: StudentsTableFilters
}) {
  const { anio, ...columnsFilters } = filters
  const filtersData = Object.entries(columnsFilters).map(([id, value]) => {
    return {
      filterFn: FILTERS_FNS[id as keyof typeof FILTERS_FNS].filterFn,
      value,
    }
  })
  const data = await fetchStudentsData(anio)
  const filteredData = data.filter((student) =>
    filtersData.every(({ filterFn, value }) => filterFn(student, value)),
  )

  return <DataTable columns={columns} data={filteredData} />
}

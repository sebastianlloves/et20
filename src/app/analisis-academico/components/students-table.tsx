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
  const data = await fetchStudentsData(anio)
  const filteredData = data.filter((student) =>
    Object.entries(columnsFilters).every(([filterID, filterValue]) =>
      FILTERS_FNS[filterID as keyof typeof FILTERS_FNS].filterFn(
        student,
        filterValue,
      ),
    ),
  )

  return <DataTable columns={columns} data={filteredData} />
}

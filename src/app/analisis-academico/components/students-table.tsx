import { fetchStudentsData } from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { FILTERS_FNS } from '@/lib/constants'
import { SearchParams } from '../page'

export default async function StudentsTable({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { anio, ...filterParams } = searchParams
  const data = await fetchStudentsData(anio)
  const filteredData = data.filter((student) =>
    Object.entries(filterParams).every(([filterName, filterParam]) =>
      FILTERS_FNS[filterName as keyof typeof FILTERS_FNS].filterFn(
        student,
        filterParam,
      ),
    ),
  )

  return <DataTable columns={columns} data={filteredData} />
}

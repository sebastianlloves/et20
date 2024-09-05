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
    Object.keys(filterParams)
      .filter((key) => key !== 'enProceso2020' && key !== 'inclusionEstricta')
      .every((filterName) =>
        FILTERS_FNS[filterName as keyof typeof FILTERS_FNS].filterFn(
          student,
          searchParams,
        ),
      ),
  )

  return <DataTable columns={columns} data={filteredData} />
}

import { fetchStudentsData, getFilteredStudentData } from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { SearchParams } from '../page'
import FiltersPanel from './filters/filters-panel'

export default async function StudentsTable({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { anio, ...filterParams } = searchParams
  const data = await fetchStudentsData(anio)
  const filteredData = getFilteredStudentData(data, filterParams)

  return (
    <>
      <FiltersPanel filterParams={filterParams} data={data} />
      <DataTable columns={columns} data={filteredData} />
    </>
  )
}

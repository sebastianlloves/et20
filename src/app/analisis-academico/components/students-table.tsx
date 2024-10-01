import { fetchStudentsData, getFilteredStudentData } from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { SearchParams } from '../page'
import FiltersPanel from './filters/filters-panel'
import FiltersPanelMobile from './filters/filters-panel-mobile'
import SearchBar from './filters/search-bar'
import ToggleDB from './toggle-db'

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
      <FiltersPanelMobile>
        <div className="flex flex-col gap-10">
          <ToggleDB />
          <SearchBar />
          <FiltersPanel filterParams={filterParams} data={data} />
        </div>
      </FiltersPanelMobile>
      <div className="hidden lg:block">
        <FiltersPanel filterParams={filterParams} data={data} />
      </div>
      <DataTable columns={columns} data={filteredData} />
    </>
  )
}

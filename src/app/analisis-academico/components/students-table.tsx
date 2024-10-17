import {
  fetchCalificacionesActuales,
  fetchStudentsData,
  getFilteredStudentData,
} from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { SearchParams } from '../page'
import FiltersPanel from './filters/filters-panel'
import FiltersPanelMobile from './filters/filters-panel-mobile'

export default async function StudentsTable({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { anio, ...filterParams } = searchParams
  const data = await fetchStudentsData(anio)
  const filteredData = getFilteredStudentData(data, filterParams)

  console.time(`console time ejecución Promise.all`)
  const califActuales = await fetchCalificacionesActuales(filteredData)
  console.timeEnd(`console time ejecución Promise.all`)
  // console.log(califActuales.map(obj => obj.apellido))

  return (
    <>
      <FiltersPanelMobile>
        <FiltersPanel filterParams={filterParams} data={data} />
      </FiltersPanelMobile>
      <div className="hidden lg:block">
        <FiltersPanel filterParams={filterParams} data={data} />
      </div>

      <div>
        {/* {calificacionesActuales.map((row, index) => (
          <p key={index}>{JSON.stringify(row)}</p>
        ))} */}
        <DataTable columns={columns} data={filteredData} />
      </div>
    </>
  )
}

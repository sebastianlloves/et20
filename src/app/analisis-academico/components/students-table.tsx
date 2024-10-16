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
  const startTime = Date.now()
  await Promise.all(
    ['1° 1°', '1° 2°'].map((curso) => fetchCalificacionesActuales(curso)),
  )
  const endTime = Date.now() // Fin del tiempo
  console.log(`Tiempo de ejecución Promise.all: ${endTime - startTime} ms`)

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

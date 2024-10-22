import {
  fetchCalificacionesActuales,
  fetchStudentsData,
  getFilteredStudentData,
  projectCalifActuales,
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
  const includeCalifActuales = true
  const data = await fetchStudentsData(anio)
  const filteredData = getFilteredStudentData(data, filterParams)

  if (includeCalifActuales) {
    console.time('Tiempo proyeción')
    const califActuales = await fetchCalificacionesActuales(filteredData)
    // Reemplazar filteredData en vez de crear una nueva constante
    const testingFilteredData = projectCalifActuales(
      filteredData,
      califActuales,
      'primerCuatrimeste',
    )
    console.timeEnd('Tiempo proyeción')
    /* console.log(
    califActuales.map(({ dni, materias }) => {
      return { dni, materias: JSON.stringify(materias) }
    })) */
    console.log(testingFilteredData)
  }

  return (
    <>
      <FiltersPanelMobile>
        <FiltersPanel filterParams={filterParams} data={data} />
      </FiltersPanelMobile>
      <div className="hidden lg:block">
        <FiltersPanel filterParams={filterParams} data={data} />
      </div>

      <div className='w-full'>
        {/* {calificacionesActuales.map((row, index) => (
          <p key={index}>{JSON.stringify(row)}</p>
        ))} */}
        <DataTable columns={columns} data={filteredData} />
      </div>
    </>
  )
}

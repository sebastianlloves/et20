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
import { INSTANCIAS_ANIO } from '@/lib/constants'

export default async function StudentsTable({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { anio, proyeccion, ...filterParams } = searchParams
  let data = await fetchStudentsData(anio)

  if (proyeccion && isValidInstancia(proyeccion)) {
    console.time('Tiempo proyeción')
    const califActuales = await fetchCalificacionesActuales(data, anio)
    // Reemplazar filteredData en vez de crear una nueva constante
    data = projectCalifActuales(data, califActuales, proyeccion)
    // const testingFilteredData = projectCalifActuales(
    //   filteredData,
    //   califActuales,
    //   'primerCuatrimeste',
    // )
    // console.log(
    //   JSON.stringify(testingFilteredData.find(({ dni }) => dni === 50156849)),
    // )
    console.timeEnd('Tiempo proyeción')
  }
  const filteredData = getFilteredStudentData(data, filterParams)

  return (
    <>
      <FiltersPanelMobile>
        <FiltersPanel filterParams={filterParams} data={data} />
      </FiltersPanelMobile>
      <div className="hidden lg:block">
        <FiltersPanel filterParams={filterParams} data={data} />
      </div>
      <DataTable columns={columns} data={filteredData} />
    </>
  )
}

function isValidInstancia(
  instancia: string,
): instancia is (typeof INSTANCIAS_ANIO)[number] {
  return (
    instancia === 'acreditacion' ||
    INSTANCIAS_ANIO.includes(instancia as (typeof INSTANCIAS_ANIO)[number])
  )
}

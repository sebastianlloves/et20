import {
  fetchCalificacionesActuales,
  fetchStudentsData,
  getFilteredStudentData,
  getPagination,
  projectCalifActuales,
} from '@/lib/data'
import DataTable from '../../../components/ui/data-table'
import { columns } from './columns'
import { SearchParams } from '../page'
import FiltersPanel from './filters/filters-panel'
import FiltersPanelMobile from './filters/filters-panel-mobile'
import { isValidInstancia } from '@/lib/utils'
import TablePagination from './table-pagination'

const ROWS_COUNT = 50

export default async function StudentsTable({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { anio, proyeccion, page, ...filterParams } = searchParams
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

  console.time('Paginación')
  const { data: paginatedData, ...paginationUtils } = getPagination(
    filteredData,
    ROWS_COUNT,
    page,
  )
  console.timeEnd('Paginación')

  return (
    <>
      <FiltersPanelMobile>
        <FiltersPanel filterParams={filterParams} data={data} />
      </FiltersPanelMobile>
      <div className="hidden lg:block">
        <FiltersPanel filterParams={filterParams} data={data} />
      </div>
      <DataTable columns={columns} data={paginatedData} />
      <TablePagination paginationUtils={paginationUtils} />
    </>
  )
}

import { ParamsValues } from '@/app/analisis-academico/page'
import {
  getGrupalItemData,
  getQuantity,
  getUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import { Users } from 'lucide-react'
import { CURSOS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import Filter from '../filter'
import { CursosFilterContent } from './cursos-filter-client'
import { Student } from '@/lib/definitions'

export async function CursosFilter({
  paramsValues = {},
  allData,
}: {
  paramsValues: ParamsValues
  allData?: Student[]
}) {
  const uniqueValues =
    allData && getUniqueValues(allData, paramsValues, 'cursos')
  const filterValue =
    !paramsValues.cursos || typeof paramsValues.cursos === 'string'
      ? []
      : paramsValues.cursos
  const filterTags = filterValue.map((value) => {
    const tagText = value
    const quantity = getQuantity(value, uniqueValues)
    return { value, tagText, quantity, newQueryState: '' }
  })

  const todosManiana = CURSOS_ITEMS_DATA.flatMap(
    ({ turnoManiana }) => turnoManiana,
  )
  const todosManianaData = getGrupalItemData(
    todosManiana,
    filterValue,
    uniqueValues,
  )
  const todosTarde = CURSOS_ITEMS_DATA.flatMap(({ turnoTarde }) => turnoTarde)
  const todosTardeData = getGrupalItemData(
    todosTarde,
    filterValue,
    uniqueValues,
  )

  const todosCB = CURSOS_ITEMS_DATA.flatMap(({ cursosCB }) => cursosCB)
  const todosCBData = getGrupalItemData(todosCB, filterValue, uniqueValues)

  const todosTICS = CURSOS_ITEMS_DATA.flatMap(({ cursosTICs }) => cursosTICs)
  const todosTICsData = getGrupalItemData(todosTICS, filterValue, uniqueValues)

  const todosPM = CURSOS_ITEMS_DATA.flatMap(({ cursosPM }) => cursosPM)
  const todosPMData = getGrupalItemData(todosPM, filterValue, uniqueValues)

  return (
    <Filter
      title="Cursos"
      maxTags={3}
      icon={<Users strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
      filterTags={filterTags}
      paramKeys={['cursos']}
    >
      <CursosFilterContent
        cursosItemsData={CURSOS_ITEMS_DATA}
        filterValue={filterValue}
        paramsValues={paramsValues}
        uniqueValues={uniqueValues}
        groupsValuesData={{
          maniana: { ...todosManianaData, todos: todosManiana },
          tarde: { ...todosTardeData, todos: todosTarde },
          CB: { ...todosCBData, todos: todosCB },
          TICs: { ...todosTICsData, todos: todosTICS },
          PM: { ...todosPMData, todos: todosPM },
        }}
      />
    </Filter>
  )
}

export default CursosFilter

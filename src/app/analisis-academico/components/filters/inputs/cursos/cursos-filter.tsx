import 'server-only'

import { ParamsValues } from '@/app/analisis-academico/page'
import {
  getGrupalItemData,
  getQuantity,
  getUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import { Users } from 'lucide-react'
import { CURSOS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import { CursosFilterContent } from './cursos-filter-content'
import { Student } from '@/lib/definitions'
import FilterInput from '../filter-input'
import { updateArrParamState } from '@/app/analisis-academico/utils/urlParamsOperations'

const GROUP_VALUES_KEYS: Array<
  keyof Omit<(typeof CURSOS_ITEMS_DATA)[number], 'anio'>
> = ['maniana', 'tarde', 'cb', 'tics', 'pm', 'todos']

export async function CursosFilter({
  paramsValues = {},
  allData,
}: {
  paramsValues: ParamsValues
  allData?: Student[]
}) {
  const uniqueValues = getUniqueValues(paramsValues, 'cursos', allData)
  const filterValue =
    !paramsValues.cursos || typeof paramsValues.cursos === 'string'
      ? []
      : paramsValues.cursos

  const [maniana, tarde, cb, tics, pm] = GROUP_VALUES_KEYS.map((key) => {
    const todosCursos = CURSOS_ITEMS_DATA.flatMap((data) => data[key])
    const todosData = getGrupalItemData(todosCursos, filterValue, uniqueValues)
    return { ...todosData, value: todosCursos }
  })
  const todosCursosData = { maniana, tarde, cb, tics, pm }

  const cursosAnioData = CURSOS_ITEMS_DATA.map((anioData) => {
    const partialFilterValues = filterValue.filter(
      (curso) => curso[0] === anioData.anio[0],
    )
    const [maniana, tarde, tics, pm, todos] = GROUP_VALUES_KEYS.filter(
      (key) => key !== 'cb',
    ).map((key) => {
      const groupCursos = anioData[key]
      const groupData = getGrupalItemData(
        groupCursos,
        partialFilterValues,
        uniqueValues,
      )
      return { ...groupData, value: groupCursos }
    })
    const cursosAnioItems = anioData.todos.map((curso) => {
      const quantity = getQuantity(curso, uniqueValues)
      const isSelected = filterValue.includes(curso)
      return { value: curso, quantity, isSelected }
    })
    return {
      anio: anioData.anio,
      partialFilterValues,
      cursosAnioItems,
      anioGroupItems: {
        maniana,
        tarde,
        tics,
        pm,
        todos,
      },
    }
  })

  const filterTags = filterValue.map((value) => {
    const tagText = value
    const quantity = getQuantity(value, uniqueValues)
    const removeTagState = {
      ...paramsValues,
      cursos: updateArrParamState(value, filterValue),
    }
    return { value, tagText, quantity, removeTagState }
  })

  return (
    <FilterInput
      title="Cursos"
      maxTags={3}
      icon={<Users strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
      filterTags={filterTags}
      paramKeys={['cursos']}
    >
      <CursosFilterContent
        filterValue={filterValue}
        paramsValues={paramsValues}
        cursosAnioData={cursosAnioData}
        todosValuesData={todosCursosData}
      />
    </FilterInput>
  )
}

export default CursosFilter

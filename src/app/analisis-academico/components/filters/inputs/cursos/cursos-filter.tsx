import 'server-only'

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
import { AllFiltersValues } from '@/app/analisis-academico/utils/definitions'
import { TagsBox } from '../../tags/tags-box'

const GROUP_VALUES_KEYS: Array<
  keyof Omit<(typeof CURSOS_ITEMS_DATA)[number], 'anio'>
> = ['maniana', 'tarde', 'cb', 'tics', 'pm', 'todos']

export async function CursosFilter({
  allFiltersValues = {},
  allData,
}: {
  allFiltersValues: AllFiltersValues
  allData?: Student[]
}) {
  const uniqueValues = getUniqueValues(allFiltersValues, 'cursos', allData)
  const filterValue = allFiltersValues.cursos || []

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
      ...allFiltersValues,
      cursos: updateArrParamState(value, filterValue),
    }
    return { value, tagText, quantity, removeTagState }
  })

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Cursos"
        icon={<Users strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
        content={
          <CursosFilterContent
            filterValue={filterValue}
            allFiltersValues={allFiltersValues}
            cursosAnioData={cursosAnioData}
            todosValuesData={todosCursosData}
          />
        }
      />
      {filterTags.length > 0 && (
        <TagsBox tags={filterTags} maxTags={3} paramKeys={[]} />
      )}
    </div>
  )
}

export default CursosFilter

import 'server-only'

import {
  getGrupalItemData,
  getQuantity,
} from '@/app/analisis-academico/utils/dataOperations'
import { Users } from 'lucide-react'
import { CURSOS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import { CursosFilterContent } from './cursos-filter-content'
import FilterInput from '../filter-input'
import { FiltersValues } from '@/app/analisis-academico/utils/definitions'
import CursosTags from '../../tags/cursos-tags'
// import { TagsBox } from '../../tags/tags-box'

const GROUP_VALUES_KEYS: {
  key: keyof Omit<(typeof CURSOS_ITEMS_DATA)[number], 'anio'>
  itemText: string
}[] = [
  { key: 'maniana', itemText: 'Turno Mañana' },
  { key: 'tarde', itemText: 'Turno Tarde' },
  { key: 'cb', itemText: 'Ciclo Básico' },
  { key: 'tics', itemText: 'TICs' },
  { key: 'pm', itemText: 'Prod. Multimedial' },
  { key: 'todos', itemText: 'Todos los ' },
]

export async function CursosFilter({
  allFiltersValues = {},
  uniqueValues,
}: {
  allFiltersValues: FiltersValues
  uniqueValues?: Map<any, number>
}) {
  const filterValue = allFiltersValues.cursos || []

  const [maniana, tarde, cb, tics, pm] = GROUP_VALUES_KEYS.map(
    ({ key, itemText }) => {
      const todosCursos = CURSOS_ITEMS_DATA.flatMap((data) => data[key])
      const todosData = getGrupalItemData(
        todosCursos,
        filterValue,
        uniqueValues,
      )
      return { ...todosData, value: todosCursos, itemText }
    },
  )
  const todosCursosData = { maniana, tarde, cb, tics, pm }

  const cursosAnioData = CURSOS_ITEMS_DATA.map((anioData) => {
    const partialFilterValues = filterValue.filter(
      (curso) => curso[0] === anioData.anio[0],
    )
    const [maniana, tarde, tics, pm, todos] = GROUP_VALUES_KEYS.filter(
      ({ key }) => key !== 'cb',
    ).map(({ key, itemText }) => {
      const groupCursos = anioData[key]
      const groupData = getGrupalItemData(
        groupCursos,
        partialFilterValues,
        uniqueValues,
      )
      return { ...groupData, value: groupCursos, itemText }
    })
    const cursosAnioItems = anioData.todos.map((curso) => {
      const quantity = getQuantity(curso, uniqueValues)
      const isSelected = filterValue.includes(curso)
      return { value: curso, itemText: curso, quantity, isSelected }
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

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Cursos"
        icon={<Users strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
        content={
          <CursosFilterContent
            filterValue={filterValue}
            cursosItemsData={cursosAnioData}
            todosItemsData={todosCursosData}
          />
        }
      />
      <CursosTags filterValue={filterValue} uniqueValues={uniqueValues} />
    </div>
  )
}

export default CursosFilter

import { getQuantity } from '@/app/analisis-academico/utils/dataOperations'
import {
  FiltersValues,
  SearchParams,
} from '@/app/analisis-academico/utils/definitions'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { TagsSection } from './tags-section'

function CursosTags({
  filterValue,
  uniqueValues,
}: {
  filterValue: FiltersValues['cursos']
  uniqueValues?: Map<any, number>
}) {
  if (!filterValue || !filterValue.length) return false

  const filterTags = filterValue.map((value) => {
    const tagText = value
    const quantity = getQuantity(value, uniqueValues)
    const newFilterState = updateArrFilterState(value, filterValue)
    const keyParam = 'cursos' as keyof SearchParams

    return { value, tagText, quantity, newFilterState, keyParam }
  })

  return <TagsSection tags={filterTags} maxTags={3} />
}

export default CursosTags

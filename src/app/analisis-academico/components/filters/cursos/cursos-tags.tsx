import { getQuantity } from '@/app/analisis-academico/utils/dataOperations'
import {
  FiltersValues,
  TagData,
} from '@/app/analisis-academico/utils/definitions'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { TagsSection } from '../tags-section'

function CursosTags({
  filterValue,
  uniqueValues,
}: {
  filterValue: FiltersValues['cursos']
  uniqueValues?: Map<any, number>
}) {
  if (!filterValue || !filterValue.length) return false

  const filterTags: TagData[] = filterValue.map((value) => {
    const tagText = value
    const quantity = getQuantity(value, uniqueValues)
    const newFilterState = updateArrFilterState(value, filterValue)

    return { value, tagText, quantity, newFilterState, keyParam: 'cursos' }
  })

  return <TagsSection tags={filterTags} maxTags={3} />
}

export default CursosTags

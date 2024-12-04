import 'server-only'

import { getQuantity } from '@/app/analisis-academico/utils/dataOperations'
import {
  FiltersValues,
  TagData,
} from '@/app/analisis-academico/utils/definitions'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { TagsSection } from '../tags-section'

function ProyeccionTags({
  filterValue,
  uniqueValues,
}: {
  filterValue: FiltersValues['proyeccion']
  uniqueValues?: Map<any, number>
}) {
  if (!filterValue || !filterValue.length) return false

  const filterTags: TagData[] = filterValue.map((value) => {
    const tagText = value
    const quantity = getQuantity(value, uniqueValues)
    const newFilterState = updateArrFilterState(value, filterValue)

    return { value, tagText, quantity, newFilterState, keyParam: 'proyeccion' }
  })

  return <TagsSection tags={filterTags} maxTags={3} />
}

export default ProyeccionTags

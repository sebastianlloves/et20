import {
  getQuantity,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  FiltersValues,
  TagData,
} from '@/app/analisis-academico/utils/definitions'
import { TagsSection } from '../tags-section'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'

function MateriasTags({
  filtersValues,
  uniqueValuesModel,
}: {
  filtersValues: FiltersValues
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
}) {
  const materiasFilterValue = filtersValues.materias
  const strictInclusionFilterValue = filtersValues.inclusionEstricta === 'true'
  const uniqueValues = uniqueValuesModel?.materias

  const filterTags: TagData[] = (materiasFilterValue || []).map((materia) => {
    return {
      tagText: materia,
      quantity: strictInclusionFilterValue
        ? null
        : getQuantity(materia, uniqueValues),
      keyParam: 'materias',
      newFilterState: updateArrFilterState(materia, materiasFilterValue),
    }
  })

  if(strictInclusionFilterValue){
    const strictInclusionTag: TagData = {
      tagText: 'Inclusión estricta',
      quantity: getQuantity(materiasFilterValue?.[0], uniqueValues),
      keyParam: 'inclusionEstricta',
      newFilterState: undefined,
      className: 'rounded-lg pl-1 bg-primary/15',
    }
    filterTags.unshift(strictInclusionTag)
  }

  return <TagsSection tags={filterTags} maxTags={3} />
}

export default MateriasTags

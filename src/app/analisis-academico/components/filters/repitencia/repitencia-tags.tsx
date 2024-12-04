import {
  getCantFilterData,
  getQuantity,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  FiltersValues,
  TagData,
} from '@/app/analisis-academico/utils/definitions'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { TagsSection } from '../tags-section'
import { getCantRepitenciasString } from '@/app/analisis-academico/utils/utils'
import { getNumbersBetween } from '@/lib/utils'

function RepitenciaTags({
  aniosFilterValue,
  cantFilterValue,
  uniqueValuesModel,
}: {
  aniosFilterValue?: FiltersValues['repitenciaAnios']
  cantFilterValue?: FiltersValues['repitenciaCant']
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
}) {
  const aniosUniqueValues = uniqueValuesModel?.repitenciaAnios
  const cantUniqueValues = uniqueValuesModel?.repitenciaCant

  const aniosTags: TagData[] = (aniosFilterValue || []).map((anio) => {
    const value = anio
    const tagText = `Repitió ${anio}`
    const quantity = getQuantity(anio, aniosUniqueValues)
    const newFilterState = updateArrFilterState(value, aniosFilterValue)

    return {
      value,
      tagText,
      quantity,
      newFilterState,
      keyParam: 'repitenciaAnios',
    }
  })

  const filterTags = [...aniosTags]

  const { filterValue: cantValue } = getCantFilterData(
    cantUniqueValues,
    cantFilterValue,
  )
  if (cantValue) {
    const cantTag: TagData = {
      tagText: getCantRepitenciasString(cantValue),
      keyParam: 'repitenciaCant',
      quantity: getQuantity(
        getNumbersBetween([cantValue.min, cantValue.max]).map(
          (number) => `${number}`,
        ),
        cantUniqueValues,
      ),
      newFilterState: undefined,
    }
    filterTags.push(cantTag)
  }

  return <TagsSection tags={filterTags} maxTags={3} />
}

export default RepitenciaTags

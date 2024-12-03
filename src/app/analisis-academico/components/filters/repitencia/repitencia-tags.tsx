import {
  getCantFilterData,
  getQuantity,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  FiltersValues,
  SearchParams,
  TagData,
} from '@/app/analisis-academico/utils/definitions'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { TagsSection } from '../tags-section'
import { getCantRepitenciasString } from '@/app/analisis-academico/utils/utils'
import { getNumbersBetween } from '@/lib/utils'

function RepitenciaTags({
  aniosFilterValue,
  aniosUniqueValues,
  cantFilterValue,
  cantUniqueValues,
}: {
  aniosFilterValue?: FiltersValues['repitenciaAnios']
  aniosUniqueValues?: Map<any, number>
  cantFilterValue?: FiltersValues['repitenciaCant']
  cantUniqueValues?: Map<any, number>
}) {
  if (!aniosFilterValue || !aniosFilterValue.length) return false

  const aniosTags: TagData[] = aniosFilterValue.map((anio) => {
    const value = anio
    const tagText = `Repitió ${anio}`
    const quantity = getQuantity(anio, aniosUniqueValues)
    const newFilterState = updateArrFilterState(value, aniosFilterValue)
    const keyParam = 'repitenciaAnios' as keyof SearchParams

    return { value, tagText, quantity, newFilterState, keyParam }
  })

  const filterTags = [...aniosTags]

  const { filterValue: cantValue } = getCantFilterData(
    cantUniqueValues,
    cantFilterValue,
  )
  if (cantValue) {
    const cantTag: TagData = {
      tagText: getCantRepitenciasString(cantValue),
      keyParam: 'repitenciaCant' as keyof SearchParams,
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

import {
  getCantFilterData,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  FiltersValues,
  TagData,
} from '@/app/analisis-academico/utils/definitions'
import { getCantMateriasString } from '@/app/analisis-academico/utils/utils'
import { TagsSection } from '../tags-section'

function CantidadesTags({
  allFiltersValues = {},
  uniqueValuesModel,
}: {
  allFiltersValues: FiltersValues
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
}) {
  const troncalesUniqueValues = uniqueValuesModel?.cantidadesTroncales
  const { filterValue: troncalesFilterValue } = getCantFilterData(
    troncalesUniqueValues,
    allFiltersValues.cantidadesTroncales,
  )
  const troncalesTag: TagData | undefined = troncalesFilterValue && {
    tagText: getCantMateriasString(troncalesFilterValue, {
      singular: 'troncal',
      plural: 'troncales',
    }),
    keyParam: 'cantidadesTroncales',
    quantity: null,
    newFilterState: undefined,
  }

  const generalesUniqueValues = uniqueValuesModel?.cantidadesGenerales
  const { filterValue: generalesFilterValue } = getCantFilterData(
    generalesUniqueValues,
    allFiltersValues.cantidadesGenerales,
  )
  const generalesTag: TagData | undefined = generalesFilterValue && {
    tagText: getCantMateriasString(generalesFilterValue, {
      singular: 'general',
      plural: 'generales',
    }),
    keyParam: 'cantidadesGenerales',
    quantity: null,
    newFilterState: undefined,
  }

  const enProcesoUniqueValues = uniqueValuesModel?.cantidadesEnProceso2020
  const { filterValue: enProcesoFilterValue } = getCantFilterData(
    enProcesoUniqueValues,
    allFiltersValues.cantidadesEnProceso2020,
  )
  const enProcesoTag: TagData | undefined = enProcesoFilterValue && {
    tagText: getCantMateriasString(enProcesoFilterValue, {
      singular: 'en Proceso (2020)',
      plural: 'en Proceso (2020)',
    }),
    keyParam: 'cantidadesEnProceso2020',
    quantity: null,
    newFilterState: undefined,
  }

  const tags = [troncalesTag, generalesTag, enProcesoTag].filter(
    (tag) => tag !== undefined,
  )

  return <TagsSection tags={tags} maxTags={3} />
}

export default CantidadesTags

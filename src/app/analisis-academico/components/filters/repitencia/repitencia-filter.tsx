import 'server-only'
import { FiltersValues } from '@/app/analisis-academico/utils/definitions'
import FilterInput from '../filter-input'
import { IterationCcw } from 'lucide-react'
import RepitenciaAniosFilterContent from './repitencia-anios-filter-content'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ANIOS_REPETIBLES } from '@/app/analisis-academico/utils/constants'
import {
  getCantFilterData,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import RepitenciaTags from './repitencia-tags'
import SliderItem from '../slider-item'
import { getQuantity } from '@/app/analisis-academico/utils/filtersOperations'

function RepitenciaFilter({
  allFiltersValues = {},
  uniqueValuesModel,
}: {
  allFiltersValues: FiltersValues
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
}) {
  const aniosUniqueValues = uniqueValuesModel?.repitenciaAnios
  const cantUniqueValues = uniqueValuesModel?.repitenciaCant

  const aniosFilterValue = allFiltersValues.repitenciaAnios
  const aniosItemsData = ANIOS_REPETIBLES.map((anio) => {
    const value = anio
    const itemText = `Repitió ${anio}`
    const quantity = getQuantity(anio, aniosUniqueValues)
    const isSelected = aniosFilterValue?.includes(anio) || false
    const isDisabled = !quantity
    return { value, itemText, quantity, isSelected, isDisabled }
  })

  const { cantMinMax, filterValue: cantFilterValue } = getCantFilterData(
    cantUniqueValues,
    allFiltersValues.repitenciaCant,
  )

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Repitencia"
        icon={
          <IterationCcw strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />
        }
        content={
          <div>
            <RepitenciaAniosFilterContent
              filterValue={aniosFilterValue}
              filterItemsData={aniosItemsData}
            />
            <DropdownMenuSeparator className="mx-1" />
            <SliderItem
              title="Cantidad"
              minMaxValues={cantMinMax}
              filterValue={cantFilterValue}
              keyParam="repitenciaCant"
            />
          </div>
        }
      />
      {(aniosFilterValue || cantFilterValue) && (
        <RepitenciaTags
          aniosFilterValue={aniosFilterValue}
          cantFilterValue={allFiltersValues.repitenciaCant}
          uniqueValuesModel={uniqueValuesModel}
        />
      )}
    </div>
  )
}

export default RepitenciaFilter

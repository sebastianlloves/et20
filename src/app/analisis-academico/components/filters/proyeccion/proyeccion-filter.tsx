import { FiltersValues } from '@/app/analisis-academico/utils/definitions'
import { FastForward } from 'lucide-react'
import ProyeccionFilterContent from './proyeccion-filter-content'
import { PROYECCION_DATA } from '@/app/analisis-academico/utils/constants'
import {
  getQuantity,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import ProyeccionTags from './proyeccion-tags'
import FilterInput from '../filter-input'

function ProyeccionFilter({
  allFiltersValues = {},
  uniqueValuesModel,
}: {
  allFiltersValues: FiltersValues
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
}) {
  const filterValue = allFiltersValues.proyeccion
  const califParcialFilter = allFiltersValues.califParciales
  const uniqueValues = uniqueValuesModel?.proyeccion

  const showedItems = PROYECCION_DATA.filter(
    ({ show }) => !show || show(califParcialFilter),
  )
  const filterItemsData = showedItems.map(({ value }) => {
    const itemText = value
    const quantity = getQuantity(value, uniqueValues)
    const isSelected = filterValue?.includes(value) || false
    const isDisabled = quantity === 0
    return { value, itemText, quantity, isSelected, isDisabled }
  })

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Proyección"
        icon={
          <FastForward strokeWidth={1.8} className="w-[13px] lg:w-[15px]" />
        }
        content={
          <ProyeccionFilterContent
            filterValue={filterValue}
            filterItemsData={filterItemsData}
          />
        }
      />
      {filterValue && (
        <ProyeccionTags filterValue={filterValue} uniqueValues={uniqueValues} />
      )}
    </div>
  )
}

export default ProyeccionFilter
